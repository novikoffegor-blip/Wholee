import { products } from "@/lib/mock/products";
import type { Product } from "@/types";

export type BrandProductStatus = "Активен" | "Скрыт";

export interface BrandDashboardProduct extends Product {
  description: string;
  stock: number;
  status: BrandProductStatus;
}

export type BrandOrderStatus = "Новый" | "В обработке" | "Отправлен" | "Выполнен" | "Отменён";

export interface BrandOrderProduct {
  name: string;
  quantity: number;
  price: number;
}

export interface BrandOrder {
  id: string;
  date: string;
  buyer: string;
  buyerContact: string;
  buyerCity: string;
  items: BrandOrderProduct[];
  total: number;
  status: BrandOrderStatus;
}

export const brandCompany = {
  companyName: "ООО Аврора Ателье",
  inn: "7701234567",
  ogrn: "1237700123456",
  brandName: "Aurora Atelier",
  contactName: "Елена Миронова",
  email: "brand@aurora.example",
  phone: "+7 495 120-45-90",
  categories: ["Обувь", "Сумки", "Аксессуары"],
  description:
    "Премиальный российский бренд городской обуви и кожаных аксессуаров для бутиков, шоурумов и концепт-сторов."
};

export const brandProducts: BrandDashboardProduct[] = products.slice(0, 8).map((product, index) => ({
  ...product,
  id: `brand-${product.id}`,
  description: "Позиция для оптовой матрицы бренда.",
  stock: [84, 60, 38, 42, 160, 120, 56, 44][index] ?? 50,
  status: index === 3 || index === 7 ? "Скрыт" : "Активен"
}));

export const brandOrders: BrandOrder[] = [
  {
    id: "LS-2401",
    date: "2026-05-28",
    buyer: "Concept Store Volna",
    buyerContact: "Мария Соколова",
    buyerCity: "Москва",
    items: [
      { name: "Кожаные лоферы Studio", quantity: 24, price: 7800 },
      { name: "Ремень Classic Buckle", quantity: 30, price: 2100 }
    ],
    total: 250200,
    status: "Новый"
  },
  {
    id: "LS-2398",
    date: "2026-05-25",
    buyer: "Бутик Север",
    buyerContact: "Анна Белова",
    buyerCity: "Екатеринбург",
    items: [
      { name: "Сумка Tote North", quantity: 12, price: 11200 },
      { name: "Кошелек Fold Mini", quantity: 24, price: 2600 }
    ],
    total: 196800,
    status: "В обработке"
  },
  {
    id: "LS-2391",
    date: "2026-05-21",
    buyer: "Room 18 Showroom",
    buyerContact: "Даниил Орлов",
    buyerCity: "Санкт-Петербург",
    items: [
      { name: "Туфли Court Line", quantity: 18, price: 8400 },
      { name: "Клатч Evening Soft", quantity: 12, price: 5200 }
    ],
    total: 213600,
    status: "Отправлен"
  },
  {
    id: "LS-2386",
    date: "2026-05-18",
    buyer: "Market Hall",
    buyerContact: "Игорь Фомин",
    buyerCity: "Казань",
    items: [
      { name: "Перчатки Fine Leather", quantity: 20, price: 3400 },
      { name: "Шоппер Market Leather", quantity: 10, price: 7600 }
    ],
    total: 144000,
    status: "Выполнен"
  },
  {
    id: "LS-2379",
    date: "2026-05-12",
    buyer: "Local Fashion",
    buyerContact: "Ксения Лаврова",
    buyerCity: "Новосибирск",
    items: [{ name: "Кожаные лоферы Studio", quantity: 12, price: 7800 }],
    total: 93600,
    status: "Выполнен"
  },
  {
    id: "LS-2371",
    date: "2026-05-08",
    buyer: "Showcase Ural",
    buyerContact: "Павел Денисов",
    buyerCity: "Пермь",
    items: [{ name: "Клатч Evening Soft", quantity: 12, price: 5200 }],
    total: 62400,
    status: "Отменён"
  }
];
