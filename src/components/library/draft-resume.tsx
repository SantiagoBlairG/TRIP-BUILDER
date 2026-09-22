"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useBuilderStore } from "@/stores/builder-store";
import { useBuilderHydration } from "@/components/builder/use-builder-hydration";
import { Button } from "@/components/ui/button";
import { duration } from "@/lib/builder";
export function DraftResume() {
  const { ready, storageError } = useBuilderHydration();
  const draft = useBuilderStore((s) => s.draft);
  if (!ready || !draft.updatedAt) return null;
  return (
    <section
      aria-label="Your saved draft"
      className="glass-surface mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5"
    >
      <div>
        <p className="text-xs font-semibold text-primary">
          Your draft · on this device
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight">
          {draft.details.name}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {draft.route.length} cities · {duration(draft)} days
          {storageError
            ? " · Local saving unavailable"
            : " · Ready when you are"}
        </p>
      </div>
      <Button asChild>
        <Link href="/builder">
          Resume draft
          <ArrowUpRight />
        </Link>
      </Button>
    </section>
  );
}
