"use client";

import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";

interface CartAddedToastProps {
  productName: string;
  visible: boolean;
  onClose: () => void;
}

export function CartAddedToast({ productName, visible, onClose }: CartAddedToastProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 z-[70] rounded-2xl border border-border bg-foreground p-4 text-background shadow-2xl sm:left-auto sm:right-6 sm:w-[390px]"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">Товар добавлен в корзину</p>
          <p className="mt-1 truncate text-sm text-background/70">{productName}</p>
          <Link
            href="/dashboard/buyer/cart"
            className="mt-3 inline-block text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background"
          >
            Перейти в корзину
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть уведомление"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-background/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
