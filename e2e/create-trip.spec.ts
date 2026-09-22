import { test, expect, type Page } from "@playwright/test";
async function prepare(page: Page) {
  await page.goto("/builder");
  await page.getByRole("button", { name: "Select Japan", exact: true }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await page.getByRole("button", { name: "Select Tokyo", exact: true }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await page.getByLabel("Trip name", { exact: true }).fill("Our Tokyo chapter");
  await page.getByLabel("Total days", { exact: true }).fill("4");
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
}
for (const width of [375, 768, 1440])
  test(
    "creates, reloads and finds trip at " + width,
    async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      if (width === 375) await page.emulateMedia({ reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await prepare(page);
      const create = page.getByRole("button", {
        name: "Create Trip",
        exact: true,
      });
      await expect(create).toBeEnabled();
      await create.click();
      if (width === 1440) {
        await expect(page.getByRole("status")).toContainText(
          "Bringing your adventure together",
        );
        await page.waitForTimeout(6500);
        await page.screenshot({ path: testInfo.outputPath("creation.png") });
      }
      await expect(page).toHaveURL(/\/trips\/local-/, { timeout: 12000 });
      await expect(
        page.getByRole("heading", { name: "Our Tokyo chapter", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Room for the adventure" }),
      ).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "Our Tokyo chapter", exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath("overview.png"),
        fullPage: true,
      });
      await page.getByRole("link", { name: "Back to my trips" }).click();
      await page
        .getByRole("searchbox", { name: "Search trips" })
        .fill("Our Tokyo chapter");
      await expect(page.getByRole("status").last()).toContainText(
        "1 trip in view",
      );
      expect(
        await page.evaluate(
          () => JSON.parse(localStorage.getItem("roam-trips-v1")!).length,
        ),
      ).toBe(1);
      expect(
        await page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("roam-builder-v1")!).state.draft
              .countryIds,
        ),
      ).toEqual([]);
      expect(errors).toEqual([]);
    },
  );
test("failed save retains draft and permits retry", async ({ page }) => {
  await prepare(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === "roam-trips-v1") throw new Error("Quota");
      original.call(this, k, v);
    };
    Object.assign(window, {
      restoreStorage: () => {
        Storage.prototype.setItem = original;
      },
    });
  });
  await page.getByRole("button", { name: "Create Trip", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "could not be saved" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("roam-builder-v1")!).state.draft
          .countryIds,
    ),
  ).toEqual(["japan"]);
  await page.evaluate(() =>
    (window as unknown as { restoreStorage: () => void }).restoreStorage(),
  );
  await page.getByRole("button", { name: "Create Trip", exact: true }).click();
  await expect(page).toHaveURL(/\/trips\/local-/, { timeout: 12000 });
});
test("unknown local trips recover gracefully", async ({ page }) => {
  await page.goto("/trips/local-missing");
  await expect(
    page.getByRole("heading", { name: /isn.t in your library/ }),
  ).toBeVisible();
});

test("default duration creates without manually allocating leftover days", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/builder");
  await page.getByRole("button", { name: "Select Japan", exact: true }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await page.getByRole("button", { name: "Select Tokyo", exact: true }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(
    page.getByText("Create Trip will distribute the remaining 6 days", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create Trip", exact: true }).click();
  await expect(page).toHaveURL(/\/trips\/local-/);
  const trip = await page.evaluate(
    () => JSON.parse(localStorage.getItem("roam-trips-v1")!)[0],
  );
  expect(trip.route[0].days).toBe(10);
  expect(trip.itinerary).toHaveLength(10);
});
