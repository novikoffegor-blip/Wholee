import Link from "next/link";
import { BarChart3, Boxes, PackageCheck, Store } from "lucide-react";

import { PricingPlans } from "@/components/pricing/pricing-plans";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    title: "Коллекции и товары",
    description: "Размещайте ассортимент, оптовые цены, MOQ, остатки и сезонность в единой витрине.",
    icon: Boxes
  },
  {
    title: "Оптовые заказы",
    description: "Получайте заявки от байеров, смотрите состав заказа и управляйте статусами поставки.",
    icon: PackageCheck
  },
  {
    title: "Профиль бренда",
    description: "Показывайте компанию, категории, контакты и описание бренда для профессиональных закупщиков.",
    icon: Store
  },
  {
    title: "Аналитика",
    description: "Следите за товарами, активными заказами, новыми заявками и оборотом за период.",
    icon: BarChart3
  }
];

const steps = ["Зарегистрируйте компанию", "Добавьте товары и MOQ", "Получайте заказы от байеров"];

export default function ForBrandsPage() {
  return (
    <main>
      <section className="border-b border-border py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Поставщикам</p>
            <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-normal md:text-7xl">
              Кабинет для брендов и оптовых поставщиков
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Wholee Store помогает брендам обуви, сумок и аксессуаров показывать коллекции, принимать B2B-заказы
              и работать с байерами в одном чистом интерфейсе.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard/brand">Открыть демо-кабинет</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Зарегистрироваться</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-20">
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

      <section id="pricing" className="scroll-mt-28 border-b border-border py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Подписка для поставщиков</p>
            <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">Тарифы для брендов</h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Для байеров платформа бесплатна. Бренды выбирают план под свой объём продаж.
            </p>
          </div>
          <PricingPlans />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Как это работает</p>
            <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">
              От витрины до первого заказа
            </h2>
          </div>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={step} className="grid grid-cols-[48px_1fr] items-center border border-border p-5">
                <span className="text-sm text-muted">0{index + 1}</span>
                <p className="text-lg font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
