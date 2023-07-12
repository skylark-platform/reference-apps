import { LegacyObjectType, LegacyObjects } from "./types/legacySkylark";

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
