#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const outputDir = path.resolve(
  "exampleSite/content/fixtures/archive-contact-sheet-20/plates"
);
const checkOnly = process.argv.includes("--check");

const escapeXML = (value) => value.replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const makePlate = (number) => {
  const padded = String(number).padStart(2, "0");
  const x = 70 + ((number * 83) % 580);
  const y = 85 + ((number * 47) % 310);
  const radius = 45 + ((number * 13) % 90);
  const rotation = -28 + ((number * 17) % 57);
  const label = escapeXML(`KETTLE OBSERVATORY / PLATE ${padded}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600" role="img" aria-labelledby="title desc">
  <title id="title">Kettle Observatory plate ${padded}</title>
  <desc id="desc">Abstract red and black archival diagram numbered ${padded} on a cream field.</desc>
  <rect width="900" height="600" fill="#f3eddb"/>
  <path d="M0 ${90 + number * 11} L900 ${520 - number * 7}" stroke="#171512" stroke-width="12"/>
  <circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="#d92d20" stroke-width="28"/>
  <g transform="translate(450 300) rotate(${rotation}) translate(-450 -300)">
    <rect x="170" y="265" width="560" height="70" fill="#d92d20"/>
    <rect x="392" y="118" width="116" height="364" fill="#171512"/>
  </g>
  <rect x="36" y="36" width="828" height="528" fill="none" stroke="#171512" stroke-width="5"/>
  <text x="58" y="86" fill="#171512" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="2">${label}</text>
  <text x="830" y="535" fill="#171512" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="900" text-anchor="end">${padded}</text>
</svg>
`;
};

const mismatches = [];
if (!checkOnly) fs.mkdirSync(outputDir, { recursive: true });

for (let number = 1; number <= 20; number += 1) {
  const filename = `plate-${String(number).padStart(2, "0")}.svg`;
  const target = path.join(outputDir, filename);
  const expected = makePlate(number);

  if (checkOnly) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== expected) {
      mismatches.push(filename);
    }
  } else {
    fs.writeFileSync(target, expected);
  }
}

if (checkOnly && mismatches.length) {
  process.stderr.write(
    `Archive fixture images are missing or stale: ${mismatches.join(", ")}\n`
  );
  process.exitCode = 1;
} else {
  process.stdout.write(
    checkOnly
      ? "Archive fixture images: 20 deterministic files verified\n"
      : `Archive fixture images: wrote 20 files to ${outputDir}\n`
  );
}
