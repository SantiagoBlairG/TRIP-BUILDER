import { describe, expect, it } from "vitest";
import { activities, cities } from "@/data/catalog";
import { citiesForCountries, recommendActivities } from "./recommendations";

describe("destination-aware recommendations", () => {
  it("filters countries before offering cities, including multi-country selections", () => {
    const result = citiesForCountries(cities, ["colombia", "italy"]);
    expect(result).toHaveLength(8);
    expect(
      result.every((city) => ["colombia", "italy"].includes(city.countryId)),
    ).toBe(true);
    expect(citiesForCountries(cities, [])).toEqual([]);
  });

  it("never leaks activities from unrelated cities, even with matching travel styles", () => {
    const result = recommendActivities(
      activities,
      ["santa-marta"],
      ["beaches"],
    );
    expect(result).toHaveLength(6);
    expect(result.every((activity) => activity.cityId === "santa-marta")).toBe(
      true,
    );
    expect(
      result.some((activity) => activity.name === "Tayrona day trip"),
    ).toBe(true);
    expect(
      result.some((activity) => activity.name === "Fornillo Beach afternoon"),
    ).toBe(false);
    expect(recommendActivities(activities, [], ["food"])).toEqual([]);
    expect(recommendActivities(activities, ["unknown"])).toEqual([]);
  });

  it("honors preference order without mutating source fixtures", () => {
    const originalIds = activities.map((activity) => activity.id);
    expect(
      recommendActivities(activities, ["positano"], ["food", "beaches"])[0]
        .category,
    ).toBe("food");
    expect(
      recommendActivities(activities, ["positano"], ["beaches", "food"])[0]
        .category,
    ).toBe("beaches");
    expect(activities.map((activity) => activity.id)).toEqual(originalIds);
    expect(recommendActivities(activities, ["positano"])).toEqual(
      recommendActivities(activities, ["positano"]),
    );
  });
});
