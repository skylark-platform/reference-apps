import { resolve } from "path";
import { config } from "dotenv";

// Load SL8 Skylark env vars
config({ path: resolve(__dirname, "../../../apps/media/.env.local") });

// Load SLX Skylark env vars
config({ path: resolve(__dirname, "../../../apps/saas/.env.local") });
