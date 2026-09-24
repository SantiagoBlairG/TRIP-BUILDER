import { test, expect } from "@playwright/test";
import activities from "../src/data/activities.json";
test("all activity photos are served locally", async ({ request }) => {
  for (let i = 0; i < activities.length; i += 12) {
    await Promise.all(
      activities.slice(i, i + 12).map(async (a) => {
        const r = await request.get(a.image);
        expect(r.ok(), a.id).toBe(true);
        expect(r.headers()["content-type"]).toMatch(/image/);
        expect((await r.body()).length).toBeGreaterThan(1000);
      }),
    );
  }
});
test("Italy activities use individual photos in the builder", async ({
  page,
}, testInfo) => {
  await page.goto("/builder");
  await page.getByRole("button", { name: "Select Italy", exact: true }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  for (const city of ["Rome", "Florence", "Positano"])
    await page
      .getByRole("button", { name: "Select " + city, exact: true })
      .click();
  await page
    .getByRole("navigation", { name: "Builder steps" })
    .getByRole("button", { name: /Experiences/ })
    .click();
  const photos = page
    .getByRole("region", { name: "Option tray" })
    .locator("img");
  await expect(photos).toHaveCount(18);
  for (const img of await photos.all()) {
    await expect(img).toHaveAttribute("src", /activities/);
  }
  const first = photos.first();
  await expect(first).toHaveJSProperty("complete", true);
  expect(
    await first.evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
  await page.screenshot({
    path: testInfo.outputPath("italy-activities.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Photo credits", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "views behind",
  );
});
