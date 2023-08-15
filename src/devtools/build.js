// // rollup.config.js
const devtoolsPackageJson = require("./package.json");
const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const { build } = require("esbuild");

const copySittlyDepsIntoDevtoolsDeps = () => {
  const sittlyPackageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../../package.json"), {
      encoding: "utf-8",
    })
  );

  const merge = {
    ...devtoolsPackageJson,
    peerDependencies: {
      ...sittlyPackageJson.dependencies,
      ...sittlyPackageJson.devDependencies,
    },
  };
  return merge;
};
const saveDevtoolsPackageJson = (packageJson) => {
  fs.writeFileSync(
    path.resolve(__dirname, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
};
const fixedDevtoolsPackageJson = copySittlyDepsIntoDevtoolsDeps();
saveDevtoolsPackageJson(fixedDevtoolsPackageJson);

build({
  entryPoints: ["./index.ts"],
  bundle: true,
  minify: false,
  keepNames: true,
  minifyIdentifiers: false,
  minifySyntax: false,
  format: "esm",
  sourcemap: true,
  outfile: "dist/index.js",
  external: Object.keys(fixedDevtoolsPackageJson.peerDependencies),
});

//==============

// import { defineConfig } from "tsup";
// import packageJsonSittly from "../../package.json";
// const merge = {
//   peerDependencies: {
//     ...packageJsonSittly.dependencies,
//     ...packageJsonSittly.devDependencies,
//   },
// };

// export default defineConfig({
//   entry: ["index.ts"],
//   outDir: "dist",
//   dts: "index.ts",
//   splitting: false,
//   minify: true,
//   external: Object.keys(merge),
//   sourcemap: false,
//   bundle: true,
//   clean: true,
// });
