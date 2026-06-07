"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Package,
  ReceiptText,
  TrendingUp
} from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { demoBrandCompany as brandCompany } from "@/lib/demo-companies";
import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";
import { formatPrice } from "@/lib/utils";

const shoeCategories = new Set(["Кроссовки", "Лоферы", "Ботинки", "Туфли"]);

const todayTasks = [
  {
    title: "Подтвердить новый заказ LS-2401",
    description: "24 пары лоферов ждут подтверждения до 14:00.",
    href: "/dashboard/brand/orders",
    label: "Открыть заказ"
  },
  {
    title: "Пополнить остатки Court Line",
    description: "Ходовые размеры 37–39 приближаются к страховому запасу.",
    href: "/dashboard/brand/products",
    label: "Проверить товары"
  },
  {
    title: "Обновить условия для байеров",
    description: "Проверьте контакты и описание обувной специализации.",
    href: "/dashboard/brand/profile",
    label: "Открыть профиль"
  }
];

const topModels = [
  { name: "Кожаные лоферы Studio", category: "Лоферы", pairs: 96, revenue: 748_800, growth: "+18%" },
  { name: "Туфли Court Line", category: "Туфли", pairs: 72, revenue: 604_800, growth: "+12%" },
  { name: "Ботинки Chelsea Black", category: "Ботинки", pairs: 48, revenue: 441_600, growth: "+9%" }
];

const footwearFunnel = [
  { label: "Просмотры обувных моделей", value: 420, width: "100%" },
  { label: "Заявки от байеров", value: 38, width: "72%" },
  { label: "Согласованные размерные ряды", value: 17, width: "48%" },
  { label: "Новые заказы", value: 6, width: "30%" }
];

const quickActions = [
  { title: "Обработать заказы", href: "/dashboard/brand/orders", icon: ReceiptText },
  { title: "Управлять моделями", href: "/dashboard/brand/products", icon: Package },
  { title: "Обновить профиль", href: "/dashboard/brand/profile", icon: ClipboardList }
];

export default function BrandDashboardPage() {
  const orders = useServerCommerceStore((state) => state.brandOrders);
  const brandProducts = useServerCommerceStore((state) => state.brandProducts);
  const activeOrders = orders.filter((order) => ["Новый", "В обработке", "Отправлен"].includes(order.status));
  const revenue = orders
    .filter((order) => order.status !== "Отменён")
    .reduce((total, order) => total + order.total, 0);
  const soldPairs = orders
    .filter((order) => order.status !== "Отменён")
    .flatMap((order) => order.items)
    .filter((item) => item.unit === "пар")
    .reduce((total, item) => total + item.quantity, 0);
  const newOrders = orders.filter((order) => order.status === "Новый").length;
  const lowStockShoes = brandProducts
    .filter((product) => shoeCategories.has(product.category) && product.stock <= 60)
    .sort((firstProduct, secondProduct) => firstProduct.stock - secondProduct.stock);

  const metrics = [
    { label: "Выручка за период", value: formatPrice(revenue), detail: "по всем заказам, кроме отменённых" },
    { label: "Продано обуви", value: `${soldPairs} пар`, detail: "в заказах текущего периода" },
    { label: "Новые заказы", value: newOrders.toString(), detail: `${activeOrders.length} заказа требуют контроля` },
    { label: "Новые заявки", value: "7", detail: "5 заявок относятся к обуви" }
  ];

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-7 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Обзор продаж</p>
            <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">
              Добро пожаловать, {brandCompany.brandName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Обувь формирует 85% коммерческого фокуса: держите в поле зрения новые заказы, ходовые размеры и остатки моделей.
            </p>
          </div>
          <Link
            href="/dashboard/brand/orders"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <ReceiptText className="h-4 w-4" />
            Обработать заказы
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="border border-border bg-surface p-5">
              <p className="text-sm text-muted">{metric.label}</p>
              <p className="mt-5 text-2xl font-medium tracking-normal md:text-3xl">{metric.value}</p>
              <p className="mt-3 text-xs leading-5 text-muted">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
          <div className="border border-border bg-surface p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Приоритеты</p>
                <h2 className="mt-3 text-2xl font-medium">Задачи на сегодня</h2>
              </div>
              <CheckCircle2 className="h-5 w-5 text-muted" />
            </div>
            <div className="mt-6 divide-y divide-border">
              {todayTasks.map((task, index) => (
                <Link
                  key={task.title}
                  href={task.href}
                  className="group grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[32px_1fr_auto] sm:items-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-medium">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{task.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">{task.description}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-medium">
                    {task.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-border bg-surface p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Конверсия</p>
                <h2 className="mt-3 text-2xl font-medium">Обувная воронка</h2>
              </div>
              <TrendingUp className="h-5 w-5 text-muted" />
            </div>
            <div className="mt-6 space-y-5">
              {footwearFunnel.map((stage) => (
                <div key={stage.label}>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-muted">{stage.label}</span>
                    <span className="font-medium">{stage.value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-full bg-foreground" style={{ width: stage.width }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-muted">
              85% новых заявок приходит на обувь, ещё 15% — на сумки и аксессуары для дополнения заказа.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
          <div>
            <div className="flex items-end justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Лидеры продаж</p>
                <h2 className="mt-3 text-2xl font-medium">Топ моделей</h2>
              </div>
              <Link
                href="/dashboard/brand/products"
                className="hidden items-center gap-2 text-sm font-medium hover:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground sm:inline-flex"
              >
                Все модели
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {topModels.map((model, index) => (
                <div key={model.name} className="grid gap-3 py-5 sm:grid-cols-[32px_1fr_auto_auto] sm:items-center sm:gap-5">
                  <span className="text-sm text-muted">0{index + 1}</span>
                  <div>
                    <p className="font-medium">{model.name}</p>
                    <p className="mt-1 text-xs text-muted">{model.category}</p>
                  </div>
                  <div className="text-sm sm:text-right">
                    <p className="font-medium">{model.pairs} пар</p>
                    <p className="mt-1 text-xs text-muted">{model.growth} к прошлому периоду</p>
                  </div>
                  <p className="text-sm font-medium sm:text-right">{formatPrice(model.revenue)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-surface p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Склад</p>
                <h2 className="mt-3 text-2xl font-medium">Низкие остатки</h2>
              </div>
              <AlertTriangle className="h-5 w-5 text-muted" />
            </div>
            <div className="mt-6 divide-y divide-border">
              {lowStockShoes.map((product) => (
                <Link
                  key={product.id}
                  href="/dashboard/brand/products"
                  className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="mt-1 text-xs text-muted">{product.sizeRange} · {product.sku}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium">{product.stock} пар</p>
                    <p className="mt-1 text-xs text-muted">пополнить</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="border-b border-border pb-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Быстрые действия</p>
            <h2 className="mt-3 text-2xl font-medium">Управление продажами</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex min-h-24 items-center justify-between gap-4 border border-border bg-surface p-5 transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                >
                  <span className="flex items-center gap-3 font-medium">
                    <Icon className="h-5 w-5" />
                    {action.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Заказы</p>
              <h2 className="mt-3 text-2xl font-medium">Последние заказы</h2>
            </div>
            <Link
              href="/dashboard/brand/orders"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <Boxes className="h-4 w-4" />
              Все заказы
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
                  <th className="py-4 font-medium">№ заказа</th>
                  <th className="py-4 font-medium">Байер</th>
                  <th className="py-4 font-medium">Обувь / позиции</th>
                  <th className="py-4 font-medium">Сумма</th>
                  <th className="py-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order) => {
                  const pairs = order.items
                    .filter((item) => /лофер|туфл|ботин|кроссов|сапог/i.test(item.name))
                    .reduce((total, item) => total + item.quantity, 0);

                  return (
                    <tr key={order.id} className="border-b border-border">
                      <td className="py-5 font-medium">{order.id}</td>
                      <td className="py-5 text-muted">{order.buyer}</td>
                      <td className="py-5">
                        {pairs} пар <span className="text-muted">/ {order.items.length} поз.</span>
                      </td>
                      <td className="py-5">{formatPrice(order.total)}</td>
                      <td className="py-5">
                        <StatusBadge>{order.status}</StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
