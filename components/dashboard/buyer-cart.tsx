"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useBuyerStore } from "@/lib/stores/buyer-store";
import { formatPrice } from "@/lib/utils";

export function BuyerCart() {
  const cart = useBuyerStore((state) => state.cart);
  const updateQuantity = useBuyerStore((state) => state.updateQuantity);
  const removeFromCart = useBuyerStore((state) => state.removeFromCart);
  const checkout = useBuyerStore((state) => state.checkout);
  const [message, setMessage] = useState("");
  const total = cart.reduce((sum, item) => sum + item.product.wholesalePrice * item.quantity, 0);

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-6xl">
        <div className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Закупка</p>
          <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">Корзина</h1>
        </div>

        {message ? <p className="mt-6 border border-border px-4 py-3 text-sm">{message}</p> : null}

        {cart.length === 0 ? (
          <div className="mt-10 border border-border p-8">
            <p className="text-lg font-medium">Корзина пуста</p>
            <p className="mt-3 text-muted">Добавьте товары из каталога, чтобы собрать оптовый заказ.</p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/buyer/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cart.map((item) => {
                const lineTotal = item.product.wholesalePrice * item.quantity;

                return (
                  <article key={item.product.id} className="border border-border p-4">
                    <div className="grid gap-4 md:grid-cols-[72px_1fr_160px_120px_44px] md:items-center">
                      <div className="relative h-20 w-16 overflow-hidden rounded-xl bg-surface">
                        <Image src={item.product.images[0]} alt={item.product.name} fill sizes="72px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="mt-1 text-sm text-muted">{item.product.brandName}</p>
                        <p className="mt-2 text-sm text-muted">Мин. партия: {item.product.moq} шт.</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Цена за ед.</p>
                        <p className="mt-1 font-medium">{formatPrice(item.product.wholesalePrice)}</p>
                      </div>
                      <label>
                        <span className="text-sm text-muted">Количество</span>
                        <input
                          type="number"
                          min={item.product.moq}
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                          className="mt-2 h-10 w-full border border-border px-3 text-sm focus:border-foreground focus:outline-none"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="inline-flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                        aria-label={`Удалить ${item.product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
                      <span>Сумма позиции</span>
                      <span>{formatPrice(lineTotal)}</span>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit border border-border p-6">
              <p className="text-sm text-muted">Итого по корзине</p>
              <p className="mt-4 text-3xl font-medium">{formatPrice(total)}</p>
              <p className="mt-4 text-sm leading-6 text-muted">Заказ сформирован партиями с учётом MOQ каждого товара.</p>
              <Button
                className="mt-6 w-full"
                type="button"
                onClick={() => {
                  const order = checkout();
                  setMessage(order ? `Заказ ${order.id} создан. Корзина очищена.` : "Корзина пуста.");
                }}
              >
                Оформить заказ
              </Button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
