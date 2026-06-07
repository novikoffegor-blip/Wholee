import { NextResponse } from "next/server";

import { getServerSessionRole } from "@/lib/auth/server";
import {
  brandOrderStatuses,
  getBrandCommerce,
  getBuyerCommerce,
  getGuestCommerce,
  runBrandAction,
  runBuyerAction
} from "@/lib/demo-commerce/server-state";
import type {
  BrandCommerceAction,
  BuyerCommerceAction,
  DemoCommerceAction,
  DemoCommerceResult
} from "@/lib/demo-commerce/types";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store"
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStoreHeaders });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isBuyerAction(value: unknown): value is BuyerCommerceAction {
  if (!isRecord(value) || typeof value.action !== "string") {
    return false;
  }

  if (value.action === "checkout") {
    return true;
  }

  if (!isNonEmptyString(value.productId)) {
    return false;
  }

  if (value.action === "removeFromCart" || value.action === "toggleFavorite") {
    return true;
  }

  if (value.action === "addToCart") {
    return true;
  }

  return value.action === "updateQuantity" && typeof value.quantity === "number";
}

function isBrandAction(value: unknown): value is BrandCommerceAction {
  return (
    isRecord(value) &&
    value.action === "updateStatus" &&
    isNonEmptyString(value.orderId) &&
    typeof value.status === "string" &&
    brandOrderStatuses.includes(value.status as BrandCommerceAction["status"])
  );
}

function resultStatus(result: DemoCommerceResult) {
  if (result.ok) {
    return 200;
  }

  if (result.error.includes("не найден") || result.error.includes("отсутствует")) {
    return 404;
  }

  return 400;
}

export async function GET() {
  const role = await getServerSessionRole();

  if (role === "buyer") {
    return json(getBuyerCommerce());
  }

  if (role === "brand") {
    return json(getBrandCommerce());
  }

  return json(getGuestCommerce());
}

export async function POST(request: Request) {
  const role = await getServerSessionRole();
  const body = (await request.json().catch(() => null)) as DemoCommerceAction | null;

  if (!body) {
    return json({ ok: false, error: "Ожидается JSON с торговым действием" }, 400);
  }

  if (role === "guest") {
    return json({ ok: false, error: "Для торговых действий требуется вход" }, 401);
  }

  if (role === "buyer") {
    if (!isBuyerAction(body)) {
      return json(
        {
          ok: false,
          error:
            "Покупателю доступны действия addToCart, updateQuantity, removeFromCart, toggleFavorite и checkout"
        },
        403
      );
    }

    const result = runBuyerAction(body);
    if (!result.ok) {
      return json(result, resultStatus(result));
    }

    return json({
      ...getBuyerCommerce(),
      message: result.message,
      ...(result.createdOrders ? { createdOrders: result.createdOrders } : {})
    });
  }

  if (!isBrandAction(body)) {
    return json({ ok: false, error: "Бренду доступно только действие updateStatus" }, 403);
  }

  const result = runBrandAction(body);
  if (!result.ok) {
    return json(result, resultStatus(result));
  }

  return json({
    ...getBrandCommerce(),
    message: result.message
  });
}
