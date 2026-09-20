import { describe, expect, it } from "vitest";
import { formatTripDates } from "./format";

describe("calendar-date display", () => {
  it("keeps fixed punctuation and calendar days across month and year boundaries", () => {
    expect(formatTripDates("2027-04-05", "2027-04-14")).toBe("Apr 5–14, 2027");
    expect(formatTripDates("2027-04-30", "2027-05-02")).toBe(
      "Apr 30 – May 2, 2027",
    );
    expect(formatTripDates("2026-12-31", "2027-01-02")).toBe(
      "Dec 31, 2026 – Jan 2, 2027",
    );
    expect(formatTripDates("2027-04-05", "2027-04-05")).toBe("Apr 5, 2027");
    expect(formatTripDates()).toBe("Dates to dream about");
  });
});
