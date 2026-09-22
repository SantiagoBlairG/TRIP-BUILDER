import { z } from "zod";
import { activities, cities, countryById } from "@/data/catalog";
import { travelStyleIdSchema } from "@/types/travel";

export const detailsSchema = z
  .object({
    name: z.string().trim().min(1, "Give your trip a name").max(80),
    dateMode: z.enum(["duration", "dates"]),
    totalDays: z.number().int().min(1).max(365),
    startDate: z.string(),
    endDate: z.string(),
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(20),
    names: z.string().max(500),
    travelerType: z.enum(["solo", "couple", "friends", "family", "group"]),
    budgetLevel: z.enum(["budget", "balanced", "premium", "custom"]),
    customAmount: z.number().min(0),
  })
  .superRefine((d, ctx) => {
    if (
      d.dateMode === "dates" &&
      (!z.iso.date().safeParse(d.startDate).success ||
        !z.iso.date().safeParse(d.endDate).success ||
        dateDays(d.startDate, d.endDate) < 1 ||
        dateDays(d.startDate, d.endDate) > 365)
    )
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Choose valid dates in order, up to 365 days apart.",
      });
    if (d.budgetLevel === "custom" && d.customAmount <= 0)
      ctx.addIssue({
        code: "custom",
        path: ["customAmount"],
        message: "Enter a positive budget.",
      });
  });
export type BuilderDetails = z.infer<typeof detailsSchema>;
export const defaultDetails: BuilderDetails = {
  name: "My next adventure",
  dateMode: "duration",
  totalDays: 10,
  startDate: "",
  endDate: "",
  adults: 1,
  children: 0,
  names: "",
  travelerType: "solo",
  budgetLevel: "balanced",
  customAmount: 0,
};
export const draftSchema = z
  .object({
    details: detailsSchema,
    countryIds: z.array(z.string()),
    route: z.array(
      z.object({ cityId: z.string(), days: z.number().int().min(1).max(365) }),
    ),
    priorities: z.array(travelStyleIdSchema),
    savedIds: z.array(z.string()),
    updatedAt: z.string(),
  })
  .refine(
    (d) =>
      d.route.reduce((n, s) => n + s.days, 0) <=
      (d.details.dateMode === "dates"
        ? dateDays(d.details.startDate, d.details.endDate)
        : d.details.totalDays),
    "Route exceeds duration",
  );
export type BuilderDraft = z.infer<typeof draftSchema>;
export const emptyDraft = (): BuilderDraft => ({
  details: { ...defaultDetails },
  countryIds: [],
  route: [],
  priorities: [],
  savedIds: [],
  updatedAt: "",
});
export function dateDays(start: string, end: string) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1;
}
export function duration(d: BuilderDraft) {
  return d.details.dateMode === "dates"
    ? dateDays(d.details.startDate, d.details.endDate)
    : d.details.totalDays;
}
export function assignedDays(d: BuilderDraft) {
  return d.route.reduce((n, s) => n + s.days, 0);
}
/** Prune dependent selections after a parent is removed. Never silently shorten a route. */
export function cleanDraft(d: BuilderDraft): BuilderDraft {
  const countryIds = [...new Set(d.countryIds)].filter((id) => countryById[id]);
  const seen = new Set<string>();
  const route = d.route.filter((s) => {
    const valid =
      cities.some(
        (c) => c.id === s.cityId && countryIds.includes(c.countryId),
      ) && !seen.has(s.cityId);
    seen.add(s.cityId);
    return valid;
  });
  return {
    ...d,
    countryIds,
    route,
    priorities: [...new Set(d.priorities)],
    savedIds: [...new Set(d.savedIds)].filter((id) =>
      activities.some(
        (a) => a.id === id && route.some((s) => s.cityId === a.cityId),
      ),
    ),
  };
}
export function draftIssues(d: BuilderDraft) {
  const issues: string[] = [];
  if (!d.countryIds.length) issues.push("Choose at least one country.");
  if (!d.route.length) issues.push("Add a city to your route.");
  if (assignedDays(d) !== duration(d))
    issues.push(
      `Assign all ${duration(d)} days to your route (${assignedDays(d)} assigned).`,
    );
  return issues;
}
/** Mock land-only USD estimate: country daily ranges × route days × people × tier.
 * Unassigned days use the selected-country average. Saved activities are included
 * in daily allowances, never added again. Flights excluded; custom uses balanced rates. */
export function estimateDraft(d: BuilderDraft) {
  const selected = d.countryIds.flatMap((id) =>
    countryById[id] ? [countryById[id]!] : [],
  );
  const people = d.details.adults + d.details.children;
  const factor = { budget: 0.75, balanced: 1, premium: 1.6, custom: 1 }[
    d.details.budgetLevel
  ];
  const cost = (key: "min" | "max") => {
    if (!selected.length) return 0;
    const routeCost = d.route.reduce(
      (sum, s) =>
        sum +
        (countryById[cities.find((c) => c.id === s.cityId)?.countryId ?? ""]
          ?.dailyBudget[key] ?? 0) *
          s.days,
      0,
    );
    const unassigned = Math.max(0, duration(d) - assignedDays(d));
    return Math.round(
      (routeCost +
        (unassigned * selected.reduce((n, c) => n + c.dailyBudget[key], 0)) /
          selected.length) *
        people *
        factor,
    );
  };
  return { min: cost("min"), max: cost("max"), people };
}
