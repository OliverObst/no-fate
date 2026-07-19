#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const publicDir = path.resolve(process.argv[2] || "exampleSite/public");
const siteOrigin = new URL(process.env.NO_FATE_TEST_ORIGIN || "https://no-fate.test");
const localHosts = new Set([siteOrigin.host, "127.0.0.1:4173", "localhost:4173"]);
const failures = new Set();
const documents = new Map();

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

const htmlFiles = walk(publicDir).filter((file) => file.endsWith(".html"));

const documentURL = (file) => {
  const relative = path.relative(publicDir, file).split(path.sep).join("/");
  if (relative === "index.html") return new URL("/", siteOrigin);
  if (relative.endsWith("/index.html")) {
    return new URL(`/${relative.slice(0, -"index.html".length)}`, siteOrigin);
  }
  return new URL(`/${relative}`, siteOrigin);
};

const lineNumber = (source, offset) => source.slice(0, offset).split("\n").length;

const extractReferences = (html) => {
  const references = [];
  const attributePattern = /\b(?:href|src|poster|data)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
  const srcsetPattern = /\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

  for (const match of html.matchAll(attributePattern)) {
    references.push({ value: match[1] ?? match[2] ?? match[3], offset: match.index });
  }
  for (const match of html.matchAll(srcsetPattern)) {
    const srcset = match[1] ?? match[2] ?? match[3];
    for (const candidate of srcset.split(",")) {
      const value = candidate.trim().split(/\s+/)[0];
      if (value) references.push({ value, offset: match.index });
    }
  }

  return references;
};

const findTarget = (pathname) => {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relative = decoded.replace(/^\/+/, "");
  const base = path.resolve(publicDir, relative);
  if (base !== publicDir && !base.startsWith(`${publicDir}${path.sep}`)) return null;

  const candidates = decoded.endsWith("/")
    ? [path.join(base, "index.html")]
    : [base, `${base}.html`, path.join(base, "index.html")];

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || null;
};

const idsFor = (file) => {
  if (documents.has(file)) return documents.get(file);
  if (!file.endsWith(".html")) return new Set();

  const html = fs.readFileSync(file, "utf8");
  const ids = new Set(
    [...html.matchAll(/\b(?:id|name)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))/gi)]
      .map((match) => match[1] ?? match[2] ?? match[3])
  );
  documents.set(file, ids);
  return ids;
};

for (const file of htmlFiles) {
  const relative = path.relative(publicDir, file);
  const html = fs.readFileSync(file, "utf8");
  const sourceURL = documentURL(file);

  for (const reference of extractReferences(html)) {
    const raw = reference.value.replaceAll("&amp;", "&").trim();
    if (
      !raw ||
      raw === "#" ||
      /^(?:data|javascript|mailto|tel):/i.test(raw) ||
      raw.startsWith("//")
    ) {
      continue;
    }

    let targetURL;
    try {
      targetURL = new URL(raw, sourceURL);
    } catch {
      failures.add(`${relative}:${lineNumber(html, reference.offset)} invalid URL ${raw}`);
      continue;
    }

    if (!["http:", "https:"].includes(targetURL.protocol) || !localHosts.has(targetURL.host)) {
      continue;
    }

    const target = findTarget(targetURL.pathname);
    if (!target) {
      failures.add(`${relative}:${lineNumber(html, reference.offset)} missing ${targetURL.pathname}`);
      continue;
    }

    if (targetURL.hash && target.endsWith(".html")) {
      let fragment;
      try {
        fragment = decodeURIComponent(targetURL.hash.slice(1));
      } catch {
        fragment = targetURL.hash.slice(1);
      }
      if (fragment && !idsFor(target).has(fragment)) {
        failures.add(
          `${relative}:${lineNumber(html, reference.offset)} missing fragment ${targetURL.pathname}#${fragment}`
        );
      }
    }
  }
}

if (failures.size) {
  [...failures].sort().forEach((failure) => process.stderr.write(`${failure}\n`));
  process.exit(1);
}

process.stdout.write(`Rendered link check passed (${htmlFiles.length} HTML documents).\n`);
