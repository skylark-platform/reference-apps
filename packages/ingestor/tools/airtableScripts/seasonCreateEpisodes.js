const inputConfig = input.config();

const baseTmdbUrl = "https://api.themoviedb.org/3";

let table = base.getTable("Media Content");

let queryResult = await table.selectRecordsAsync({
  recordIds: [inputConfig.record_id],
  fields: ["title", "tmdb_id", "language_code", "language", "season_number"],
});

const seasonRecord = queryResult.records?.[0];
const seasonTmdbId = seasonRecord?.getCellValue("tmdb_id");
const seasonLanguage =
  seasonRecord?.getCellValue("language_code")?.[0] || "en-GB";
const seasonLanguageField = seasonRecord?.getCellValue("language");

console.log({ seasonRecord, seasonTmdbId, seasonLanguage });

if (seasonRecord && seasonTmdbId) {
  const seasonNumber = seasonRecord?.getCellValue("season_number");

  const url = `${baseTmdbUrl}/tv/${seasonTmdbId}/season/${seasonNumber}?language=${seasonLanguage}`;

  const tmdbToken = `Bearer ${inputConfig.tmdb_token}`;

  const allRecordsResult = await table.selectRecordsAsync({
    fields: [
      "title",
      "tmdb_id",
      "language_code",
      "season_number",
      "episode_number",
      "skylark_object_type",
    ],
  });

  const allRelatedRecords = allRecordsResult.records
    .map((rec) => ({
      ...rec,
      episode_number: rec.getCellValue("episode_number"),
      season_number: rec.getCellValue("season_number"),
      tmdb_id: rec.getCellValue("tmdb_id"),
      skylark_object_type: rec.getCellValue("skylark_object_type"),
    }))
    .filter((rec) => rec.tmdb_id === seasonTmdbId);

  const response = await fetch(url, {
    headers: {
      Authorization: tmdbToken,
    },
  });
  const season = await response.json();
  console.log(season);

  if (season && season.episodes && season.episodes.length > 0) {
    const skylarkObjectTypes = await table.getField("skylark_object_type")
      .options;
    const episodeChoice = skylarkObjectTypes.choices.find(
      ({ name }) => name === "Episode",
    );

    await Promise.all(
      season.episodes.map(async ({ episode_number, air_date }) => {
        const todaysDate = new Date();
        const airDate = new Date(air_date);

        if (airDate <= todaysDate) {
          const existingEpisode = allRelatedRecords.find(
            (rec) =>
              rec.skylark_object_type.name === "Episode" &&
              rec.season_number === seasonNumber &&
              rec.episode_number === episode_number,
          );
          const availabilityId = "recXNjJNyc6nKQIYa";
          if (existingEpisode) {
            // Reset tmdb_id to trigger update
            await table.updateRecordAsync(existingEpisode.id, {
              tmdb_id: undefined,
            });

            await table.updateRecordAsync(existingEpisode.id, {
              skylark_object_type: episodeChoice,
              tmdb_id: seasonTmdbId,
              season_number: seasonNumber,
              episode_number: episode_number,
              parent: [{ id: seasonRecord.id }],
              language: seasonLanguageField,
              availability: [{ id: availabilityId }],
            });
          } else {
            await table.createRecordAsync({
              skylark_object_type: episodeChoice,
              tmdb_id: seasonTmdbId,
              season_number: seasonNumber,
              episode_number: episode_number,
              parent: [{ id: seasonRecord.id }],
              language: seasonLanguageField,
              availability: [{ id: availabilityId }],
            });
          }
        }
      }),
    );
  }
}
