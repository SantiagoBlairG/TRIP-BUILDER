// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { activities, cities, countries, demoTrips } from "./catalog";
import { getDestinationImage } from "./images";
import { catalogSchema } from "@/lib/validation";
import { tripSchema, travelStyleIds } from "@/types/travel";

const catalog = { countries, cities, activities, demoTrips };

describe("normalized destination fixtures", () => {
  it("covers all required destinations with complete city and activity references", () => {
    expect(countries.map((country) => country.id).sort()).toEqual([
      "colombia",
      "france",
      "greece",
      "italy",
      "japan",
      "spain",
    ]);
    for (const country of countries) {
      expect(country.cityIds.length).toBeGreaterThanOrEqual(4);
      expect(country.cityIds.length).toBeLessThanOrEqual(5);
    }
    for (const city of cities) {
      expect(city.activityIds.length).toBeGreaterThanOrEqual(6);
      expect(city.activityIds.length).toBeLessThanOrEqual(10);
    }
    expect(new Set(activities.map((activity) => activity.category))).toEqual(
      new Set(travelStyleIds),
    );
    expect(catalogSchema.safeParse(catalog).success).toBe(true);
    expect(demoTrips).toHaveLength(4);
  });

  it("rejects duplicate entity IDs and missing reverse references", () => {
    expect(
      catalogSchema.safeParse({
        ...catalog,
        activities: [...activities, activities[0]],
      }).success,
    ).toBe(false);
    const broken = structuredClone(catalog);
    broken.countries[0].cityIds = [];
    expect(catalogSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects cross-country activity links, saved activities, and scheduled activities", () => {
    const wrongCountry = structuredClone(catalog);
    wrongCountry.activities[0].countryId = "italy";
    expect(catalogSchema.safeParse(wrongCountry).success).toBe(false);
    const wrongSaved = structuredClone(catalog);
    wrongSaved.demoTrips[0].savedActivityIds.push("positano-01");
    expect(catalogSchema.safeParse(wrongSaved).success).toBe(false);
    const wrongDay = structuredClone(catalog);
    wrongDay.demoTrips[0].itinerary[0].activities[0].activityId = "kyoto-01";
    expect(catalogSchema.safeParse(wrongDay).success).toBe(false);
  });

  it("keeps every referenced photo local, documented, and a valid photo asset", () => {
    const paths = new Set(
      [...countries, ...cities, ...activities].map((entity) => entity.image),
    );
    for (const path of paths) {
      const metadata = getDestinationImage(path);
      expect(metadata?.alt.length).toBeGreaterThan(15);
      expect(metadata?.caption).toContain("inspiration");
      const bytes = readFileSync(
        new URL(
          `../..${path.replace("/images/", "/public/images/")}`,
          import.meta.url,
        ),
      );
      expect([
        [255, 216],
        [137, 80],
      ]).toContainEqual([...bytes.subarray(0, 2)]);
    }
    for (const city of cities)
      expect(getDestinationImage(city.image)?.cityId).toBe(city.id);
    for (const activity of activities)
      expect(getDestinationImage(activity.image)?.cityId).toBe(activity.cityId);
  });
});

describe("trip constraints", () => {
  it("rejects overflow, inconsistent dates, and itinerary order mismatches", () => {
    const overflow = structuredClone(demoTrips[0]);
    overflow.route[0].days += 1;
    expect(tripSchema.safeParse(overflow).success).toBe(false);
    expect(
      tripSchema.safeParse({ ...demoTrips[0], endDate: "2027-04-06" }).success,
    ).toBe(false);
    const wrongOrder = structuredClone(demoTrips[0]);
    wrongOrder.itinerary[0].cityId = "kyoto";
    expect(tripSchema.safeParse(wrongOrder).success).toBe(false);
  });

  it("allows unscheduled, undated drafts but requires an adult and valid custom budget", () => {
    const draft = {
      ...demoTrips[2],
      countryIds: [],
      route: [],
      itinerary: [],
      savedActivityIds: [],
    };
    expect(tripSchema.safeParse(draft).success).toBe(true);
    expect(
      tripSchema.safeParse({
        ...draft,
        travelers: [{ id: "child", name: "Lee", type: "child" }],
      }).success,
    ).toBe(false);
    expect(
      tripSchema.safeParse({
        ...draft,
        budget: { level: "custom", currency: "USD" },
      }).success,
    ).toBe(false);
  });
});
