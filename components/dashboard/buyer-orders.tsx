"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import type { DemoCommerceBuyerOrder } from "@/lib/demo-commerce/client";
import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";
import { formatPrice, getProductUnit } from "@/lib/utils";

export function BuyerOrders() {
  const orders = useServerCommerceStore((state) => state.orders);
  const [openOrderId, setOpenOrderId] = useState<string | null>(orders[0]?.id ?? null);

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-7xl">
        <div className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">История закупок</p>
          <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">Мои заказы</h1>
        </div>

        <div className="mt-8 grid gap-4 md:hidden">
          {orders.map((order) => {
            const isOpen = openOrderId === order.id;

            return (
              <article key={order.id} className="border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="mt-1 text-sm text-muted">
                      {new Intl.DateTimeFormat("ru-RU").format(new Date(order.date))}
                    </p>
                  </div>
                  <StatusBadge>{order.status}</StatusBadge>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="font-medium">{order.brand}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted">Позиции</dt>
                      <dd className="mt-1">{order.items.length}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Сумма</dt>
                      <dd className="mt-1 font-medium">{formatPrice(order.total)}</dd>
                    </div>
                  </dl>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 border border-border px-3 text-sm font-medium transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                >
                  {isOpen ? "Скрыть детали" : "Открыть детали"}
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isOpen ? (
                  <OrderDetails
                    brand={order.brand}
                    brandContact={order.brandContact}
                    brandEmail={order.brandEmail}
                    items={order.items}
                    total={order.total}
                  />
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-8 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
                <th className="py-4 font-medium">№ заказа</th>
                <th className="py-4 font-medium">Дата</th>
                <th className="py-4 font-medium">Бренд</th>
                <th className="py-4 font-medium">Позиции</th>
                <th className="py-4 font-medium">Сумма</th>
                <th className="py-4 font-medium">Статус</th>
                <th className="py-4 text-right font-medium">Детали</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isOpen = openOrderId === order.id;

                return (
                  <Fragment key={order.id}>
                    <tr className="border-b border-border align-middle">
                      <td className="py-5 font-medium">{order.id}</td>
                      <td className="py-5 text-muted">{new Intl.DateTimeFormat("ru-RU").format(new Date(order.date))}</td>
                      <td className="py-5">{order.brand}</td>
                      <td className="py-5 text-muted">{order.items.length} позиции</td>
                      <td className="py-5">{formatPrice(order.total)}</td>
                      <td className="py-5">
                        <StatusBadge>{order.status}</StatusBadge>
                      </td>
                      <td className="py-5 text-right">
                        <button
                          type="button"
                          onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                          className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-medium transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                        >
                          {isOpen ? "Скрыть" : "Открыть"}
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr className="border-b border-border bg-surface">
                        <td colSpan={7} className="p-6">
                          <OrderDetails
                            brand={order.brand}
                            brandContact={order.brandContact}
                            brandEmail={order.brandEmail}
                            items={order.items}
                            total={order.total}
                          />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

interface OrderDetailsProps {
  brand: string;
  brandContact: string;
  brandEmail: string;
  items: DemoCommerceBuyerOrder["items"];
  total: number;
}

function OrderDetails({ brand, brandContact, brandEmail, items, total }: OrderDetailsProps) {
  return (
    <div className="mt-5 grid gap-6 md:mt-0 md:grid-cols-[1fr_280px]">
      <div>
        <p className="text-sm font-medium">Состав заказа</p>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.quantity}`} className="grid gap-2 border-b border-border pb-3 text-sm md:grid-cols-[1fr_auto_auto] md:gap-4">
              <span>{item.product.name}</span>
              <span className="text-muted">{item.quantity} {getProductUnit(item.product)}</span>
              <span className="font-medium">{formatPrice(item.product.wholesalePrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between text-base font-medium">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <div className="border border-border bg-surface p-5">
        <p className="text-sm font-medium">Данные поставщика</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-muted">Бренд</dt>
            <dd className="mt-1">{brand}</dd>
          </div>
          <div>
            <dt className="text-muted">Контакт</dt>
            <dd className="mt-1">{brandContact}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="mt-1">{brandEmail}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
