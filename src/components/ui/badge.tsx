import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-foreground",
        route: "bg-route text-foreground",
        dates: "bg-dates text-foreground",
        budget: "bg-budget text-foreground",
        recommendation: "bg-recommendation text-foreground",
        warning: "bg-warning text-foreground",
        destination: "bg-destination-soft text-destination",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);
export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
