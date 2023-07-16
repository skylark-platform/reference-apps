/* eslint-disable no-console */
import "../../../env";
import { createAlwaysAndForeverAvailability } from "../../skylark/saas/availability";

import {
  ALWAYS_FOREVER_AVAILABILITY_EXT_ID,
  USED_LANGUAGES,
} from "../constants";
import "../env";
import { readLegacyObjectsFromFile } from "../fs";
import { addAlwaysAvailabilityToObjects } from "../skylark";
import { checkEnvVars } from "../utils";

const main = async () => {
  checkEnvVars();

  console.log("\nCreating Always & Forever Availability...");
  const alwaysAvailability = await createAlwaysAndForeverAvailability(
    ALWAYS_FOREVER_AVAILABILITY_EXT_ID
  );

  console.log("\nReading Legacy Objects from Disk...");
  const legacyObjects = await readLegacyObjectsFromFile();

  const values = Object.values(legacyObjects);

  console.log("\nLinking Always & Forever Availability to all Objects...");
  await addAlwaysAvailabilityToObjects(
    alwaysAvailability,
    values,
    USED_LANGUAGES
  );

  console.log("\nAvailability Linked Successfully.");
};

main().catch((err) => {
  console.error(err);
});

/* eslint-enable no-console */
