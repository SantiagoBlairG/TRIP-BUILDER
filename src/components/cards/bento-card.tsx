import type { ReactNode } from "react";
import { BaseCard, type BaseCardProps } from "./base-card";

export function BentoCard({
  title,
  eyebrow,
  children,
  footer,
  ...props
}: BaseCardProps & { title: string; eyebrow?: string; footer?: ReactNode }) {
  return (
    <BaseCard {...props} className={`flex flex-col ${props.className ?? ""}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium tracking-widest uppercase">
          {eyebrow}
        </p>
      )}
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-5 flex-1">{children}</div>
      {footer && (
        <div className="mt-6 border-t border-foreground/10 pt-4 text-sm">
          {footer}
        </div>
      )}
    </BaseCard>
  );
}
