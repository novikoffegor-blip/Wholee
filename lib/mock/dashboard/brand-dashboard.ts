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
  unit: Product["unit"];
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

export const brandProducts: BrandDashboardProduct[] = products
  .filter((product) => product.brandId === "brand-aurora" && product.brandName === brandCompany.brandName)
  .map((product, index) => ({
    ...product,
    id: `brand-${product.id}`,
    description: "Позиция для оптовой матрицы бренда.",
    stock: Math.max(Math.ceil(product.moq), [84, 60, 38, 42, 160, 120, 56, 44][index] ?? 50),
    status: index === 3 || index === 7 ? "Скрыт" : "Активен"
  }));

function getBrandProduct(sku: string) {
  const product = brandProducts.find((brandProduct) => brandProduct.sku === sku);

  if (!product) {
    throw new Error(`Aurora dashboard product ${sku} is missing`);
  }

  return product;
}

function createBrandOrderItem(sku: string, quantity: number): BrandOrderProduct {
  const product = getBrandProduct(sku);

  if (
    !Number.isInteger(quantity) ||
    quantity < product.moq ||
    quantity > product.stock ||
    (quantity - product.moq) % product.orderStep !== 0
  ) {
    throw new Error(`Invalid mock quantity ${quantity} for ${sku}`);
  }

  return {
    name: product.name,
    quantity,
    price: product.wholesalePrice,
    unit: product.unit
  };
}

function createBrandOrder(order: Omit<BrandOrder, "total">): BrandOrder {
  return {
    ...order,
    total: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
}

export const brandOrders: BrandOrder[] = [
  createBrandOrder({
    id: "LS-2401",
    date: "2026-05-28",
    buyer: "Concept Store Volna",
    buyerContact: "Мария Соколова",
    buyerCity: "Москва",
    items: [
      createBrandOrderItem("WS-AUR-001", 24),
      createBrandOrderItem("WS-AUR-009", 32)
    ],
    status: "Новый"
  }),
  createBrandOrder({
    id: "LS-2398",
    date: "2026-05-25",
    buyer: "Бутик Север",
    buyerContact: "Анна Белова",
    buyerCity: "Екатеринбург",
    items: [
      createBrandOrderItem("WS-AUR-004", 12),
      createBrandOrderItem("WS-AUR-010", 24)
    ],
    status: "В обработке"
  }),
  createBrandOrder({
    id: "LS-2391",
    date: "2026-05-21",
    buyer: "Room 18 Showroom",
    buyerContact: "Даниил Орлов",
    buyerCity: "Санкт-Петербург",
    items: [
      createBrandOrderItem("WS-AUR-004", 18),
      createBrandOrderItem("WS-AUR-014", 12)
    ],
    status: "Отправлен"
  }),
  createBrandOrder({
    id: "LS-2386",
    date: "2026-05-18",
    buyer: "Market Hall",
    buyerContact: "Игорь Фомин",
    buyerCity: "Казань",
    items: [
      createBrandOrderItem("WS-AUR-018", 20),
      createBrandOrderItem("WS-AUR-009", 24)
    ],
    status: "Выполнен"
  }),
  createBrandOrder({
    id: "LS-2379",
    date: "2026-05-12",
    buyer: "Local Fashion",
    buyerContact: "Ксения Лаврова",
    buyerCity: "Новосибирск",
    items: [createBrandOrderItem("WS-AUR-001", 12)],
    status: "Выполнен"
  }),
  createBrandOrder({
    id: "LS-2371",
    date: "2026-05-08",
    buyer: "Showcase Ural",
    buyerContact: "Павел Денисов",
    buyerCity: "Пермь",
    items: [createBrandOrderItem("WS-AUR-014", 12)],
    status: "Отменён"
  })
];
