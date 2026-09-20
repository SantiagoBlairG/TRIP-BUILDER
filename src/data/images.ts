import cityImages from "./city-images.json";

export type DestinationImage = {
  src: string;
  alt: string;
  caption: string;
  source: string;
  cityId?: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
};

/** Photos depict their stated destination; activity cards label shared city inspiration. */
export const destinationImages: DestinationImage[] = [
  {
    src: "/images/colombia.jpg",
    alt: "Colorful Cartagena houses with flower-covered balconies",
    caption: "Cartagena, Colombia · destination inspiration",
    source: "https://unsplash.com/photos/multicolored-houses-L6T_6Rp2iEk",
  },
  {
    src: "/images/france.jpg",
    alt: "The Eiffel Tower beside the Seine under a pink evening sky",
    caption: "Paris, France · destination inspiration",
    source: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    src: "/images/italy.jpg",
    alt: "Colorful houses above a rocky harbor on Italy’s Ligurian coast",
    caption: "Ligurian coast, Italy · destination inspiration",
    source: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
  },
  {
    src: "/images/japan.jpg",
    alt: "A Kyoto lane lined with traditional houses leading toward a pagoda at dusk",
    caption: "Kyoto, Japan · destination inspiration",
    source: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
  },
  {
    src: "/images/spain.jpg",
    alt: "Madrid rooftops and the illuminated Gran Vía at sunset",
    caption: "Madrid, Spain · destination inspiration",
    source: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
  },
  {
    src: "/images/greece.jpg",
    alt: "Blue-domed churches and white buildings above the sea in Santorini",
    caption: "Santorini, Greece · destination inspiration",
    source: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
  },
  ...cityImages,
];

export function getDestinationImage(src: string): DestinationImage | undefined {
  return destinationImages.find((image) => image.src === src);
}
