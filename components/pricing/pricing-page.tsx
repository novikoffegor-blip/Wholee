"use client";

import Link from "next/link";
import { Check, Minus } from "lucide-react";

import { PricingPlans } from "@/components/pricing/pricing-plans";
import { Button } from "@/components/ui/button";

const comparison = [
  ["Товаров в каталоге", "10", "100", "Без лимита"],
  ["Комиссия с заказов", "5%", "3%", "0%"],
  ["Аналитика", "—", "Базовая", "Расширенная"],
  ["Поддержка", "Email", "Приоритетная", "Персональный менеджер"],
  ["Размещение в топе", "—", "—", "✓"],
  ["Профиль бренда", "✓", "✓", "✓"]
];

const faqs = [
  {
    question: "Платят ли байеры за использование платформы?",
    answer: "Нет, для байеров Wholee Store полностью бесплатна."
  },
  {
    question: "Чем выгодна годовая оплата?",
    answer: "При оплате за год вы получаете примерно 2 месяца бесплатно, экономия составляет около 17%."
  },
  {
    question: "Можно ли сменить тариф?",
    answer: "Да, тариф можно сменить в любой момент в кабинете бренда."
  },
  {
    question: "Что такое комиссия с заказов?",
    answer: "Это процент, удерживаемый с суммы оплаченного оптового заказа."
  },
  {
    question: "Есть ли пробный период?",
    answer: "Тариф «Старт» бесплатен без ограничения по времени."
  }
];

export function PricingPageContent() {
  return (
    <main>
      <section className="border-b border-border py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Подписка для поставщиков</p>
            <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-normal md:text-7xl">
              Тарифы для брендов
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Для байеров платформа бесплатна. Бренды выбирают план под свой объём продаж.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-14 md:py-20">
        <div className="container">
          <PricingPlans />
        </div>
      </section>

      <section className="border-b border-border py-14 md:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Сравнение</p>
            <h2 className="mt-4 text-3xl font-medium tracking-normal md:text-4xl">Что входит в тарифы</h2>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted">
                  <th className="py-4 font-medium">Возможность</th>
                  <th className="py-4 font-medium">Старт</th>
                  <th className="py-4 font-medium">Бизнес</th>
                  <th className="py-4 font-medium">Премиум</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row[0]} className="border-b border-border">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className="py-5">
                        {cell === "✓" ? <Check className="h-4 w-4" /> : cell === "—" ? <Minus className="h-4 w-4 text-muted" /> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-14 md:py-20">
        <div className="container grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">FAQ</p>
            <h2 className="mt-4 text-3xl font-medium tracking-normal md:text-4xl">Частые вопросы</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-border bg-surface p-5">
                <summary className="cursor-pointer list-none text-lg font-medium focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-7 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Старт продаж</p>
            <h2 className="mt-4 text-3xl font-medium tracking-normal md:text-4xl">
              Готовы начать продавать оптом?
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/register">Зарегистрировать бренд</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
