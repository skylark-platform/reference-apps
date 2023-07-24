import { LegacyObjectType } from "./types/legacySkylark";

export const ALWAYS_FOREVER_AVAILABILITY_EXT_ID =
  "skylark_legacy_ingest_availability";

export const OBJECT_TYPES_WITHOUT_LAST_MONTH_MODE = [
  LegacyObjectType.TagCategories,
  LegacyObjectType.Tags,
];
export const LAST_MONTH_MODE_DATE = "2023-06-01T00:00:00";
