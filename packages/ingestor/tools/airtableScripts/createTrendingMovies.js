let inputConfig = input.config();

console.log(`The value of tmdb_token is ${inputConfig.tmdb_token}`);

const url = `https://api.themoviedb.org/3/trending/movie/day`;
const response = await fetch(url, {
  headers: {
    authorization: `Bearer ${inputConfig.tmdb_token}`,
  },
});

const data = await response.json();
console.log(data);

let table = base.getTable("Media Content");

let mediaObjectRecords = (
  await table.selectRecordsAsync({
    fields: ["tmdb_id", "skylark_object_type", "language"],
  })
).records;

let skylarkObjectTypes = await table.getField("skylark_object_type").options;
const movieChoice = skylarkObjectTypes.choices.find(
  ({ name }) => name === "Movie",
);

console.log(movieChoice);

let mediaObjects = mediaObjectRecords
  .map((rec) => ({ ...rec, tmdb_id: rec.getCellValue("tmdb_id") }))
  .filter(({ tmdb_id }) => tmdb_id !== null);
let existingTmdbIds = mediaObjects.map((rec) => rec.tmdb_id);

console.log(existingTmdbIds);
const englishLanguageRecordId = "recdW4ANwDtnhaQn1";
const portugueseLanguageRecordId = "recoNzbdGmRCXneKG";

const trending = data.results.splice(0, 12);
const recordsToCreate = trending.filter(
  ({ id }) => !existingTmdbIds.includes(`${id}`),
);

const createConfig = recordsToCreate.map((movie) => ({
  fields: {
    internal_title: movie.original_title,
    tmdb_id: `${movie.id}`,
    skylark_object_type: movieChoice,
    language: [{ id: englishLanguageRecordId }],
  },
}));
console.log(createConfig);

let recordIds = await table.createRecordsAsync(createConfig);
console.log("Created " + recordIds.length + " records!");

// Create Portuguese Translations
let translationsTable = base.getTable("Media Content - Translations");
const createTranslationsConfig = recordIds.map((id) => ({
  fields: {
    object: [{ id: id }],
    languages: [{ id: portugueseLanguageRecordId }],
  },
}));
let translationRecordIds = await translationsTable.createRecordsAsync(
  createTranslationsConfig,
);
console.log("Created " + translationRecordIds.length + " translations!");

// Update Trending Movies Set Content
let setsTable = base.getTable("sets");
let sets = (
  await setsTable.selectRecordsAsync({ fields: ["content", "external_id"] })
).records;

const trendingMovieSet = sets.find(
  (rec) => rec.getCellValue("external_id") === "streamtv_trending_movies",
);

console.log(trendingMovieSet);
if (trendingMovieSet) {
  const trendingTmdbIds = trending.map(({ id }) => `${id}`);

  const existingObjects = mediaObjects.filter(({ tmdb_id }) =>
    trendingTmdbIds.includes(tmdb_id),
  );
  const content = [
    ...recordIds.map((id) => ({ id })),
    ...existingObjects.map(({ id }) => ({ id })),
  ];
  console.log(trendingTmdbIds, content);
  await setsTable.updateRecordAsync(trendingMovieSet, {
    content: content,
  });
}

output.set("tmdb_token", inputConfig.tmdb_token);
