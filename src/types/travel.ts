import { z } from "zod";

export const travelStyleIds = [
  "food",
  "beaches",
  "hiking",
  "nature",
  "culture",
  "history",
  "nightlife",
  "shopping",
  "photography",
  "adventure",
  "wellness",
  "family",
] as const;
export const themeIds = [
  "colombia",
  "france",
  "italy",
  "japan",
  "spain",
  "greece",
] as const;
export const travelStyleIdSchema = z.enum(travelStyleIds);
export const themeIdSchema = z.enum(themeIds);
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
export const budgetRangeSchema = z
  .object({ min: z.number().nonnegative(), max: z.number().nonnegative() })
  .refine((range) => range.max >= range.min, "Maximum must cover minimum");
export const timeOfDaySchema = z.enum(["morning", "afternoon", "evening"]);
const id = z.string().min(1);
const image = z.string().startsWith("/images/");
const uniqueIds = z
  .array(id)
  .refine((ids) => new Set(ids).size === ids.length, "IDs must be unique");
const styles = z
  .array(travelStyleIdSchema)
  .refine((ids) => new Set(ids).size === ids.length, "Styles must be unique");

export const countrySchema = z.object({
  id,
  name: id,
  continent: z.enum(["Europe", "Asia", "South America"]),
  description: id,
  image,
  theme: themeIdSchema,
  tags: styles,
  dailyBudget: budgetRangeSchema,
  cityIds: uniqueIds,
});
export const citySchema = z.object({
  id,
  countryId: id,
  name: id,
  description: id,
  image,
  recommendedDays: z.number().int().min(1),
  tags: styles,
  coordinates: coordinatesSchema,
  activityIds: uniqueIds,
});
export const activitySchema = z.object({
  id,
  countryId: id,
  cityId: id,
  name: id,
  description: id,
  image,
  category: travelStyleIdSchema,
  tags: z.array(z.enum(["Must visit", "Rainy day", "Hidden gem", "Optional"])),
  durationMinutes: z.number().int().positive(),
  estimatedCost: z.number().nonnegative(),
  currency: z.literal("USD"),
  coordinates: coordinatesSchema,
  rating: z.number().min(0).max(5),
  recommendedTimeOfDay: z.array(timeOfDaySchema).min(1),
});
export const travelerSchema = z.object({
  id,
  name: z.string(),
  type: z.enum(["adult", "child"]),
});
export const tripStopSchema = z.object({
  id,
  cityId: id,
  days: z.number().int().positive(),
});
export const tripBudgetSchema = z
  .object({
    level: z.enum(["budget", "balanced", "premium", "custom"]),
    customAmount: z.number().positive().optional(),
    currency: z.literal("USD"),
  })
  .refine(
    (budget) => budget.level !== "custom" || budget.customAmount !== undefined,
    "Custom budget needs an amount",
  );
export const scheduledActivitySchema = z.object({
  id,
  activityId: id,
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  durationMinutes: z.number().int().positive(),
  costPerPerson: z.number().nonnegative(),
  status: z.enum(["planned", "confirmed"]),
  notes: z.string(),
});
export const itineraryDaySchema = z.object({
  id,
  dayNumber: z.number().int().positive(),
  cityId: id,
  activities: z.array(scheduledActivitySchema),
});
export const tripSchema = z
  .object({
    id,
    name: id,
    status: z.enum(["draft", "upcoming", "past"]),
    countryIds: uniqueIds,
    route: z.array(tripStopSchema),
    startDate: z.iso.date().optional(),
    endDate: z.iso.date().optional(),
    totalDays: z.number().int().min(1).max(365),
    travelers: z.array(travelerSchema).min(1),
    travelerType: z.enum(["solo", "couple", "friends", "family", "group"]),
    budget: tripBudgetSchema,
    theme: themeIdSchema,
    travelStylePriorities: styles,
    savedActivityIds: uniqueIds,
    itinerary: z.array(itineraryDaySchema),
  })
  .superRefine((trip, ctx) => {
    const issue = (message: string) =>
      ctx.addIssue({ code: "custom", message });
    const assigned = trip.route.reduce((sum, stop) => sum + stop.days, 0);
    if (assigned > trip.totalDays) issue("Assigned days exceed trip duration");
    if (
      trip.status !== "draft" &&
      (assigned !== trip.totalDays || trip.countryIds.length === 0)
    )
      issue("Completed trips require a route covering every day");
    if (!trip.travelers.some((traveler) => traveler.type === "adult"))
      issue("At least one adult is required");
    if (Boolean(trip.startDate) !== Boolean(trip.endDate))
      issue("Provide both dates or neither");
    if (trip.startDate && trip.endDate) {
      const days =
        (Date.parse(trip.endDate) - Date.parse(trip.startDate)) / 86_400_000 +
        1;
      if (days !== trip.totalDays)
        issue("Inclusive date range must match trip duration");
    }
    for (const ids of [
      trip.route.map((stop) => stop.id),
      trip.route.map((stop) => stop.cityId),
      trip.travelers.map((traveler) => traveler.id),
      trip.itinerary.map((day) => day.id),
      trip.itinerary.flatMap((day) =>
        day.activities.map((activity) => activity.id),
      ),
    ]) {
      if (new Set(ids).size !== ids.length)
        issue("Trip instance IDs and route cities must be unique");
    }
    const expectedCities = trip.route.flatMap((stop) =>
      Array<string>(stop.days).fill(stop.cityId),
    );
    if (trip.itinerary.length !== assigned)
      issue("Itinerary must cover each assigned route day");
    trip.itinerary.forEach((day, index) => {
      if (day.dayNumber !== index + 1 || day.cityId !== expectedCities[index])
        issue("Itinerary days must follow the route in order");
    });
  });

export type Country = z.infer<typeof countrySchema>;
export type City = z.infer<typeof citySchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Trip = z.infer<typeof tripSchema>;
export type TripStop = z.infer<typeof tripStopSchema>;
export type Traveler = z.infer<typeof travelerSchema>;
export type TripBudget = z.infer<typeof tripBudgetSchema>;
export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type ScheduledActivity = z.infer<typeof scheduledActivitySchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type BudgetRange = z.infer<typeof budgetRangeSchema>;
export type TimeOfDay = z.infer<typeof timeOfDaySchema>;
export type TravelStyleId = z.infer<typeof travelStyleIdSchema>;
export type ThemeId = z.infer<typeof themeIdSchema>;
