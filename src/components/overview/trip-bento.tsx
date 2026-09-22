"use client";
import { TripActions } from "./trip-actions";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { tripEstimate } from "@/lib/trips";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  Compass,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import type { Trip } from "@/types/travel";
import { activityById, cities, countries } from "@/data/catalog";
import { travelStyleById } from "@/data/travel-styles";
import { formatDuration, formatTripDates, formatMoney } from "@/lib/format";
import { BaseCard } from "@/components/cards/base-card";
import { DestinationPhoto } from "./destination-photo";
import { cn } from "@/lib/utils";
import styles from "./trip-bento.module.css";

const MotionCard = motion.create(BaseCard);
export function TripBento({
  trip,
  assembling = false,
}: {
  trip: Trip;
  assembling?: boolean;
}) {
  const reduced = useReducedMotion();
  function arrival(index: number) {
    return {
      initial:
        assembling && !reduced
          ? { opacity: 0, y: 96, scale: 0.94 }
          : (false as const),
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        duration: 1.9,
        delay: assembling && !reduced ? 0.2 + index * 0.2 : 0,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        layout: {
          duration: 1.5,
          delay: index * 0.09,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      },
    };
  }
  const [shareMessage, setShareMessage] = useState("");
  const estimate = tripEstimate(trip);
  const midpoint = Math.round((estimate.min + estimate.max) / 2);
  const scheduled = trip.itinerary.flatMap((day) => day.activities);
  const confirmed = scheduled.filter(
    (activity) => activity.status === "confirmed",
  ).length;
  const local = trip.id.startsWith("local-");
  async function share() {
    const text = [
      trip.name,
      formatTripDates(trip.startDate, trip.endDate),
      trip.totalDays + " days",
      trip.route
        .map(
          (s) =>
            (cities.find((c) => c.id === s.cityId)?.name ?? "") +
            " (" +
            s.days +
            " days)",
        )
        .join(" / "),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setShareMessage(
        "Trip summary copied. Local trips are stored only on this device.",
      );
    } catch {
      setShareMessage(
        "Copy unavailable. You can select and copy the trip details below.",
      );
    }
  }
  const country = countries.find((item) => item.id === trip.countryIds[0]);
  const saved = trip.savedActivityIds.flatMap((id) =>
    activityById[id] ? [activityById[id]] : [],
  );
  const scheduledDays = trip.itinerary.filter(
    (day) => day.activities.length > 0,
  ).length;
  const percentage = Math.round((scheduledDays / trip.totalDays) * 100);
  const selectedCities = trip.route.map((stop) => ({
    ...stop,
    city: cities.find((city) => city.id === stop.cityId),
  }));
  const featured = saved
    .filter(
      (activity, index, array) =>
        array.findIndex((item) => item.cityId === activity.cityId) === index,
    )
    .slice(0, 3);
  const status =
    trip.status === "draft"
      ? "A trip in the making"
      : trip.status === "past"
        ? "A journey to remember"
        : "Your next adventure";

  return (
    <div inert={assembling || undefined}>
      <Link
        href="/trips"
        className="mb-3 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to my trips
      </Link>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={cn(styles.eyebrow, "mb-3 text-muted-foreground")}>
            {status}
          </p>
          <h1
            tabIndex={-1}
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {trip.name}
          </h1>
        </div>
        <span className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {trip.status === "draft"
            ? "Draft"
            : trip.status === "past"
              ? "Past trip"
              : "Upcoming"}
          <span aria-hidden="true">·</span>
          {trip.route.length} {trip.route.length === 1 ? "stop" : "stops"}
        </span>
      </header>

      {
        <div
          style={{ visibility: assembling ? "hidden" : undefined }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          {!assembling && <TripActions trip={trip} />}
          <Button variant="outline" onClick={share}>
            Copy trip summary <ArrowUpRight />
          </Button>
          <span role="status" className="text-xs text-muted-foreground">
            {shareMessage}
          </span>
        </div>
      }
      <div className={styles.grid} aria-label="Trip overview">
        <MotionCard {...arrival(0)} className={cn(styles.tile, styles.hero)}>
          {country && (
            <div className={styles.heroPhoto}>
              <DestinationPhoto src={country.image} priority />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className={cn(styles.eyebrow, "flex items-center gap-2")}>
              <MapPin className="size-4" aria-hidden="true" />
              {trip.countryIds
                .map((id) => countries.find((item) => item.id === id)?.name)
                .join(" · ")}
            </span>
            <Compass className="size-7" strokeWidth={1} aria-hidden="true" />
          </div>
          <div>
            <p className="mb-2 text-xs tracking-wide">A change of scenery.</p>
            <h2 className="font-bold tracking-tight text-5xl leading-none tracking-tight sm:text-6xl">
              {country?.name ?? "Somewhere new"}
              <span className="block text-4xl sm:text-5xl">at your pace.</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/90">
              {country?.description ?? "A little room for the unexpected."}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-white/30 pt-4 text-xs">
              <span>{trip.totalDays} days of possibility</span>
              <span>Destination inspiration</span>
            </div>
          </div>
        </MotionCard>

        <MotionCard {...arrival(1)} className={cn(styles.tile, styles.dates)}>
          <div className="flex items-center justify-between">
            <h2 className={styles.eyebrow}>Time to get away</h2>
            <CalendarDays
              className="size-4"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <p className="mt-5 text-5xl font-medium tracking-tighter tabular-nums">
            {trip.totalDays}
            <span className="ml-2 text-base font-normal tracking-normal">
              days
            </span>
          </p>
          <p className="mt-3 text-xs leading-5">
            {formatTripDates(trip.startDate, trip.endDate)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {Math.max(trip.totalDays - 1, 0)} nights · plenty of possibilities
          </p>
        </MotionCard>

        <MotionCard
          {...arrival(2)}
          className={cn(styles.tile, styles.travelers)}
        >
          <div className="flex items-center justify-between">
            <h2 className={styles.eyebrow}>Better together</h2>
            <Users className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className="mt-5 flex items-center -space-x-2">
            {trip.travelers.slice(0, 4).map((traveler, index) => (
              <span
                key={traveler.id}
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border-4 border-budget text-sm font-medium",
                  index % 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-primary",
                )}
                aria-label={traveler.name || "Traveler"}
              >
                {(traveler.name || "Traveler").slice(0, 1).toUpperCase()}
              </span>
            ))}
            {trip.travelers.length > 4 && (
              <span className="pl-4 text-sm">+{trip.travelers.length - 4}</span>
            )}
          </div>
          <p className="mt-4 text-sm font-medium">
            {trip.travelers
              .map((traveler) => traveler.name || "Traveler")
              .join(" & ")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {trip.travelers.length}{" "}
            {trip.travelers.length === 1 ? "traveler" : "travelers"} ·{" "}
            {
              trip.travelers.filter((traveler) => traveler.type === "adult")
                .length
            }{" "}
            {trip.travelers.filter((t) => t.type === "adult").length === 1
              ? "adult"
              : "adults"}
          </p>
        </MotionCard>

        <MotionCard {...arrival(3)} className={cn(styles.tile, styles.route)}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={styles.eyebrow}>A route worth taking</h2>
            <span className="text-xs text-muted-foreground">
              {trip.route.length}{" "}
              {trip.route.length === 1 ? "chapter" : "chapters"}
            </span>
          </div>
          <ol className={styles.routeStops}>
            {selectedCities.map(({ id, days, city }, index) => (
              <li key={id} className="min-w-0">
                <div className={styles.cityPhoto}>
                  {city && (
                    <DestinationPhoto
                      src={city.image}
                      sizes="(max-width: 640px) 40vw, 220px"
                    />
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium">
                      {city?.name ?? "Your next stop"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {days} {days === 1 ? "day" : "days"}
                    </p>
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          {!trip.route.length && (
            <p className="py-10 text-sm text-muted-foreground">
              Your first stop is still a possibility.
            </p>
          )}
        </MotionCard>

        <MotionCard
          {...arrival(4)}
          className={cn(styles.tile, styles.interests)}
        >
          <div className="flex items-center justify-between">
            <h2 className={styles.eyebrow}>Your travel mood</h2>
            <Sparkles className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="mt-5 mb-5 font-bold tracking-tight text-4xl leading-tight">
            A little more
            <br />
            <span className="text-primary">you.</span>
          </p>
          <ol className="space-y-3">
            {trip.travelStylePriorities.map((id, index) => (
              <li key={id} className="flex items-center gap-3 text-xs">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card/70 text-xs">
                  {index + 1}
                </span>
                {travelStyleById[id].name}
              </li>
            ))}
          </ol>
          {!trip.travelStylePriorities.length && (
            <p className="text-sm text-muted-foreground">
              Follow your curiosity.
            </p>
          )}
        </MotionCard>

        <MotionCard {...arrival(5)} className={cn(styles.tile, styles.ideas)}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className={styles.eyebrow}>The wish list</h2>
            <Bookmark className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {featured.map((activity) => (
              <div key={activity.id} className="min-w-0">
                <div className={styles.ideaPhoto}>
                  <DestinationPhoto
                    src={activity.image}
                    sizes="(max-width: 640px) 40vw, 180px"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {cities.find((city) => city.id === activity.cityId)?.name} ·
                  inspiration
                </p>
                <h3 className="mt-1 text-sm font-medium leading-5">
                  {activity.name}
                </h3>
              </div>
            ))}
          </div>
          {saved.length ? (
            <details className="mt-4 border-t pt-1">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-xs font-medium">
                Explore all {saved.length} saved ideas
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </summary>
              <ul className={styles.savedList}>
                {saved.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span>
                      {activity.name}
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {
                          cities.find((city) => city.id === activity.cityId)
                            ?.name
                        }
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDuration(activity.durationMinutes)}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <p className="py-10 text-sm text-muted-foreground">
              Save a little something to look forward to.
            </p>
          )}
        </MotionCard>

        <MotionCard
          {...arrival(6)}
          className={cn(styles.tile, styles.progress)}
        >
          <div className="flex items-center justify-between">
            <h2 className={styles.eyebrow}>Taking shape</h2>
            <Check className="size-4" aria-hidden="true" />
          </div>
          <div className="relative mx-auto my-5 size-32">
            <svg
              viewBox="0 0 120 120"
              className={styles.ring}
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".15"
                strokeWidth="5"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${percentage} 100`}
              />
            </svg>
            <p className="absolute inset-0 flex items-center justify-center text-4xl font-light tracking-tight tabular-nums">
              {percentage}
              <span className="ml-0.5 text-lg">%</span>
            </p>
          </div>
          <p className="text-center text-sm">
            {scheduledDays} of {trip.totalDays} days have plans
          </p>
          <p className="mt-2 text-center text-xs text-white/80">
            {scheduled.length} activities scheduled / {confirmed} confirmed
            (simulated)
          </p>
          <p className="mt-2 text-center text-xs leading-5 text-white/75">
            {scheduledDays === trip.totalDays
              ? "A little adventure in every day."
              : "Leave some room for serendipity."}
          </p>
        </MotionCard>

        <MotionCard {...arrival(7)} className={cn(styles.tile, styles.budget)}>
          <h2 className={styles.eyebrow}>Room for the adventure</h2>
          <motion.p
            initial={assembling && !reduced ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-3xl font-bold tracking-tight"
          >
            {formatMoney(estimate.min)} - {formatMoney(estimate.max)}
          </motion.p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatMoney(Math.round(estimate.min / estimate.people))} -{" "}
            {formatMoney(Math.round(estimate.max / estimate.people))} per person
          </p>
          {trip.budget.customAmount && (
            <div className="mt-4">
              <progress
                className="h-2 w-full accent-primary"
                aria-label="Estimated budget used"
                max={trip.budget.customAmount}
                value={Math.min(midpoint, trip.budget.customAmount)}
              />
              <p className="mt-2 text-sm">
                {midpoint > trip.budget.customAmount
                  ? formatMoney(midpoint - trip.budget.customAmount) + " above"
                  : formatMoney(trip.budget.customAmount - midpoint) +
                    " remaining in"}{" "}
                your {formatMoney(trip.budget.customAmount)} budget at the
                midpoint estimate.
              </p>
            </div>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Sample USD estimate for the whole group. Land costs only; flights
            excluded. Saved ideas are included in daily allowances.
          </p>
        </MotionCard>
        <MotionCard
          {...arrival(8)}
          className={cn(styles.tile, styles.suggestion)}
        >
          <h2 className={styles.eyebrow}>A little nudge</h2>
          <p className="mt-4 text-2xl font-bold tracking-tight">
            {saved.length
              ? "Your wish list is a lovely start."
              : "Leave room for a favorite find."}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {saved.length
              ? saved.length +
                " saved ideas are ready to explore. Saving an idea does not schedule it."
              : "Explore your route and collect a few experiences that feel like you."}{" "}
            Day-by-day planning is coming next.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Planning suggestion based on your trip, not a live recommendation.
          </p>
        </MotionCard>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        {local
          ? "Saved on this device. Your next chapter starts here."
          : "Sample trip. A little inspiration before the adventure."}
      </p>
    </div>
  );
}
