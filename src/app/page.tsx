import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPinned,
  Route,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Follow your curiosity",
    description:
      "Start with a country, a city, or somewhere you’ve always wanted to go.",
    icon: MapPinned,
    color: "bg-route",
  },
  {
    number: "02",
    title: "Make it your kind of trip",
    description:
      "A little culture, a long lunch, a day with no plans. Find your own pace.",
    icon: CalendarDays,
    color: "bg-dates",
  },
  {
    number: "03",
    title: "Bring it all together",
    description:
      "Your route, favorite places, and budget. One space for the whole adventure.",
    icon: Wallet,
    color: "bg-budget",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="grid items-center gap-10 pb-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Less logistics. More possibility.
          </p>
          <h1 className="max-w-2xl font-display text-6xl leading-[1.02] tracking-tight sm:text-7xl">
            Good trips start
            <br />
            with a little <span className="text-primary italic">wonder.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            A home for all your somewhere-someday ideas. Piece together a trip
            that feels like you, one card at a time.
          </p>
          <Button asChild className="mt-8">
            <Link href="/builder">
              Explore the trip builder <ArrowRight />
            </Link>
          </Button>
        </div>
        <div
          className="relative rounded-xl border bg-secondary p-6 sm:p-9"
          aria-label="Preview of the trip planning workspace"
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">
              A world of possibilities
            </span>
            <CompassMark />
          </div>
          <Card className="rotate-[-2deg] border-none">
            <div className="mb-5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Route className="size-4" />
              THE SHAPE OF A GREAT TRIP
            </div>
            <p className="font-display text-4xl">
              Somewhere new.
              <br />
              Something unforgettable.
            </p>
            <div className="mt-7 flex items-center gap-2 text-xs text-primary">
              <span className="size-2 rounded-full bg-primary" />
              <span>A spark of an idea</span>
              <span className="h-px flex-1 bg-border" />
              <MapPinned className="size-5" />
            </div>
          </Card>
          <div className="relative mt-5 ml-6 flex rotate-[2deg] items-center gap-3 rounded-lg bg-dates p-4">
            <Sparkles className="size-5 shrink-0" />
            <p className="text-sm">Leave a little room for the unexpected.</p>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Workspace preview · Trip creation is coming in Phase 3
          </p>
        </div>
      </section>
      <section className="border-t pt-10" aria-labelledby="how-it-works">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2
            id="how-it-works"
            className="text-xl font-semibold tracking-tight"
          >
            From someday to let’s go.
          </h2>
          <p className="text-sm text-muted-foreground">
            A more thoughtful way to plan.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ number, title, description, icon: Icon, color }) => (
            <Card key={number} className="shadow-none">
              <div className="mb-5 flex items-center justify-between">
                <span
                  className={`flex size-11 items-center justify-center rounded-lg ${color}`}
                >
                  <Icon className="size-5" strokeWidth={1.7} />
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {number}
                </span>
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function CompassMark() {
  return (
    <span className="flex size-8 items-center justify-center rounded-full border border-primary/20">
      <ArrowRight className="size-4 -rotate-45 text-primary" />
    </span>
  );
}
