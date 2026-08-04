import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(webRoot, "public");
const files = walk(publicDir).sort();
const hash = createHash("sha256");

for (const file of files) {
  hash.update(relative(publicDir, file).replaceAll("\\", "/"));
  hash.update("\0");
  hash.update(readFileSync(file));
  hash.update("\0");
}

const rev = hash.digest("hex").slice(0, 12);
writeFileSync(join(webRoot, ".env.production.local"), `NEXT_PUBLIC_ASSET_REV=${rev}\n`);
console.log(`Wrote NEXT_PUBLIC_ASSET_REV=${rev}`);
