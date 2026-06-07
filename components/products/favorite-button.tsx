"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  initialFavorite?: boolean;
  isBuyer: boolean;
  next: string;
  onToggle?: () => Promise<void>;
  className?: string;
  variant?: "icon" | "label";
}

export function FavoriteButton({
  productId,
  productName,
  initialFavorite = false,
  isBuyer,
  next,
  onToggle,
  className,
  variant = "icon"
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const loginHref = `/login?${new URLSearchParams({ next }).toString()}`;
  const registerHref = `/register?${new URLSearchParams({ role: "buyer", next }).toString()}`;

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  async function toggleFavorite() {
    if (!isBuyer) {
      dialogRef.current?.showModal();
      return;
    }

    const previousValue = isFavorite;
    setIsFavorite(!previousValue);
    setIsLoading(true);

    try {
      if (onToggle) {
        await onToggle();
      } else {
        const response = await fetch("/api/demo-commerce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "toggleFavorite", productId })
        });

        if (!response.ok) {
          throw new Error("Не удалось обновить избранное");
        }
      }
    } catch {
      setIsFavorite(previousValue);
    } finally {
      setIsLoading(false);
    }
  }

  const label = isFavorite ? `Убрать ${productName} из избранного` : `Добавить ${productName} в избранное`;

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void toggleFavorite();
        }}
        disabled={isLoading}
        aria-label={label}
        aria-pressed={isFavorite}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded-xl border border-border bg-background/95 text-foreground shadow-sm backdrop-blur transition-all hover:scale-105 hover:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-60",
          variant === "icon" ? "h-11 w-11" : "h-11 gap-2 px-4 text-sm font-medium",
          isFavorite && "border-foreground bg-foreground text-background",
          className
        )}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        {variant === "label" ? (isFavorite ? "В избранном" : "Сохранить") : null}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto w-[min(92vw,480px)] rounded-2xl border border-border bg-background p-0 text-foreground backdrop:bg-black/45"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Heart className="h-6 w-6" />
              <h2 id={titleId} className="mt-6 text-2xl font-medium">Сохраняйте товары для закупки</h2>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Закрыть"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p id={descriptionId} className="mt-4 leading-7 text-muted">
            Избранное доступно байерам. Войдите или зарегистрируйтесь бесплатно, чтобы собрать рабочую подборку.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button asChild>
              <Link href={registerHref}>Стать байером</Link>
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
