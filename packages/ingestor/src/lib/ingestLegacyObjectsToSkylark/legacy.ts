/* eslint-disable no-console */
import { hasProperty } from "@skylark-reference-apps/lib";
import { Axios } from "axios";
import { chunk } from "lodash";
import {
  LegacyCommonObject,
  LegacyObjectType,
  LegacyResponseListObjectsData,
} from "./types/legacySkylark";
import { USED_LANGUAGES } from "./constants";
import { pause } from "../skylark/saas/utils";

const outputLegacyObjectCount = ({
  type,
  objects,
}: {
  type: LegacyObjectType;
  objects: Record<string, object[]>;
}) => {
  const { total, totalLanguages } = Object.values(objects).reduce(
    (previous, arr) => ({
      total: previous.total + arr.length,
      totalLanguages:
        arr.length > 0 ? previous.totalLanguages + 1 : previous.totalLanguages,
    }),
    { total: 0, totalLanguages: 0 }
  );

  console.log(
    `--- ${type} found: ${total} (${totalLanguages} language${
      totalLanguages > 1 ? "s" : ""
    })`
  );

  return total;
};

const createLegacyAxios = (language: string) => {
  const legacyApiUrl = process.env.LEGACY_API_URL;
  const legacyToken = process.env.LEGACY_SKYLARK_TOKEN;

  const legacyAxios = new Axios({
    baseURL: legacyApiUrl,
    headers: {
      Authorization: legacyToken as string,
      "Content-Type": "application/json",
      "Accept-Language": language,
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
    },
  });

  return { legacyAxios };
};

const getAllObjectsOfType = async <T extends LegacyCommonObject>(
  type: LegacyObjectType,
  language: string
): Promise<{ type: LegacyObjectType; objects: T[] }> => {
  const { legacyAxios } = createLegacyAxios(language);

  const limit = 25;

  let numberOfRequests = 0;
  let count = 0;

  try {
    const countResponse = await legacyAxios.get<string>(
      `/api/${type}/count/?all=true`
    );
    if (countResponse.status < 200 || countResponse.status >= 300) {
      throw new Error("Unexpected response from count endpoint");
    }

    const { count: c } = JSON.parse(countResponse.data) as { count: number };
    numberOfRequests = Math.ceil(c / limit);
    count = c;
  } catch (err) {
    console.log("[getAllObjectsOfType] Failed to fetch count for", type);
    throw err;
  }

  const offsetArr = Array.from(
    { length: numberOfRequests },
    (_, index) => index * limit
  );

  const chunkedOffsetArr = chunk(offsetArr, 2); // Apparently 24 connections at once crashed it

  const dataArr: T[][] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const offsets of chunkedOffsetArr) {
    // eslint-disable-next-line no-await-in-loop
    const dArr = await Promise.all(
      offsets.map(async (offset) => {
        try {
          const query = ["all=true", `limit=${limit}`, `start=${offset}`];
          if (type === LegacyObjectType.Assets) {
            query.push("fields_to_expand=asset_type_url");
          }

          const listObjectsResponse = await legacyAxios.get<string>(
            `/api/${type}/?${query.join("&")}`
          );

          const data = JSON.parse(
            listObjectsResponse.data
          ) as LegacyResponseListObjectsData<T>;

          if (!hasProperty(data, "objects")) {
            throw new Error(
              `[getAllObjectsOfType] Unexpected response format for ${type}`
            );
          }

          const { objects } = data;

          return objects;
        } catch (err) {
          console.log("[getAllObjectsOfType] Failed to parse JSON for", type);
          throw err;
        }
      })
    );

    dataArr.push(dArr.flatMap((d) => d));

    // This pause will increase the time taken to run BUT it should help mitigate any Legacy Skylark crashes
    // eslint-disable-next-line no-await-in-loop
    await pause(2000);
  }

  const objects: T[] = dataArr.flatMap((data) => data);

  if (count !== objects.length)
    console.log(
      type,
      count,
      objects.length,
      `- Missing objects ${count - objects.length}`
    );

  return { type, objects };
};

export const fetchObjectsFromLegacySkylark = async <
  T extends LegacyCommonObject
>(
  type: LegacyObjectType
): Promise<{
  type: LegacyObjectType;
  objects: Record<string, T[]>;
  totalFound: number;
}> => {
  const allObjects: Record<string, T[]> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const language of USED_LANGUAGES) {
    // eslint-disable-next-line no-await-in-loop
    const { objects } = await getAllObjectsOfType<T>(type, language);

    // Add the _type to the object to be used later
    const objectsWithType = objects.map((obj) => ({
      ...obj,
      _type: type,
    }));

    if (objects.length > 0) {
      allObjects[language] = objectsWithType;
    }
  }

  const total = outputLegacyObjectCount({ type, objects: allObjects });

  return {
    type,
    objects: allObjects,
    totalFound: total,
  };
};
/* eslint-enable no-console */
