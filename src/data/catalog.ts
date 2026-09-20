import rawCountries from "./countries.json";
import rawCities from "./cities.json";
import rawActivities from "./activities.json";
import rawDemoTrips from "./demo-trips.json";
import { catalogSchema } from "@/lib/validation";

// Fail early on malformed checked-in fixtures; never silently coerce imported JSON.
const catalog = catalogSchema.parse({
  countries: rawCountries,
  cities: rawCities,
  activities: rawActivities,
  demoTrips: rawDemoTrips,
});

export const { countries, cities, activities, demoTrips } = catalog;
function indexById<T extends { id: string }>(
  items: T[],
): Readonly<Partial<Record<string, T>>> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}
export const countryById = indexById(countries);
export const cityById = indexById(cities);
export const activityById = indexById(activities);
