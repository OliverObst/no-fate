#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const documents = [
  "README.md",
  "CONTRIBUTING.md",
  "RELEASE.md",
  "UPSTREAM.md",
  "CHANGELOG.md",
  ...fs.readdirSync(path.join(root, "docs"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join("docs", name))
];

const failures = [];
const linkPattern = /\[[^\]]*]\(([^)]+)\)/g;

for (const relativeDocument of documents) {
  const absoluteDocument = path.join(root, relativeDocument);
  const markdown = fs.readFileSync(absoluteDocument, "utf8")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "");

  for (const match of markdown.matchAll(linkPattern)) {
    let target = match[1].trim();

    if (target.startsWith("<")) {
      const closing = target.indexOf(">");
      if (closing !== -1) target = target.slice(1, closing);
    } else {
      target = target.split(/\s+["']/)[0];
    }

    if (
      !target ||
      target.startsWith("#") ||
      /^(?:https?:|mailto:|tel:)/i.test(target)
    ) {
      continue;
    }

    target = target.split("#")[0].split("?")[0];
    if (!target) continue;

    let decodedTarget;
    try {
      decodedTarget = decodeURIComponent(target);
    } catch {
      failures.push(`${relativeDocument}: invalid encoded link target ${target}`);
      continue;
    }

    const resolved = path.resolve(path.dirname(absoluteDocument), decodedTarget);
    if (!fs.existsSync(resolved)) {
      failures.push(`${relativeDocument}: missing local link target ${target}`);
    }
  }
}

if (failures.length) {
  failures.forEach((failure) => process.stderr.write(`${failure}\n`));
  process.exit(1);
}

process.stdout.write(`Markdown link check passed (${documents.length} documents).\n`);
