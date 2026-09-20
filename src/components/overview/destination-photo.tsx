"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { getDestinationImage } from "@/data/images";

export function DestinationPhoto({
  src,
  priority = false,
  sizes = "(max-width: 640px) 100vw, 50vw",
}: {
  src: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const image = getDestinationImage(src);
  return !image || failed ? (
    <div className="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground">
      <ImageOff className="size-8" aria-label="Destination photo unavailable" />
    </div>
  ) : (
    <Image
      src={src}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={priority}
      className={priority ? "scroll-photo object-cover" : "object-cover"}
      onError={() => setFailed(true)}
    />
  );
}
