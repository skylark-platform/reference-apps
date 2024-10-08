const inputs = input.config();

let table = base.getTable("Media Content");

let queryResult = await table.selectRecordsAsync({
  recordIds: [inputs.record_id],
  fields: ["skylark_object_type", "images", "language_code", "slug"],
});
let record = queryResult.records[0];

const existingImages = record.getCellValue("images") || [];

console.log({ existingImages });

if (record && existingImages.length === 0) {
  let imagesTable = await base.getTable("images");
  const imageRecords = (
    await imagesTable.selectRecordsAsync({ fields: ["title", "image"] })
  ).records.map((imgRec) => ({
    ...imgRec,
    image: imgRec.getCellValue("image")[0],
  }));

  console.log(record, record.getCellValue("images"), imageRecords);

  const language = record.getCellValue("language_code") || "en-GB";

  const url = `${inputs.tmdb_url}/images`;
  const response = await fetch(url, {
    headers: {
      Authorization: inputs.tmdb_token,
    },
  });

  const json = await response.json();
  console.log(json);

  const images = [
    ...(json?.stills || []),
    ...(json?.posters || []),
    ...(json?.backdrops || []),
    ...(json?.logos || []),
  ];

  console.log({ images });

  if (images && images.length > 0) {
    const image =
      images.find(
        (image) => image.aspect_ratio > 1.5 && image.aspect_ratio < 2,
      ) ||
      images.find(
        (image) => image.aspect_ratio > 1 && image.aspect_ratio < 2.5,
      ) ||
      images?.[0];

    const baseImageUrl = "https://image.tmdb.org/t/p/original";
    const imageUrl = `${baseImageUrl}/${image.file_path}`;

    const normalisedFilePath = image.file_path.substring(1);
    const imageExists = imageRecords.find(
      (imgRec) => normalisedFilePath === imgRec.image.filename,
    );
    console.log({ url, images, image, imageExists, normalisedFilePath });

    const thumbnailImageTypeID = "reclzSCCkNeh9JGQT";
    const alwaysAvailabilityID = "recR7MXtwMj6MR8TK";

    let imageRecordId;

    if (imageExists) {
      imageRecordId = imageExists.id;
    } else {
      imageRecordId = await imagesTable.createRecordAsync({
        identifier: record.getCellValue("slug"),
        "type-reference": [{ id: thumbnailImageTypeID }],
        image: [{ url: imageUrl, filename: normalisedFilePath }],
        availability: [{ id: alwaysAvailabilityID }],
      });
    }

    const objectImages = [...existingImages, { id: imageRecordId }];
    console.log({ imageRecordId, objectImages });

    await table.updateRecordAsync(record, {
      images: objectImages,
    });
  }
}
