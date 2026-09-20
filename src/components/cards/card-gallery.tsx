"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  Compass,
  MapPin,
  RotateCcw,
  Route,
  Users,
  Wallet,
} from "lucide-react";
import { countries, cities, activities, demoTrips } from "@/data/catalog";
import { destinationImages } from "@/data/images";
import { travelStyles } from "@/data/travel-styles";
import { citiesForCountries, recommendActivities } from "@/lib/recommendations";
import type { TravelStyleId } from "@/types/travel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "./activity-card";
import { BaseCard } from "./base-card";
import { BentoCard } from "./bento-card";
import { CityCard } from "./city-card";
import { DestinationCard } from "./destination-card";
import { ImageCard } from "./image-card";
import { PreferenceCard } from "./preference-card";
import { StatCard } from "./stat-card";
import { TripCard } from "./trip-card";

const sections = [
  "Destinations",
  "Experiences",
  "Trip cards",
  "Sizes & states",
] as const;
type Section = (typeof sections)[number];

export function CardGallery() {
  const [section, setSection] = useState<Section>("Destinations");
  const [countryId, setCountryId] = useState("italy");
  const [cityId, setCityId] = useState("positano");
  const [priorities, setPriorities] = useState<TravelStyleId[]>([
    "food",
    "beaches",
  ]);
  const [saved, setSaved] = useState<string[]>([]);
  const [message, setMessage] = useState(
    "Italy and Positano selected for this preview.",
  );
  const country = countries.find((item) => item.id === countryId);
  const cityOptions = citiesForCountries(cities, countryId ? [countryId] : []);
  const city = cityOptions.find((item) => item.id === cityId);
  const recommendations = recommendActivities(
    activities,
    city ? [city.id] : [],
    priorities,
  );

  function chooseCountry(nextId: string) {
    const next = nextId === countryId ? "" : nextId;
    setCountryId(next);
    setCityId(cities.find((item) => item.countryId === next)?.id ?? "");
    setMessage(
      next
        ? `${countries.find((item) => item.id === next)?.name} selected. City options updated.`
        : "Country removed. Choose a destination to explore its cities.",
    );
  }
  function toggleStyle(id: TravelStyleId) {
    setPriorities((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setMessage(
      "Travel styles updated. Experiences are ranked in your selection order.",
    );
  }
  function toggleSaved(id: string) {
    const isSaved = saved.includes(id);
    setSaved((current) =>
      isSaved ? current.filter((item) => item !== id) : [...current, id],
    );
    setMessage(
      `${activities.find((item) => item.id === id)?.name} ${isSaved ? "removed from" : "saved to"} preview ideas.`,
    );
  }
  function reset() {
    setCountryId("italy");
    setCityId("positano");
    setPriorities(["food", "beaches"]);
    setSaved([]);
    setMessage("Preview reset to Italy and Positano.");
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            The Roam collection · Phase 1
          </p>
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
            Small cards.{" "}
            <span className="text-primary italic">Big possibilities.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            A working gallery of the pieces behind your next adventure. Select a
            destination, explore its cities, and try saving an experience.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Reset preview
        </Button>
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        <Badge tone="route">{countries.length} countries</Badge>
        <Badge tone="dates">{cities.length} cities</Badge>
        <Badge tone="recommendation">{activities.length} experiences</Badge>
        <Badge tone="budget">{saved.length} saved in preview</Badge>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Internal component gallery · changes last until reload · all costs and
        ratings are mock data.
      </p>
      <nav
        aria-label="Card collections"
        className="my-8 flex flex-wrap gap-2 border-y py-3"
      >
        {sections.map((item) => (
          <Button
            key={item}
            type="button"
            variant={item === section ? "default" : "ghost"}
            aria-pressed={item === section}
            onClick={() => setSection(item)}
          >
            {item}
          </Button>
        ))}
      </nav>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mb-6 min-h-5 text-sm text-primary"
      >
        {message}
      </p>

      {section === "Destinations" && (
        <>
          <SectionHeading
            title="Where will curiosity take you?"
            description="Destination cards · Select a country to reveal its cities below."
          />
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((item, index) => (
              <DestinationCard
                key={item.id}
                country={item}
                priority={index === 0}
                selected={countryId === item.id}
                onToggle={() => chooseCountry(item.id)}
              />
            ))}
          </div>
          <div className="mt-12">
            <SectionHeading
              title={
                country
                  ? `A little more ${country.name}.`
                  : "Your route starts with a country."
              }
              description="City cards · Suggested stays and experiences are local fixture data."
            />
            {country ? (
              <>
                <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {cityOptions.map((item) => (
                    <CityCard
                      key={item.id}
                      city={item}
                      countryName={country.name}
                      selected={item.id === cityId}
                      onToggle={() => {
                        setCityId(item.id === cityId ? "" : item.id);
                        setMessage(
                          `${item.name} ${item.id === cityId ? "removed" : "selected"} in preview.`,
                        );
                      }}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  className="mt-6"
                  disabled={!city}
                  onClick={() => setSection("Experiences")}
                >
                  Explore {city?.name ?? "city"} experiences
                  <Compass aria-hidden="true" />
                </Button>
              </>
            ) : (
              <EmptyState
                title="Choose a country above"
                description="Its cities will appear here. No unrelated destinations are suggested."
              />
            )}
          </div>
        </>
      )}

      {section === "Experiences" && (
        <>
          <SectionHeading
            title="Your kind of getaway."
            description="Preference cards · Select in priority order to bring matching experiences to the top."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {travelStyles.map((style) => (
              <PreferenceCard
                key={style.id}
                styleId={style.id}
                selected={priorities.includes(style.id)}
                priority={priorities.indexOf(style.id) + 1}
                onToggle={() => toggleStyle(style.id)}
              />
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-end justify-between gap-5">
            <SectionHeading
              title={
                city
                  ? `A few reasons to love ${city.name}.`
                  : "Find your next experience."
              }
              description="Activity cards · Save an idea or expand its details."
            />
            <label className="mb-6 flex min-w-0 flex-col gap-2 text-sm font-medium">
              Preview city
              <select
                aria-label="Preview city"
                value={cityId}
                onChange={(event) => {
                  setCityId(event.target.value);
                  setMessage(
                    "Preview city updated. Experiences now match this city.",
                  );
                }}
                className="min-h-11 max-w-full rounded-lg border bg-card px-4 py-2 font-normal"
              >
                <option value="">Choose a city</option>
                {cityOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {city ? (
            <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  cityName={city.name}
                  saved={saved.includes(activity.id)}
                  onSave={() => toggleSaved(activity.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Select a city to see its experiences"
              description="Choose a country in Destinations, then select a city. Recommendations stay within your selection."
            />
          )}
        </>
      )}

      {section === "Trip cards" && (
        <>
          <SectionHeading
            title="Stories waiting to happen."
            description="Four sample adventures · Open a trip to review its route and collected ideas."
          />
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {demoTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                countries={countries}
                cities={cities}
                href={`/trips/${trip.id}`}
              />
            ))}
          </div>
          <div className="mt-12">
            <SectionHeading
              title="The details, at a glance."
              description="Stat and Bento cards · Example presentation using the Japan demo fixture."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <BentoCard
                title="Japan Spring Escape"
                eyebrow="Destination theme · Japan"
                theme="japan"
                tone="destination"
                size="horizontal"
                footer="Tokyo → Kyoto → Osaka"
              >
                <p className="font-display text-4xl">
                  A new perspective,
                  <br />
                  one neighborhood at a time.
                </p>
              </BentoCard>
              <StatCard
                tone="dates"
                label="Time to explore"
                value="10 days"
                description="April 5–14, 2027"
                icon={<CalendarDays className="size-5" />}
              />
              <StatCard
                tone="travelers"
                label="Good company"
                value="2 travelers"
                description="Alex and Sam"
                icon={<Users className="size-5" />}
              />
            </div>
          </div>
        </>
      )}

      {section === "Sizes & states" && (
        <>
          <SectionHeading
            title="One system. Room to move."
            description="Card spans collapse on small screens. Drag states below are visual previews; builder drag behavior arrives in Phase 3."
          />
          <div className="grid auto-rows-auto gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <BentoCard
              title="The big picture"
              size="featured"
              tone="route"
              eyebrow="2 × 2 · Featured"
              footer="A little structure, a lot of possibility."
            >
              <Route className="mb-4 size-8" aria-hidden="true" />
              <p className="font-display text-4xl leading-tight">
                Every stop has a story.
              </p>
              <p className="mt-5 text-sm leading-6">
                Use the featured card for the destination hero or an expanded
                route. Content sets the height; nothing gets clipped.
              </p>
            </BentoCard>
            <BentoCard
              title="The scenic route"
              size="vertical"
              tone="recommendation"
              eyebrow="1 × 2 · Vertical"
            >
              <ol className="space-y-6 text-sm">
                {["Tokyo · 4 days", "Kyoto · 4 days", "Osaka · 2 days"].map(
                  (stop) => (
                    <li key={stop} className="flex items-center gap-2">
                      <MapPin className="size-4" aria-hidden="true" />
                      {stop}
                    </li>
                  ),
                )}
              </ol>
            </BentoCard>
            <StatCard
              label="A little flexibility"
              value="Balanced"
              description="1 × 1 · Compact budget card"
              tone="budget"
              icon={<Wallet className="size-5" />}
            />
            <StatCard
              label="Keep it simple"
              value="3 stops"
              description="1 × 1 · Compact route card"
              tone="dates"
            />
            <BentoCard
              title="Space for the next idea"
              size="horizontal"
              eyebrow="2 × 1 · Horizontal"
            >
              <p className="text-sm text-muted-foreground">
                A wider surface for a route summary, suggestion, or planning
                progress.
              </p>
            </BentoCard>
          </div>
          <h2 className="mt-12 mb-6 text-2xl font-semibold">
            Feedback you can feel.
          </h2>
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <BaseCard state="selected">
              <h3 className="font-semibold">Selected</h3>
              <p className="mt-3 flex items-center gap-2 text-sm">
                <Check className="size-4" aria-hidden="true" />
                Added to your ideas
              </p>
            </BaseCard>
            <BaseCard state="dragging">
              <h3 className="font-semibold">Dragging preview</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Lift, rotation, and elevation.
              </p>
            </BaseCard>
            <BaseCard state="valid-drop">
              <h3 className="font-semibold">Compatible destination</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The activity belongs in this city.
              </p>
            </BaseCard>
            <BaseCard state="invalid-drop">
              <h3 className="font-semibold">Different city</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Visible text explains the conflict.
              </p>
            </BaseCard>
            <BaseCard state="disabled">
              <h3 className="font-semibold">Unavailable action</h3>
              <p className="my-3 text-sm text-muted-foreground">
                Select a destination first.
              </p>
              <Button disabled>Add to route</Button>
            </BaseCard>
            <BaseCard
              state="loading"
              aria-label="Loading destination preview"
            />
            <ImageCard
              unavailable
              image={{
                src: "/images/italy.jpg",
                alt: "Destination image fallback example",
                caption: "Image-unavailable state preview",
              }}
            >
              <h3 className="font-semibold">An image can take a detour.</h3>
              <p className="text-sm text-muted-foreground">
                The card stays readable if its photo is unavailable.
              </p>
            </ImageCard>
            <BaseCard state="expanded">
              <h3 className="font-semibold">Expanded details</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A stronger border and elevation keep the selected card in
                context. Try View details on an experience to see the real
                interaction.
              </p>
            </BaseCard>
          </div>
          <details className="mt-10 rounded-xl border bg-card p-5">
            <summary className="cursor-pointer text-sm font-medium">
              Photography sources
            </summary>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {destinationImages.map((image) => (
                <li key={image.src}>
                  <a
                    href={image.source}
                    className="underline underline-offset-4"
                  >
                    {image.caption}
                  </a>
                  {image.credit && <span> · {image.credit}</span>}
                  {image.license && (
                    <span>
                      {" "}
                      ·{" "}
                      <a
                        href={image.licenseUrl}
                        className="underline underline-offset-4"
                      >
                        {image.license}
                      </a>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
    </>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <BaseCard className="border-dashed bg-transparent py-12 text-center shadow-none">
      <Compass
        className="mx-auto mb-4 size-7 text-primary"
        aria-hidden="true"
      />
      <h3 className="font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </BaseCard>
  );
}
