"use client";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { buyerCompany } from "@/lib/mock";
import { useBuyerStore } from "@/lib/stores/buyer-store";
import { formatPrice } from "@/lib/utils";

export function BuyerOverview() {
  const cart = useBuyerStore((state) => state.cart);
  const orders = useBuyerStore((state) => state.orders);
  const activeOrders = orders.filter((order) => ["Новый", "В обработке", "Отправлен"].includes(order.status)).length;

  const metrics = [
    { label: "Активных заказов", value: activeOrders.toString() },
    { label: "Всего заказов", value: orders.length.toString() },
    { label: "Позиций в корзине", value: cart.length.toString() },
    { label: "Потрачено за месяц", value: "320 000 ₽" }
  ];

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-6xl">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Обзор</p>
        <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">
          Добро пожаловать, {buyerCompany.companyName}
        </h1>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="border border-border p-6">
              <p className="text-sm text-muted">{metric.label}</p>
              <p className="mt-5 text-3xl font-medium tracking-normal">{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="border-b border-border pb-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Закупки</p>
            <h2 className="mt-3 text-2xl font-medium">Последние заказы</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
                  <th className="py-4 font-medium">№ заказа</th>
                  <th className="py-4 font-medium">Бренд</th>
                  <th className="py-4 font-medium">Сумма</th>
                  <th className="py-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="border-b border-border">
                    <td className="py-5 font-medium">{order.id}</td>
                    <td className="py-5 text-muted">{order.brand}</td>
                    <td className="py-5">{formatPrice(order.total)}</td>
                    <td className="py-5">
                      <StatusBadge>{order.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
