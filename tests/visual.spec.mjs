import { expect, test } from "@playwright/test";

const visit = async (page, route, theme = "light") => {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem("pref-theme", selectedTheme);
  }, theme);
  const response = await page.goto(route, { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
};

test("homepage desktop and mobile rhythm", async ({ page }) => {
  await visit(page, "/");
  await expect(page).toHaveScreenshot("home-desktop-light.png", { fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await expect(page).toHaveScreenshot("home-mobile-light.png", { fullPage: true });
});

const pageModes = [
  ["/essays/maintenance-is-a-design-material/", "mode-editorial-light.png"],
  ["/questions/what-are-we-optimising/", "mode-poster-light.png"],
  ["/archives/tide-room-ledgers/", "mode-archive-light.png"],
  ["/record/register-of-useful-misplacements/", "mode-record-light.png"]
];

for (const [route, snapshot] of pageModes) {
  test(`${snapshot} preserves its page-mode composition`, async ({ page }) => {
    await visit(page, route);
    await expect(page).toHaveScreenshot(snapshot, { fullPage: true });
  });
}

test("dark theme preserves the homepage composition", async ({ page }) => {
  await visit(page, "/", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page).toHaveScreenshot("home-desktop-dark.png", { fullPage: true });
});

test("wide and narrow navigation remain visually stable", async ({ page }) => {
  await visit(page, "/essays/");
  await expect(page.locator(".nf-site-header")).toHaveScreenshot("navigation-wide.png");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator(".nf-site-header")).toHaveScreenshot("navigation-narrow.png");
});

test("structured-record filtering has a stable active state", async ({ page }) => {
  await visit(page, "/record/");
  const filters = page.locator(".nf-structured-record__complete .nf-section-filters");
  await filters.locator('[data-nf-filter-field="year"]').selectOption("2026");
  await expect(filters.locator(".nf-section-filters__status")).toContainText("record entries");
  await filters.scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot("record-filtered.png");
});

test("contact sheet spacing and numbering remain stable", async ({ page }) => {
  await visit(page, "/fixtures/structural-components/");
  const contactSheet = page.locator(".nf-contact-sheet");
  await contactSheet.scrollIntoViewIfNeeded();
  await expect(contactSheet).toHaveScreenshot("contact-sheet.png");
});

test("20-image archive remains dense, numbered and legible", async ({ page }) => {
  await visit(page, "/fixtures/archive-contact-sheet-20/");
  const contactSheet = page.locator(".nf-contact-sheet");
  await contactSheet.scrollIntoViewIfNeeded();
  await expect(contactSheet).toHaveScreenshot("archive-contact-sheet-20.png");
});

test("genuinely long record table preserves its scanning rhythm", async ({ page }) => {
  await visit(page, "/fixtures/long-record-table/");
  const table = page.locator(".nf-table-wrap");
  await table.scrollIntoViewIfNeeded();
  await expect(table).toHaveScreenshot("long-record-table.png");
});

test("maths, code and footnotes remain composed as one article", async ({ page }) => {
  await visit(page, "/fixtures/maths-code-and-footnotes/");
  await expect(page).toHaveScreenshot("maths-code-footnotes.png", { fullPage: true });
});

test("PDF artefact presents an explicit download", async ({ page }) => {
  await visit(page, "/fixtures/artefact-pdf-download/");
  const artefact = page.locator(".nf-artefact");
  await artefact.scrollIntoViewIfNeeded();
  await expect(artefact).toHaveScreenshot("artefact-pdf-download.png");
});

test("long English and German titles wrap on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await visit(page, "/fixtures/long-english-title/");
  await expect(page.locator(".nf-article__opening")).toHaveScreenshot(
    "long-title-english-mobile.png"
  );

  await visit(page, "/fixtures/long-german-title/");
  await expect(page.locator(".nf-article__opening")).toHaveScreenshot(
    "long-title-german-mobile.png"
  );
});

test("print media keeps the editorial article legible", async ({ page }) => {
  await page.emulateMedia({ media: "print" });
  await visit(page, "/essays/maintenance-is-a-design-material/");
  await expect(page).toHaveScreenshot("editorial-print.png", { fullPage: true });
});
