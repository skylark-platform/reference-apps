/* eslint-disable no-console */
import "../../../env";
import { createAlwaysAndForeverAvailability } from "../../skylark/saas/availability";

import { ALWAYS_FOREVER_AVAILABILITY_EXT_ID } from "../constants";
import "../env";
import { readLegacyObjectsFromFile } from "../fs";
import { addAlwaysAvailabilityToObjects } from "../skylark";
import { LegacyObjectType, LegacyObjects } from "../types/legacySkylark";
import { checkEnvVars } from "../utils";

const main = async () => {
  checkEnvVars();

  console.log("\nCreating Always & Forever Availability...");
  const alwaysAvailability = await createAlwaysAndForeverAvailability(
    ALWAYS_FOREVER_AVAILABILITY_EXT_ID
  );

  console.log("\nReading Legacy Objects from Disk...");
  const legacyObjects = await readLegacyObjectsFromFile<
    {
      type: LegacyObjectType;
      objects: Record<string, LegacyObjects>;
      totalFound: number;
    }[]
  >();

  const values = Object.values(legacyObjects);

  const languages: string[] = [];

  console.log("\nLinking Always & Forever Availability to all Objects...");
  await addAlwaysAvailabilityToObjects(alwaysAvailability, values, languages);

  console.log("\nAvailability Linked Successfully.");
};

main().catch((err) => {
  console.error(err);
});

/* eslint-enable no-console */
