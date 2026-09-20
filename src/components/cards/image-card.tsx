"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { BaseCard, type BaseCardProps } from "./base-card";
import { cn } from "@/lib/utils";
import type { DestinationImage } from "@/data/images";

type CardImage = Pick<DestinationImage, "src" | "alt" | "caption">;

function Photo({
  image,
  priority,
  aspect,
  unavailable,
}: {
  image: CardImage;
  priority: boolean;
  aspect: "landscape" | "wide";
  unavailable: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <figure>
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          aspect === "wide" ? "aspect-[16/9]" : "aspect-[4/3]",
        )}
      >
        {failed || unavailable ? (
          <div
            role="img"
            aria-label={`Image unavailable: ${image.alt}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 text-center text-muted-foreground"
          >
            <ImageOff className="size-7" aria-hidden="true" />
            <span className="text-sm">A little imagination for now</span>
            <span className="text-xs">Photo unavailable</span>
          </div>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            preload={priority}
            className="card-photo scroll-photo object-cover"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption className="border-b px-5 py-2 text-xs leading-5 text-muted-foreground">
        {image.caption}
      </figcaption>
    </figure>
  );
}

export function ImageCard({
  image,
  children,
  className,
  priority = false,
  aspect = "landscape",
  unavailable = false,
  ...props
}: BaseCardProps & {
  image: CardImage;
  priority?: boolean;
  aspect?: "landscape" | "wide";
  unavailable?: boolean;
}) {
  return (
    <BaseCard {...props} className={cn("overflow-hidden p-0", className)}>
      <Photo
        key={image.src}
        image={image}
        priority={priority}
        aspect={aspect}
        unavailable={unavailable}
      />
      <div className="space-y-4 p-5">{children}</div>
    </BaseCard>
  );
}
