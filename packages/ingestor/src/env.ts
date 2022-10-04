import { resolve } from "path";
import { config } from "dotenv";

// Load V8 Skylark env vars
config({ path: resolve(__dirname, "../../../apps/media/.env.local") });

// Load SaaS Skylark env vars
config({ path: resolve(__dirname, "../../../apps/saas/.env.local") });
