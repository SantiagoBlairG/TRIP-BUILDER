import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Trip builder" };

export default function BuilderPage() {
  return (
    <section className="mx-auto max-w-3xl py-8">
      <p className="mb-4 text-xs font-semibold tracking-widest text-primary uppercase">
        Your next chapter
      </p>
      <h1 className="font-display text-5xl sm:text-6xl">
        Every adventure starts somewhere.
      </h1>
      <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
        This is the future home of your visual trip builder. Soon you’ll collect
        destinations, shape a route, and make the details your own.
      </p>
      <Card className="my-8 flex min-h-64 flex-col items-center justify-center border-dashed bg-transparent text-center shadow-none">
        <MapPinned className="mb-4 size-9 text-primary" strokeWidth={1.5} />
        <h2 className="text-lg font-semibold">A little space for a big idea</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Foundation preview. Interactive destination cards and draft saving
          arrive in Phase 3.
        </p>
      </Card>
      <Button asChild variant="outline">
        <Link href="/">
          <ArrowLeft />
          Back to home
        </Link>
      </Button>
    </section>
  );
}
