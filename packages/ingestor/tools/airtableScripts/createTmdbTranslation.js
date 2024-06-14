const baseTmdbUrl = "https://api.themoviedb.org/3";

const getTmdbUrl = (record, id) => {
  const objectType = record.getCellValue("skylark_object_type").name;

  if (objectType.toUpperCase() === "MOVIE") {
    return `${baseTmdbUrl}/movie/${id}`;
  }

  if (objectType.toUpperCase() === "BRAND") {
    return `${baseTmdbUrl}/tv/${id}`;
  }

  const seasonNumber = record.getCellValue("season_number");
  if (objectType.toUpperCase() === "SEASON") {
    return `${baseTmdbUrl}/tv/${id}/season/${seasonNumber}`;
  }

  const episodeNumber = record.getCellValue("episode_number");
  if (objectType.toUpperCase() === "EPISODE") {
    return `${baseTmdbUrl}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`;
  }

  return "";
};

const inputs = input.config();

let translationTable = base.getTable("Media Content - Translations");

let queryResult = await translationTable.selectRecordsAsync({
  recordIds: [inputs.record_id],
  fields: [
    "title",
    "object",
    "languages",
    "language_code",
    "title_short",
    "synopsis",
    "synopsis_short",
    "release_date",
    "Translation Created",
  ],
});
let translationRecord = queryResult.records[0];
let languages = translationRecord.getCellValue("language_code");
const language = languages?.[0];

let originalRecordId = translationRecord.getCellValue("object")?.[0]?.id;

console.log({ translationRecord, originalRecordId, languages });

// Assume the first language only
if (translationRecord && originalRecordId && language) {
  let mediaObjectsTable = await base.getTable("Media Content");
  const originalRecord = (
    await mediaObjectsTable.selectRecordsAsync({
      recordIds: [originalRecordId],
      fields: [
        "internal_title",
        "tmdb_id",
        "skylark_object_type",
        "season_number",
        "episode_number",
      ],
    })
  ).records?.[0];

  const tmdbId = originalRecord.getCellValue("tmdb_id");

  if (tmdbId) {
    console.log({ originalRecord, language, tmdbId });

    const url = getTmdbUrl(originalRecord, tmdbId);
    const tmdbToken = `Bearer ${inputs.tmbd_token}`;
    const response = await fetch(`${url}?language=${language}`, {
      headers: {
        Authorization: tmdbToken,
      },
    });
    const metadata = await response.json();
    console.log(metadata);

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
      console.log(fallbackLanguage, fallbackMetadata);
    }

    const metadataTitle =
      metadata.original_title || metadata.name || metadata.title;
    const fallbackTitle =
      fallbackMetadata.original_title ||
      fallbackMetadata.name ||
      fallbackMetadata.title;

    // Use longer title
    const title =
      fallbackTitle.length > metadataTitle.length
        ? fallbackTitle
        : metadataTitle;

    const synopsis = metadata.overview || fallbackMetadata.overview;
    const releaseDate =
      metadata.release_date ||
      metadata.air_date ||
      metadata.first_air_date ||
      fallbackMetadata.release_date ||
      fallbackMetadata.air_date ||
      fallbackMetadata.first_air_date;

    await translationTable.updateRecordAsync(translationRecord, {
      title: translationRecord.getCellValue("title") || title,
      title_short: translationRecord.getCellValue("title_short") || title,
      synopsis: translationRecord.getCellValue("synopsis") || synopsis,
      release_date:
        translationRecord.getCellValue("release_date") || releaseDate,
      "Translation Created": true,
    });
  }
}
