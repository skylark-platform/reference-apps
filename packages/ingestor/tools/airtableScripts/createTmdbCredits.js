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

const existingCredits = record?.getCellValue("credits") || [];

console.log({ existingCredits });

if (record) {
  let peopleTable = await base.getTable("people");
  const peopleRecords = (
    await peopleTable.selectRecordsAsync({ fields: ["name", "slug"] })
  ).records.map((pRec) => ({
    ...pRec,
    name: pRec.getCellValue("name"),
    slug: pRec.getCellValue("slug"),
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

  console.log({ record, existingCredits, creditRecords, peopleRecords });

  const language = record.getCellValue("language_code") || "en-GB";

  const url = `${inputs.tmdb_url}?language=${language}`;
  const response = await fetch(url, {
    headers: {
      Authorization: inputs.tmdb_token,
    },
  });

  const json = await response.json();
  console.log(json);
}
