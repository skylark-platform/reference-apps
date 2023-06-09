/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" assert { type: "ManifestV3Export" };

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  optimizeDeps: {
    exclude: ["@skylark-reference-apps/lib", "@skylark-reference-apps/react"],
  },
});
/* eslint-enable import/no-extraneous-dependencies */
