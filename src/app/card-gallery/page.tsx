import type { Metadata } from "next";
import { CardGallery } from "@/components/cards/card-gallery";

export const metadata: Metadata = {
  title: "Card gallery",
  robots: { index: false, follow: false },
};
export default function CardGalleryPage() {
  return <CardGallery />;
}
