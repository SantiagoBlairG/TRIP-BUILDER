import { countries, cities, activities, countryById } from "@/data/catalog";
import { tripSchema, type Trip } from "@/types/travel";
import { findCatalogIssues } from "@/lib/validation";
import { cleanDraft, draftSchema, draftIssues, duration, estimateDraft, type BuilderDraft } from "./builder";

export function createTrip(draft: BuilderDraft, id: string, today: string): Trip {
  const d = cleanDraft(draftSchema.parse(draft));
  const issues = draftIssues(d);
  if (issues.length) throw new Error(issues.join(" "));
  const names = d.details.names.split(",").map(n => n.trim());
  const route = d.route.map((s, i) => ({ ...s, id: id + "-stop-" + i }));
  const trip = tripSchema.parse({
    id, name: d.details.name,
    status: d.details.dateMode === "dates" && d.details.endDate < today ? "past" : "upcoming",
    countryIds: d.countryIds, route, totalDays: duration(d),
    ...(d.details.dateMode === "dates" ? {startDate: d.details.startDate, endDate: d.details.endDate} : {}),
    travelers: Array.from({length: d.details.adults + d.details.children}, (_, i) => ({id: id + "-traveler-" + i, name: names[i] || "Traveler " + (i + 1), type: i < d.details.adults ? "adult" : "child"})),
    travelerType: d.details.travelerType,
    budget: {level: d.details.budgetLevel, currency: "USD", ...(d.details.budgetLevel === "custom" ? {customAmount: d.details.customAmount} : {})},
    theme: countryById[d.countryIds[0]]!.theme,
    travelStylePriorities: d.priorities, savedActivityIds: d.savedIds,
    itinerary: route.flatMap(s => Array.from({length:s.days}, () => s.cityId)).map((cityId,i) => ({id:id + "-day-" + i, dayNumber:i+1, cityId, activities:[]}))
  });
  return trip;
}
export function validLocalTrip(value: unknown): Trip | null {
  const result = tripSchema.safeParse(value);
  if (!result.success || !result.data.id.startsWith("local-")) return null;
  return findCatalogIssues({countries, cities, activities, demoTrips:[result.data]}).length ? null : result.data;
}
export function tripEstimate(trip: Trip) {
  return estimateDraft({countryIds:trip.countryIds, route:trip.route, priorities:trip.travelStylePriorities, savedIds:trip.savedActivityIds, updatedAt:"", details:{name:trip.name, dateMode:"duration", totalDays:trip.totalDays, startDate:"", endDate:"", adults:trip.travelers.filter(t=>t.type==="adult").length, children:trip.travelers.filter(t=>t.type==="child").length, names:"", travelerType:trip.travelerType, budgetLevel:trip.budget.level, customAmount:trip.budget.customAmount ?? 0}});
}
