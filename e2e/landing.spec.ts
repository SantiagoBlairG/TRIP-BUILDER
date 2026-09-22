import { expect, test } from "@playwright/test";
for (const width of [375, 768, 1440]) {
  test(
    "landing navigation and layout at " + width,
    async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Less planning.",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath("landing-" + width + ".png"),
        fullPage: true,
      });
      await page
        .getByRole("link", { name: "Explore your trips", exact: true })
        .click();
      await expect(page).toHaveURL("/trips");
      await expect(
        page.getByRole("heading", { name: "On the horizon" }),
      ).toBeVisible();
      await page.goto("/");
      await page
        .getByRole("link", { name: "Start a new trip", exact: true })
        .click();
      await expect(page).toHaveURL("/builder");
    },
  );
}
test("scroll effects reverse and reduced motion removes them", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const card = page.locator("article").first();
  const initial = await card.evaluate((el) => getComputedStyle(el).translate);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect
    .poll(() => card.evaluate((el) => getComputedStyle(el).translate))
    .not.toBe(initial);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect
    .poll(() => card.evaluate((el) => getComputedStyle(el).translate))
    .toBe(initial);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => card.evaluate((el) => getComputedStyle(el).animationName))
    .toBe("none");
});
