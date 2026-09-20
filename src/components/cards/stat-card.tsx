import type { ReactNode } from "react";
import { BaseCard, type BaseCardProps } from "./base-card";

export function StatCard({
  label,
  value,
  description,
  icon,
  ...props
}: Omit<BaseCardProps, "children"> & {
  label: string;
  value: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <BaseCard {...props}>
      <div className="mb-5 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">{label}</h3>
        {icon && <span aria-hidden="true">{icon}</span>}
      </div>
      <p className="text-4xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </BaseCard>
  );
}
