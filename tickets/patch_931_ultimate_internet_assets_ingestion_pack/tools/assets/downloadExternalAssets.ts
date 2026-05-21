import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";

const manifestPath = path.resolve("public/assets/external/_sources/externalAssetManifest.json");
const outRoot = path.resolve("public/assets/external/_downloaded");

type Source = {
  id: string;
  title: string;
  download?: string | null;
  licenseStatus: string;
};

function download(url: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const client = url.startsWith("https:") ? https : http;
    const file = fs.createWriteStream(outPath);
    client.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(outPath);
        download(response.headers.location, outPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(outPath);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      file.close();
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      reject(err);
    });
  });
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const report: any[] = [];

  for (const source of manifest.sources as Source[]) {
    if (!source.download) {
      report.push({ id: source.id, skipped: true, reason: "no download URL" });
      continue;
    }

    if (source.licenseStatus !== "approved" && process.env.ALLOW_USER_LICENSED_ASSETS !== "1") {
      report.push({
        id: source.id,
        skipped: true,
        reason: `licenseStatus=${source.licenseStatus}; set ALLOW_USER_LICENSED_ASSETS=1 to download`,
      });
      continue;
    }

    const url = source.download;
    const filename = decodeURIComponent(path.basename(new URL(url).pathname));
    const outPath = path.join(outRoot, source.id, filename);

    try {
      await download(url, outPath);
      report.push({ id: source.id, downloaded: true, path: path.relative(process.cwd(), outPath) });
    } catch (error: any) {
      report.push({ id: source.id, downloaded: false, error: error.message });
    }
  }

  const reportPath = path.resolve("public/assets/external/_sources/download_report_runtime.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Asset download report: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
