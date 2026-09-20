import { expect, test } from "@playwright/test";
import cities from "../src/data/cities.json";
import countries from "../src/data/countries.json";

test("every city has its own loadable local photograph", async ({ page }) => {
  await page.goto("/card-gallery");
  for (const country of countries) {
    await page
      .getByRole("button", { name: `Select ${country.name}`, exact: true })
      .click();
    for (const city of cities.filter((item) => item.countryId === country.id)) {
      const card = page
        .getByRole("button", { name: `Select ${city.name}`, exact: true })
        .locator("xpath=ancestor::*[@data-slot='card']");
      await card.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          card
            .locator("img")
            .evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
        )
        .toBe(true);
    }
  }
});

test("country selection scopes cities and activities; saving and details remain keyboard-accessible", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/card-gallery");
  await page
    .getByRole("button", { name: "Select Colombia", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Select Santa Marta", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Select Positano", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Select Santa Marta", exact: true })
    .click();
  await page.getByRole("button", { name: "Experiences", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tayrona day trip", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Fornillo Beach afternoon",
      exact: true,
    }),
  ).toHaveCount(0);
  const save = page.getByRole("button", {
    name: "Save Tayrona day trip",
    exact: true,
  });
  await save.focus();
  await page.keyboard.press("Space");
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText("1 saved in preview", { exact: true }),
  ).toBeVisible();
  const details = page
    .getByRole("button", { name: "View details", exact: true })
    .first();
  await details.click();
  await expect(
    page.getByRole("button", { name: "Hide details", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Reset preview" }).click();
  await expect(
    page.getByText("0 saved in preview", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Fornillo Beach afternoon",
      exact: true,
    }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [375, 768, 1440]) {
  test(`gallery fits ${width}px and all destination photographs load`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/card-gallery");
    for (const name of [
      "Colombia",
      "France",
      "Italy",
      "Japan",
      "Spain",
      "Greece",
    ]) {
      const card = page
        .getByRole("button", { name: `Select ${name}`, exact: true })
        .locator("xpath=ancestor::*[@data-slot='card']");
      await card.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          card
            .locator("img")
            .evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
        )
        .toBe(true);
    }
    for (const section of [
      "Destinations",
      "Experiences",
      "Trip cards",
      "Sizes & states",
    ]) {
      await page.getByRole("button", { name: section, exact: true }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await expect(
      page.getByRole("img", {
        name: "Image unavailable: Destination image fallback example",
      }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Destinations", exact: true })
      .click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`gallery-${width}.png`),
      fullPage: true,
    });
  });
}
