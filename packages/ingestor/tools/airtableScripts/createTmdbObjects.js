const getTmdbUrl = (record, id) => {
  const base = "https://api.themoviedb.org/3";

  const objectType = record.getCellValue("skylark_object_type").name;

  if (objectType.toUpperCase() === "MOVIE") {
    return `${base}/movie/${id}`;
  }

  if (objectType.toUpperCase() === "BRAND") {
    return `${base}/tv/${id}`;
  }

  const seasonNumber = record.getCellValue("season_number");
  if (objectType.toUpperCase() === "SEASON") {
    return `${base}/tv/${id}/season/${seasonNumber}`;
  }

  const episodeNumber = record.getCellValue("episode_number");
  if (objectType.toUpperCase() === "EPISODE") {
    return `${base}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`;
  }

  return "";
};

const inputs = input.config();

let table = base.getTable("Media Content");

let queryResult = await table.selectRecordsAsync({
  recordIds: [inputs.record_id],
  fields: [
    "skylark_object_type",
    "slug",
    "title",
    "title_short",
    "synopsis",
    "release_date",
    "genres",
    "language_code",
    "budget",
    "season_number",
    "episode_number",
    "number_of_episodes",
    "internal_title",
  ],
});
let record = queryResult.records[0];

if (record) {
  let genresTable = await base.getTable("genres");
  const genreRecords = (
    await genresTable.selectRecordsAsync({ fields: ["internal_title"] })
  ).records;

  console.log(record, record.getCellValue("genres"), genreRecords);

  const language = record.getCellValue("language_code") || "en-GB";

  const url = getTmdbUrl(record, inputs.tmdb_id);
  const tmdbToken = `Bearer ${inputs.tmbd_token}`;
  const response = await fetch(`${url}?language=${language}`, {
    headers: {
      Authorization: tmdbToken,
    },
  });
  const metadata = await response.json();

  console.log(metadata);

  const genres = metadata?.genres
    ? metadata.genres
        .map(({ name }) => ({
          id: genreRecords.find((rec) =>
            name.toLowerCase().includes(rec.name.toLowerCase()),
          )?.id,
        }))
        .filter(
          ({ id }) =>
            Boolean(id) &&
            !record
              .getCellValue("genres")
              .find((existingGenre) => existingGenre.id === id),
        )
    : [];

  const title = metadata.original_title || metadata.name || metadata.title;
  const slug =
    record.getCellValue("slug") ||
    (title || "")
      .toLocaleLowerCase()
      .replaceAll(":", "")
      .replaceAll("& ", "")
      .replaceAll(" ", "-");
  console.log({ genres, slug });

  await table.updateRecordAsync(record, {
    audience_rating: metadata.vote_average,
    genres:
      genres.length > 0
        ? [...genres, ...record.getCellValue("genres")]
        : record.getCellValue("genres"),
    internal_title: record.getCellValue("internal_title") || title,
    title: record.getCellValue("title") || title,
    title_short: record.getCellValue("title_short") || title,
    synopsis: record.getCellValue("synopsis") || metadata.overview,
    release_date:
      record.getCellValue("release_date") ||
      metadata.release_date ||
      metadata.air_date ||
      metadata.first_air_date,
    budget: record.getCellValue("budget") || metadata.budget,
    number_of_episodes: metadata.number_of_episodes,
    slug: slug,
  });

  output.set("record_id", inputs.record_id);
  output.set("tmdb_id", inputs.tmdb_id);
  output.set("tmdb_url", url);
  output.set("tmdb_token", tmdbToken);
}
