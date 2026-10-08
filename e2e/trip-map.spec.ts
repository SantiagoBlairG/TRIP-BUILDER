import { test, expect } from "@playwright/test";
import trips from "../src/data/demo-trips.json";

test("country map follows route order and opens previews", async ({ page }) => {
  await page.goto("/trips/japan-spring");
  const map = page.getByRole("region", { name: "Trip map" });
  await map.scrollIntoViewIfNeeded();
  await expect(
    map.getByRole("button", { name: "Stop 1: Tokyo", exact: true }),
  ).toBeVisible();
  await map.getByRole("button", { name: "Stop 2: Kyoto", exact: true }).click();
  await expect(map.getByRole("status")).toContainText("Kyoto");
  await map.getByRole("button", { name: "Close place preview" }).click();
  await expect(map.getByRole("status")).toHaveCount(0);
  await page.screenshot({
    path: "test-results/map-country.png",
    fullPage: true,
  });
});

test("phone city map separates saved ideas and scheduled days", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const original = trips[0];
  const days = original.itinerary.filter((day) => day.cityId === "tokyo");
  const trip = {
    ...original,
    id: "local-map-test",
    route: [{ ...original.route[0], days: days.length }],
    totalDays: days.length,
    startDate: undefined,
    endDate: undefined,
    savedActivityIds: ["tokyo-01", "tokyo-02"],
    itinerary: days.map((day) => ({ ...day, activities: [] })),
  };
  await page.addInitScript(
    (value) => localStorage.setItem("roam-trips-v1", JSON.stringify([value])),
    trip,
  );
  await page.goto("/trips/local-map-test");
  const map = page.getByRole("region", { name: "Trip map" });
  await map.scrollIntoViewIfNeeded();
  await expect(map.getByLabel("Map day")).toHaveValue("ideas");
  await expect(map.getByRole("button", { name: /^Stop / })).toHaveCount(2);
  await map.getByRole("button", { name: /^Stop 1:/ }).click();
  await expect(map.getByRole("status")).toBeVisible();
  await map.getByRole("button", { name: "Close place preview" }).click();
  await map.getByLabel("Map day").selectOption(days[0].id);
  await expect(
    map.getByText("No activities scheduled for this day yet."),
  ).toBeVisible();
  await expect(map.getByRole("button", { name: /^Stop / })).toHaveCount(0);
  await map.getByLabel("Map day").selectOption("ideas");
  await expect(map.getByRole("button", { name: /^Stop / })).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/map-city-phone.png",
    fullPage: true,
  });
});
