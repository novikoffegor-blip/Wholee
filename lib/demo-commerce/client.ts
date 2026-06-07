"use client";

import type {
  BrandCommerceAction,
  BrandCommerceResponse,
  BuyerCommerceResponse,
  DemoCommerceAction,
  DemoCommerceGetResponse,
  DemoCommercePostResponse
} from "@/lib/demo-commerce/types";

export type DemoCommerceCatalogProduct = BuyerCommerceResponse["catalog"][number];
export type DemoCommerceCartItem = BuyerCommerceResponse["cart"][number];
export type DemoCommerceBuyerOrder = BuyerCommerceResponse["orders"][number];
export type DemoCommerceBrandProduct = BrandCommerceResponse["brandProducts"][number];
export type DemoCommerceBrandOrder = BrandCommerceResponse["brandOrders"][number];
export type DemoCommerceOrderStatus = BrandCommerceAction["status"];
export type DemoCommerceSnapshot = DemoCommerceGetResponse;
export type DemoCommerceResponse = DemoCommercePostResponse;

const DEMO_COMMERCE_ENDPOINT = "/api/demo-commerce";

function getErrorMessage(payload: unknown, response: Response) {
  if (payload && typeof payload === "object") {
    const error = "error" in payload ? payload.error : undefined;
    const message = "message" in payload ? payload.message : undefined;

    if (typeof error === "string" && error) {
      return error;
    }

    if (typeof message === "string" && message) {
      return message;
    }
  }

  return `Не удалось обновить данные (${response.status})`;
}

async function readResponse(response: Response) {
  const payload = (await response.json().catch(() => null)) as DemoCommerceResponse | null;

  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, response));
  }

  return payload;
}

export async function getDemoCommerceSnapshot() {
  return readResponse(
    await fetch(DEMO_COMMERCE_ENDPOINT, {
      cache: "no-store",
      credentials: "same-origin"
    })
  );
}

export async function mutateDemoCommerce(action: DemoCommerceAction) {
  return readResponse(
    await fetch(DEMO_COMMERCE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(action),
      cache: "no-store",
      credentials: "same-origin"
    })
  );
}

export function addDemoCommerceCartItem(productId: string) {
  return mutateDemoCommerce({ action: "addToCart", productId });
}

export function updateDemoCommerceCartItem(productId: string, quantity: number) {
  return mutateDemoCommerce({ action: "updateQuantity", productId, quantity });
}

export function removeDemoCommerceCartItem(productId: string) {
  return mutateDemoCommerce({ action: "removeFromCart", productId });
}

export function toggleDemoCommerceFavorite(productId: string) {
  return mutateDemoCommerce({ action: "toggleFavorite", productId });
}

export function checkoutDemoCommerceCart() {
  return mutateDemoCommerce({ action: "checkout" });
}

export function updateDemoCommerceOrderStatus(
  orderId: string,
  status: DemoCommerceOrderStatus
) {
  return mutateDemoCommerce({ action: "updateStatus", orderId, status });
}
