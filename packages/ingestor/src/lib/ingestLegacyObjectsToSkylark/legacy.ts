/* eslint-disable no-console */
import { hasProperty } from "@skylark-reference-apps/lib";
import { Axios, AxiosInstance } from "axios";
import { chunk } from "lodash";
import axiosRetry, { exponentialDelay } from "axios-retry";
import {
  FetchedLegacyObjects,
  LegacyAsset,
  LegacyBaseObject,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjectType,
  LegacyResponseListObjectsData,
  LegacySeason,
  ParsedSL8Credits,
} from "./types/legacySkylark";
import {
  LAST_MONTH_MODE_DATE,
  OBJECT_TYPES_WITHOUT_LAST_MONTH_MODE,
} from "./constants";
import { pause } from "../skylark/saas/utils";
import { writeLegacyObjectsToDisk } from "./fs";
import { getLegacyUidFromUrl } from "./utils";

const outputLegacyObjectCount = ({
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
    { total: 0, totalLanguages: 0 },
  );

  console.log(
    `    - total found: ${total} (${totalLanguages} language${
      totalLanguages > 1 ? "s" : ""
    })`,
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

  axiosRetry(legacyAxios as AxiosInstance, {
    retries: 5,
    retryDelay: exponentialDelay,
  });

  return { legacyAxios };
};

const parseJSON = <T>(str: string) => {
  // Wrapper to make debugging easier
  try {
    return JSON.parse(str) as T;
  } catch (err) {
    console.error(`[parseJSON]: Error parsing JSON`, err);
    throw err;
  }
};

const getAllObjectsOfType = async <T extends LegacyBaseObject>(
  type: LegacyObjectType,
  language: string,
): Promise<{ type: LegacyObjectType; objects: T[] }> => {
  const { legacyAxios } = createLegacyAxios(language);
  const onlyDataCreatedInLastMonth =
    !OBJECT_TYPES_WITHOUT_LAST_MONTH_MODE.includes(type) &&
    process.env.LEGACY_DATA_LAST_MONTH_ONLY === "true";
  // https://developers.skylarkplatform.com/api/skylark_api.html#controlling-responses
  const lastMonthQuery = `created__gte=${LAST_MONTH_MODE_DATE}`;

  const limit = 50; // 40 + 4 requests at once pegged the CPU at ~80% for Episodes (SL6)
  const numRequestsAtOnce = 4;

  let numberOfRequests = 0;
  let count = 0;

  try {
    const countQuery = ["all=true"];

    if (onlyDataCreatedInLastMonth) {
      countQuery.push(lastMonthQuery);
    }

    const countResponse = await legacyAxios.get<string>(
      `/api/${type}/count/?${countQuery.join("&")}`,
    );
    if (countResponse.status < 200 || countResponse.status >= 300) {
      throw new Error(
        `Unexpected response from count endpoint (language: ${language})`,
      );
    }

    const { count: c } = JSON.parse(countResponse.data) as { count: number };
    numberOfRequests = Math.ceil(c / limit);
    count = c;
  } catch (err) {
    console.log(
      "[getAllObjectsOfType] Failed to fetch count for",
      type,
      `(language: ${language})`,
    );
    throw err;
  }

  if (count === 0) {
    return {
      type,
      objects: [],
    };
  }

  const offsetArr = Array.from(
    { length: numberOfRequests },
    (_, index) => index * limit,
  );

  const chunkedOffsetArr = chunk(offsetArr, numRequestsAtOnce); // Apparently 24 connections at once crashed it
  const numBatches = chunkedOffsetArr.length;

  console.log(
    `    - ${language.toLowerCase()}: ${count} objects found (${numberOfRequests} requests in ${numBatches} batch${
      numBatches > 1 ? "es" : ""
    })`,
  );

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
          if (type === LegacyObjectType.Schedules) {
            query.push("fields_to_expand=customer_type_urls,device_type_urls");
          }

          if (onlyDataCreatedInLastMonth) {
            query.push(lastMonthQuery);
          }

          const listObjectsResponse = await legacyAxios.get<string>(
            `/api/${type}/?${query.join("&")}`,
          );

          const data = parseJSON<LegacyResponseListObjectsData<T>>(
            listObjectsResponse.data,
          );

          if (!hasProperty(data, "objects")) {
            throw new Error(
              `[getAllObjectsOfType] Unexpected response format for ${type}`,
            );
          }

          const { objects } = data;

          return objects;
        } catch (err) {
          console.log("[getAllObjectsOfType] Failed to parse JSON for", type);
          throw err;
        }
      }),
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
      `- Missing objects ${count - objects.length}`,
    );

  return { type, objects };
};

export const fetchObjectsFromLegacySkylark = async <T extends LegacyBaseObject>(
  type: LegacyObjectType,
  languagesToCheck: string[],
): Promise<FetchedLegacyObjects<T>> => {
  console.log(`--- ${type} fetching...`);

  const allObjects: Record<string, T[]> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const language of languagesToCheck) {
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

    // Schedules don't have languages
    if (type === LegacyObjectType.Schedules) {
      break;
    }
  }

  const total = outputLegacyObjectCount({ type, objects: allObjects });

  return {
    type,
    objects: allObjects,
    totalFound: total,
  };
};

export const fetchLegacyObjectsAndWriteToDisk = async <
  T extends LegacyBaseObject,
>(
  type: LegacyObjectType,
  dir: string,
  languagesToCheck: string[],
) => {
  const objects = await fetchObjectsFromLegacySkylark<T>(
    type,
    languagesToCheck,
  );
  await writeLegacyObjectsToDisk(dir, objects);
  return objects;
};

export const generateSL8CreditUid = (
  peopleUrl: string,
  roleUrl: string,
  character: string,
) => {
  const arr = [
    getLegacyUidFromUrl(peopleUrl),
    roleUrl && getLegacyUidFromUrl(roleUrl),
    character,
  ].filter((str) => !!str);

  return arr.join("_");
};

export const convertSL8CreditsToLegacyObjects = (
  assets: Record<string, LegacyAsset[]>,
  episodes: Record<string, LegacyEpisode[]>,
  seasons: Record<string, LegacySeason[]>,
  brands: Record<string, LegacyBrand[]>,
): FetchedLegacyObjects<ParsedSL8Credits> => {
  const sl8Credits = [
    ...Object.values(assets)[0],
    ...Object.values(episodes)[0],
    ...Object.values(seasons)[0],
    ...Object.values(brands)[0],
  ]
    .map(({ credits }) => credits || [])
    .flatMap((credits) => credits);

  const convertedCredits: ParsedSL8Credits[] = sl8Credits.map((credit) => ({
    _type: LegacyObjectType.Credits,
    uid: generateSL8CreditUid(
      credit.people_url,
      credit.role_url,
      credit.character,
    ),
    data_source_id: null,
    ...credit,
  }));

  const creditUids = convertedCredits.map(({ uid }) => uid);
  const uniqueCredits = convertedCredits.filter(
    (obj, index) => creditUids.indexOf(obj.uid) !== index,
  );

  return {
    type: LegacyObjectType.Credits,
    objects: { [Object.keys(assets)[0]]: uniqueCredits },
    totalFound: uniqueCredits.length,
  };
};

/* eslint-enable no-console */
