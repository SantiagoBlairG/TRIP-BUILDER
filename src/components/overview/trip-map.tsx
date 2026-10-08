"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Map, Navigation, X } from "lucide-react";
import { cityById, countryById } from "@/data/catalog";
import land from "@/data/map-land.json";
import { mapProjection, tripMapStops } from "@/lib/trip-map";
import type { Trip } from "@/types/travel";
import styles from "./trip-map.module.css";

export function TripMap({ trip }: { trip: Trip }) {
  const city = trip.route.length === 1;
  const firstDay = trip.itinerary.find((day) => day.activities.length);
  const defaultDay =
    firstDay?.id ??
    (trip.savedActivityIds.length
      ? "ideas"
      : (trip.itinerary[0]?.id ?? "ideas"));
  const [chosenDay, setDay] = useState(defaultDay);
  // Editing the route can remove a selected day without unmounting this card.
  const day =
    (chosenDay === "ideas" && trip.savedActivityIds.length > 0) ||
    trip.itinerary.some((item) => item.id === chosenDay)
      ? chosenDay
      : defaultDay;
  const [active, setActive] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const patternId = useId();
  const stops = tripMapStops(trip, day);
  const center = cityById[trip.route[0]?.cityId];
  const project = mapProjection(
    stops.length
      ? stops.map((stop) => stop.coordinates)
      : center
        ? [center.coordinates]
        : [],
    city,
  );
  const points = stops.map((stop) => ({
    ...stop,
    ...project(stop.coordinates),
  }));
  const route = points
    .map((point, i) => `${i ? "L" : "M"}${point.x},${point.y}`)
    .join(" ");
  const selected = stops.find((stop) => stop.id === preview);
  const title = city
    ? center?.name
    : trip.countryIds
        .map((id) => countryById[id]?.name)
        .filter(Boolean)
        .join(" · ");

  return (
    <section aria-label="Trip map" className={styles.card}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            <Map size={14} /> YOUR ADVENTURE, CONNECTED
          </p>
          <h2>{title || "A world of possibilities"}</h2>
          <p className={styles.subtitle}>
            {city
              ? day === "ideas"
                ? "Your saved ideas, together on the map. Not yet scheduled."
                : "A little closer to your day’s discoveries."
              : "Follow your journey, one city at a time."}
          </p>
        </div>
        {city && (
          <label className={styles.selector}>
            Explore
            <select
              aria-label="Map day"
              value={day}
              onChange={(event) => {
                setDay(event.target.value);
                setActive(null);
                setPreview(null);
              }}
            >
              {trip.savedActivityIds.length > 0 && (
                <option value="ideas">Saved ideas</option>
              )}
              {trip.itinerary.map((item) => (
                <option key={item.id} value={item.id}>
                  Day {item.dayNumber}
                </option>
              ))}
              {!trip.itinerary.length && !trip.savedActivityIds.length && (
                <option value="ideas">Saved ideas</option>
              )}
            </select>
          </label>
        )}
      </header>
      <div className={styles.canvas}>
        <svg
          viewBox="0 0 1000 460"
          preserveAspectRatio="none"
          className={styles.map}
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={patternId}
              width="110"
              height="90"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-15)"
            >
              <rect width="110" height="90" fill="var(--map-land)" />
              <path
                d="M0 0H110M0 0V90"
                stroke="var(--map-road)"
                strokeWidth="12"
              />
              <rect
                x="15"
                y="14"
                width="32"
                height="25"
                rx="3"
                fill="var(--map-building)"
              />
              <rect
                x="55"
                y="14"
                width="40"
                height="25"
                rx="3"
                fill="var(--map-building)"
              />
              <rect
                x="15"
                y="47"
                width="50"
                height="28"
                rx="3"
                fill="var(--map-building)"
              />
              <rect
                x="73"
                y="47"
                width="22"
                height="28"
                rx="8"
                fill="var(--map-park)"
              />
            </pattern>
          </defs>
          {city ? (
            <>
              <rect width="1000" height="460" fill={`url(#${patternId})`} />
              <path
                d="M690 -30C540 70 820 170 710 280S620 400 780 490"
                fill="none"
                stroke="var(--map-park)"
                strokeWidth="95"
              />
              <path
                d="M690 -30C540 70 820 170 710 280S620 400 780 490"
                fill="none"
                stroke="var(--map-water)"
                strokeWidth="52"
              />
              <path
                d="M550 135L760 120M600 380L780 355"
                stroke="var(--map-road)"
                strokeWidth="17"
              />
            </>
          ) : (
            land.map((country) => (
              <path
                key={country.name}
                d={country.rings
                  .map(
                    (ring) =>
                      ring
                        .map(([longitude, latitude], i) => {
                          const point = project({ longitude, latitude });
                          return `${i ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
                        })
                        .join(" ") + "Z",
                  )
                  .join(" ")}
                fill="var(--map-park)"
                stroke="var(--map-road)"
                strokeWidth="1.5"
              />
            ))
          )}
          {points.length > 1 && (
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d={route} stroke="white" strokeWidth="11" />
              <motion.path
                key={day + stops.map((stop) => stop.id).join()}
                d={route}
                stroke="var(--map-route)"
                strokeWidth="6"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </g>
          )}
        </svg>
        <span className={styles.compass}>
          <Navigation size={17} /> N
        </span>
        {points.map((point, i) => (
          <button
            key={point.id}
            className={styles.pin}
            data-active={active === point.id || preview === point.id}
            style={{ left: `${point.x / 10}%`, top: `${point.y / 4.6}%` }}
            aria-label={`Stop ${i + 1}: ${point.name}`}
            aria-pressed={preview === point.id}
            onMouseEnter={() => setActive(point.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(point.id)}
            onBlur={() => setActive(null)}
            onClick={() => setPreview(preview === point.id ? null : point.id)}
          >
            <span>{i + 1}</span>
            <strong>{point.name}</strong>
          </button>
        ))}
        {!points.length && (
          <div className={styles.empty}>
            <Map size={24} />
            <strong>{center?.name || "Your route starts here"}</strong>
            <span>
              {city
                ? "No activities scheduled for this day yet."
                : "Choose a city to start your route."}
            </span>
          </div>
        )}
        {selected && (
          <div className={styles.preview} role="status">
            <strong>{selected.name}</strong>
            <p>{selected.description}</p>
            <button
              aria-label="Close place preview"
              onClick={() => setPreview(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}
        <span className={styles.caption}>
          {city ? "Illustrative city layout" : "Made with Natural Earth"} ·
          Route preview, not navigation
        </span>
      </div>
      <ol className={styles.stops} aria-label="Map stops">
        {stops.map((stop, i) => (
          <li key={stop.id}>
            <button
              data-active={active === stop.id || preview === stop.id}
              onMouseEnter={() => setActive(stop.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(stop.id)}
              onBlur={() => setActive(null)}
              onClick={() => setPreview(preview === stop.id ? null : stop.id)}
            >
              <span>{i + 1}</span>
              {stop.name}
            </button>
          </li>
        ))}
      </ol>
      <p className={styles.note}>
        Illustrative connections using sample coordinates.{" "}
        {city && day === "ideas"
          ? "Saved order shown; this view does not assign activities to days."
          : "Lines show stop order, not driving or walking directions."}
      </p>
    </section>
  );
}
