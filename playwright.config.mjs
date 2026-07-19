import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results/playwright",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["line"], ["html", { outputFolder: "test-results/playwright-report", open: "never" }]]
    : "list",
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
      scale: "css"
    }
  },
  use: {
    baseURL,
    colorScheme: "light",
    locale: "en-AU",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    timezoneId: "Australia/Sydney",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 1000 }
  },
  webServer: {
    command: [
      "hugo server",
      "--source exampleSite",
      "--themesDir ../..",
      `--baseURL ${baseURL}`,
      "--bind 127.0.0.1",
      "--port 4173",
      "--appendPort=false",
      "--disableFastRender",
      "--panicOnWarning"
    ].join(" "),
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  snapshotPathTemplate: "{testDir}/visual-snapshots/{arg}{ext}",
  projects: [
    {
      name: "accessibility",
      testMatch: /accessibility\.spec\.mjs/
    },
    {
      name: "visual",
      testMatch: /visual\.spec\.mjs/
    }
  ]
});
