"use client";

import { create } from "zustand";

import {
  initialBuyerCart,
  initialBuyerOrders,
  type BuyerCartItem,
  type BuyerCatalogProduct,
  type BuyerOrder
} from "@/lib/mock/dashboard/buyer-dashboard";

interface BuyerStore {
  cart: BuyerCartItem[];
  orders: BuyerOrder[];
  addToCart: (product: BuyerCatalogProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  checkout: () => BuyerOrder | null;
}

function getCartTotal(cart: BuyerCartItem[]) {
  return cart.reduce((sum, item) => sum + item.product.wholesalePrice * item.quantity, 0);
}

export const useBuyerStore = create<BuyerStore>((set, get) => ({
  cart: initialBuyerCart,
  orders: initialBuyerOrders,
  addToCart: (product) =>
    set((state) => {
      const currentItem = state.cart.find((item) => item.product.id === product.id);

      if (currentItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + product.moq } : item
          )
        };
      }

      return {
        cart: [{ product, quantity: product.moq }, ...state.cart]
      };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(item.product.moq, quantity)
        };
      })
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId)
    })),
  checkout: () => {
    const cart = get().cart;

    if (cart.length === 0) {
      return null;
    }

    const firstBrand = cart[0].product.brandName;
    const newOrder: BuyerOrder = {
      id: `LB-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      brand: cart.every((item) => item.product.brandName === firstBrand) ? firstBrand : "Несколько брендов",
      brandContact: "Менеджер поставщика",
      brandEmail: "orders@wholee.example",
      items: cart,
      total: getCartTotal(cart),
      status: "Новый"
    };

    set((state) => ({
      cart: [],
      orders: [newOrder, ...state.orders]
    }));

    return newOrder;
  }
}));
