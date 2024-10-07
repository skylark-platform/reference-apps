import { resolve } from "path";
import { config } from "dotenv";

// Load env vars
config({ path: resolve(__dirname, "../../../packages/skylarktv/.env.local") });
