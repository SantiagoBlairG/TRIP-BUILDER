"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useBuilderStore } from "@/stores/builder-store";
import { useBuilderHydration } from "@/components/builder/use-builder-hydration";
import { Button } from "@/components/ui/button";
import { duration } from "@/lib/builder";
export function DraftResume() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
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
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
          Delete draft
        </Button>
        <Button asChild>
          <Link href="/builder">
            Resume draft
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
      {confirmDelete && (
        <div className="w-full border-t pt-4">
          <p>Delete this unfinished draft? This cannot be undone.</p>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Keep draft
            </Button>
            <Button
              onClick={() => {
                try {
                  localStorage.removeItem("roam-builder-v1");
                  useBuilderStore.getState().reset();
                } catch {
                  setDeleteError(
                    "Could not delete your draft. Please try again.",
                  );
                }
              }}
            >
              Confirm delete draft
            </Button>
          </div>
        </div>
      )}
      {deleteError && <p role="alert">{deleteError}</p>}
    </section>
  );
}
