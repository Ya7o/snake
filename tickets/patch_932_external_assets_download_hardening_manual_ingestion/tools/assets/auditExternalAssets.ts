import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve("public/assets/external/_sources/externalAssetManifest.json");
const downloadedRoot = path.resolve("public/assets/external/_downloaded");
const manualRoot = path.resolve("public/assets/external/_manual_drop");
const auditRoot = path.resolve("public/assets/external/_audit");

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const p = path.join(dir, entry);
    const st = fs.statSync(p);
    return st.isDirectory() ? listFiles(p) : [p];
  });
}

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : { sources: [] };

const rows = (manifest.sources ?? []).map((source: any) => {
  const downloaded = listFiles(path.join(downloadedRoot, source.id));
  const manual = listFiles(path.join(manualRoot, source.id));
  return {
    id: source.id,
    title: source.title,
    licenseStatus: source.licenseStatus ?? source.status ?? "unknown",
    downloadMode: source.downloadMode ?? "legacy",
    downloadedCount: downloaded.length,
    manualDropCount: manual.length,
    needsAction:
      downloaded.length > 0
        ? "none"
        : manual.length > 0
          ? "run assets:download-external to import manual drop"
          : "manual download or URL fix required",
  };
});

fs.mkdirSync(auditRoot, { recursive: true });
fs.writeFileSync(path.join(auditRoot, "external-assets-audit.json"), JSON.stringify(rows, null, 2));

const md = [
  "# External assets audit",
  "",
  "| Source | License/status | Mode | Downloaded | Manual drop | Action |",
  "|---|---|---:|---:|---:|---|",
  ...rows.map((r: any) =>
    `| ${r.id} | ${r.licenseStatus} | ${r.downloadMode} | ${r.downloadedCount} | ${r.manualDropCount} | ${r.needsAction} |`
  ),
  "",
].join("\n");

fs.writeFileSync(path.join(auditRoot, "external-assets-audit.md"), md);
console.log(`External assets audit: ${path.join(auditRoot, "external-assets-audit.md")}`);
