export type ProductColor = {
  id: string;
  image: string;
  swatch: string;
};

export type Product = {
  id: string;
  slug: string;
  priceEur: number;
  madeInItaly: boolean;
  available: boolean;
  colors: ProductColor[];
};

/**
 * Structural catalog only — names and copy live in messages/{locale}.json.
 * Prices: Wave 1 band €79–€129 (decision 2A).
 * First color in each list is the default / first-visible photo (chosen for
 * contrast, hardware pop, and variety across the collection grid).
 */
export const products: Product[] = [
  {
    id: "PRODUCT_01",
    slug: "serena",
    priceEur: 129,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "rosso", image: "/products/serena/rosso.jpg", swatch: "#9c2b2b" },
      { id: "verde_salvia", image: "/products/serena/verde_salvia.jpg", swatch: "#8a9a84" },
      { id: "cuoio", image: "/products/serena/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "nudo", image: "/products/serena/nudo.jpg", swatch: "#d4b59a" },
      { id: "azzurro", image: "/products/serena/azzurro.jpg", swatch: "#7eb0c8" },
      { id: "rosa", image: "/products/serena/rosa.jpg", swatch: "#d4a0a8" },
      { id: "bianco", image: "/products/serena/bianco.jpg", swatch: "#f4f1ea" },
      { id: "panna", image: "/products/serena/panna.jpg", swatch: "#f3ead8" },
    ],
  },
  {
    id: "PRODUCT_02",
    slug: "melody",
    priceEur: 99,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "cuoio", image: "/products/melody/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "rosso", image: "/products/melody/rosso.jpg", swatch: "#9c2b2b" },
      { id: "giallo", image: "/products/melody/giallo.jpg", swatch: "#e0b000" },
      { id: "verde_menta", image: "/products/melody/verde_menta.jpg", swatch: "#7fbfb0" },
      { id: "azzurro", image: "/products/melody/azzurro.jpg", swatch: "#7eb0c8" },
      { id: "rosa", image: "/products/melody/rosa.jpg", swatch: "#d4a0a8" },
      { id: "tortora", image: "/products/melody/tortora.jpg", swatch: "#a89888" },
      { id: "panna", image: "/products/melody/panna.jpg", swatch: "#f3ead8" },
      { id: "bianco", image: "/products/melody/bianco.jpg", swatch: "#f4f1ea" },
    ],
  },
  {
    id: "PRODUCT_04",
    slug: "conny",
    priceEur: 79,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "bordeaux", image: "/products/conny/bordeaux.jpg", swatch: "#6b2430" },
      { id: "nero", image: "/products/conny/nero.jpg", swatch: "#1a1714" },
      { id: "testa_di_moro", image: "/products/conny/testa_di_moro.jpg", swatch: "#3d2a22" },
      { id: "verde_oliva", image: "/products/conny/verde_oliva.jpg", swatch: "#6a6840" },
      { id: "tortora", image: "/products/conny/tortora.jpg", swatch: "#a89888" },
    ],
  },
  {
    id: "PRODUCT_07",
    slug: "lila",
    priceEur: 109,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "rosso", image: "/products/lila/rosso.jpg", swatch: "#9c2b2b" },
      { id: "nero", image: "/products/lila/nero.jpg", swatch: "#1a1714" },
      { id: "azzurro", image: "/products/lila/azzurro.jpg", swatch: "#7eb0c8" },
      { id: "cuoio", image: "/products/lila/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "giallo", image: "/products/lila/giallo.jpg", swatch: "#e0b000" },
      { id: "rosa", image: "/products/lila/rosa.jpg", swatch: "#d4a0a8" },
    ],
  },
  {
    id: "PRODUCT_08",
    slug: "fiocco",
    priceEur: 99,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "blu", image: "/products/fiocco/blu.jpg", swatch: "#1e4d8c" },
      { id: "bordeaux", image: "/products/fiocco/bordeaux.jpg", swatch: "#6b2430" },
      { id: "nero", image: "/products/fiocco/nero.jpg", swatch: "#1a1714" },
      { id: "cuoio", image: "/products/fiocco/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "caramello", image: "/products/fiocco/caramello.jpg", swatch: "#c4a070" },
    ],
  },
  {
    id: "PRODUCT_09",
    slug: "sopie",
    priceEur: 89,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "rosso", image: "/products/sopie/rosso.jpg", swatch: "#9c2b2b" },
      { id: "nero", image: "/products/sopie/nero.jpg", swatch: "#1a1714" },
      { id: "verde_salvia", image: "/products/sopie/verde_salvia.jpg", swatch: "#8a9a84" },
      { id: "cuoio", image: "/products/sopie/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "azzurro", image: "/products/sopie/azzurro.jpg", swatch: "#7eb0c8" },
      { id: "tortora", image: "/products/sopie/tortora.jpg", swatch: "#a89888" },
      { id: "testa_di_moro", image: "/products/sopie/testa_di_moro.jpg", swatch: "#3d2a22" },
    ],
  },
  {
    id: "PRODUCT_10",
    slug: "bombola",
    priceEur: 79,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "blu_notte", image: "/products/bombola/blu_notte.jpg", swatch: "#1e2a44" },
      { id: "nero", image: "/products/bombola/nero.jpg", swatch: "#1a1714" },
      { id: "cuoio", image: "/products/bombola/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "testa_di_moro", image: "/products/bombola/testa_di_moro.jpg", swatch: "#3d2a22" },
      { id: "azzurro", image: "/products/bombola/azzurro.jpg", swatch: "#7eb0c8" },
      { id: "panna", image: "/products/bombola/panna.jpg", swatch: "#f3ead8" },
    ],
  },
  {
    id: "PRODUCT_06",
    slug: "bianca",
    priceEur: 119,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "senape", image: "/products/bianca/senape.jpg", swatch: "#e0b000" },
      { id: "nero", image: "/products/bianca/nero.jpg", swatch: "#1a1714" },
      { id: "cuoio", image: "/products/bianca/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "blu_notte", image: "/products/bianca/blu_notte.jpg", swatch: "#1e2a44" },
      { id: "argento", image: "/products/bianca/argento.jpg", swatch: "#c5c7c9" },
      { id: "azzurro", image: "/products/bianca/azzurro.jpg", swatch: "#7eb0c8" },
      { id: "cipria", image: "/products/bianca/cipria.jpg", swatch: "#e4cfc4" },
      { id: "testa_di_moro", image: "/products/bianca/testa_di_moro.jpg", swatch: "#3d2a22" },
      { id: "tortora", image: "/products/bianca/tortora.jpg", swatch: "#a89888" },
      { id: "panna", image: "/products/bianca/panna.jpg", swatch: "#f3ead8" },
      { id: "bianco", image: "/products/bianca/bianco.jpg", swatch: "#f4f1ea" },
    ],
  },
  {
    id: "PRODUCT_05",
    slug: "elisa",
    priceEur: 89,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "nero", image: "/products/elisa/nero.jpg", swatch: "#1a1714" },
      { id: "rosso", image: "/products/elisa/rosso.jpg", swatch: "#9c2b2b" },
      { id: "cipria", image: "/products/elisa/cipria.jpg", swatch: "#e4cfc4" },
      { id: "rosa", image: "/products/elisa/rosa.jpg", swatch: "#d4a0a8" },
      { id: "burro", image: "/products/elisa/burro.jpg", swatch: "#e6d7a8" },
      { id: "bianco", image: "/products/elisa/bianco.jpg", swatch: "#f4f1ea" },
    ],
  },
  {
    id: "PRODUCT_03",
    slug: "federica",
    priceEur: 109,
    madeInItaly: true,
    available: true,
    colors: [
      { id: "verde", image: "/products/federica/verde.jpg", swatch: "#3f6b45" },
      { id: "cuoio", image: "/products/federica/cuoio.jpg", swatch: "#8b5a2b" },
      { id: "nero", image: "/products/federica/nero.jpg", swatch: "#1a1714" },
      { id: "testa_di_moro", image: "/products/federica/testa_di_moro.jpg", swatch: "#3d2a22" },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export const faqIds = [
  "origin",
  "materials",
  "delivery",
  "deliveryCost",
  "returns",
  "damage",
  "contact",
  "payment",
  "currency",
  "fees",
  "difference",
] as const;

export type FaqId = (typeof faqIds)[number];
