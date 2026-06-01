import { StatusBadge } from "@/components/dashboard/status-badge";
import { brandCompany, brandOrders } from "@/lib/mock";
import { formatPrice } from "@/lib/utils";

const metrics = [
  { label: "Всего товаров", value: "12" },
  { label: "Активных заказов", value: "3" },
  { label: "Новых заказов", value: "1" },
  { label: "Выручка за месяц", value: "450 000 ₽" }
];

export default function BrandDashboardPage() {
  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-6xl">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Обзор</p>
        <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">
          Добро пожаловать, {brandCompany.brandName}
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
          <div className="flex items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Заказы</p>
              <h2 className="mt-3 text-2xl font-medium">Последние заказы</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
                  <th className="py-4 font-medium">№ заказа</th>
                  <th className="py-4 font-medium">Байер</th>
                  <th className="py-4 font-medium">Сумма</th>
                  <th className="py-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {brandOrders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="border-b border-border">
                    <td className="py-5 font-medium">{order.id}</td>
                    <td className="py-5 text-muted">{order.buyer}</td>
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
