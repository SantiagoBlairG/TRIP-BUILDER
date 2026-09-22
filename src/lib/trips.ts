import {
  countries,
  cities,
  activities,
  countryById,
  demoTrips,
} from "@/data/catalog";
import { tripSchema, type Trip } from "@/types/travel";
import { findCatalogIssues } from "@/lib/validation";
import {
  cleanDraft,
  draftSchema,
  draftIssues,
  duration,
  estimateDraft,
  defaultDetails,
  distributeRemainingDays,
  type BuilderDraft,
} from "./builder";

export function createTrip(
  draft: BuilderDraft,
  id: string,
  today: string,
  draftStatus = false,
): Trip {
  const d = cleanDraft(draftSchema.parse(draft));
  const issues = draftIssues(d);
  if (!d.countryIds.length) throw new Error("Choose at least one country.");
  if (!draftStatus && issues.length) throw new Error(issues.join(" "));
  const names = d.details.names.split(",").map((n) => n.trim());
  const route = d.route.map((s, i) => ({ ...s, id: id + "-stop-" + i }));
  const trip = tripSchema.parse({
    id,
    name: d.details.name,
    status: draftStatus
      ? "draft"
      : d.details.dateMode === "dates" && d.details.endDate < today
        ? "past"
        : "upcoming",
    countryIds: d.countryIds,
    route,
    totalDays: duration(d),
    ...(d.details.dateMode === "dates"
      ? { startDate: d.details.startDate, endDate: d.details.endDate }
      : {}),
    travelers: Array.from(
      { length: d.details.adults + d.details.children },
      (_, i) => ({
        id: id + "-traveler-" + i,
        name: names[i] || "Traveler " + (i + 1),
        type: i < d.details.adults ? "adult" : "child",
      }),
    ),
    travelerType: d.details.travelerType,
    budget: {
      level: d.details.budgetLevel,
      currency: "USD",
      ...(d.details.budgetLevel === "custom"
        ? { customAmount: d.details.customAmount }
        : {}),
    },
    theme: countryById[d.countryIds[0]]!.theme,
    travelStylePriorities: d.priorities,
    savedActivityIds: d.savedIds,
    itinerary: route
      .flatMap((s) => Array.from({ length: s.days }, () => s.cityId))
      .map((cityId, i) => ({
        id: id + "-day-" + i,
        dayNumber: i + 1,
        cityId,
        activities: [],
      })),
  });
  return trip;
}
export function validLocalTrip(value: unknown): Trip | null {
  const result = tripSchema.safeParse(value);
  if (
    !result.success ||
    (!result.data.id.startsWith("local-") &&
      !demoTrips.some((t) => t.id === result.data.id))
  )
    return null;
  return findCatalogIssues({
    countries,
    cities,
    activities,
    demoTrips: [result.data],
  }).length
    ? null
    : result.data;
}
export function tripEstimate(trip: Trip) {
  return estimateDraft({
    countryIds: trip.countryIds,
    route: trip.route,
    priorities: trip.travelStylePriorities,
    savedIds: trip.savedActivityIds,
    updatedAt: "",
    details: {
      name: trip.name,
      dateMode: "duration",
      totalDays: trip.totalDays,
      startDate: "",
      endDate: "",
      adults: trip.travelers.filter((t) => t.type === "adult").length,
      children: trip.travelers.filter((t) => t.type === "child").length,
      names: "",
      travelerType: trip.travelerType,
      budgetLevel: trip.budget.level,
      customAmount: trip.budget.customAmount ?? 0,
    },
  });
}

export function tripToDraft(trip: Trip): BuilderDraft {
  return {
    countryIds: trip.countryIds,
    route: trip.route.map((s) => ({ cityId: s.cityId, days: s.days })),
    priorities: trip.travelStylePriorities,
    savedIds: trip.savedActivityIds,
    updatedAt: "",
    details: {
      ...defaultDetails,
      name: trip.name,
      dateMode: trip.startDate ? "dates" : "duration",
      startDate: trip.startDate ?? "",
      endDate: trip.endDate ?? "",
      totalDays: trip.totalDays,
      adults: trip.travelers.filter((t) => t.type === "adult").length,
      children: trip.travelers.filter((t) => t.type === "child").length,
      names: trip.travelers.map((t) => t.name).join(", "),
      travelerType: trip.travelerType,
      budgetLevel: trip.budget.level,
      customAmount: trip.budget.customAmount ?? 0,
    },
  };
}
export function editTrip(
  original: Trip,
  draft: BuilderDraft,
  today: string,
): Trip {
  const next = createTrip(
    original.status === "draft" ? draft : distributeRemainingDays(draft),
    original.id,
    today,
    original.status === "draft",
  );
  const visited = new Map<string, number>();
  next.itinerary = next.itinerary.map((day) => {
    const ordinal = visited.get(day.cityId) ?? 0;
    visited.set(day.cityId, ordinal + 1);
    const previous = original.itinerary.filter((d) => d.cityId === day.cityId)[
      ordinal
    ];
    return { ...day, activities: previous?.activities ?? [] };
  });
  return tripSchema.parse(next);
}
