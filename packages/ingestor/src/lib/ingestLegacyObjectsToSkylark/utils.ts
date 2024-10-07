import { GraphQLObjectTypes } from "@skylark-apps/skylarktv/src/lib/interfaces";
import {
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
} from "@skylark-apps/skylarktv/src/lib/skylark";
import {
  FetchedLegacyObjects,
  LegacyObjectType,
  LegacyObjects,
} from "./types/legacySkylark";
import {
  waitForUpdatingSchema,
  updateEnumTypes,
  activateConfigurationVersion,
} from "../skylark/saas/schema";

export const checkEnvVars = () => {
  const legacyApiUrl = process.env.LEGACY_API_URL;
  const legacyToken = process.env.LEGACY_SKYLARK_TOKEN;

  const client = process.env.CLIENT as "CLIENT_A" | "CLIENT_C";
  const validClients = ["CLIENT_A", "CLIENT_C"];
  if (!client) {
    throw new Error(
      "process.env.CLIENT must be specified so we know which data model set up to use. Each corresponds to a Skylark Legacy Customer.",
    );
  }
  if (!validClients.includes(client)) {
    throw new Error(
      `value given for process.env.CLIENT is not a valid option (value: ${client}). Valid Options: ${validClients.join(
        ", ",
      )}`,
    );
  }

  if (!legacyApiUrl)
    throw new Error("process.env.LEGACY_API_URL cannot be undefined");

  if (!legacyToken)
    throw new Error("process.env.LEGACY_SKYLARK_TOKEN cannot be undefined");

  if (!SAAS_API_ENDPOINT)
    throw new Error("process.env.SAAS_API_ENDPOINT cannot be undefined");

  if (!SAAS_API_KEY)
    throw new Error("process.env.SAAS_API_KEY cannot be undefined");

  // eslint-disable-next-line no-console
  console.log(
    "Legacy API URL:",
    legacyApiUrl,
    "\nSkylark API URL:",
    SAAS_API_ENDPOINT,
  );

  // eslint-disable-next-line no-console
  console.log(`--- Client: ${client}`);

  const readFromDisk = process.env.READ_LEGACY_OBJECTS_FROM_DISK === "true";

  const isCreateOnly = process.env.CREATE_ONLY === "true";
  // eslint-disable-next-line no-console
  console.log(`--- Mode: ${isCreateOnly ? "Create Only" : "Create & Update"}`);

  return { client, readFromDisk, isCreateOnly };
};

export const calculateTotalObjects = (
  objects: Record<string, FetchedLegacyObjects<LegacyObjects[0]>>,
) => {
  const totalObjectsFound = Object.values(objects).reduce(
    (previous, { totalFound }) => previous + totalFound,
    0,
  );

  return totalObjectsFound;
};

export const convertLegacyObjectTypeToObjectType = (
  legacyType: LegacyObjectType,
): GraphQLObjectTypes => {
  switch (legacyType) {
    case LegacyObjectType.TagCategories:
      return "TagCategory";
    case LegacyObjectType.Tags:
      return "SkylarkTag";
    case LegacyObjectType.Assets:
      return "SkylarkAsset";
    case LegacyObjectType.Episodes:
      return "Episode";
    case LegacyObjectType.Seasons:
      return "Season";
    case LegacyObjectType.Brands:
      return "Brand";
    case LegacyObjectType.Ratings:
      return "Rating";
    case LegacyObjectType.Roles:
      return "Role";
    case LegacyObjectType.Genres:
      return "Genre";
    case LegacyObjectType.People:
      return "Person";
    case LegacyObjectType.Images:
      return "SkylarkImage";
    case LegacyObjectType.Credits:
      return "Credit";
    case LegacyObjectType.Games:
      return "Game";
    case LegacyObjectType.Sets:
      if (!process.env.CUSTOM_SET_OBJECT_TYPE) {
        throw new Error(
          `[convertLegacyObjectTypeToObjectType] process.env.CUSTOM_SET_OBJECT_TYPE cannot be empty`,
        );
      }
      return process.env.CUSTOM_SET_OBJECT_TYPE as GraphQLObjectTypes;
    default:
      throw new Error("[convertLegacyObjectTypeToObjectType] Unknown type");
  }
};

export const getLegacyUidFromUrl = (url: string) => {
  if (!url.includes("/")) {
    throw new Error(
      `[getLegacyUidFromUrl] URL does not contain array separator" ${url}`,
    );
  }

  // e.g. /api/tag-categories/cate_44ef19d0f44a4775af16bf7cf35f25b9/
  const uid = url.split("/")?.[3];
  if (!uid) {
    throw new Error(
      `[getLegacyUidFromUrl] Unable to parse legacy UID from "${url}"`,
    );
  }
  return uid;
};

export const getLegacyObjectTypeFromUrl = (url: string) => {
  if (!url.includes("/")) {
    throw new Error(
      `[getLegacyObjectTypeFromUrl] URL does not contain array separator" ${url}`,
    );
  }

  const legacyObjectType = url.split("/")[2] as LegacyObjectType; // e.g. "/api/brands/bran_02744c9321ef402ea29231109c3ec806/"
  return legacyObjectType;
};

export const updateSkylarkSchema = async ({
  assetTypes,
  imageTypes,
  setTypes,
}: {
  assetTypes: string[];
  imageTypes: string[] | null;
  setTypes: string[] | null;
}) => {
  const initialVersion = await waitForUpdatingSchema();
  // eslint-disable-next-line no-console
  console.log("--- Initial Schema version:", initialVersion);

  const { version: assetTypeVersion } = await updateEnumTypes(
    "AssetType",
    assetTypes,
    initialVersion,
  );

  let updatedVersion = assetTypeVersion || initialVersion;

  if (imageTypes) {
    const { version: imageTypeVersion } = await updateEnumTypes(
      "ImageType",
      imageTypes,
      updatedVersion,
    );

    if (imageTypeVersion) updatedVersion = imageTypeVersion;
  }

  if (setTypes) {
    const { version: setTypeVersion } = await updateEnumTypes(
      "SetType",
      setTypes,
      updatedVersion,
    );

    if (setTypeVersion) updatedVersion = setTypeVersion;
  }

  if (updatedVersion && updatedVersion !== initialVersion) {
    // eslint-disable-next-line no-console
    console.log("--- Activating Schema version:", updatedVersion);
    await activateConfigurationVersion(updatedVersion);
    await waitForUpdatingSchema();
  }
};
