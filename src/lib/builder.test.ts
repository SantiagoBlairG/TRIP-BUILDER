import { describe, expect, it } from "vitest";
import {
  cleanDraft,
  addCityToDraft,
  dateDays,
  defaultDetails,
  detailsSchema,
  draftIssues,
  draftSchema,
  emptyDraft,
  estimateDraft,
} from "./builder";
describe("builder draft rules", () => {
  it("prunes cities and saved ideas when a country is removed", () => {
    const draft = emptyDraft();
    draft.countryIds = ["japan"];
    draft.route = [
      { cityId: "tokyo", days: 4 },
      { cityId: "paris", days: 3 },
    ];
    draft.savedIds = ["tokyo-01", "paris-01"];
    const cleaned = cleanDraft(draft);
    expect(cleaned.route).toEqual([{ cityId: "tokyo", days: 4 }]);
    expect(cleaned.savedIds).toEqual(["tokyo-01"]);
    expect(cleanDraft({ ...cleaned, countryIds: [] }).savedIds).toEqual([]);
  });
  it("rejects invalid dates, no adult, and missing custom budget", () => {
    expect(dateDays("2028-02-28", "2028-03-01")).toBe(3);
    expect(
      detailsSchema.safeParse({
        ...defaultDetails,
        dateMode: "dates",
        startDate: "2027-02-30",
        endDate: "2027-03-02",
      }).success,
    ).toBe(false);
    expect(
      detailsSchema.safeParse({ ...defaultDetails, adults: 0 }).success,
    ).toBe(false);
    expect(
      detailsSchema.safeParse({ ...defaultDetails, budgetLevel: "custom" })
        .success,
    ).toBe(false);
  });
  it("preserves overallocated drafts but reports them as incomplete", () => {
    const draft = emptyDraft();
    draft.countryIds = ["japan"];
    draft.route = [{ cityId: "tokyo", days: 11 }];
    expect(draftSchema.safeParse(draft).success).toBe(true);
    expect(draftIssues(draft)).toHaveLength(1);
    draft.route[0].days = 10;
    expect(draftIssues(draft)).toEqual([]);
    draft.route[0].days = 4;
    expect(draftIssues(draft)).toHaveLength(1);
  });
  it("grows suggested duration and preserves full city recommendations", () => {
    let draft = emptyDraft();
    draft.countryIds = ["japan", "france"];
    for (const city of ["tokyo", "kyoto", "osaka", "paris", "lyon"])
      draft = addCityToDraft(draft, city);
    expect(draft.route).toHaveLength(5);
    expect(draft.details.totalDays).toBeGreaterThan(10);
    expect(draft.details.totalDays).toBe(
      draft.route.reduce((n, stop) => n + stop.days, 0),
    );
    expect(draftSchema.safeParse(draft).success).toBe(true);
  });
  it("allows more cities without changing exact dates", () => {
    let draft = emptyDraft();
    draft.countryIds = ["japan"];
    draft.details = {
      ...draft.details,
      dateMode: "dates",
      startDate: "2027-01-01",
      endDate: "2027-01-02",
    };
    draft = addCityToDraft(addCityToDraft(draft, "tokyo"), "kyoto");
    expect(draft.route).toHaveLength(2);
    expect(draft.details.endDate).toBe("2027-01-02");
    expect(draftSchema.safeParse(draft).success).toBe(true);
    expect(draftIssues(draft)).not.toEqual([]);
  });
  it("scales mock estimates with people, duration and budget without charging twice for saved ideas", () => {
    const draft = emptyDraft();
    draft.countryIds = ["japan"];
    draft.route = [{ cityId: "tokyo", days: 10 }];
    const base = estimateDraft(draft);
    expect(base.min).toBeGreaterThan(0);
    expect(
      estimateDraft({ ...draft, details: { ...draft.details, adults: 2 } }).max,
    ).toBe(base.max * 2);
    expect(estimateDraft({ ...draft, savedIds: ["tokyo-01"] })).toEqual(base);
    expect(
      estimateDraft({
        ...draft,
        details: { ...draft.details, budgetLevel: "premium" },
      }).max,
    ).toBe(Math.round(base.max * 1.6));
  });
});
