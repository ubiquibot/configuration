import esbuild from "esbuild";
import { yamlPlugin } from "esbuild-plugin-yaml";
import p from "../package.json";
import { Generator } from "npm-dts";

new Generator({
  entry: "src/index.ts",
  output: "dist/index.d.ts",
})
  .generate()
  .catch((e) => console.error(`Failed to generate types: ${e}`));

const { dependencies, peerDependencies } = p;

export const esBuildContext: esbuild.BuildOptions = {
  // sourcemap: true,
  entryPoints: ["src/index.ts"],
  bundle: true,
  // minify: true,
  // outdir: "dist",
  plugins: [yamlPlugin({})],
  loader: {
    ".yml": "file",
  },
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
  platform: "node",
};

esbuild
  .build({ ...esBuildContext, outfile: "dist/index.js" })
  .then(() => {
    console.log("\tesbuild complete");
  })
  .catch((err) => {
    console.error(err);
  });

esbuild
  .build({ ...esBuildContext, outfile: "dist/index.esm.js", format: "esm" })
  .then(() => {
    console.log("\tesbuild esm complete");
  })
  .catch((err) => {
    console.error(err);
  });
