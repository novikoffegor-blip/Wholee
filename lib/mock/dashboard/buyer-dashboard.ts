import type { BrandOrderStatus } from "@/lib/mock/dashboard/brand-dashboard";
import { products } from "@/lib/mock/products";
import type { Product } from "@/types";

export interface BuyerCatalogProduct extends Product {
  brandName: string;
  description: string;
  stock: number;
}

export interface BuyerCartItem {
  product: BuyerCatalogProduct;
  quantity: number;
}

export interface BuyerOrder {
  id: string;
  date: string;
  brand: string;
  brandContact: string;
  brandEmail: string;
  items: BuyerCartItem[];
  total: number;
  status: BrandOrderStatus;
}

export const buyerCompany = {
  companyName: "Concept Store Volna",
  inn: "7801234567",
  ogrn: "1237800123456",
  businessType: "Розничный магазин",
  city: "Москва",
  contactName: "Мария Соколова",
  email: "buyer@volna.example",
  phone: "+7 495 220-18-40"
};

export const buyerCatalogProducts: BuyerCatalogProduct[] = products.slice(0, 10).map((product, index) => ({
  ...product,
  id: `buyer-${product.id}`,
  description: "Оптовая позиция для байерского каталога.",
  stock: [84, 96, 42, 60, 38, 50, 42, 44, 160, 120][index] ?? 60
}));

export const initialBuyerCart: BuyerCartItem[] = [
  { product: buyerCatalogProducts[0], quantity: buyerCatalogProducts[0].moq },
  { product: buyerCatalogProducts[3], quantity: buyerCatalogProducts[3].moq },
  { product: buyerCatalogProducts[6], quantity: buyerCatalogProducts[6].moq }
];

export const initialBuyerOrders: BuyerOrder[] = [
  {
    id: "LB-5012",
    date: "2026-05-29",
    brand: "Aurora Atelier",
    brandContact: "Елена Миронова",
    brandEmail: "brand@aurora.example",
    items: [
      { product: buyerCatalogProducts[0], quantity: 24 },
      { product: buyerCatalogProducts[6], quantity: 30 }
    ],
    total: 250200,
    status: "В обработке"
  },
  {
    id: "LB-5008",
    date: "2026-05-23",
    brand: "Mira Bags",
    brandContact: "Ольга Захарова",
    brandEmail: "sales@mira.example",
    items: [
      { product: buyerCatalogProducts[3], quantity: 12 },
      { product: buyerCatalogProducts[5], quantity: 12 }
    ],
    total: 196800,
    status: "Отправлен"
  },
  {
    id: "LB-4999",
    date: "2026-05-19",
    brand: "Nord Line",
    brandContact: "Алексей Ветров",
    brandEmail: "orders@nord.example",
    items: [{ product: buyerCatalogProducts[2], quantity: 10 }],
    total: 92000,
    status: "Выполнен"
  },
  {
    id: "LB-4987",
    date: "2026-05-14",
    brand: "Aurora Atelier",
    brandContact: "Елена Миронова",
    brandEmail: "brand@aurora.example",
    items: [{ product: buyerCatalogProducts[9], quantity: 16 }],
    total: 54400,
    status: "Выполнен"
  },
  {
    id: "LB-4978",
    date: "2026-05-09",
    brand: "Mira Bags",
    brandContact: "Ольга Захарова",
    brandEmail: "sales@mira.example",
    items: [{ product: buyerCatalogProducts[4], quantity: 10 }],
    total: 98000,
    status: "Отменён"
  },
  {
    id: "LB-4964",
    date: "2026-05-02",
    brand: "Nord Line",
    brandContact: "Алексей Ветров",
    brandEmail: "orders@nord.example",
    items: [{ product: buyerCatalogProducts[8], quantity: 8 }],
    total: 100800,
    status: "Выполнен"
  }
];
