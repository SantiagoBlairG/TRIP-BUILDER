import type { Activity, City, TravelStyleId } from "@/types/travel";

export function citiesForCountries(
  cities: readonly City[],
  countryIds: readonly string[],
): City[] {
  const selected = new Set(countryIds);
  return cities.filter((city) => selected.has(city.countryId));
}

/** Destination filtering always precedes stable preference ranking. Never broadens an empty selection. */
export function recommendActivities(
  activities: readonly Activity[],
  cityIds: readonly string[],
  priorities: readonly TravelStyleId[] = [],
): Activity[] {
  const selected = new Set(cityIds);
  const rank = (activity: Activity) => {
    const index = priorities.indexOf(activity.category);
    return index < 0 ? priorities.length : index;
  };
  return activities
    .filter((activity) => selected.has(activity.cityId))
    .sort(
      (a, b) =>
        rank(a) - rank(b) || b.rating - a.rating || a.id.localeCompare(b.id),
    );
}
