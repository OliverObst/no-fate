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
  ["/record/", "record"],
  ["/fixtures/archive-contact-sheet-20/", "archive-20"]
];
const accessibilityThreshold = 0.95;
const performanceThreshold = 0.95;
const cumulativeLayoutShiftThreshold = 0.1;
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
  "--minify",
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
  const summary = [];
  for (const [route, name] of routes) {
    const result = await lighthouse(`${baseURL}${route}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["accessibility", "performance"],
      formFactor: "desktop",
      throttlingMethod: "provided",
      screenEmulation: {
        mobile: false,
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        disabled: false
      }
    });
    const accessibility = result.lhr.categories.accessibility.score;
    const performance = result.lhr.categories.performance.score;
    const cumulativeLayoutShift =
      result.lhr.audits["cumulative-layout-shift"].numericValue;
    const accessibilityPercentage = Math.round(accessibility * 100);
    const performancePercentage = Math.round(performance * 100);
    fs.writeFileSync(
      path.join(reportDir, `${name}.json`),
      JSON.stringify(result.lhr, null, 2)
    );
    summary.push({
      name,
      route,
      accessibility,
      performance,
      cumulativeLayoutShift
    });
    process.stdout.write(
      `Lighthouse: ${name} accessibility ${accessibilityPercentage}, `
      + `performance ${performancePercentage}, `
      + `CLS ${cumulativeLayoutShift.toFixed(3)}\n`
    );
    if (accessibility < accessibilityThreshold) {
      failures.push(
        `${name}: accessibility ${accessibilityPercentage} is below `
        + `${accessibilityThreshold * 100}`
      );
    }
    if (performance < performanceThreshold) {
      failures.push(
        `${name}: performance ${performancePercentage} is below `
        + `${performanceThreshold * 100}`
      );
    }
    if (cumulativeLayoutShift > cumulativeLayoutShiftThreshold) {
      failures.push(
        `${name}: CLS ${cumulativeLayoutShift.toFixed(3)} exceeds `
        + cumulativeLayoutShiftThreshold
      );
    }
  }
  fs.writeFileSync(
    path.join(reportDir, "summary.json"),
    JSON.stringify({
      thresholds: {
        accessibility: accessibilityThreshold,
        performance: performanceThreshold,
        cumulativeLayoutShift: cumulativeLayoutShiftThreshold
      },
      results: summary
    }, null, 2)
  );

  if (failures.length) {
    failures.forEach((failure) => process.stderr.write(`${failure}\n`));
    process.exitCode = 1;
  }
} finally {
  if (chrome) await chrome.kill();
  server.kill("SIGTERM");
}
