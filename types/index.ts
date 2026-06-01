export type UserRole = "brand" | "buyer" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  companyName: string;
  inn: string;
  ogrn: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: "Обувь" | "Сумки" | "Аксессуары" | "Мультикатегория";
}

export type ProductCategory = "Кроссовки" | "Лоферы" | "Ботинки" | "Туфли" | "Сумки" | "Аксессуары";
export type ProductColor = "чёрный" | "белый" | "бежевый" | "жёлтый" | "коричневый" | "красный" | "синий" | "зелёный";
export type ProductGender = "Женское" | "Мужское" | "Унисекс";
export type ProductSeason = "Лето" | "Зима" | "Демисезон";
export type ProductMaterial = "кожа" | "замша" | "текстиль" | "эко-кожа";

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  images: string[];
  wholesalePrice: number;
  retailPrice: number;
  moq: number;
  sizes: string[];
  sizeRange: string;
  colors: ProductColor[];
  gender: ProductGender;
  material: ProductMaterial;
  sku: string;
  season: ProductSeason;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  wholesalePrice: number;
}

export interface Order {
  id: string;
  buyerId: string;
  brandId: string;
  items: OrderItem[];
  total: number;
  status: "draft" | "pending" | "confirmed" | "shipped" | "completed" | "cancelled";
  createdAt: string;
}
