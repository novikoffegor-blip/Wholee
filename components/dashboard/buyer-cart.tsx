"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";
import { formatPrice, getProductUnit } from "@/lib/utils";

export function BuyerCart() {
  const cart = useServerCommerceStore((state) => state.cart);
  const updateQuantity = useServerCommerceStore((state) => state.update);
  const removeFromCart = useServerCommerceStore((state) => state.remove);
  const checkout = useServerCommerceStore((state) => state.checkout);
  const [message, setMessage] = useState("");
  const total = cart.reduce((sum, item) => sum + item.product.wholesalePrice * item.quantity, 0);
  const cartGroups = useMemo(() => {
    const groups = new Map<string, typeof cart>();

    cart.forEach((item) => {
      groups.set(item.product.brandId, [...(groups.get(item.product.brandId) ?? []), item]);
    });

    return Array.from(groups.values());
  }, [cart]);

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
            <div className="space-y-8">
              {cartGroups.map((brandItems) => {
                const brandName = brandItems[0].product.brandName;
                const brandTotal = brandItems.reduce(
                  (sum, item) => sum + item.product.wholesalePrice * item.quantity,
                  0
                );

                return (
                  <section key={brandItems[0].product.brandId}>
                    <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">Отдельный заказ</p>
                        <h2 className="mt-2 text-xl font-medium">{brandName}</h2>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(brandTotal)}</p>
                    </div>
                    <div className="mt-4 space-y-4">
                      {brandItems.map((item) => {
                        const lineTotal = item.product.wholesalePrice * item.quantity;
                        const unit = getProductUnit(item.product);

                        return (
                          <article key={item.product.id} className="border border-border p-4">
                            <div className="grid gap-4 md:grid-cols-[72px_1fr_160px_120px_44px] md:items-center">
                              <div className="relative h-20 w-16 overflow-hidden rounded-xl bg-surface">
                                <Image src={item.product.images[0]} alt={item.product.name} fill sizes="72px" className="object-cover" />
                              </div>
                              <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="mt-1 text-sm text-muted">{item.product.brandName}</p>
                                <p className="mt-2 text-sm leading-5 text-muted">
                                  MOQ {item.product.moq} {unit} · шаг {item.product.orderStep} · на складе {item.product.stock}
                                </p>
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
                                  max={item.product.stock}
                                  step={item.product.orderStep}
                                  value={item.quantity}
                                  onChange={(event) => {
                                    void updateQuantity(item.product.id, Number(event.target.value)).catch((error) => {
                                      setMessage(error instanceof Error ? error.message : "Не удалось изменить количество.");
                                    });
                                  }}
                                  className="mt-2 h-10 w-full border border-border px-3 text-sm focus:border-foreground focus:outline-none"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  void removeFromCart(item.product.id).catch((error) => {
                                    setMessage(error instanceof Error ? error.message : "Не удалось удалить товар.");
                                  });
                                }}
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
                  </section>
                );
              })}
            </div>

            <aside className="h-fit border border-border p-6">
              <p className="text-sm text-muted">Итого по корзине</p>
              <p className="mt-4 text-3xl font-medium">{formatPrice(total)}</p>
              <p className="mt-4 text-sm leading-6 text-muted">
                Будет создано заказов: {cartGroups.length}. Количество учитывает MOQ, остаток и шаг заказа.
              </p>
              <Button
                className="mt-6 w-full"
                type="button"
                onClick={async () => {
                  try {
                    const orders = await checkout();
                    setMessage(
                      orders.length
                        ? `Созданы заказы: ${orders.map((order) => `${order.id} — ${order.brand}`).join("; ")}.`
                        : "Корзина пуста."
                    );
                  } catch (error) {
                    setMessage(error instanceof Error ? error.message : "Не удалось оформить заказ.");
                  }
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
