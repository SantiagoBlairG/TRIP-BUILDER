import { expect, test } from "@playwright/test";
import trips from "../src/data/demo-trips.json";

test("all sample trips open, survive reload, and return to the library", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const trip of trips) {
    await page.goto("/trips");
    await page
      .getByRole("link", {
        name: `${trip.status === "draft" ? "Review draft" : "View trip"}: ${trip.name}`,
      })
      .click();
    await expect(page).toHaveURL(`/trips/${trip.id}`);
    await expect(
      page.getByRole("heading", { level: 1, name: trip.name }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { level: 1, name: trip.name }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to my trips" }).click();
    await expect(
      page.getByRole("heading", { name: "On the horizon" }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("search recovery, new-trip navigation, and unknown trip recovery", async ({
  page,
}) => {
  await page.goto("/trips");
  await page
    .getByRole("searchbox", { name: "Search trips" })
    .fill("Not a real trip");
  await expect(
    page.getByRole("heading", { name: "No trips found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("link", { name: "Create a new trip" }).click();
  await expect(page).toHaveURL("/builder");
  await page.goto("/trips/unknown-trip");
  await expect(
    page.getByRole("heading", {
      name: "This adventure isn’t in your library.",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to my trips" }).click();
  await expect(page).toHaveURL("/trips");
});

for (const width of [375, 768, 1440]) {
  test(`library and trip preview fit ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/trips", "/trips/japan-spring"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath(
          `${path === "/trips" ? "library" : "trip"}-${width}.png`,
        ),
        fullPage: true,
      });
    }
  });
}
