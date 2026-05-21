import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";

type DownloadMode = "direct" | "opengameartPageScrape" | "manual";

type Source = {
  id: string;
  title?: string;
  page?: string;
  pageUrl?: string;
  download?: string | null;
  directUrls?: string[];
  downloadMode?: DownloadMode;
  licenseStatus?: string;
  status?: string;
};

const manifestPath = path.resolve("public/assets/external/_sources/externalAssetManifest.json");
const outRoot = path.resolve("public/assets/external/_downloaded");
const manualRoot = path.resolve("public/assets/external/_manual_drop");
const auditRoot = path.resolve("public/assets/external/_audit");

const ALLOW_USER_LICENSED = process.env.ALLOW_USER_LICENSED_ASSETS === "1";
const OGA_FILE_RE = /https?:\/\/opengameart\.org\/sites\/default\/files\/[^"' <>)]+/g;

function requestBuffer(url: string): Promise<{ buffer: Buffer; contentType: string; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;

    client.get(url, { headers: { "User-Agent": "SnakeDriveV4AssetIngest/1.0" } }, (response) => {
      const status = response.statusCode ?? 0;

      if (status >= 300 && status < 400 && response.headers.location) {
        const redirected = new URL(response.headers.location, url).toString();
        requestBuffer(redirected).then(resolve).catch(reject);
        return;
      }

      if (status !== 200) {
        reject(new Error(`HTTP ${status}`));
        response.resume();
        return;
      }

      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      response.on("end", () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType: String(response.headers["content-type"] ?? ""),
          finalUrl: url,
        });
      });
    }).on("error", reject);
  });
}

function safeFilenameFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  return decodeURIComponent(path.basename(pathname)).replace(/[^\w.\- ()%]/g, "_");
}

function isHtml(contentType: string, buffer: Buffer): boolean {
  const head = buffer.subarray(0, 256).toString("utf8").trim().toLowerCase();
  return contentType.includes("text/html") || head.startsWith("<!doctype html") || head.startsWith("<html");
}

function copyManualDrop(sourceId: string): string[] {
  const srcDir = path.join(manualRoot, sourceId);
  const dstDir = path.join(outRoot, sourceId);
  if (!fs.existsSync(srcDir)) return [];

  const copied: string[] = [];
  fs.mkdirSync(dstDir, { recursive: true });

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      const p = path.join(dir, entry);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else {
        const rel = path.relative(srcDir, p);
        const dst = path.join(dstDir, rel);
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.copyFileSync(p, dst);
        copied.push(path.relative(process.cwd(), dst).replaceAll("\\", "/"));
      }
    }
  }

  walk(srcDir);
  return copied;
}

async function downloadDirect(source: Source, url: string) {
  const { buffer, contentType } = await requestBuffer(url);

  if (isHtml(contentType, buffer)) {
    throw new Error(`URL returned HTML instead of an asset: ${url}`);
  }

  const outDir = path.join(outRoot, source.id);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, safeFilenameFromUrl(url));
  fs.writeFileSync(outPath, buffer);

  return {
    path: path.relative(process.cwd(), outPath).replaceAll("\\", "/"),
    bytes: buffer.length,
    contentType,
  };
}

async function discoverOpenGameArtFiles(pageUrl: string): Promise<string[]> {
  const { buffer, contentType } = await requestBuffer(pageUrl);
  if (!isHtml(contentType, buffer)) return [pageUrl];

  const html = buffer.toString("utf8");
  const raw = html.match(OGA_FILE_RE) ?? [];
  const decoded = raw.map((u) => u.replace(/&amp;/g, "&"));
  return [...new Set(decoded)];
}

async function main() {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing manifest: ${manifestPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const sources: Source[] = manifest.sources ?? [];
  const report: any[] = [];

  for (const source of sources) {
    const licenseStatus = source.licenseStatus ?? source.status ?? "unknown";

    if (licenseStatus.includes("review") && !ALLOW_USER_LICENSED) {
      report.push({
        id: source.id,
        status: "skipped_review_required",
        reason: "Set ALLOW_USER_LICENSED_ASSETS=1 to download this source.",
      });
      continue;
    }

    const manualCopied = copyManualDrop(source.id);
    if (manualCopied.length > 0) {
      report.push({
        id: source.id,
        status: "manual_imported",
        files: manualCopied,
      });
      continue;
    }

    const mode: DownloadMode = source.downloadMode ?? (source.download ? "direct" : "manual");

    if (mode === "manual") {
      report.push({
        id: source.id,
        status: "manual_required",
        reason: `Place files in public/assets/external/_manual_drop/${source.id}/`,
      });
      continue;
    }

    try {
      const urls = new Set<string>();

      for (const direct of source.directUrls ?? []) urls.add(direct);
      if (source.download) urls.add(source.download);

      if (mode === "opengameartPageScrape") {
        const page = source.pageUrl ?? source.page;
        if (!page) throw new Error("Missing pageUrl for opengameartPageScrape");
        const discovered = await discoverOpenGameArtFiles(page);
        for (const url of discovered) urls.add(url);
      }

      const files = [];
      for (const url of urls) {
        try {
          files.push(await downloadDirect(source, url));
        } catch (error: any) {
          files.push({ url, error: error.message });
        }
      }

      report.push({
        id: source.id,
        status: files.some((f: any) => f.path) ? "downloaded_or_partial" : "failed",
        files,
      });
    } catch (error: any) {
      report.push({
        id: source.id,
        status: "failed",
        error: error.message,
      });
    }
  }

  fs.mkdirSync(auditRoot, { recursive: true });
  const out = path.join(auditRoot, "external-download-report.json");
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`External download report: ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
