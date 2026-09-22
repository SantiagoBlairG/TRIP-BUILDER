import { describe, expect, it } from "vitest";
import { demoTrips } from "@/data/catalog";
import { emptyDraft } from "./builder";
import {
  createTrip,
  validLocalTrip,
  tripEstimate,
  editTrip,
  tripToDraft,
} from "./trips";
const readyDraft = () => ({
  ...emptyDraft(),
  countryIds: ["japan"],
  route: [{ cityId: "tokyo", days: 10 }],
});
describe("finished local trips", () => {
  it("requires every day to be allocated", () => {
    expect(() =>
      createTrip(emptyDraft(), "local-test", "2026-09-22"),
    ).toThrow();
    expect(() =>
      createTrip(
        { ...readyDraft(), route: [{ cityId: "tokyo", days: 2 }] },
        "local-test",
        "2026-09-22",
      ),
    ).toThrow(/Assign all/);
  });
  it("preserves choices and builds ordered empty itinerary days", () => {
    const draft = readyDraft();
    draft.details.names = "Alex, Sam";
    draft.details.children = 1;
    draft.details.budgetLevel = "custom";
    draft.details.customAmount = 5000;
    const trip = createTrip(draft, "local-test", "2026-09-22");
    expect(trip.itinerary).toHaveLength(10);
    expect(trip.itinerary[9]).toMatchObject({
      dayNumber: 10,
      cityId: "tokyo",
      activities: [],
    });
    expect(trip.travelers[1]).toMatchObject({ name: "Sam", type: "child" });
    expect(trip.budget.customAmount).toBe(5000);
    expect(validLocalTrip(trip)).toEqual(trip);
    expect(tripEstimate(trip).people).toBe(2);
  });
  it("preserves inclusive dates and rejects stale catalog references", () => {
    const draft = readyDraft();
    Object.assign(draft.details, {
      dateMode: "dates",
      startDate: "2026-01-01",
      endDate: "2026-01-10",
    });
    const trip = createTrip(draft, "local-test", "2026-09-22");
    expect(trip.status).toBe("past");
    expect(trip.startDate).toBe("2026-01-01");
    expect(validLocalTrip({ ...trip, countryIds: ["unknown"] })).toBeNull();
    expect(validLocalTrip({ id: "local-broken" })).toBeNull();
  });
});

it("editing details preserves scheduled plans and route pruning removes only affected days", () => {
  const original = demoTrips.find(
    (t) => t.status !== "draft" && t.itinerary.some((d) => d.activities.length),
  )!;
  const draft = tripToDraft(original);
  draft.details.name = "Changed name";
  const updated = editTrip(original, draft, "2026-09-22");
  expect(updated.itinerary.map((d) => d.activities)).toEqual(
    original.itinerary.map((d) => d.activities),
  );
  const removedCity = draft.route[0].cityId;
  draft.route = draft.route.slice(1);
  draft.savedIds = [];
  const pruned = editTrip(original, draft, "2026-09-22");
  expect(pruned.itinerary.some((d) => d.cityId === removedCity)).toBe(false);
  expect(
    pruned.itinerary.flatMap((d) => d.activities).map((a) => a.id),
  ).not.toEqual(
    original.itinerary.flatMap((d) => d.activities).map((a) => a.id),
  );
});
