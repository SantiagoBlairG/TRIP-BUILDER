import { test, expect } from "@playwright/test";
test("edit is transactional, persists, and delete stays deleted", async ({
  page,
}) => {
  await page.goto("/trips/japan-spring");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Trip name", { exact: true }).fill("Cancelled name");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Edit", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await dialog.getByLabel("Trip name", { exact: true }).fill("Edited Japan");
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Edited Japan", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Edited Japan", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await dialog.getByRole("button", { name: "Keep trip" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await dialog
    .getByRole("button", { name: "Delete trip", exact: true })
    .click();
  await expect(page).toHaveURL(/\/trips$/);
  await page.reload();
  await page
    .getByRole("searchbox", { name: "Search trips" })
    .fill("Edited Japan");
  await expect(
    page.getByRole("heading", { name: "No trips found" }),
  ).toBeVisible();
  await page.goto("/trips/japan-spring");
  await expect(
    page.getByRole("heading", { name: /isn.t in your library/ }),
  ).toBeVisible();
});
test("mobile modal validates details and leaves the original on failed save", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/trips/japan-spring");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Trip name", { exact: true }).fill("");
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Give your trip a name",
  );
  await dialog.getByLabel("Trip name", { exact: true }).fill("Unsaved name");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Quota");
    };
  });
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "original trip is unchanged",
  );
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Unsaved name" })).toHaveCount(
    0,
  );
});

test("delete unfinished builder draft requires confirmation and persists", async ({
  page,
}) => {
  await page.goto("/builder");
  await page.getByRole("button", { name: "Select Japan", exact: true }).click();
  await page.goto("/trips");
  const draft = page.getByRole("region", { name: "Your saved draft" });
  await draft
    .getByRole("button", { name: "Delete draft", exact: true })
    .click();
  await draft.getByRole("button", { name: "Keep draft" }).click();
  await expect(draft).toBeVisible();
  await draft
    .getByRole("button", { name: "Delete draft", exact: true })
    .click();
  await draft.getByRole("button", { name: "Confirm delete draft" }).click();
  await expect(draft).toHaveCount(0);
  await page.reload();
  await expect(draft).toHaveCount(0);
});
