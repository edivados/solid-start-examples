import { exec, execSync, spawnSync } from "child_process";
import glob from "fast-glob";
import fs from "fs/promises";
import { promisify } from "util";

const execAsync = promisify(exec);
const packages = ["solid-js", "solid-start", "solid-start-node", "@solidjs/router", "@solidjs/meta"];
const versions = await Promise.all(packages.map(async (name) => ({
  name, 
  version: (await execAsync(`npm view ${name} version`)).stdout.toString().trim()
})));

const targets = (await Promise.all([
  glob("examples/*/package.json"),
  glob("packages/*/package.json"),
])).flat();

await Promise.all(targets.map(async packagePath => {
  const packageJson = JSON.parse(await fs.readFile(packagePath));

  versions.forEach(({ name, version }) => {
    console.log(name, version);
    packageJson.dependencies?.[name] && (packageJson.dependencies[name] = `^${version}`);
    packageJson.devDependencies?.[name] && (packageJson.devDependencies[name] = `^${version}`);
  });

  await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
}));

console.log("Updating lock file...\n");
spawnSync("pnpm i", { shell: true, stdio: "inherit" });