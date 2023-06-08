import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    // nodePolyfills({
    //   // To exclude specific polyfills, add them to this list.
    //   exclude: [
    //     // "fs", // Excludes the polyfill for `fs` and `node:fs`.
    //   ],
    //   // Whether to polyfill `node:` protocol imports.
    //   protocolImports: true,
    // }),
  ],
  // server: {
  //   watch: {
  //     usePolling: true, // For Docker.

  //     ignored: [
  //       "!**/node_modules/@skylark-reference-apps/dimensions-drawer/**",
  //     ],
  //   },
  // },
  // optimizeDeps: {
  //   exclude: ["@skylark-reference-apps/dimensions-drawer"],
  // },
  optimizeDeps: {
    exclude: ["@skylark-reference-apps/lib", "@skylark-reference-apps/react"],
  },
  // define: {
  //   // By default, Vite doesn't include shims for NodeJS/
  //   // necessary for segment analytics lib to work
  //   global: {},
  // },
  // // resolve: {
  // //   alias: {
  // //     process: "process/browser",
  // //     buffer: "buffer",
  // //     crypto: "crypto-browserify",
  // //     stream: "stream-browserify",
  // //     assert: "assert",
  // //     http: "stream-http",
  // //     https: "https-browserify",
  // //     os: "os-browserify",
  // //     url: "url",
  // //     util: "util",
  // //   },
  // // },
  // css: {
  //   postcss: {
  //     plugins: [tailwindcss],
  //   },
  // },
});
