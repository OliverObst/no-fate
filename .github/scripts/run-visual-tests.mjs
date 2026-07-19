#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const extraArgs = process.argv.slice(2);
const playwrightArgs = ["playwright", "test", "--project=visual", ...extraArgs];

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options
  });
  if (result.error) {
    process.stderr.write(`${result.error.message}\n`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
};

if (process.platform === "linux") {
  run("npx", playwrightArgs);
}

const architecture = process.arch === "arm64" ? "arm64" : "amd64";
const repository = process.cwd();
const repositoryName = path.basename(repository);
const parent = path.dirname(repository);
const user = typeof process.getuid === "function" && typeof process.getgid === "function"
  ? `${process.getuid()}:${process.getgid()}`
  : null;
const quotedArgs = extraArgs.map((argument) => `'${argument.replaceAll("'", "'\\''")}'`).join(" ");
const command = [
  "curl --fail --silent --show-error --location",
  `--output /tmp/hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.164.0/hugo_0.164.0_linux-${architecture}.deb`,
  "&& dpkg-deb --extract /tmp/hugo.deb /tmp/hugo",
  "&& export PATH=/tmp/hugo/usr/local/bin:/tmp/hugo/usr/bin:$PATH",
  `&& npx playwright test --project=visual ${quotedArgs}`
].join(" ");
const dockerArgs = [
  "run",
  "--rm",
  "--platform", `linux/${architecture}`,
  "-e", "HOME=/tmp",
  "-e", "CI=1",
  "-v", `${parent}:/workspace`,
  "-w", `/workspace/${repositoryName}`
];

if (user) dockerArgs.push("--user", user);
dockerArgs.push(
  "mcr.microsoft.com/playwright:v1.61.1-noble@sha256:5b8f294aff9041b7191c34a4bab3ac270157a28774d4b0660e9743297b697e48",
  "bash",
  "-lc",
  command
);

run("docker", dockerArgs);
