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

const paths = globSync(["./**/*.ts", "./**/*.tsx"]).filter(
  (path) => !path.includes("node_modules") && !path.includes("dist-types")
);

paths.forEach((path) => {
  const outputFilePath = `dist/${path}`;
  const tsPath = `${outputFilePath.split(".")[0]}.d.ts`;
  const esbuildOutfile = `${outputFilePath.split(".")[0]}.js`;

  build({
    entryPoints: [path],
    bundle: true,
    minify: true,
    format: "esm",
    sourcemap: true,
    outfile: esbuildOutfile,
    external: Object.keys(fixedDevtoolsPackageJson.peerDependencies),
  });
});

// Copy dist/@devtools types to
const compiledTypesFiles = globSync([
  "./dist-types/@devtools/**/*.ts",
  "./dist-types/@devtools/**/*.tsx",
]).filter((path) => !path.includes("node_modules"));

compiledTypesFiles.forEach((location) => {
  const destination = location.replace("dist-types/@devtools", "dist");
  console.log({
    location: path.resolve(location),
    destionation: path.resolve(destination),
  });
  fs.cpSync(path.resolve(location), path.resolve(destination), {
    recursive: true,
  });
});
