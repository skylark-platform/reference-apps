const inputs = input.config();

let table = base.getTable("Media Content");
let queryResult = await table.selectRecordsAsync({
  recordIds: [inputs.record_id],
  fields: [
    "skylark_object_type",
    "credits",
    "language_code",
    "slug",
    "credits",
  ],
});
let record = queryResult.records[0];

if (record) {
  let peopleTable = await base.getTable("people");
  const peopleRecords = (
    await peopleTable.selectRecordsAsync({
      fields: ["name", "slug", "tmdb_id"],
    })
  ).records.map((pRec) => ({
    ...pRec,
    name: pRec.getCellValue("name"),
    slug: pRec.getCellValue("slug"),
  }));

  const rolesTable = await base.getTable("roles");
  const rolesRecords = (
    await rolesTable.selectRecordsAsync({
      fields: ["internal_title", "title", "slug"],
    })
  ).records.map((rRec) => ({
    ...rRec,
    internal_title: rRec.getCellValue("internal_title"),
    title: rRec.getCellValue("title"),
    slug: rRec.getCellValue("slug"),
  }));

  const creditsTable = await base.getTable("credits");
  const creditRecords = (
    await creditsTable.selectRecordsAsync({
      fields: ["internal_title", "slug", "person", "role", "character"],
    })
  ).records.map((cRec) => ({
    ...cRec,
    internal_title: cRec.getCellValue("internal_title"),
    slug: cRec.getCellValue("slug"),
    person: cRec.getCellValue("person")?.[0],
    role: cRec.getCellValue("role")?.[0],
    character: cRec.getCellValue("character"),
  }));

  console.log({ record, creditRecords, peopleRecords, rolesRecords });

  const language = record.getCellValue("language_code") || "en-GB";

  const url = `${inputs.tmdb_url}/credits?language=${language}`;
  const response = await fetch(url, {
    headers: {
      Authorization: inputs.tmdb_token,
    },
  });

  const json = await response.json();
  console.log(json);

  const allCreditsInTmdb = [
    ...(json?.crew || []),
    ...(json?.cast || []),
    ...(json?.guest_stars || []),
  ]
    .map((c) => {
      let skylarkRole = null;

      if (c?.character) {
        skylarkRole = "Actor";
      } else if (c?.job) {
        skylarkRole = c.job;
      } else if (c?.known_for_department) {
        if (c.known_for_department === "Acting") {
          skylarkRole = "Actor";
        } else if (c.known_for_department === "Writing") {
          skylarkRole = "Writer";
        } else if (c.known_for_department === "Directing") {
          skylarkRole = "";
        }
      }

      return {
        ...c,
        skylarkRole,
      };
    })
    .filter((c) => Boolean(c.skylarkRole))
    .slice(0, 8);

  const allPeopleInTmdbCredits = allCreditsInTmdb.map(
    ({ original_name, name }) => (name || original_name).toLowerCase(),
  );
  console.log(allCreditsInTmdb, allPeopleInTmdbCredits);

  const existingPeople = peopleRecords.filter(({ name }) =>
    allPeopleInTmdbCredits.includes(name.toLowerCase()),
  );
  console.log("Existing people: ", existingPeople);

  const createdPeople = await Promise.all(
    allCreditsInTmdb.map(async (tmdbCredit) => {
      const name = tmdbCredit.name || tmdbCredit.original_name || "";
      const slug = name
        .toLocaleLowerCase()
        .replaceAll(".", "")
        .replaceAll(":", "")
        .replaceAll("/", "")
        .replaceAll("& ", "")
        .replaceAll(" ", "-");

      const config = {
        tmdb_id: `${tmdbCredit.id}`,
        name: name,
        slug: slug,
      };

      const existingPersonRecord = existingPeople.find(
        (rec) => rec.name === name,
      );
      if (existingPersonRecord) {
        await peopleTable.updateRecordAsync(existingPersonRecord.id, config);

        return {
          ...tmdbCredit,
          airtable_id: existingPersonRecord.id,
        };
      }

      const recordId = await peopleTable.createRecordAsync(config);
      return {
        ...tmdbCredit,
        airtable_id: recordId,
      };
    }),
  );

  console.log("Created people: ", createdPeople);

  const existingCredits = creditRecords
    .map((creditRecord) => {
      const { person, role, character } = creditRecord;
      const foundCredit = allCreditsInTmdb.find((tmdbCredit) => {
        if (!person || !role) {
          return false;
        }

        const roleRecord = rolesRecords.find(({ id }) => id === role.id);
        const personRecord = peopleRecords.find(({ id }) => id === person.id);

        if (!roleRecord || !roleRecord.internal_title || !personRecord) {
          return false;
        }

        // If no character, default to true
        const characterMatch =
          (!tmdbCredit.character && !character) ||
          tmdbCredit.character === character;
        const nameMatch =
          tmdbCredit.name.toLowerCase() === personRecord.name.toLowerCase() ||
          tmdbCredit.original_name.toLowerCase() ===
            personRecord.name.toLowerCase();
        const roleMatch =
          roleRecord.internal_title &&
          tmdbCredit.skylarkRole.toLowerCase() ===
            roleRecord.internal_title.toLowerCase();
        return characterMatch && nameMatch && roleMatch;
      });

      if (!foundCredit) {
        return false;
      }

      return {
        ...creditRecord,
        tmdb_credit_id: foundCredit.credit_id,
      };
    })
    .filter((credit) => !!credit);

  console.log("Existing Airtable credits: ", existingCredits);

  if (existingCredits.length > 0) {
    const existingCreditsOnObject = (record?.getCellValue("credits") || []).map(
      ({ id }) => ({ id }),
    );
    const newCreditsToLink = existingCredits.map((rec) =>
      rec ? { id: rec.id } : { id: "" },
    );
    const alreadyLinked = newCreditsToLink.every(({ id }) =>
      existingCreditsOnObject.find((e) => id === e.id),
    );

    if (!alreadyLinked) {
      const existingCreditIds = [
        ...existingCreditsOnObject,
        ...newCreditsToLink,
      ].filter(
        ({ id }, index, arr) => arr.findIndex((r) => r.id === id) === index,
      );
      await table.updateRecordAsync(record.id, {
        credits: existingCreditIds,
      });
    }
  }

  const existingCreditsTmdbIds = existingCredits.map(
    ({ tmdb_credit_id }) => tmdb_credit_id,
  );

  console.log({ existingCredits });

  const missingCredits = allCreditsInTmdb.filter(
    (tmdbCredit) => !existingCreditsTmdbIds.includes(tmdbCredit.credit_id),
  );

  console.log("Missing Credits: ", missingCredits);

  const createCreditsRequestConfig = missingCredits
    .map((tmdbCredit) => {
      const roleRecord = rolesRecords.find(
        ({ internal_title }) =>
          internal_title && internal_title === tmdbCredit.skylarkRole,
      );
      const personRecord = peopleRecords.find(
        ({ name }) =>
          name.toLocaleLowerCase() === tmdbCredit.name.toLowerCase() ||
          name.toLocaleLowerCase() === tmdbCredit.original_name.toLowerCase(),
      );

      return {
        fields: {
          person: [{ id: personRecord?.id || "" }],
          role: [{ id: roleRecord?.id || "" }],
          character: tmdbCredit.character,
          "Media Content": [{ id: record.id }],
          credit_tmdb_id: tmdbCredit.credit_id,
        },
      };
    })
    .filter(
      (config) => config.fields.person?.[0].id && config.fields.role?.[0].id,
    );

  console.log("Create Credits config: ", createCreditsRequestConfig);

  await creditsTable.createRecordsAsync(createCreditsRequestConfig);
}
