/* eslint-disable no-console */
import { ingestClientA } from "./client/clientA";
import { writeError } from "./fs";
import { checkEnvVars } from "./utils";

const main = async () => {
  console.time("Total ingest time:");
  const { client, readFromDisk, isCreateOnly } = checkEnvVars();

  if (client === "CLIENT_A") {
    await ingestClientA({ readFromDisk, isCreateOnly });
  }

  console.log("\nObjects Created Successfully.");
  console.timeEnd("Total ingest time:");
};

main().catch((err) => {
  console.error(err);
  void writeError(err);
});
/* eslint-enable no-console */
