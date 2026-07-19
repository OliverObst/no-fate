#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const publicDir = path.resolve(process.argv[2] ?? "exampleSite/public");
const fixtureRoot = path.join(publicDir, "fixtures");
const failures = [];

const fail = (message) => failures.push(message);
const read = (relativePath, encoding = "utf8") => {
  const target = path.join(publicDir, relativePath);
  if (!fs.existsSync(target)) {
    fail(`missing rendered fixture: ${relativePath}`);
    return encoding ? "" : Buffer.alloc(0);
  }
  return fs.readFileSync(target, encoding);
};

const count = (value, pattern) => [...value.matchAll(pattern)].length;
const stripTags = (value) => value.replaceAll(/<[^>]+>/g, "").trim();

const imageCheck = spawnSync(
  process.execPath,
  [".github/scripts/generate-archive-fixture-images.mjs", "--check"],
  { encoding: "utf8" }
);
if (imageCheck.status !== 0) {
  fail(imageCheck.stderr.trim() || "archive source-image check failed");
}

const archive = read("fixtures/archive-contact-sheet-20/index.html");
const archiveItems = count(archive, /<li class="?nf-contact-sheet__item"?/g);
if (archiveItems !== 20) {
  fail(`20-image archive rendered ${archiveItems} contact-sheet items`);
}

const sourceImageDir = path.resolve(
  "exampleSite/content/fixtures/archive-contact-sheet-20/plates"
);
const sourceImages = fs.existsSync(sourceImageDir)
  ? fs.readdirSync(sourceImageDir).filter((name) => /^plate-\d{2}\.svg$/.test(name))
  : [];
if (sourceImages.length !== 20) {
  fail(`20-image archive contains ${sourceImages.length} source images`);
}

const record = read("fixtures/long-record-table/index.html");
const recordRows = count(record, /<tbody>[\s\S]*?<\/tbody>/g)
  ? count(record.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0] ?? "", /<tr/g)
  : 0;
if (recordRows < 60) {
  fail(`long record table rendered ${recordRows} body rows; expected at least 60`);
}
if (!record.includes("data-nf-sortable")) {
  fail("long record table is not marked as sortable");
}

const maths = read("fixtures/maths-code-and-footnotes/index.html");
if (count(maths, /<math(?:\s|>)/g) < 5) {
  fail("maths article did not render enough native MathML expressions");
}
if (!maths.includes("language-javascript") || !maths.includes("language-toml")) {
  fail("maths article is missing a fenced JavaScript or TOML code block");
}
if (
  count(maths, /class="?footnote-ref"?/g) < 3
  || count(maths, /class="?footnote-backref"?/g) < 3
) {
  fail("maths article is missing its three footnote references or backlinks");
}

const artefact = read("fixtures/artefact-pdf-download/index.html");
if (!/<a href="?field-card\.pdf"? download/.test(artefact)) {
  fail("artefact page is missing the local PDF download link");
}
const pdf = read(
  "fixtures/artefact-pdf-download/field-card.pdf",
  null
);
if (
  !pdf.subarray(0, 5).equals(Buffer.from("%PDF-"))
  || !pdf.subarray(Math.max(0, pdf.length - 32)).includes(Buffer.from("%%EOF"))
  || pdf.length < 2000
) {
  fail("artefact download is not a substantial, complete PDF");
}

const titleFixtures = [
  [
    "fixtures/long-english-title/index.html",
    "What Happened When the Last Lantern, Three Loose Labels and a Patient Measuring Tape Absolutely Refused to Share the Same Cupboard"
  ],
  [
    "fixtures/long-german-title/index.html",
    "Was geschah, als die letzte Laterne, drei lose Etiketten und ein geduldiges Maßband partout nicht in denselben Schrank passen wollten"
  ]
];

for (const [fixture, expectedTitle] of titleFixtures) {
  const html = read(fixture);
  const heading = stripTags(
    html.match(/<h1[^>]*class="[^"]*nf-article__title[^"]*"[^>]*>[\s\S]*?<\/h1>/)
      ?.[0] ?? ""
  );
  if (heading !== expectedTitle) {
    fail(`${fixture} did not preserve its full title`);
  }
  if (heading.length < 100) {
    fail(`${fixture} title is only ${heading.length} characters long`);
  }
}

for (const [fixture] of titleFixtures) {
  if (!/<meta\s+name="?robots"?\s+content="noindex, nofollow"/.test(read(fixture))) {
    fail(`${fixture} is not excluded from indexing`);
  }
}

if (failures.length) {
  failures.forEach((message) => process.stderr.write(`Section 27.2: ${message}\n`));
  process.exitCode = 1;
} else {
  process.stdout.write(
    "Section 27.2 fixtures: 20 images, 60 rows, maths/code/footnotes, PDF and long titles verified\n"
  );
}
