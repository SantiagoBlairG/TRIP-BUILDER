import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "glass-surface rounded-xl border bg-card p-5 text-card-foreground shadow-card",
        className,
      )}
      {...props}
    />
  );
}
