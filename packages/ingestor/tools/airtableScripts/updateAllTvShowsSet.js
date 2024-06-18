const inputs = input.config();

const allTVShowsSetExternalId = "skylarktv_all_tv_shows";

let table = base.getTable("Media Content");
let episodeQueryResult = await table.selectRecordsAsync({
  recordIds: [inputs.record_id],
  fields: ["parent"],
});

console.log("Episode", episodeQueryResult);

const seasonRecord =
  episodeQueryResult.records?.[0].getCellValue("parent")?.[0];

if (seasonRecord) {
  let seasonQueryResult = await table.selectRecordsAsync({
    recordIds: [seasonRecord.id],
    fields: ["parent"],
  });

  console.log("Season", seasonQueryResult);

  const brandRecord =
    seasonQueryResult.records?.[0].getCellValue("parent")?.[0];

  if (brandRecord) {
    let brandQueryResult = await table.selectRecordsAsync({
      recordIds: [brandRecord.id],
      fields: ["parent"],
    });

    console.log("Brand", brandQueryResult);

    let setsTable = base.getTable("sets");
    let setQueryResult = await setsTable.selectRecordsAsync({
      fields: ["content", "external_id"],
    });

    const allTVShowsSet = setQueryResult.records.find(
      (rec) => rec.getCellValue("external_id") === allTVShowsSetExternalId,
    );
    const existingContent = allTVShowsSet?.getCellValue("content") || [];

    console.log("Set", allTVShowsSet, existingContent);

    if (
      allTVShowsSet &&
      !existingContent.find(({ id }) => id === brandRecord.id)
    ) {
      await setsTable.updateRecordAsync(allTVShowsSet, {
        content: [{ id: brandRecord.id }, ...existingContent],
      });
    }
  }
}
