const inputConfig = input.config();

const baseTmdbUrl = "https://api.themoviedb.org/3";

let table = base.getTable("Media Content");

let queryResult = await table.selectRecordsAsync({
  recordIds: [inputConfig.record_id],
  fields: ["title", "tmdb_id", "language_code", "language"],
});

const brandRecord = queryResult.records?.[0];
const brandTmdbId = brandRecord?.getCellValue("tmdb_id");
const brandLanguage =
  brandRecord?.getCellValue("language_code")?.[0] || "en-GB";
const brandLanguageField = brandRecord?.getCellValue("language");

console.log({ brandRecord, brandTmdbId, brandLanguage });

if (brandRecord && brandTmdbId) {
  const url = `${baseTmdbUrl}/tv/${brandTmdbId}?language=${brandLanguage}`;

  const tmdbToken = `Bearer ${inputConfig.tmdb_token}`;
  const response = await fetch(url, {
    headers: {
      Authorization: tmdbToken,
    },
  });
  const brand = await response.json();
  console.log(brand);

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
    .filter((rec) => rec.tmdb_id === brandTmdbId);

  console.log("All related records", allRelatedRecords);

  if (brand && brand.seasons && brand.seasons.length > 0) {
    const skylarkObjectTypes = await table.getField("skylark_object_type")
      .options;
    const seasonChoice = skylarkObjectTypes.choices.find(
      ({ name }) => name === "Season",
    );

    await Promise.all(
      brand.seasons.map(async ({ season_number, episode_count }) => {
        const existingSeason = allRelatedRecords.find(
          (rec) =>
            rec.skylark_object_type.name === "Season" &&
            rec.season_number === season_number,
        );
        let seasonRecordId;

        console.log("Existing season", existingSeason);

        if (existingSeason) {
          seasonRecordId = existingSeason.id;

          // Reset tmdb_id to trigger update
          await table.updateRecordAsync(seasonRecordId, {
            tmdb_id: undefined,
          });

          await table.updateRecordAsync(seasonRecordId, {
            skylark_object_type: seasonChoice,
            tmdb_id: brandTmdbId,
            season_number: season_number,
            number_of_episodes: episode_count,
            parent: [{ id: brandRecord.id }],
            language: brandLanguageField,
            autofill_tv_seasons_episodes: true,
          });
        } else {
          seasonRecordId = await table.createRecordAsync({
            skylark_object_type: seasonChoice,
            tmdb_id: brandTmdbId,
            season_number: season_number,
            number_of_episodes: episode_count,
            parent: [{ id: brandRecord.id }],
            language: brandLanguageField,
            autofill_tv_seasons_episodes: true,
          });
        }

        const seasonUrl = `${baseTmdbUrl}/tv/${brandTmdbId}/season/${season_number}?language=${brandLanguage}`;

        const response = await fetch(seasonUrl, {
          headers: {
            Authorization: tmdbToken,
          },
        });
        const season = await response.json();
        console.log(season);

        if (season && season.episodes && season.episodes.length > 0) {
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
                    rec.season_number === season_number &&
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
                    tmdb_id: brandTmdbId,
                    season_number: season_number,
                    episode_number: episode_number,
                    parent: [{ id: seasonRecordId }],
                    language: brandLanguageField,
                    availability: [{ id: availabilityId }],
                  });
                } else {
                  await table.createRecordAsync({
                    skylark_object_type: episodeChoice,
                    tmdb_id: brandTmdbId,
                    season_number: season_number,
                    episode_number: episode_number,
                    parent: [{ id: seasonRecordId }],
                    language: brandLanguageField,
                    availability: [{ id: availabilityId }],
                  });
                }
              }
            }),
          );
        }
      }),
    );
  }
}
