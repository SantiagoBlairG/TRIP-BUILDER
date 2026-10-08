import { activityById, cityById } from "@/data/catalog";
import type { Trip } from "@/types/travel";

export type MapStop = {
  id: string;
  name: string;
  image: string;
  description: string;
  coordinates: { latitude: number; longitude: number };
};

export function tripMapStops(trip: Trip, day: string): MapStop[] {
  if (trip.route.length > 1) {
    return trip.route.flatMap((stop) => {
      const city = cityById[stop.cityId];
      return city
        ? [
            {
              ...city,
              id: stop.id,
              description: `${stop.days} days in ${city.name}`,
            },
          ]
        : [];
    });
  }
  const ids =
    day === "ideas"
      ? trip.savedActivityIds
      : (trip.itinerary
          .find((item) => item.id === day)
          ?.activities.map((item) => item.activityId) ?? []);
  return ids.flatMap((id, index) => {
    const activity = activityById[id];
    return activity && activity.cityId === trip.route[0]?.cityId
      ? [{ ...activity, id: `${id}-${index}` }]
      : [];
  });
}

// One projection for the basemap and pins; latitude correction preserves local proportions.
export function mapProjection(points: MapStop["coordinates"][], city: boolean) {
  const coordinates = points.length ? points : [{ longitude: 0, latitude: 0 }];
  const latitudes = coordinates.map((point) => point.latitude);
  const longitudes = coordinates.map((point) => point.longitude);
  const latitude = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
  const longitude = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
  const correction = Math.cos((latitude * Math.PI) / 180);
  const width = Math.max(
    (Math.max(...longitudes) - Math.min(...longitudes)) * correction,
    city ? 0.001 : 2,
  );
  const height = Math.max(
    Math.max(...latitudes) - Math.min(...latitudes),
    city ? 0.001 : 1.5,
  );
  const scale = Math.min(680 / width, 280 / height);
  return (point: MapStop["coordinates"]) => ({
    x: 500 + (point.longitude - longitude) * correction * scale,
    y: 230 - (point.latitude - latitude) * scale,
  });
}
