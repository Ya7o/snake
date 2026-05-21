import fs from "node:fs";
import path from "node:path";

const root = path.resolve("public/assets/external/_downloaded");
const out = path.resolve("public/assets/external/_index/externalAssetIndex.json");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const p = path.join(dir, entry);
    const st = fs.statSync(p);
    return st.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(root).filter((p) => /\.(png|jpg|jpeg|webp|svg|zip)$/i.test(p));
const index = files.map((p) => ({
  path: path.relative(process.cwd(), p).replaceAll("\\", "/"),
  sourceId: path.relative(root, p).split(path.sep)[0],
  ext: path.extname(p).toLowerCase(),
}));

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(index, null, 2));
console.log(`External asset index: ${out}`);
