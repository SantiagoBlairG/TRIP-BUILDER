import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it } from "vitest";
import { demoTrips } from "@/data/catalog";
import { TripMap } from "./trip-map";

it("recovers the map selection when editing removes the selected day", () => {
  const original = demoTrips[0];
  const trip = {
    ...original,
    route: [original.route[0]],
    savedActivityIds: ["tokyo-01"],
    itinerary: original.itinerary
      .slice(0, 2)
      .map((day) => ({ ...day, activities: [] })),
  };
  const { rerender } = render(<TripMap trip={trip} />);
  fireEvent.change(screen.getByLabelText("Map day"), {
    target: { value: trip.itinerary[1].id },
  });
  expect(screen.getByLabelText("Map day")).toHaveValue(trip.itinerary[1].id);
  rerender(<TripMap trip={{ ...trip, itinerary: [trip.itinerary[0]] }} />);
  expect(screen.getByLabelText("Map day")).toHaveValue("ideas");
  expect(screen.getAllByRole("button", { name: /^Stop / })).toHaveLength(1);
});
