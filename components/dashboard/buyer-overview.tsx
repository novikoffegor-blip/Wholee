"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Boxes,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  Store
} from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { demoBuyerCompany as buyerCompany } from "@/lib/demo-companies";
import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";
import { formatPrice, getProductUnit } from "@/lib/utils";

const shoeCategories = new Set(["Кроссовки", "Лоферы", "Ботинки", "Туфли"]);
const shoeBudget = 1_000_000;

const notifications = [
  {
    title: "Заказ LB-5008 уже в пути",
    description: "12 пар Court Line и сопутствующая капсула прибудут через 3 дня.",
    href: "/dashboard/buyer/orders",
    label: "Проверить заказ"
  },
  {
    title: "В корзине есть готовый размерный ряд",
    description: "Лоферы Studio Black можно отправить поставщику без изменений.",
    href: "/dashboard/buyer/cart",
    label: "Открыть корзину"
  },
  {
    title: "Новые модели в обувной матрице",
    description: "В каталоге появились демисезонные лоферы и ботинки.",
    href: "/dashboard/buyer/catalog",
    label: "Смотреть новинки"
  }
];

const quickActions = [
  {
    title: "Собрать обувную закупку",
    description: "Подобрать модели под бюджет и размерную сетку.",
    href: "/dashboard/buyer/catalog",
    icon: Boxes
  },
  {
    title: "Проверить корзину",
    description: "Сверить MOQ, пары и потенциальную маржу.",
    href: "/dashboard/buyer/cart",
    icon: ShoppingCart
  },
  {
    title: "Отследить поставки",
    description: "Посмотреть статусы активных заказов.",
    href: "/dashboard/buyer/orders",
    icon: PackageCheck
  }
];

export function BuyerOverview() {
  const cart = useServerCommerceStore((state) => state.cart);
  const orders = useServerCommerceStore((state) => state.orders);
  const activeOrderList = orders.filter((order) => ["Новый", "В обработке", "Отправлен"].includes(order.status));
  const activeShoeItems = activeOrderList.flatMap((order) =>
    order.items.filter((item) => shoeCategories.has(item.product.category))
  );
  const activeShoeSpend = activeShoeItems.reduce(
    (total, item) => total + item.product.wholesalePrice * item.quantity,
    0
  );
  const activePairs = activeShoeItems.reduce((total, item) => total + item.quantity, 0);
  const cartMargin = cart.reduce(
    (total, item) => total + (item.product.retailPrice - item.product.wholesalePrice) * item.quantity,
    0
  );
  const cartPairs = cart
    .filter((item) => shoeCategories.has(item.product.category))
    .reduce((total, item) => total + item.quantity, 0);
  const shoeBudgetProgress = Math.min(Math.round((activeShoeSpend / shoeBudget) * 100), 100);
  const remainingShoeBudget = Math.max(shoeBudget - activeShoeSpend, 0);

  const metrics = [
    {
      label: "Свободный обувной бюджет",
      value: formatPrice(remainingShoeBudget),
      detail: `${formatPrice(activeShoeSpend)} уже в активных заказах`
    },
    {
      label: "Активные заказы",
      value: activeOrderList.length.toString(),
      detail: `${activeOrderList.filter((order) => order.status === "Отправлен").length} поставка уже в пути`
    },
    {
      label: "Пары / размерные ряды",
      value: `${activePairs} / ${activeShoeItems.length}`,
      detail: "в активной обувной закупке"
    },
    {
      label: "Потенциальная маржа",
      value: formatPrice(cartMargin),
      detail: `по текущей корзине, включая ${cartPairs} пар`
    }
  ];

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-7 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Обзор закупок</p>
            <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">
              Добро пожаловать, {buyerCompany.companyName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Фокус закупки — обувь: контролируйте бюджет, размерные ряды и ожидаемую маржу до отправки заказа.
            </p>
          </div>
          <Link
            href="/dashboard/buyer/catalog"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <Store className="h-4 w-4" />
            Перейти к закупке
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

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
          <div className="border border-border bg-surface p-5 md:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Бюджет закупки</p>
                <h2 className="mt-3 text-2xl font-medium">Обувная матрица: 85% фокуса</h2>
              </div>
              <p className="text-sm font-medium">{shoeBudgetProgress}% освоено</p>
            </div>

            <div className="mt-7 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full bg-foreground" style={{ width: `${shoeBudgetProgress}%` }} />
            </div>
            <div className="mt-3 flex justify-between gap-4 text-xs text-muted">
              <span>{formatPrice(activeShoeSpend)} в работе</span>
              <span>{formatPrice(shoeBudget)} план</span>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="border-l-4 border-foreground pl-4">
                <p className="text-2xl font-medium">85%</p>
                <p className="mt-1 text-sm text-muted">обувь и размерные ряды</p>
              </div>
              <div className="border-l-4 border-border pl-4">
                <p className="text-2xl font-medium">15%</p>
                <p className="mt-1 text-sm text-muted">сумки и аксессуары для допродажи</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-border pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted">
                Резерв позволяет добавить около <span className="font-medium text-foreground">84 пар</span> в среднем чеке текущей матрицы.
              </p>
              <Link
                href="/dashboard/buyer/catalog"
                className="inline-flex shrink-0 items-center gap-2 font-medium hover:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
              >
                Добрать модели
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="border border-border bg-surface p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Центр внимания</p>
                <h2 className="mt-3 text-2xl font-medium">Уведомления</h2>
              </div>
              <Bell className="h-5 w-5 text-muted" />
            </div>
            <div className="mt-6 divide-y divide-border">
              {notifications.map((notification) => (
                <Link
                  key={notification.title}
                  href={notification.href}
                  className="group block py-4 first:pt-0 last:pb-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted">{notification.description}</p>
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-2 text-xs font-medium">{notification.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="border-b border-border pb-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Быстрые действия</p>
            <h2 className="mt-3 text-2xl font-medium">Продолжить работу</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex min-h-36 flex-col justify-between border border-border bg-surface p-5 transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-5 w-5" />
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-6">
                    <p className="font-medium">{action.title}</p>
                    <p className="mt-2 text-sm leading-5 text-muted">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Закупки</p>
              <h2 className="mt-3 text-2xl font-medium">Последние заказы</h2>
            </div>
            <Link
              href="/dashboard/buyer/orders"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <ReceiptText className="h-4 w-4" />
              Все заказы
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
                  <th className="py-4 font-medium">№ заказа</th>
                  <th className="py-4 font-medium">Бренд</th>
                  <th className="py-4 font-medium">Пары / позиции</th>
                  <th className="py-4 font-medium">Сумма</th>
                  <th className="py-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order) => {
                  const pairs = order.items
                    .filter((item) => getProductUnit(item.product) === "пар")
                    .reduce((total, item) => total + item.quantity, 0);

                  return (
                    <tr key={order.id} className="border-b border-border">
                      <td className="py-5 font-medium">{order.id}</td>
                      <td className="py-5 text-muted">{order.brand}</td>
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
