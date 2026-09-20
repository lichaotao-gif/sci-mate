import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const exportDirectory = resolve(projectRoot, "out");
const deployDirectory = resolve(projectRoot, "dist");
const exportedIndex = resolve(exportDirectory, "index.html");

if (!existsSync(exportedIndex)) {
  throw new Error("Tencent static export is missing out/index.html");
}

rmSync(deployDirectory, { recursive: true, force: true });
cpSync(exportDirectory, deployDirectory, { recursive: true });

console.log("Tencent static deployment package prepared in dist/");
