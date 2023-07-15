import {
  GraphQLObjectTypes,
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
} from "@skylark-reference-apps/lib";
import { LegacyObjectType, LegacyObjects } from "./types/legacySkylark";

export const checkEnvVars = () => {
  const legacyApiUrl = process.env.LEGACY_API_URL;
  const legacyToken = process.env.LEGACY_SKYLARK_TOKEN;

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
    SAAS_API_ENDPOINT
  );
};

export const calculateTotalObjects = (
  objects: Record<
    string,
    {
      type: LegacyObjectType;
      objects: Record<string, LegacyObjects>;
      totalFound: number;
    }
  >
) => {
  const totalObjectsFound = Object.values(objects).reduce(
    (previous, { totalFound }) => previous + totalFound,
    0
  );

  return totalObjectsFound;
};

export const convertLegacyObjectTypeToObjectType = (
  legacyType: LegacyObjectType
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
    default:
      throw new Error("[convertLegacyObjectTypeToObjectType] Unknown type");
  }
};
