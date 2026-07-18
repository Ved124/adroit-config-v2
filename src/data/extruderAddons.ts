// src/data/extruderAddons.ts

export interface ExtruderAddon {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  cardDesc?: string;
  description: string;
  supportedTypes: string[];
}

export const EXTRUDER_ADDONS: ExtruderAddon[] = [
  {
    id: "addon-lever-screen-changer",
    name: "Lever type Manual Screen Changer Upgrade",
    category: "Extruder Addons",
    price: 100000,
    image: "/images/Acessories/lever_sc.jpg",
    cardDesc: "Upgrade to high-efficiency lever type screen changer.",
    description: "Upgrades standard candle type screen changers to high-efficiency lever type for faster screen replacement.",
    supportedTypes: ["mono", "aba", "3layer", "5layer"]
  }
];
