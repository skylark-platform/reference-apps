import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import dts from "rollup-plugin-dts";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      // {
      //   file: packageJson.main,
      //   format: "cjs",
      //   sourcemap: true,
      //   name: packageJson.name,
      // },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({
        config: {
          path: "./postcss.config.cjs",
        },
        // plugins: [
        //   autoprefixer(),
        //   tailwindcss({
        //     config: "./tailwind.config.cjs",
        //   }),
        // ],
        // minimize: true,
        // modules: true,
        // use: {
        //   sass: null,
        //   stylus: null,
        //   less: { javascriptEnabled: true },
        // },
        // extract: true,
        // extensions: [".css"],
        // minimize: true,
        extensions: [".css"],
        minimize: true,
        inject: {
          insertAt: "top",
        },
        extract: false,
        // inject: true,
        // plugins: [tailwindcss()],
      }),
      external(),

      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
