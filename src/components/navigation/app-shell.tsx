"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Compass, LayoutGrid, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Roam home"
            className="flex items-center gap-2 text-2xl font-semibold tracking-tight"
          >
            <Compass className="size-8 text-primary" strokeWidth={1.7} />
            roam<span className="text-primary">.</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="order-3 flex w-full items-center gap-2 sm:order-none sm:w-auto"
          >
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm",
                pathname === "/"
                  ? "bg-secondary font-medium text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <LayoutGrid className="size-4" />
              My trips
            </Link>
            <Link
              href="/builder"
              aria-current={pathname === "/builder" ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm",
                pathname === "/builder"
                  ? "bg-secondary font-medium text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <Compass className="size-4" />
              Trip builder
            </Link>
          </nav>
          <Button asChild>
            <Link href="/builder">
              <Plus />
              New trip
            </Link>
          </Button>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-7xl px-5 py-10 focus:outline-none sm:px-8 lg:px-12 lg:py-14"
      >
        {children}
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:px-8 lg:px-12">
        <span>A little planning. A lot to look forward to.</span>
        <Link
          href="/card-gallery"
          className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:underline"
        >
          Explore the card gallery{" "}
          <ArrowUpRight className="size-3" aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
