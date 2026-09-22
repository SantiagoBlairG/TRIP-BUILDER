"use client";

import Link from "next/link";
import { useState } from "react";
import { Compass, Plus, Search } from "lucide-react";
import { TripCard } from "@/components/cards/trip-card";
import { BaseCard } from "@/components/cards/base-card";
import { Button } from "@/components/ui/button";
import { cities, countries } from "@/data/catalog";
import type { Trip } from "@/types/travel";
import { useTripLibrary } from "@/stores/trip-store";
import { DraftResume } from "./draft-resume";

const sections = [
  {
    status: "upcoming",
    title: "On the horizon",
    description: "The adventures you’re looking forward to.",
  },
  {
    status: "draft",
    title: "Still dreaming",
    description: "A few ideas with somewhere to go.",
  },
  {
    status: "past",
    title: "The places that stay with you",
    description: "Good trips become great stories.",
  },
] as const;

export function TripLibrary({ trips: samples }: { trips: readonly Trip[] }) {
  const {trips: localTrips, error} = useTripLibrary();
  const trips = [...localTrips, ...samples];
  const [filter, setFilter] = useState<"all" | Trip["status"]>("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = trips.filter((trip) => {
    const searchable = [
      trip.name,
      ...trip.countryIds.map(
        (id) => countries.find((country) => country.id === id)?.name ?? "",
      ),
      ...trip.route.map(
        (stop) => cities.find((city) => city.id === stop.cityId)?.name ?? "",
      ),
    ]
      .join(" ")
      .toLocaleLowerCase();
    return (
      (filter === "all" || trip.status === filter) &&
      searchable.includes(normalizedQuery)
    );
  });
  return (
    <>
      <section className="page-hero mb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] hero-copy uppercase">
            Your world, a little closer
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Somewhere <span className="hero-copy">to look forward to.</span>
          </h1>
          <p className="hero-copy mt-3 max-w-xl text-sm leading-6">
            Big adventures, little escapes, and all the ideas in between. Keep
            your next chapter in one place.
          </p>
        </div>
      </section>
      <DraftResume />
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      {trips.length === 0 ? (
        <LibraryEmpty />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3 border-b pb-3">
            <label className="flex min-h-11 w-full items-center gap-2 rounded-full border bg-card px-3 sm:w-60">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="sr-only">Search trips</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Trip, country, or city"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm"
              />
            </label>
            <nav aria-label="Filter trips" className="flex flex-wrap gap-1">
              {(["all", "upcoming", "draft", "past"] as const).map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={filter === status ? "default" : "ghost"}
                  aria-pressed={filter === status}
                  onClick={() => setFilter(status)}
                >
                  {status === "all"
                    ? "All trips"
                    : status === "draft"
                      ? "Drafts"
                      : status === "past"
                        ? "Past"
                        : "Upcoming"}
                  <span className="text-xs tabular-nums">
                    {status === "all"
                      ? trips.length
                      : trips.filter((trip) => trip.status === status).length}
                  </span>
                </Button>
              ))}
            </nav>
            <Button asChild className="lg:ml-auto">
              <Link href="/builder">
                <Plus aria-hidden="true" />
                Create a new trip
              </Link>
            </Button>
          </div>
          <p role="status" className="mb-4 text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "trip" : "trips"} in view
          </p>
          {filtered.length === 0 ? (
            <BaseCard className="border-dashed bg-transparent py-14 text-center shadow-none">
              <Search
                className="mx-auto mb-4 size-7 text-primary"
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold">No trips found</h2>
              <p className="my-4 text-sm text-muted-foreground">
                Try another destination or clear your filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            </BaseCard>
          ) : (
            sections.map((section) => {
              const sectionTrips = filtered.filter(
                (trip) => trip.status === section.status,
              );
              if (!sectionTrips.length) return null;
              return (
                <section
                  key={section.status}
                  aria-labelledby={`trips-${section.status}`}
                  className="mb-8"
                >
                  <div className="mb-3">
                    <h2
                      id={`trips-${section.status}`}
                      className="text-2xl font-bold tracking-tight"
                    >
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sectionTrips.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        countries={countries}
                        cities={cities}
                        href={`/trips/${trip.id}`}
                        actionLabel={
                          trip.status === "draft" ? "Review draft" : "View trip"
                        }
                      />
                    ))}
                    {section.status === "upcoming" &&
                      filter === "all" &&
                      !normalizedQuery && (
                        <BaseCard className="flex min-h-64 flex-col items-start justify-center border-dashed bg-secondary shadow-none">
                          <Compass
                            className="mb-5 size-8 text-primary"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <p className="text-4xl font-bold tracking-tight">
                            Where to next?
                          </p>
                          <p className="mt-3 mb-6 text-sm leading-6 text-muted-foreground">
                            Leave a little room for a place you haven’t met yet.
                          </p>
                          <Button asChild variant="outline">
                            <Link href="/builder">
                              Start with an idea
                              <Plus aria-hidden="true" />
                            </Link>
                          </Button>
                        </BaseCard>
                      )}
                  </div>
                </section>
              );
            })
          )}
        </>
      )}
    </>
  );
}

function LibraryEmpty() {
  return (
    <BaseCard className="border-dashed bg-transparent py-16 text-center shadow-none">
      <Compass
        className="mx-auto mb-5 size-10 text-primary"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h2 className="text-4xl font-bold tracking-tight">
        Your first adventure starts here.
      </h2>
      <p className="mx-auto mt-4 mb-6 max-w-md text-sm leading-6 text-muted-foreground">
        A long weekend or the trip of a lifetime. Give your next idea a place to
        grow.
      </p>
      <Button asChild>
        <Link href="/builder">
          <Plus aria-hidden="true" />
          Plan your first trip
        </Link>
      </Button>
    </BaseCard>
  );
}
