import { expect, test, type Page } from "@playwright/test";
const review = async (page: Page) => {
  const button = page.getByRole("button", { name: "Review trip", exact: true });
  if ((await button.getAttribute("aria-expanded")) !== "true")
    await button.click();
};
const step = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: "Builder steps" })
    .getByRole("button", { name: new RegExp(name) })
    .click();

test("bottom bar advances, goes back, and validates Details before Next", async ({
  page,
}) => {
  await page.goto("/builder");
  const next = page.getByRole("button", { name: "Next step", exact: true });
  await expect(next).toBeDisabled();
  await page
    .getByRole("button", { name: "Select Japan", exact: true })
    .press("Space");
  await expect(next).toBeEnabled();
  await next.click();
  await expect(
    page.getByRole("button", { name: "Select Tokyo", exact: true }),
  ).toBeVisible();
  await expect(next).toBeDisabled();
  await page.getByRole("button", { name: "Select Tokyo", exact: true }).click();
  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(
    page.getByRole("button", { name: "Select Japan", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await next.click();
  await next.click();
  await page.getByLabel("Trip name", { exact: true }).fill("");
  await next.click();
  await expect(
    page.getByRole("region", { name: "Option tray" }).getByRole("alert"),
  ).toContainText("Give your trip a name");
  await page
    .getByLabel("Trip name", { exact: true })
    .fill("A smaller, simpler trip");
  await next.click();
  await expect(
    page.getByRole("button", { name: "Food & gastronomy", exact: true }),
  ).toBeVisible();
  await next.click();
  await expect(
    page.getByRole("button", { name: /^Save / }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Review draft", exact: true }).click();
  await expect(page.locator("#trip-review")).toBeVisible();
  await expect(page.locator("#trip-review")).toContainText(
    "A smaller, simpler trip",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#trip-review")).toBeHidden();
});

test("build a draft, validate details, save ideas, resume and remove dependent selections", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/builder");
  await page.getByRole("button", { name: "Select Japan", exact: true }).click();
  await step(page, "Cities");
  await expect(
    page.getByRole("button", { name: "Select Paris", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Select Tokyo", exact: true }).click();
  await page.getByRole("button", { name: "Select Kyoto", exact: true }).click();
  await review(page);
  await page.getByRole("button", { name: "Move Kyoto earlier" }).click();
  const canvas = page.locator("#trip-review");
  await expect(canvas.locator("li").first()).toContainText("Kyoto");
  await step(page, "Details");
  await page.getByLabel("Trip name", { exact: true }).fill("Autumn in Japan");
  await page.getByLabel("Total days", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Apply trip details" }).click();
  await expect(
    page.getByRole("region", { name: "Option tray" }).getByRole("alert"),
  ).toContainText("route already uses");
  await page.getByLabel("Total days", { exact: true }).fill("12");
  await page.getByLabel("Traveling as").selectOption("couple");
  await page.getByLabel("Budget level").selectOption("custom");
  await page.getByRole("button", { name: "Apply trip details" }).click();
  await expect(
    page.getByRole("region", { name: "Option tray" }).getByRole("alert"),
  ).toContainText("positive budget");
  await page.getByLabel("Total budget (USD)").fill("5000");
  await page.getByRole("button", { name: "Apply trip details" }).click();
  await expect(canvas).toContainText("12 days · 2 travelers");
  await review(page);
  await page.getByRole("button", { name: "Distribute remaining days" }).click();
  await expect(canvas).toContainText("Your draft is ready");
  await step(page, "Interests");
  await page
    .getByRole("button", { name: "Food & gastronomy", exact: true })
    .click();
  await step(page, "Experiences");
  const save = page.getByRole("button", { name: /^Save / }).first();
  await save.click();
  await expect(canvas).toContainText("1 saved idea");
  await page.goto("/trips");
  await expect(
    page.getByRole("region", { name: "Your saved draft" }),
  ).toContainText("Autumn in Japan");
  await page.getByRole("link", { name: "Resume draft" }).click();
  await page.reload();
  await expect(canvas).toContainText("Autumn in Japan");
  await expect(canvas).toContainText("1 saved idea");
  await review(page);
  await page.getByRole("button", { name: "Remove country Japan" }).click();
  await expect(canvas).toContainText("0 saved ideas");
  await expect(page.getByRole("button", { name: "Reorder Kyoto" })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("button", { name: "Keep my draft" }).click();
  await expect(canvas).toContainText("Autumn in Japan");
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("button", { name: "Clear draft", exact: true }).click();
  await page.reload();
  await expect(canvas).toContainText("My next adventure");
  expect(errors).toEqual([]);
});

test("pointer drag adds a destination and keyboard reorders the route", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/builder");
  const handle = page.getByRole("button", {
    name: "Select Colombia",
    exact: true,
  });
  await handle.scrollIntoViewIfNeeded();
  const from = await handle.boundingBox();
  const to = await page.locator("[class*=dockDrop]").boundingBox();
  if (!from || !to) throw new Error("Missing drag target");
  await page.mouse.move(from.x + 20, from.y + 20);
  await page.mouse.down();
  await page.mouse.move(to.x + 80, to.y + 20, { steps: 20 });
  await page.mouse.up();
  // dnd-kit suppresses synthetic clicks for 50ms after releasing a pointer drag.
  await page.waitForTimeout(80);
  await expect(handle).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("navigation", { name: "Builder steps" })
    .getByRole("button", { name: /Cities/ })
    .press("Enter");
  await page
    .getByRole("button", { name: "Select Cartagena", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Select Medellín", exact: true })
    .click();
  await review(page);
  const reorder = page.getByRole("button", { name: "Reorder Cartagena" });
  await reorder.focus();
  await page.keyboard.press("Space", { delay: 100 });
  await page.keyboard.press("ArrowDown", { delay: 100 });
  await page.keyboard.press("Space", { delay: 100 });
  await expect(
    page.locator("#trip-review").locator("li").first(),
  ).toContainText("Medellín");
});

test("corrupt storage recovers and exact dates survive reload", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("corrupt-seeded")) {
      localStorage.setItem("roam-builder-v1", "broken json");
      sessionStorage.setItem("corrupt-seeded", "yes");
    }
  });
  await page.goto("/builder");
  await step(page, "Details");
  await page.getByLabel("Date preference").selectOption("dates");
  await page.getByLabel("Start date", { exact: true }).fill("2027-04-10");
  await page.getByLabel("End date", { exact: true }).fill("2027-04-09");
  await page.getByRole("button", { name: "Apply trip details" }).click();
  await expect(
    page.getByRole("region", { name: "Option tray" }).getByRole("alert"),
  ).toContainText("valid dates");
  await page.getByLabel("End date", { exact: true }).fill("2027-04-14");
  await page.getByRole("button", { name: "Apply trip details" }).click();
  await expect(page.locator("#trip-review")).toContainText("5 days");
  await page.reload();
  await expect(page.locator("#trip-review")).toContainText("2027-04-10");
  await expect(page.locator("#trip-review")).toContainText("5 days");
});

test("blocked storage leaves builder usable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("/builder");
  await page.getByRole("button", { name: "Select Japan", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Local saving" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Select Japan", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test.describe("touch selection", () => {
  test.use({ hasTouch: true });
  test("cards select with a tap and the bottom bar remains reachable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/builder");
    const card = page.getByRole("button", {
      name: "Select Japan",
      exact: true,
    });
    await card.tap();
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Next step", exact: true }).tap();
    await page.getByRole("button", { name: "Select Tokyo", exact: true }).tap();
    await page.getByRole("button", { name: "Review trip", exact: true }).tap();
    await expect(page.locator("#trip-review")).toContainText("Tokyo");
    await page.getByRole("button", { name: "Close trip review" }).tap();
    await expect(page.locator("#trip-review")).toBeHidden();
  });
});

for (const width of [375, 768, 1440])
  test(`builder fits ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/builder");
    await expect(
      page.getByRole("button", { name: "Select Japan", exact: true }),
    ).toBeVisible();
    for (const name of ["Destinations", "Details", "Interests"]) {
      await step(page, name);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await step(page, "Destinations");
    await page
      .getByRole("button", { name: "Select Japan", exact: true })
      .click();
    await step(page, "Cities");
    await page
      .getByRole("button", { name: "Select Tokyo", exact: true })
      .click();
    await expect(
      page.getByRole("region", { name: "Option tray" }).locator("div").first(),
    ).toHaveCSS("opacity", "1");
    await page.screenshot({
      path: testInfo.outputPath(`builder-${width}.png`),
      fullPage: true,
    });
  });
