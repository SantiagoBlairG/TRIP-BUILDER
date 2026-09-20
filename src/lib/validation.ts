import { z } from "zod";
import {
  activitySchema,
  citySchema,
  countrySchema,
  tripSchema,
  type Activity,
  type City,
  type Country,
  type Trip,
} from "@/types/travel";

export const catalogSchema = z
  .object({
    countries: z.array(countrySchema),
    cities: z.array(citySchema),
    activities: z.array(activitySchema),
    demoTrips: z.array(tripSchema),
  })
  .superRefine((catalog, ctx) => {
    for (const message of findCatalogIssues(catalog))
      ctx.addIssue({ code: "custom", message });
  });

/** Checks relationships separately from field validation; useful for future import/persistence flows. */
export function findCatalogIssues(catalog: {
  countries: Country[];
  cities: City[];
  activities: Activity[];
  demoTrips: Trip[];
}): string[] {
  const issues: string[] = [];
  for (const [kind, items] of Object.entries(catalog)) {
    if (new Set(items.map((item) => item.id)).size !== items.length)
      issues.push(`Duplicate IDs in ${kind}`);
  }
  const countries = new Map(
    catalog.countries.map((country) => [country.id, country]),
  );
  const cities = new Map(catalog.cities.map((city) => [city.id, city]));
  const activities = new Map(
    catalog.activities.map((activity) => [activity.id, activity]),
  );
  for (const country of catalog.countries) {
    for (const cityId of country.cityIds)
      if (cities.get(cityId)?.countryId !== country.id)
        issues.push(`${country.id}: invalid city reference ${cityId}`);
  }
  for (const city of catalog.cities) {
    if (!countries.get(city.countryId)?.cityIds.includes(city.id))
      issues.push(`${city.id}: missing parent country reference`);
    for (const activityId of city.activityIds)
      if (activities.get(activityId)?.cityId !== city.id)
        issues.push(`${city.id}: invalid activity reference ${activityId}`);
  }
  for (const activity of catalog.activities) {
    const city = cities.get(activity.cityId);
    if (
      !city?.activityIds.includes(activity.id) ||
      city.countryId !== activity.countryId
    )
      issues.push(`${activity.id}: city/country mismatch`);
  }
  for (const trip of catalog.demoTrips) {
    for (const countryId of trip.countryIds)
      if (!countries.has(countryId))
        issues.push(`${trip.id}: unknown country ${countryId}`);
    for (const stop of trip.route) {
      const city = cities.get(stop.cityId);
      if (!city || !trip.countryIds.includes(city.countryId))
        issues.push(`${trip.id}: route outside selected countries`);
    }
    const selectedCities = new Set(trip.route.map((stop) => stop.cityId));
    for (const activityId of trip.savedActivityIds) {
      const activity = activities.get(activityId);
      if (!activity || !selectedCities.has(activity.cityId))
        issues.push(`${trip.id}: saved activity outside route`);
    }
    for (const day of trip.itinerary) {
      if (!selectedCities.has(day.cityId))
        issues.push(`${trip.id}: itinerary day outside route`);
      for (const scheduled of day.activities)
        if (activities.get(scheduled.activityId)?.cityId !== day.cityId)
          issues.push(
            `${trip.id}: scheduled activity incompatible with day city`,
          );
    }
  }
  return issues;
}
