import { resolve } from "path"
import { config } from "dotenv"

config({ path: resolve(__dirname, "../../../apps/media/.env.local") })
