import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  ["/", "home"],
  ["/essays/maintenance-is-a-design-material/", "editorial mode"],
  ["/questions/what-are-we-optimising/", "poster mode"],
  ["/archives/tide-room-ledgers/", "archive mode"],
  ["/record/register-of-useful-misplacements/", "record mode"],
  ["/record/", "structured record"],
  ["/fixtures/structural-components/", "editorial components"],
  ["/fixtures/archive-contact-sheet-20/", "20-image archive"],
  ["/fixtures/long-record-table/", "long record table"],
  ["/fixtures/maths-code-and-footnotes/", "maths, code and footnotes"],
  ["/fixtures/artefact-pdf-download/", "PDF artefact download"],
  ["/fixtures/long-english-title/", "long English title"],
  ["/fixtures/long-german-title/", "long German title"],
  ["/search/", "search"]
];

const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const formatViolations = (violations) => violations.map((violation) => {
  const targets = violation.nodes.flatMap((node) => node.target).join(", ");
  return `${violation.id} (${violation.impact}): ${violation.help}; ${targets}`;
}).join("\n");

const visit = async (page, route, theme = "light") => {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem("pref-theme", selectedTheme);
  }, theme);
  const response = await page.goto(route, { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);
  await expect(page.locator("#nf-main")).toBeVisible();
};

for (const [route, label] of routes) {
  test(`${label} has no detectable WCAG A or AA violations`, async ({ page }) => {
    await visit(page, route);
    const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
}

test("dark mode remains accessible after client-side theme selection", async ({ page }) => {
  await visit(page, "/questions/what-are-we-optimising/", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
  expect(results.violations, formatViolations(results.violations)).toEqual([]);
});

test("structured-record filters remain labelled and accessible after use", async ({ page }) => {
  await visit(page, "/record/");
  const year = page.locator('[data-nf-filter-field="year"]');
  await year.selectOption("2026");
  await expect(page.locator(".nf-section-filters__status").last()).toContainText("record entries");
  const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
  expect(results.violations, formatViolations(results.violations)).toEqual([]);
});

test("mobile reflow remains accessible at 200 per cent equivalent width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await visit(page, "/fixtures/structural-components/");
  const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
  expect(results.violations, formatViolations(results.violations)).toEqual([]);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

for (const [route, label] of [
  ["/fixtures/long-english-title/", "long English title"],
  ["/fixtures/long-german-title/", "long German title"],
  ["/fixtures/long-record-table/", "long record table"]
]) {
  test(`${label} does not force page-level horizontal scrolling`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await visit(page, route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
