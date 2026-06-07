"use client";

import Link from "next/link";
import { LockKeyhole, X } from "lucide-react";
import { useId, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LockedPriceProps {
  next: string;
  variant?: "compact" | "detail";
  className?: string;
}

export function LockedPrice({ next, variant = "compact", className }: LockedPriceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const loginHref = `/login?${new URLSearchParams({ next }).toString()}`;
  const registerHref = `/register?${new URLSearchParams({ role: "buyer", next }).toString()}`;

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        className={cn(
          "inline-flex items-start gap-2 text-left transition-colors hover:text-muted focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4",
          variant === "detail" ? "text-base" : "max-w-44 shrink-0 text-xs",
          className
        )}
      >
        <LockKeyhole className={variant === "detail" ? "mt-0.5 h-5 w-5" : "mt-0.5 h-4 w-4 shrink-0"} />
        <span>
          <span className="block font-medium">
            Оптовая цена доступна байерам
          </span>
          <span className="mt-1 block font-normal text-muted">
            Зарегистрируйтесь бесплатно, чтобы увидеть условия
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        className="m-auto w-[min(92vw,480px)] border border-border bg-background p-0 text-foreground backdrop:bg-black/45"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <LockKeyhole className="h-6 w-6" />
              <h2 id={titleId} className="mt-6 text-2xl font-medium">
                Оптовые цены доступны байерам
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Закрыть"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p id={descriptionId} className="mt-4 leading-7 text-muted">
            Создайте кабинет байера или войдите, чтобы видеть закупочные цены и добавлять товары в заявку.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button asChild>
              <Link href={registerHref}>Зарегистрироваться как байер</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={loginHref}>Войти</Link>
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
