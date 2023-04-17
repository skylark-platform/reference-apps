import { resolve } from "path";
import { config } from "dotenv";

// Load SLX Skylark env vars
config({ path: resolve(__dirname, "../../../apps/streamtv/.env.local") });
