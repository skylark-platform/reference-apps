import "../../env";
import "./env";
import { SAAS_API_ENDPOINT, SAAS_API_KEY } from "@skylark-reference-apps/lib";
import { fetchObjectsFromLegacySkylark } from "./legacy";
import {
  LegacyAsset,
  LegacyBrand,
  LegacyEpisode,
  LegacyObjectType,
  LegacySeason,
  LegacyTag,
  LegacyTagCategory,
} from "./types/legacySkylark";
import { CreatedSkylarkObjects } from "./types/skylark";
import { setAccountConfiguration } from "../skylark/saas/account";
import {
  activateConfigurationVersion,
  updateEnumTypes,
  waitForUpdatingSchema,
} from "../skylark/saas/schema";
import { ALWAYS_FOREVER_AVAILABILITY_EXT_ID } from "./constants";
import { createAlwaysAndForeverAvailability } from "../skylark/saas/availability";
import { createObjectsInSkylark } from "./skylark";

/* eslint-disable no-console */
// For Macademia
// - Miro: https://miro.com/app/board/uXjVMDOKvio=/

// const objectTypes = [
//   "Brand",
//   "Season",
//   "Episode",
//   "Asset",
//   "Availability", // Not in use / make everything always available (No dimensions)
//   "Tags", // Game/App only
//   "Imagery", // Ignore
//   "Ratings", // Ignore
// ];

const checkEnvVars = () => {
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

  console.log("Legacy API URL:", legacyApiUrl);
  console.log("Skylark API URL:", SAAS_API_ENDPOINT);
};

const updateSkylarkSchema = async ({
  assetTypes,
}: {
  assetTypes: string[];
}) => {
  const initialVersion = await waitForUpdatingSchema();
  console.log("--- initial schema version:", initialVersion);

  const { version: updatedVersion } = await updateEnumTypes(
    "AssetType",
    assetTypes,
    initialVersion
  );

  if (updatedVersion !== initialVersion) {
    console.log("--- activating schema version:", updatedVersion);
    await activateConfigurationVersion(updatedVersion);
    await waitForUpdatingSchema(updatedVersion);
  }
};

const fetchLegacyObjects = async () => {
  const tagCategories = await fetchObjectsFromLegacySkylark<LegacyTagCategory>(
    LegacyObjectType.TagCategories
  );

  const tags = await fetchObjectsFromLegacySkylark<LegacyTag>(
    LegacyObjectType.Tags
  );

  const assets = await fetchObjectsFromLegacySkylark<LegacyAsset>(
    LegacyObjectType.Assets
  );

  const episodes = await fetchObjectsFromLegacySkylark<LegacyEpisode>(
    LegacyObjectType.Episodes
  );

  const seasons = await fetchObjectsFromLegacySkylark<LegacySeason>(
    LegacyObjectType.Seasons
  );

  const brands = await fetchObjectsFromLegacySkylark<LegacyBrand>(
    LegacyObjectType.Brands
  );

  return {
    tagCategories,
    tags,
    assets,
    episodes,
    seasons,
    brands,
  };
};

const main = async () => {
  checkEnvVars();

  console.log("\nFetching Objects from Legacy Skylark...");
  const legacyObjects = await fetchLegacyObjects();

  const assetTypes = [
    ...new Set(
      Object.values(legacyObjects.assets.objects)
        .flatMap((arr) => arr)
        .map(({ asset_type_url }) => asset_type_url?.name)
    ),
  ].filter((name): name is string => !!name);
  console.log("--- required asset type enums:", assetTypes.join(", "));

  console.log("\nUpdating Skylark Schema...");
  await updateSkylarkSchema({ assetTypes });

  console.log("\nUpdating Skylark Account...");
  await setAccountConfiguration({ defaultLanguage: "en" });

  console.log("\nCreating Always & Forever Availability");
  const alwaysAvailability = await createAlwaysAndForeverAvailability(
    ALWAYS_FOREVER_AVAILABILITY_EXT_ID
  );

  console.log("\nCreating Legacy Objects in Skylark...");

  const skylarkObjects: CreatedSkylarkObjects = {
    tagCategories: [],
    tags: [],
    assets: [],
    episodes: [],
    seasons: [],
    brands: [],
  };

  skylarkObjects.tagCategories = await createObjectsInSkylark(
    legacyObjects.tagCategories,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.tags = await createObjectsInSkylark(
    legacyObjects.tags,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.assets = await createObjectsInSkylark(
    legacyObjects.assets,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.episodes = await createObjectsInSkylark(
    legacyObjects.episodes,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.seasons = await createObjectsInSkylark(
    legacyObjects.seasons,
    skylarkObjects,
    alwaysAvailability
  );

  skylarkObjects.brands = await createObjectsInSkylark(
    legacyObjects.brands,
    skylarkObjects,
    alwaysAvailability
  );

  console.log("\nObjects Created Successfully.");
};

main().catch(console.error);
/* eslint-enable no-console */
