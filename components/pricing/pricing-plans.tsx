"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

type BillingMode = "monthly" | "yearly";

export type PricingPlanName = "Старт" | "Бизнес" | "Премиум";

const plans = [
  {
    name: "Старт" as const,
    description: "Чтобы попробовать",
    monthlyPrice: 0,
    yearlyPrice: 0,
    periodMonthly: "/ мес",
    periodYearly: "/ мес",
    features: ["До 10 товаров в каталоге", "Комиссия 5% с заказов", "Email-поддержка", "Базовый профиль бренда"],
    button: "Начать бесплатно",
    popular: false
  },
  {
    name: "Бизнес" as const,
    description: "Для растущих брендов",
    monthlyPrice: 9900,
    yearlyPrice: 99000,
    oldYearlyPrice: 118800,
    saving: 19800,
    periodMonthly: "/ мес",
    periodYearly: "/ год",
    features: [
      "До 100 товаров в каталоге",
      "Комиссия 3% с заказов",
      "Базовая аналитика продаж",
      "Приоритетная поддержка",
      "Все из тарифа «Старт»"
    ],
    button: "Выбрать Бизнес",
    popular: true
  },
  {
    name: "Премиум" as const,
    description: "Максимум возможностей",
    monthlyPrice: 39900,
    yearlyPrice: 399000,
    oldYearlyPrice: 478800,
    saving: 79800,
    periodMonthly: "/ мес",
    periodYearly: "/ год",
    features: [
      "Безлимитный каталог товаров",
      "Комиссия 0% с заказов",
      "Расширенная аналитика",
      "Персональный менеджер",
      "Размещение в топе каталога",
      "Все из тарифа «Бизнес»"
    ],
    button: "Выбрать Премиум",
    popular: false
  }
];

interface PricingPlansProps {
  ctaMode?: "link" | "select";
  onSelectPlan?: (plan: PricingPlanName) => void;
}

export function PricingPlans({ ctaMode = "link", onSelectPlan }: PricingPlansProps) {
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="inline-grid w-full grid-cols-2 rounded-2xl border border-border bg-surface p-1 sm:w-[320px]">
          <button
            type="button"
            onClick={() => setBillingMode("monthly")}
            className={cn(
              "h-11 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground",
              billingMode === "monthly" ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            )}
          >
            Помесячно
          </button>
          <button
            type="button"
            onClick={() => setBillingMode("yearly")}
            className={cn(
              "h-11 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground",
              billingMode === "yearly" ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            )}
          >
            На год
          </button>
        </div>
        <p className="inline-flex w-fit rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
          Скидка ~17% — 2 месяца в подарок
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border border-border bg-surface p-6 md:p-8",
              plan.popular && "border-foreground"
            )}
          >
            {plan.popular ? (
              <span className="absolute right-6 top-6 rounded-lg border border-foreground px-3 py-1 text-xs font-medium">
                Популярный
              </span>
            ) : null}
            <p className="text-sm text-muted">{plan.description}</p>
            <h2 className="mt-4 text-3xl font-medium">{plan.name}</h2>
            <div className="mt-8">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-medium tracking-normal">
                  {formatPrice(billingMode === "monthly" ? plan.monthlyPrice : plan.yearlyPrice)}
                </span>
                <span className="pb-1 text-sm text-muted">
                  {billingMode === "monthly" ? plan.periodMonthly : plan.periodYearly}
                </span>
              </div>
              {billingMode === "yearly" && plan.oldYearlyPrice ? (
                <div className="mt-3 text-sm text-muted">
                  <span className="line-through">{formatPrice(plan.oldYearlyPrice)}</span>
                  <span className="ml-3 text-foreground">Экономия {formatPrice(plan.saving ?? 0)}</span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">Оплата по выбранному периоду</p>
              )}
            </div>

            <ul className="mt-8 flex-1 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6">
                  <Check className="mt-1 h-4 w-4 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {ctaMode === "select" ? (
              <Button
                type="button"
                className="mt-8"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => onSelectPlan?.(plan.name)}
              >
                Выбрать тариф
              </Button>
            ) : (
              <Button asChild className="mt-8" variant={plan.popular ? "default" : "outline"}>
                <Link href="/register">{plan.button}</Link>
              </Button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
