const baseTmdbUrl = "https://api.themoviedb.org/3";

const inputConfig = input.config();

let table = base.getTable("people");

let queryResult = await table.selectRecordsAsync({
  recordIds: [inputConfig.record_id],
  fields: ["tmdb_id", "name", "slug", "translation_language_codes"],
});
let record = queryResult.records[0];

if (record) {
  const tmdb_id = record.getCellValue("tmdb_id");

  const url = `${baseTmdbUrl}/person/${tmdb_id}`;
  const tmdbToken = `Bearer ${inputConfig.tmdb_token}`;
  const response = await fetch(url, {
    headers: {
      Authorization: tmdbToken,
    },
  });
  const metadata = await response.json();

  console.log(metadata);

  if (metadata) {
    await table.updateRecordAsync(inputConfig.record_id, {
      name: metadata.name,
      bio: metadata.biography,
      place_of_birth: metadata.place_of_birth,
      date_of_birth: metadata.birthday,
    });
  }

  const existingLanguageTranslationCodes = (
    record.getCellValue("translation_language_codes") || []
  ).map((code) => code.toLowerCase());
  console.log("Existing translations: ", existingLanguageTranslationCodes);

  const createTranslationsConfig = [];

  if (!existingLanguageTranslationCodes.includes("pt-pt")) {
    const airtablePtptId = "recoNzbdGmRCXneKG";

    createTranslationsConfig.push({
      fields: {
        object: [{ id: record.id }],
        languages: [{ id: airtablePtptId }],
      },
    });
  }

  if (!existingLanguageTranslationCodes.includes("ar")) {
    const airtableArId = "rec24T6bN7ynP8ZBm";

    createTranslationsConfig.push({
      fields: {
        object: [{ id: record.id }],
        languages: [{ id: airtableArId }],
      },
    });
  }

  console.log("Creating translations: ", createTranslationsConfig);

  if (createTranslationsConfig.length > 0) {
    const translationsTable = base.getTable("people - Translations");

    const recordIds = await translationsTable.createRecordsAsync(
      createTranslationsConfig,
    );

    console.log("Created records: ", recordIds);
  }
}
