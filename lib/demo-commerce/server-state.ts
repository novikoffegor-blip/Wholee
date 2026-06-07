import "server-only";

import { brands } from "@/lib/mock/brands";
import {
  brandOrders as initialBrandOrders,
  brandProducts as initialBrandProducts,
  type BrandDashboardProduct,
  type BrandOrder,
  type BrandOrderStatus
} from "@/lib/mock/dashboard/brand-dashboard";
import {
  buyerCompany,
  initialBuyerCart,
  initialBuyerOrders,
  type BuyerCartItem,
  type BuyerCatalogProduct,
  type BuyerOrder
} from "@/lib/mock/dashboard/buyer-dashboard";
import { products } from "@/lib/mock/products";

import type {
  BrandCommerceAction,
  BrandCommerceResponse,
  BuyerCommerceAction,
  BuyerCommerceResponse,
  DemoCommerceResult,
  GuestCatalogProduct,
  GuestCommerceResponse
} from "./types";

const AURORA_BRAND_ID = "brand-aurora";

type DemoCommerceState = {
  catalog: BuyerCatalogProduct[];
  cart: BuyerCartItem[];
  buyerOrders: BuyerOrder[];
  favoriteProductIds: string[];
  brandProducts: BrandDashboardProduct[];
  brandOrderHistory: BrandOrder[];
  nextOrderNumber: number;
};

const globalDemoCommerce = globalThis as typeof globalThis & {
  __wholeeDemoCommerceServerStateV3?: DemoCommerceState;
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function createCatalog(): BuyerCatalogProduct[] {
  return products.map((product) => ({
    ...clone(product),
    description: "Оптовая позиция для байерского каталога."
  }));
}

function getCatalogProductBySku(catalog: BuyerCatalogProduct[], sku: string) {
  const product = catalog.find((catalogProduct) => catalogProduct.sku === sku);

  if (!product) {
    throw new Error(`Demo commerce catalog product ${sku} is missing`);
  }

  return product;
}

function bindCartItemsToCatalog(catalog: BuyerCatalogProduct[], items: BuyerCartItem[]) {
  return items.map((item) => ({
    product: getCatalogProductBySku(catalog, item.product.sku),
    quantity: item.quantity
  }));
}

function bindOrdersToCatalog(catalog: BuyerCatalogProduct[], orders: BuyerOrder[]) {
  return orders.map((order) => {
    const items = bindCartItemsToCatalog(catalog, order.items);

    return {
      ...clone(order),
      items,
      total: getCartTotal(items)
    };
  });
}

function bindBrandProductsToCatalog(catalog: BuyerCatalogProduct[]) {
  return initialBrandProducts.map((brandProduct) => ({
    ...clone(brandProduct),
    stock: getCatalogProductBySku(catalog, brandProduct.sku).stock
  }));
}

function createInitialState(): DemoCommerceState {
  const catalog = createCatalog();

  return {
    catalog,
    cart: bindCartItemsToCatalog(catalog, initialBuyerCart),
    buyerOrders: bindOrdersToCatalog(catalog, initialBuyerOrders),
    favoriteProductIds: ["product-002", "product-005", "product-014"],
    brandProducts: bindBrandProductsToCatalog(catalog),
    brandOrderHistory: clone(initialBrandOrders),
    nextOrderNumber: 6001
  };
}

const state = (globalDemoCommerce.__wholeeDemoCommerceServerStateV3 ??= createInitialState());

function error(errorMessage: string, details?: Record<string, unknown>): DemoCommerceResult {
  return { ok: false, error: errorMessage, details };
}

function success(message: string, createdOrders?: BuyerOrder[]): DemoCommerceResult {
  return {
    ok: true,
    message,
    ...(createdOrders ? { createdOrders: clone(createdOrders) } : {})
  };
}

function isValidQuantity(product: BuyerCatalogProduct, quantity: number) {
  return (
    Number.isInteger(quantity) &&
    quantity >= product.moq &&
    quantity <= product.stock &&
    (quantity - product.moq) % product.orderStep === 0
  );
}

function quantityError(product: BuyerCatalogProduct, quantity: number) {
  return error("Недопустимое количество товара", {
    productId: product.id,
    requestedQuantity: quantity,
    moq: product.moq,
    orderStep: product.orderStep,
    stock: product.stock,
    unit: product.unit
  });
}

function getCartTotal(items: BuyerCartItem[]) {
  return items.reduce((sum, item) => sum + item.product.wholesalePrice * item.quantity, 0);
}

function getSupplier(brandId: string) {
  const supplier = brands.find((brand) => brand.id === brandId);

  return {
    contact: supplier?.contact.manager ?? "Менеджер поставщика",
    email: supplier?.contact.email ?? "orders@wholee.example"
  };
}

function toBrandOrder(order: BuyerOrder): BrandOrder {
  return {
    id: order.id,
    date: order.date,
    buyer: buyerCompany.companyName,
    buyerContact: buyerCompany.contactName,
    buyerCity: buyerCompany.city,
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.wholesalePrice,
      unit: item.product.unit
    })),
    total: order.total,
    status: order.status
  };
}

function getAuroraOrders() {
  const sharedOrders = state.buyerOrders
    .filter((order) => order.brandId === AURORA_BRAND_ID)
    .map(toBrandOrder);
  const sharedOrderIds = new Set(sharedOrders.map((order) => order.id));

  return [...sharedOrders, ...state.brandOrderHistory.filter((order) => !sharedOrderIds.has(order.id))].sort(
    (firstOrder, secondOrder) =>
      new Date(secondOrder.date).getTime() - new Date(firstOrder.date).getTime()
  );
}

function stripPrices(product: BuyerCatalogProduct): GuestCatalogProduct {
  const { wholesalePrice: _wholesalePrice, retailPrice: _retailPrice, ...publicProduct } = product;
  return publicProduct;
}

export function getGuestCommerce(): GuestCommerceResponse {
  return {
    role: "guest",
    catalog: clone(state.catalog.map(stripPrices))
  };
}

export function getBuyerCommerce(): BuyerCommerceResponse {
  return {
    role: "buyer",
    catalog: clone(state.catalog),
    cart: clone(state.cart),
    orders: clone(state.buyerOrders),
    favoriteProductIds: clone(state.favoriteProductIds)
  };
}

export function getBrandCommerce(): BrandCommerceResponse {
  return {
    role: "brand",
    brandProducts: clone(state.brandProducts),
    brandOrders: clone(getAuroraOrders())
  };
}

function addToCart(action: Extract<BuyerCommerceAction, { action: "addToCart" }>) {
  const product = state.catalog.find((catalogProduct) => catalogProduct.id === action.productId);

  if (!product) {
    return error("Товар не найден", { productId: action.productId });
  }

  const existingItem = state.cart.find((item) => item.product.id === product.id);
  const quantity = existingItem ? existingItem.quantity + product.orderStep : product.moq;

  if (!isValidQuantity(product, quantity)) {
    return quantityError(product, quantity);
  }

  if (existingItem) {
    existingItem.quantity = quantity;
    existingItem.product = product;
  } else {
    state.cart.unshift({ product, quantity });
  }

  return success("Товар добавлен в корзину");
}

function updateCart(action: Extract<BuyerCommerceAction, { action: "updateQuantity" }>) {
  const item = state.cart.find((cartItem) => cartItem.product.id === action.productId);

  if (!item) {
    return error("Товар отсутствует в корзине", { productId: action.productId });
  }

  const product = state.catalog.find((catalogProduct) => catalogProduct.id === action.productId);
  if (!product) {
    return error("Товар больше не доступен в каталоге", { productId: action.productId });
  }

  if (!isValidQuantity(product, action.quantity)) {
    return quantityError(product, action.quantity);
  }

  item.quantity = action.quantity;
  item.product = product;

  return success("Количество обновлено");
}

function removeFromCart(action: Extract<BuyerCommerceAction, { action: "removeFromCart" }>) {
  const itemIndex = state.cart.findIndex((item) => item.product.id === action.productId);

  if (itemIndex === -1) {
    return error("Товар отсутствует в корзине", { productId: action.productId });
  }

  state.cart.splice(itemIndex, 1);
  return success("Товар удалён из корзины");
}

function toggleFavorite(action: Extract<BuyerCommerceAction, { action: "toggleFavorite" }>) {
  const product = state.catalog.find((catalogProduct) => catalogProduct.id === action.productId);

  if (!product) {
    return error("Товар не найден", { productId: action.productId });
  }

  const favoriteIndex = state.favoriteProductIds.indexOf(product.id);

  if (favoriteIndex >= 0) {
    state.favoriteProductIds.splice(favoriteIndex, 1);
    return success("Товар удалён из избранного");
  }

  state.favoriteProductIds.unshift(product.id);
  return success("Товар добавлен в избранное");
}

function checkout() {
  if (state.cart.length === 0) {
    return error("Корзина пуста");
  }

  for (const item of state.cart) {
    const product = state.catalog.find((catalogProduct) => catalogProduct.id === item.product.id);

    if (!product) {
      return error("Один из товаров больше не доступен", { productId: item.product.id });
    }

    if (!isValidQuantity(product, item.quantity)) {
      return quantityError(product, item.quantity);
    }
  }

  const itemsByBrand = new Map<string, BuyerCartItem[]>();
  for (const item of state.cart) {
    const product = state.catalog.find((catalogProduct) => catalogProduct.id === item.product.id)!;
    const brandItems = itemsByBrand.get(product.brandId) ?? [];
    brandItems.push({ product, quantity: item.quantity });
    itemsByBrand.set(product.brandId, brandItems);
  }

  const date = new Date().toISOString().slice(0, 10);
  const newOrders = Array.from(itemsByBrand.entries()).map(([brandId, items]): BuyerOrder => {
    const supplier = getSupplier(brandId);
    const order: BuyerOrder = {
      id: `LB-${state.nextOrderNumber++}`,
      date,
      brandId,
      brand: items[0].product.brandName,
      brandContact: supplier.contact,
      brandEmail: supplier.email,
      items,
      total: getCartTotal(items),
      status: "Новый"
    };

    return order;
  });

  for (const item of state.cart) {
    const product = state.catalog.find((catalogProduct) => catalogProduct.id === item.product.id)!;
    product.stock -= item.quantity;

    const brandProduct = state.brandProducts.find(
      (candidate) => candidate.brandId === product.brandId && candidate.sku === product.sku
    );
    if (brandProduct) {
      brandProduct.stock = product.stock;
    }
  }

  state.buyerOrders.unshift(...newOrders);
  state.cart = [];

  return success("Заказы созданы отдельно для каждого бренда", newOrders);
}

export function runBuyerAction(action: BuyerCommerceAction): DemoCommerceResult {
  switch (action.action) {
    case "addToCart":
      return addToCart(action);
    case "updateQuantity":
      return updateCart(action);
    case "removeFromCart":
      return removeFromCart(action);
    case "toggleFavorite":
      return toggleFavorite(action);
    case "checkout":
      return checkout();
  }
}

export function runBrandAction(action: BrandCommerceAction): DemoCommerceResult {
  const buyerOrder = state.buyerOrders.find(
    (order) => order.id === action.orderId && order.brandId === AURORA_BRAND_ID
  );

  if (buyerOrder) {
    buyerOrder.status = action.status;
    return success("Статус заказа обновлён");
  }

  const historyOrder = state.brandOrderHistory.find((order) => order.id === action.orderId);
  if (!historyOrder) {
    return error("Заказ Aurora Atelier не найден", { orderId: action.orderId });
  }

  historyOrder.status = action.status;
  return success("Статус заказа обновлён");
}

export const brandOrderStatuses: readonly BrandOrderStatus[] = [
  "Новый",
  "В обработке",
  "Отправлен",
  "Выполнен",
  "Отменён"
];
