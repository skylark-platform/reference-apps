/* eslint-disable no-console */
import "../../env";
import "./env";
import { ingestClientA } from "./client/clientA";
import { writeError } from "./fs";
import { checkEnvVars } from "./utils";
import { ingestClientC } from "./client/clientC";

const main = async () => {
  console.time("Total ingest time:");
  const { client, readFromDisk, isCreateOnly } = checkEnvVars();

  switch (client.toUpperCase()) {
    case "CLIENT_A":
      await ingestClientA({ readFromDisk, isCreateOnly });
      break;
    case "CLIENT_C":
      await ingestClientC({ readFromDisk, isCreateOnly });
      break;
    default:
      throw new Error(`Unsupported process.env.CLIENT used: ${client}`);
  }

  console.log("\nObjects Created Successfully.");
  console.timeEnd("Total ingest time:");
};

main().catch((err) => {
  console.error(err);
  void writeError(err);
});
/* eslint-enable no-console */
