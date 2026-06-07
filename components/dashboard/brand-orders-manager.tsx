"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { demoBrandCompany as brandCompany } from "@/lib/demo-companies";
import type { DemoCommerceOrderStatus } from "@/lib/demo-commerce/client";
import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";
import { formatPrice } from "@/lib/utils";

const statuses: DemoCommerceOrderStatus[] = ["Новый", "В обработке", "Отправлен", "Выполнен", "Отменён"];

export function BrandOrdersManager() {
  const orders = useServerCommerceStore((state) => state.brandOrders);
  const updateStatus = useServerCommerceStore((state) => state.updateStatus);
  const [openOrderId, setOpenOrderId] = useState<string | null>(orders[0]?.id ?? null);

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-7xl">
        <div className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Продажи</p>
          <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">
            Заказы {brandCompany.brandName}
          </h1>
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
                  <p className="font-medium">{order.buyer}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted">Товары</dt>
                      <dd className="mt-1">{order.items.length} позиции</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Сумма</dt>
                      <dd className="mt-1 font-medium">{formatPrice(order.total)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 grid gap-2">
                  <select
                    value={order.status}
                    onChange={(event) => {
                      void updateStatus(order.id, event.target.value as DemoCommerceOrderStatus);
                    }}
                    className="h-11 border border-border bg-surface px-3 text-sm focus:border-foreground focus:outline-none"
                    aria-label={`Изменить статус заказа ${order.id}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                    className="inline-flex h-11 items-center justify-center gap-2 border border-border px-3 text-sm font-medium transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                  >
                    {isOpen ? "Скрыть детали" : "Открыть детали"}
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isOpen ? (
                  <div className="mt-5 bg-surface p-4">
                    <p className="text-sm font-medium">Состав заказа</p>
                    <div className="mt-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.name}-mobile`} className="border-b border-border pb-3 text-sm">
                          <div className="flex justify-between gap-4">
                            <span>{item.name}</span>
                            <span className="text-muted">{item.quantity} {item.unit}</span>
                          </div>
                          <p className="mt-1 text-right font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between font-medium">
                      <span>Итого</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                    <div className="mt-5 border border-border bg-surface p-4 text-sm">
                      <p className="font-medium">Данные байера</p>
                      <p className="mt-3 text-muted">Контакт</p>
                      <p className="mt-1">{order.buyerContact}</p>
                      <p className="mt-3 text-muted">Город</p>
                      <p className="mt-1">{order.buyerCity}</p>
                    </div>
                  </div>
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
                <th className="py-4 font-medium">Байер</th>
                <th className="py-4 font-medium">Товары</th>
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
                      <td className="py-5">{order.buyer}</td>
                      <td className="py-5 text-muted">{order.items.length} позиции</td>
                      <td className="py-5">{formatPrice(order.total)}</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <StatusBadge>{order.status}</StatusBadge>
                          <select
                            value={order.status}
                            onChange={(event) => {
                              void updateStatus(order.id, event.target.value as DemoCommerceOrderStatus);
                            }}
                            className="h-9 border border-border bg-surface px-3 text-xs focus:border-foreground focus:outline-none"
                            aria-label={`Изменить статус заказа ${order.id}`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
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
                          <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                            <div>
                              <p className="text-sm font-medium">Состав заказа</p>
                              <div className="mt-4 space-y-3">
                                {order.items.map((item) => (
                                  <div
                                    key={`${order.id}-${item.name}`}
                                    className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border pb-3 text-sm"
                                  >
                                    <span>{item.name}</span>
                                    <span className="text-muted">{item.quantity} {item.unit}</span>
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-5 flex justify-between text-base font-medium">
                                <span>Итого</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                            <div className="border border-border bg-surface p-5">
                              <p className="text-sm font-medium">Данные байера</p>
                              <dl className="mt-4 space-y-3 text-sm">
                                <div>
                                  <dt className="text-muted">Компания</dt>
                                  <dd className="mt-1">{order.buyer}</dd>
                                </div>
                                <div>
                                  <dt className="text-muted">Контакт</dt>
                                  <dd className="mt-1">{order.buyerContact}</dd>
                                </div>
                                <div>
                                  <dt className="text-muted">Город</dt>
                                  <dd className="mt-1">{order.buyerCity}</dd>
                                </div>
                              </dl>
                            </div>
                          </div>
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
