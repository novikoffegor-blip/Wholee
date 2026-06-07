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
  brandId: string;
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
  stock: Math.max(Math.ceil(product.moq), [84, 96, 42, 60, 38, 50, 42, 44, 160, 120][index] ?? 60)
}));

function getBuyerCatalogProduct(sku: string) {
  const product = buyerCatalogProducts.find((catalogProduct) => catalogProduct.sku === sku);

  if (!product) {
    throw new Error(`Buyer catalog product ${sku} is missing`);
  }

  return product;
}

function createBuyerCartItem(sku: string, quantity: number): BuyerCartItem {
  const product = getBuyerCatalogProduct(sku);

  if (
    !Number.isInteger(quantity) ||
    quantity < product.moq ||
    quantity > product.stock ||
    (quantity - product.moq) % product.orderStep !== 0
  ) {
    throw new Error(`Invalid mock quantity ${quantity} for ${sku}`);
  }

  return { product, quantity };
}

function createBuyerOrder(order: Omit<BuyerOrder, "total">): BuyerOrder {
  if (order.items.some((item) => item.product.brandName !== order.brand)) {
    throw new Error(`Mock order ${order.id} contains products from another brand`);
  }

  return {
    ...order,
    total: order.items.reduce((sum, item) => sum + item.product.wholesalePrice * item.quantity, 0)
  };
}

export const initialBuyerCart: BuyerCartItem[] = [
  createBuyerCartItem("WS-AUR-001", 12),
  createBuyerCartItem("WS-AUR-004", 12),
  createBuyerCartItem("WS-MIR-007", 12)
];

export const initialBuyerOrders: BuyerOrder[] = [
  createBuyerOrder({
    id: "LB-5012",
    date: "2026-05-29",
    brandId: "brand-aurora",
    brand: "Aurora Atelier",
    brandContact: "Елена Миронова",
    brandEmail: "brand@aurora.example",
    items: [
      createBuyerCartItem("WS-AUR-001", 24),
      createBuyerCartItem("WS-AUR-009", 32)
    ],
    status: "В обработке"
  }),
  createBuyerOrder({
    id: "LB-5008",
    date: "2026-05-23",
    brandId: "brand-mira",
    brand: "Mira Objects",
    brandContact: "Ольга Захарова",
    brandEmail: "sales@mira.example",
    items: [
      createBuyerCartItem("WS-MIR-005", 12),
      createBuyerCartItem("WS-MIR-007", 12)
    ],
    status: "Отправлен"
  }),
  createBuyerOrder({
    id: "LB-4999",
    date: "2026-05-19",
    brandId: "brand-nord",
    brand: "Nord Line",
    brandContact: "Алексей Ветров",
    brandEmail: "orders@nord.example",
    items: [createBuyerCartItem("WS-NRD-003", 10)],
    status: "Выполнен"
  }),
  createBuyerOrder({
    id: "LB-4987",
    date: "2026-05-14",
    brandId: "brand-aurora",
    brand: "Aurora Atelier",
    brandContact: "Елена Миронова",
    brandEmail: "brand@aurora.example",
    items: [createBuyerCartItem("WS-AUR-010", 20)],
    status: "Выполнен"
  }),
  createBuyerOrder({
    id: "LB-4978",
    date: "2026-05-09",
    brandId: "brand-mira",
    brand: "Mira Objects",
    brandContact: "Ольга Захарова",
    brandEmail: "sales@mira.example",
    items: [createBuyerCartItem("WS-MIR-006", 10)],
    status: "Отменён"
  }),
  createBuyerOrder({
    id: "LB-4964",
    date: "2026-05-02",
    brandId: "brand-nord",
    brand: "Nord Line",
    brandContact: "Алексей Ветров",
    brandEmail: "orders@nord.example",
    items: [createBuyerCartItem("WS-NRD-002", 18)],
    status: "Выполнен"
  })
];
