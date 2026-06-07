"use client";

import { create } from "zustand";

import {
  addDemoCommerceCartItem,
  checkoutDemoCommerceCart,
  getDemoCommerceSnapshot,
  removeDemoCommerceCartItem,
  toggleDemoCommerceFavorite,
  updateDemoCommerceCartItem,
  updateDemoCommerceOrderStatus,
  type DemoCommerceBrandOrder,
  type DemoCommerceBrandProduct,
  type DemoCommerceBuyerOrder,
  type DemoCommerceCartItem,
  type DemoCommerceCatalogProduct,
  type DemoCommerceOrderStatus,
  type DemoCommerceResponse,
  type DemoCommerceSnapshot
} from "@/lib/demo-commerce/client";
import type { AuthRole } from "@/lib/auth/types";

interface ServerCommerceStore {
  role: AuthRole;
  catalog: DemoCommerceCatalogProduct[];
  cart: DemoCommerceCartItem[];
  orders: DemoCommerceBuyerOrder[];
  brandProducts: DemoCommerceBrandProduct[];
  brandOrders: DemoCommerceBrandOrder[];
  favoriteProductIds: string[];
  loading: boolean;
  error: string | null;
  hydrate: (snapshot?: DemoCommerceSnapshot) => Promise<DemoCommerceSnapshot>;
  refresh: () => Promise<DemoCommerceSnapshot>;
  add: (productId: string) => Promise<void>;
  update: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  checkout: () => Promise<DemoCommerceBuyerOrder[]>;
  updateStatus: (orderId: string, status: DemoCommerceOrderStatus) => Promise<void>;
}

const emptySnapshot = {
  role: "guest" as const,
  catalog: [],
  cart: [],
  orders: [],
  brandProducts: [],
  brandOrders: [],
  favoriteProductIds: []
};

function snapshotState(snapshot: DemoCommerceSnapshot) {
  return {
    role: snapshot.role,
    catalog: snapshot.role === "buyer" ? snapshot.catalog : [],
    cart: snapshot.role === "buyer" ? snapshot.cart : [],
    orders: snapshot.role === "buyer" ? snapshot.orders : [],
    brandProducts: snapshot.role === "brand" ? snapshot.brandProducts : [],
    brandOrders: snapshot.role === "brand" ? snapshot.brandOrders : [],
    favoriteProductIds: snapshot.role === "buyer" ? snapshot.favoriteProductIds : []
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Не удалось обновить данные";
}

let hydrateRequest: Promise<DemoCommerceSnapshot> | null = null;

export const useServerCommerceStore = create<ServerCommerceStore>((set) => {
  async function requestSnapshot(request: () => Promise<DemoCommerceResponse>) {
    set({ loading: true, error: null });

    try {
      const response = await request();
      set({ ...snapshotState(response), loading: false });
      return response;
    } catch (error) {
      set({ loading: false, error: errorMessage(error) });
      throw error;
    }
  }

  async function refresh() {
    return requestSnapshot(getDemoCommerceSnapshot);
  }

  return {
    ...emptySnapshot,
    loading: false,
    error: null,
    hydrate: async (snapshot) => {
      if (snapshot) {
        set({ ...snapshotState(snapshot), loading: false, error: null });
        return snapshot;
      }

      if (!hydrateRequest) {
        hydrateRequest = refresh().finally(() => {
          hydrateRequest = null;
        });
      }

      return hydrateRequest;
    },
    refresh,
    add: async (productId) => {
      await requestSnapshot(() => addDemoCommerceCartItem(productId));
    },
    update: async (productId, quantity) => {
      await requestSnapshot(() => updateDemoCommerceCartItem(productId, quantity));
    },
    remove: async (productId) => {
      await requestSnapshot(() => removeDemoCommerceCartItem(productId));
    },
    toggleFavorite: async (productId) => {
      await requestSnapshot(() => toggleDemoCommerceFavorite(productId));
    },
    checkout: async () => {
      const response = await requestSnapshot(checkoutDemoCommerceCart);
      return response.createdOrders ?? [];
    },
    updateStatus: async (orderId, status) => {
      await requestSnapshot(() => updateDemoCommerceOrderStatus(orderId, status));
    }
  };
});
