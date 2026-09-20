import type { TravelStyleId } from "@/types/travel";

export const travelStyles: {
  id: TravelStyleId;
  name: string;
  description: string;
}[] = [
  {
    id: "food",
    name: "Food & gastronomy",
    description: "Markets, long lunches, and local flavors.",
  },
  {
    id: "beaches",
    name: "Beaches & relaxation",
    description: "Salty air and slower afternoons.",
  },
  {
    id: "hiking",
    name: "Trekking & hiking",
    description: "Take the scenic way on foot.",
  },
  {
    id: "nature",
    name: "Nature & wildlife",
    description: "Make room for the great outdoors.",
  },
  {
    id: "culture",
    name: "Museums & culture",
    description: "Art, stories, and fresh perspectives.",
  },
  {
    id: "history",
    name: "History & architecture",
    description: "Find the stories behind the streets.",
  },
  {
    id: "nightlife",
    name: "Nightlife",
    description: "Discover a city after dark.",
  },
  {
    id: "shopping",
    name: "Shopping",
    description: "Independent shops and special finds.",
  },
  {
    id: "photography",
    name: "Photography",
    description: "Chase the light and keep the memories.",
  },
  {
    id: "adventure",
    name: "Sports & adventure",
    description: "Try something a little different.",
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Space to breathe and recharge.",
  },
  {
    id: "family",
    name: "Family activities",
    description: "Little discoveries for every age.",
  },
];

export const travelStyleById = Object.fromEntries(
  travelStyles.map((style) => [style.id, style]),
) as Record<TravelStyleId, (typeof travelStyles)[number]>;
