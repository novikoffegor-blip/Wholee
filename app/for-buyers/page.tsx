"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, PackageSearch, ReceiptText, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createDemoSession } from "@/lib/auth/client";

const benefits = [
  {
    title: "Каталог брендов",
    description: "Ищите товары по категории, бренду и оптовой цене, собирая закупку из актуальных коллекций.",
    icon: PackageSearch
  },
  {
    title: "Корзина с MOQ",
    description: "Добавляйте позиции партиями: количество автоматически учитывает минимальный объём заказа.",
    icon: ShoppingCart
  },
  {
    title: "Мои заказы",
    description: "Следите за статусами поставок, составом заказа, суммами и данными поставщика.",
    icon: ReceiptText
  },
  {
    title: "Профиль компании",
    description: "Храните данные магазина, шоурума или маркетплейса для будущего оформления заказов.",
    icon: Building2
  }
];

const stats = [
  { value: "10+", label: "демо-товаров" },
  { value: "3", label: "позиции в корзине" },
  { value: "8", label: "история заказов" }
];

export default function ForBuyersPage() {
  const router = useRouter();
  const [isOpeningDemo, setIsOpeningDemo] = useState(false);
  const [demoError, setDemoError] = useState("");

  async function openDemo() {
    setIsOpeningDemo(true);
    setDemoError("");

    try {
      await createDemoSession("buyer");
      router.push("/dashboard/buyer");
      router.refresh();
    } catch {
      setDemoError("Не удалось открыть демо-кабинет. Попробуйте ещё раз.");
      setIsOpeningDemo(false);
    }
  }

  return (
    <main>
      <section className="border-b border-border py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Байерам</p>
            <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-normal md:text-7xl">
              Закупайте обувь, сумки и аксессуары оптом
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Wholee Store даёт байерам единый кабинет для поиска брендов, сравнения оптовых условий,
              сборки корзины и контроля B2B-заказов.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={openDemo} disabled={isOpeningDemo}>
                Открыть демо-кабинет
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/catalog">Смотреть каталог</Link>
              </Button>
            </div>
            {demoError ? <p className="mt-4 text-sm text-red-600">{demoError}</p> : null}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-12">
        <div className="container grid gap-5 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="border-l border-border pl-6">
              <p className="text-4xl font-medium tracking-normal">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container grid gap-5 md:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="border-t border-border pt-6">
                <Icon className="h-6 w-6" />
                <h2 className="mt-6 text-xl font-medium">{item.title}</h2>
                <p className="mt-4 leading-7 text-muted">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
