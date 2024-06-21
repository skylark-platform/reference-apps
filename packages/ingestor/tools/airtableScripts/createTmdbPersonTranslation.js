const baseTmdbUrl = "https://api.themoviedb.org/3";

const inputConfig = input.config();

let table = base.getTable("people - Translations");

let queryResult = await table.selectRecordsAsync({
  recordIds: [inputConfig.record_id],
  fields: ["tmdb_id", "name", "slug", "language_code", "translated_bio"],
});
let record = queryResult.records[0];
const language = (record?.getCellValue("language_code") || [])?.[0];

if (record && language) {
  const tmdb_id = record.getCellValue("tmdb_id");

  console.log("Language: ", language);

  const url = `${baseTmdbUrl}/person/${tmdb_id}`;
  const tmdbToken = `Bearer ${inputConfig.tmdb_token}`;
  const response = await fetch(`${url}?language=${language}`, {
    headers: {
      Authorization: tmdbToken,
    },
  });
  const translationMetadata = await response.json();

  console.log(translationMetadata);

  let fallbackMetadata = {};
  let fallbackLanguage = language.split("-")?.[0];
  if (fallbackLanguage) {
    // For pt, use Brazilian Portuguese as the fallback
    if (fallbackLanguage === "pt") {
      fallbackLanguage = "pt-BR";
    }

    const fallbackResponse = await fetch(
      `${url}?language=${fallbackLanguage}`,
      {
        headers: {
          Authorization: tmdbToken,
        },
      },
    );
    fallbackMetadata = await fallbackResponse.json();
    console.log("fallback: ", fallbackLanguage, fallbackMetadata);
  }

  if (translationMetadata || fallbackMetadata) {
    await table.updateRecordAsync(inputConfig.record_id, {
      name: translationMetadata.name || fallbackMetadata.name,
      translated_bio:
        translationMetadata.biography || fallbackMetadata.biography,
    });
  }
}
