import type { Product, ProductCategory, ProductColor, ProductGender, ProductMaterial, ProductSeason } from "@/types";

export const productCategories: ProductCategory[] = ["Кроссовки", "Лоферы", "Ботинки", "Туфли", "Сумки", "Аксессуары"];
export const productColors: ProductColor[] = ["чёрный", "белый", "бежевый", "жёлтый", "коричневый", "красный", "синий", "зелёный"];
export const productGenders: ProductGender[] = ["Женское", "Мужское", "Унисекс"];
export const productSeasons: ProductSeason[] = ["Лето", "Зима", "Демисезон"];
export const productMaterials: ProductMaterial[] = ["кожа", "замша", "текстиль", "эко-кожа"];

const categoryAliases: Record<ProductCategory, string[]> = {
  Кроссовки: ["кроссовки", "кроссовок", "кроссы", "sneakers"],
  Лоферы: ["лоферы", "лофер", "лоферов"],
  Ботинки: ["ботинки", "ботинок", "сапоги", "сапог", "челси"],
  Туфли: ["туфли", "туфель", "туфля", "лодочки"],
  Сумки: ["сумки", "сумка", "сумок", "рюкзак", "рюкзаки", "клатч", "клатчи", "шоппер", "шопперы"],
  Аксессуары: ["аксессуары", "аксессуар", "ремень", "ремни", "кошелёк", "кошелек", "перчатки"]
};

const colorAliases: Record<ProductColor, string[]> = {
  чёрный: ["чёрный", "черный", "чёрные", "черные", "чёрная", "черная", "black"],
  белый: ["белый", "белые", "белая", "white"],
  бежевый: ["бежевый", "бежевые", "бежевая", "беж", "beige"],
  жёлтый: ["жёлтый", "желтый", "жёлтые", "желтые", "жёлтая", "желтая", "yellow"],
  коричневый: ["коричневый", "коричневые", "коричневая", "brown"],
  красный: ["красный", "красные", "красная", "red"],
  синий: ["синий", "синие", "синяя", "blue"],
  зелёный: ["зелёный", "зеленый", "зелёные", "зеленые", "зелёная", "зеленая", "green"]
};

export interface CatalogFilters {
  query?: string;
  category?: ProductCategory;
  color?: ProductColor;
  gender?: ProductGender;
  season?: ProductSeason;
  material?: ProductMaterial;
  minPrice?: number;
  maxPrice?: number;
}

function normalize(value: string) {
  return value.toLowerCase().replaceAll("ё", "е").trim();
}

function includesAlias(source: string, aliases: string[]) {
  const normalizedSource = normalize(source);
  return aliases.some((alias) => normalizedSource.includes(normalize(alias)));
}

export function parseCatalogQuery(query: string): CatalogFilters {
  const filters: CatalogFilters = { query };

  for (const category of productCategories) {
    if (includesAlias(query, categoryAliases[category])) {
      filters.category = category;
      break;
    }
  }

  for (const color of productColors) {
    if (includesAlias(query, colorAliases[color])) {
      filters.color = color;
      break;
    }
  }

  return filters;
}

export function buildCatalogSearchParams(filters: CatalogFilters) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.color) params.set("color", filters.color);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.season) params.set("season", filters.season);
  if (filters.material) params.set("material", filters.material);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  return params;
}

export function filterProducts(products: Product[], filters: CatalogFilters) {
  const parsedQuery = filters.query ? parseCatalogQuery(filters.query) : {};
  const effectiveFilters = { ...parsedQuery, ...filters };
  const normalizedQuery = normalize(filters.query ?? "");

  return products.filter((product) => {
    const matchesCategory = !effectiveFilters.category || product.category === effectiveFilters.category;
    const matchesColor = !effectiveFilters.color || product.colors.includes(effectiveFilters.color);
    const matchesGender = !effectiveFilters.gender || product.gender === effectiveFilters.gender;
    const matchesSeason = !effectiveFilters.season || product.season === effectiveFilters.season;
    const matchesMaterial = !effectiveFilters.material || product.material === effectiveFilters.material;
    const matchesMinPrice = !effectiveFilters.minPrice || product.wholesalePrice >= effectiveFilters.minPrice;
    const matchesMaxPrice = !effectiveFilters.maxPrice || product.wholesalePrice <= effectiveFilters.maxPrice;
    const productText = normalize(
      `${product.name} ${product.brandName} ${product.category} ${product.subcategory} ${product.colors.join(" ")} ${product.gender} ${product.season} ${product.material}`
    );
    const matchesQueryText =
      !normalizedQuery ||
      productText.includes(normalizedQuery) ||
      Boolean(parsedQuery.category || parsedQuery.color);

    return (
      matchesCategory &&
      matchesColor &&
      matchesGender &&
      matchesSeason &&
      matchesMaterial &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesQueryText
    );
  });
}
