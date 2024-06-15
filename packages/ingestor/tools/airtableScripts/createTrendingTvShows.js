let inputConfig = input.config();

console.log(`The value of tmdb_token is ${inputConfig.tmdb_token}`);

const url = `https://api.themoviedb.org/3/trending/tv/week`;
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
    fields: [
      "tmdb_id",
      "skylark_object_type",
      "language",
      "autofill_tv_seasons_episodes",
    ],
  })
).records;

let skylarkObjectTypes = await table.getField("skylark_object_type").options;
const brandChoice = skylarkObjectTypes.choices.find(
  ({ name }) => name === "Brand",
);

console.log(brandChoice);

let mediaObjects = mediaObjectRecords
  .map((rec) => ({ ...rec, tmdb_id: rec.getCellValue("tmdb_id") }))
  .filter(({ tmdb_id }) => tmdb_id !== null);
let existingTmdbIds = mediaObjects.map((rec) => rec.tmdb_id);

console.log(existingTmdbIds);
const englishLanguageRecordId = "recdW4ANwDtnhaQn1";
const portugueseLanguageRecordId = "recoNzbdGmRCXneKG";

const trending = data.results
  .filter(
    ({ id, original_language }) =>
      !existingTmdbIds.includes(`${id}`) &&
      original_language.toLowerCase().startsWith("en"),
  )
  .sort((a, b) => (a.first_air_date < b.first_air_date ? 1 : -1))
  .splice(0, 3);

console.log(trending);

const createConfig = trending.map((brand) => ({
  fields: {
    internal_title: brand.title || brand.original_title,
    tmdb_id: `${brand.id}`,
    skylark_object_type: brandChoice,
    language: [{ id: englishLanguageRecordId }],
    autofill_tv_seasons_episodes: true,
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

// Update New TV Releases Set Content
let setsTable = base.getTable("sets");
let sets = (
  await setsTable.selectRecordsAsync({ fields: ["content", "external_id"] })
).records;

const newTVReleasesSet = sets.find(
  (rec) => rec.getCellValue("external_id") === "streamtv_new_tv_releases",
);

console.log(newTVReleasesSet);
if (newTVReleasesSet) {
  const trendingTmdbIds = trending.map(({ id }) => `${id}`);

  // Always make HotD a New TV Release for demos
  const hotdBrandAirtableID = "recexHwDtkWbI2LM8";
  const content = [
    { id: recordIds[0] },
    { id: hotdBrandAirtableID },
    ...recordIds.splice(1).map((id) => ({ id })),
  ];

  console.log(trendingTmdbIds, content);

  await setsTable.updateRecordAsync(newTVReleasesSet, {
    content: content,
  });
}
