#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const publicDir = path.resolve(process.argv[2] || "exampleSite/public");
const failures = [];

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

const htmlFiles = walk(publicDir).filter((file) => file.endsWith(".html"));

for (const file of htmlFiles) {
  const relative = path.relative(publicDir, file);
  const html = fs.readFileSync(file, "utf8");

  const ids = [...html.matchAll(/\bid=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi)]
    .map((match) => match[1] || match[2] || match[3]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`${relative}: duplicate ids ${[...new Set(duplicates)].join(", ")}`);

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    if (!/\balt(?:\s*=|\s|>)/i.test(tag)) failures.push(`${relative}: image without alt`);
  }

  if (/<(?:video|audio)\b[^>]*\bautoplay\b/i.test(html)) {
    failures.push(`${relative}: autoplay media`);
  }

  for (const match of html.matchAll(/<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json'|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      failures.push(`${relative}: invalid JSON-LD (${error.message})`);
    }
  }
}

const representative = [
  "index.html",
  "essays/maintenance-is-a-design-material/index.html",
  "fixtures/structural-components/index.html",
  "record/index.html",
  "search/index.html"
];

for (const relative of representative) {
  const file = path.join(publicDir, relative);
  const html = fs.readFileSync(file, "utf8");
  const levels = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  if (levels.filter((level) => level === 1).length !== 1) {
    failures.push(`${relative}: expected exactly one h1`);
  }
  for (let index = 1; index < levels.length; index += 1) {
    if (levels[index] > levels[index - 1] + 1) {
      failures.push(`${relative}: heading jump h${levels[index - 1]} to h${levels[index]}`);
    }
  }
  if (!/class=(?:"[^"]*\bnf-skip-link\b[^"]*"|'[^']*\bnf-skip-link\b[^']*'|nf-skip-link(?:\s|>))/i.test(html)) {
    failures.push(`${relative}: missing skip link`);
  }
}

const searchHTML = fs.readFileSync(path.join(publicDir, "search/index.html"), "utf8");
if (!/<label\b[^>]*for=(?:"searchInput"|'searchInput'|searchInput)/i.test(searchHTML)) {
  failures.push("search/index.html: search input has no label");
}

if (failures.length) {
  failures.forEach((failure) => process.stderr.write(`${failure}\n`));
  process.exit(1);
}

process.stdout.write(`Rendered HTML audit passed (${htmlFiles.length} files).\n`);
