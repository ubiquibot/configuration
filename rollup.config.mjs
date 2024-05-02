import typescript from "rollup-plugin-typescript2";
import yaml from "@rollup/plugin-yaml";
import { generateDtsBundle } from "rollup-plugin-dts-bundle-generator";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [peerDepsExternal(), nodeResolve(), commonjs(), typescript({
    tsconfigOverride: {
      exclude: ["**/tests", "**/*.test.ts"],
    },
  }), yaml(), json(), generateDtsBundle(), terser()],
};
