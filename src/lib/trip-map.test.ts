import { describe, expect, it } from "vitest";
import { demoTrips, cityById, activityById } from "@/data/catalog";
import { mapProjection, tripMapStops } from "./trip-map";

describe("trip map", () => {
  it("follows the selected city order", () => {
    const trip = demoTrips[0];
    expect(tripMapStops(trip, "ideas").map((stop) => stop.name)).toEqual(
      trip.route.map((stop) => cityById[stop.cityId]?.name),
    );
  });
  it("keeps saved ideas separate from empty scheduled days", () => {
    const original = demoTrips[0];
    const trip = {
      ...original,
      route: [original.route[0]],
      savedActivityIds: ["tokyo-01"],
      itinerary: [{ ...original.itinerary[0], activities: [] }],
    };
    expect(tripMapStops(trip, "ideas")).toHaveLength(1);
    expect(tripMapStops(trip, trip.itinerary[0].id)).toEqual([]);
    expect(tripMapStops(trip, "removed-day")).toEqual([]);
  });
  it("fits widely separated cities inside the map", () => {
    const coordinates = [
      cityById.tokyo!.coordinates,
      cityById.cartagena!.coordinates,
    ];
    const project = mapProjection(coordinates, false);
    for (const point of coordinates) {
      expect(project(point).x).toBeGreaterThanOrEqual(150);
      expect(project(point).x).toBeLessThanOrEqual(850);
      expect(project(point).y).toBeGreaterThanOrEqual(80);
      expect(project(point).y).toBeLessThanOrEqual(380);
    }
  });
  it("keeps nearby activity pins apart on a phone", () => {
    const coordinates = [
      activityById["tokyo-01"]!.coordinates,
      activityById["tokyo-02"]!.coordinates,
    ];
    const project = mapProjection(coordinates, true);
    const [a, b] = coordinates.map(project);
    // The narrow phone canvas maps 1000 SVG units to about 270 CSS pixels.
    expect(
      Math.hypot((a.x - b.x) * 0.27, ((a.y - b.y) * 330) / 460),
    ).toBeGreaterThan(44);
  });
});
