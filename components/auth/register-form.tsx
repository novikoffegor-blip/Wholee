"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, ShoppingBag, Store } from "lucide-react";
import { useForm } from "react-hook-form";

import { SelectField, TextField } from "@/components/auth/form-field";
import { PricingPlans, type PricingPlanName } from "@/components/pricing/pricing-plans";
import { Button } from "@/components/ui/button";
import { createDemoSession } from "@/lib/auth/client";
import { getRegistrationRedirect } from "@/lib/auth/redirects";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

type SelectedRole = RegisterFormValues["role"] | null;

const categoryOptions = ["Обувь", "Сумки", "Аксессуары"] as const;
const businessTypeOptions = ["Розничный магазин", "Маркетплейс", "Шоурум"] as const;

const roleCards = [
  {
    role: "brand" as const,
    title: "Я бренд",
    description: "Размещайте коллекции и принимайте оптовые заказы",
    icon: Store
  },
  {
    role: "buyer" as const,
    title: "Я байер",
    description: "Находите бренды и закупайте оптом",
    icon: ShoppingBag
  }
];

export function RegisterForm({ next, initialRole }: { next?: string; initialRole?: RegisterFormValues["role"] }) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<SelectedRole>(initialRole ?? null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanName | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole,
      companyName: "",
      inn: "",
      ogrn: "",
      contactName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      brandName: "",
      categories: [],
      businessType: undefined,
      city: "",
      terms: false
    }
  });

  function chooseRole(role: RegisterFormValues["role"]) {
    setSelectedRole(role);
    setSelectedPlan(null);
    setErrorMessage("");
    setValue("role", role, { shouldValidate: true });
  }

  function backToRoleChoice() {
    setSelectedRole(null);
    setSelectedPlan(null);
    setErrorMessage("");
    reset();
  }

  async function onSubmit(values: RegisterFormValues) {
    setErrorMessage("");

    try {
      await createDemoSession(values.role);
      router.replace(getRegistrationRedirect(values.role, next));
      router.refresh();
    } catch {
      setErrorMessage("Не удалось завершить регистрацию. Попробуйте ещё раз.");
    }
  }

  return (
    <main className="container py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Регистрация</p>
        <h1 className="mt-5 text-4xl font-medium tracking-normal md:text-5xl">
          {!selectedRole ? "Выберите роль" : selectedRole === "brand" && !selectedPlan ? "Выберите тариф" : "Данные компании"}
        </h1>

        {!selectedRole ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {roleCards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => chooseRole(card.role)}
                  className="group min-h-64 border border-border bg-surface p-8 text-left transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none"
                >
                  <Icon className="h-8 w-8" />
                  <h2 className="mt-10 text-2xl font-medium">{card.title}</h2>
                  <p className="mt-4 max-w-sm leading-7 text-muted">{card.description}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                    Выбрать
                    <Check className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                  </span>
                </button>
              );
            })}
          </div>
        ) : selectedRole === "brand" && !selectedPlan ? (
          <div className="mt-10">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-muted">Роль</p>
                <p className="mt-1 text-xl font-medium">Бренд</p>
              </div>
              <Button type="button" variant="outline" onClick={backToRoleChoice}>
                <ArrowLeft className="h-4 w-4" />
                Вернуться к выбору роли
              </Button>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Тариф нужен только поставщикам: выберите подходящий план, а затем заполните данные компании.
            </p>
            <PricingPlans ctaMode="select" onSelectPlan={setSelectedPlan} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10" noValidate>
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-muted">Роль</p>
                <p className="mt-1 text-xl font-medium">{selectedRole === "brand" ? "Бренд" : "Байер"}</p>
                {selectedRole === "brand" ? <p className="mt-1 text-sm text-muted">Тариф: {selectedPlan}</p> : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {selectedRole === "brand" ? (
                  <Button type="button" variant="outline" onClick={() => setSelectedPlan(null)}>
                    Изменить тариф
                  </Button>
                ) : null}
                <Button type="button" variant="outline" onClick={backToRoleChoice}>
                  <ArrowLeft className="h-4 w-4" />
                  Вернуться к выбору роли
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <TextField label="Название компании" error={errors.companyName?.message} {...register("companyName")} />
              <TextField label="ИНН" inputMode="numeric" error={errors.inn?.message} {...register("inn")} />
              <TextField label="ОГРН / ОГРНИП" inputMode="numeric" error={errors.ogrn?.message} {...register("ogrn")} />
              <TextField label="Контактное лицо (ФИО)" error={errors.contactName?.message} {...register("contactName")} />
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <TextField
                label="Телефон"
                type="tel"
                autoComplete="tel"
                placeholder="+7"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <TextField
                label="Пароль"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />
              <TextField
                label="Подтверждение пароля"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              {selectedRole === "brand" ? (
                <>
                  <TextField label="Название бренда" error={errors.brandName?.message} {...register("brandName")} />
                  <fieldset>
                    <legend className="text-sm font-medium text-foreground">Категория товаров</legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {categoryOptions.map((category) => (
                        <label
                          key={category}
                          className="flex h-12 items-center gap-3 border border-border px-4 text-sm transition-colors has-[:checked]:border-foreground"
                        >
                          <input
                            type="checkbox"
                            value={category}
                            className="h-4 w-4 rounded-xl border-border accent-foreground focus-visible:outline-none"
                            {...register("categories")}
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                    {errors.categories?.message ? (
                      <p className="mt-2 text-sm text-red-600">{errors.categories.message}</p>
                    ) : null}
                  </fieldset>
                </>
              ) : null}

              {selectedRole === "buyer" ? (
                <>
                  <SelectField
                    label="Тип бизнеса"
                    placeholder="Выберите тип бизнеса"
                    error={errors.businessType?.message}
                    {...register("businessType")}
                  >
                    {businessTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectField>
                  <TextField label="Город" error={errors.city?.message} {...register("city")} />
                </>
              ) : null}
            </div>

            <label className="mt-8 flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded-xl border-border accent-foreground focus-visible:outline-none"
                {...register("terms")}
              />
              <span>Согласен с условиями</span>
            </label>
            {errors.terms?.message ? <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p> : null}

            {errorMessage ? (
              <p className="mt-6 border border-red-200 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="sm:min-w-64" disabled={isSubmitting}>
                Зарегистрироваться
              </Button>
              <Button type="button" variant="outline" onClick={backToRoleChoice}>
                Изменить роль
              </Button>
            </div>
          </form>
        )}

        <p className={cn("mt-8 text-sm text-red-600", selectedRole ? "hidden" : "")}>{errors.role?.message}</p>
      </div>
    </main>
  );
}
