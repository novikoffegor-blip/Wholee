"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { createDemoSession } from "@/lib/auth/client";
import { getLoginRedirect, getSafeNext, isDashboardPath } from "@/lib/auth/redirects";
import type { AccountRole } from "@/lib/auth/types";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage("");

    const safeNext = getSafeNext(next, "");
    const role: AccountRole =
      isDashboardPath(safeNext, "brand") || values.email.toLowerCase().includes("brand") ? "brand" : "buyer";

    try {
      await createDemoSession(role);
      router.replace(getLoginRedirect(role, next));
      router.refresh();
    } catch {
      setErrorMessage("Не удалось войти. Попробуйте ещё раз.");
    }
  }

  return (
    <main className="container py-14 md:py-20">
      <div className="mx-auto max-w-[480px]">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Личный кабинет</p>
        <h1 className="mt-5 text-4xl font-medium tracking-normal md:text-5xl">Вход</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="name@company.ru"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Пароль"
            type="password"
            autoComplete="current-password"
            placeholder="Введите пароль"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between gap-4 text-sm">
            <Link
              href="#"
              className="text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
            >
              Забыли пароль?
            </Link>
          </div>

          {errorMessage ? (
            <p className="border border-red-200 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Войти
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Нет аккаунта?{" "}
          <Link
            href={next ? `/register?next=${encodeURIComponent(getSafeNext(next))}` : "/register"}
            className="font-medium text-foreground focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </main>
  );
}
