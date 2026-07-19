#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const baseURL = "http://127.0.0.1:4174";
const reportDir = path.resolve("test-results/lighthouse");
const routes = [
  ["/", "home"],
  ["/questions/what-are-we-optimising/", "poster"],
  ["/search/", "search"],
  ["/record/", "record"]
];
const threshold = 0.95;
let serverOutput = "";

fs.mkdirSync(reportDir, { recursive: true });

const server = spawn("hugo", [
  "server",
  "--source", "exampleSite",
  "--themesDir", "../..",
  "--baseURL", baseURL,
  "--bind", "127.0.0.1",
  "--port", "4174",
  "--appendPort=false",
  "--disableFastRender",
  "--panicOnWarning"
], {
  stdio: ["ignore", "pipe", "pipe"]
});

server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

const waitForServer = async () => {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Hugo server exited early.\n${serverOutput}`);
    }
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for Hugo server.\n${serverOutput}`);
};

let chrome;

try {
  await waitForServer();
  chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ],
    logLevel: "silent"
  });

  const failures = [];
  for (const [route, name] of routes) {
    const result = await lighthouse(`${baseURL}${route}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["accessibility"]
    });
    const score = result.lhr.categories.accessibility.score;
    const percentage = Math.round(score * 100);
    fs.writeFileSync(
      path.join(reportDir, `${name}.json`),
      JSON.stringify(result.lhr, null, 2)
    );
    process.stdout.write(`Lighthouse accessibility: ${name} ${percentage}\n`);
    if (score < threshold) {
      failures.push(`${name}: ${percentage} is below ${threshold * 100}`);
    }
  }

  if (failures.length) {
    failures.forEach((failure) => process.stderr.write(`${failure}\n`));
    process.exitCode = 1;
  }
} finally {
  if (chrome) await chrome.kill();
  server.kill("SIGTERM");
}
