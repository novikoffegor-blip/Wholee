"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Heart, LayoutDashboard, PackageSearch, ReceiptText, ShoppingCart } from "lucide-react";

import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard/buyer", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboard/buyer/catalog", label: "Каталог", icon: PackageSearch },
  { href: "/dashboard/buyer/favorites", label: "Избранное", icon: Heart },
  { href: "/dashboard/buyer/cart", label: "Корзина", icon: ShoppingCart },
  { href: "/dashboard/buyer/orders", label: "Мои заказы", icon: ReceiptText },
  { href: "/dashboard/buyer/profile", label: "Профиль компании", icon: Building2 }
];

export function BuyerSidebar() {
  const pathname = usePathname();
  const cartCount = useServerCommerceStore((state) => state.cart.length);
  const favoritesCount = useServerCommerceStore((state) => state.favoriteProductIds.length);

  return (
    <aside className="border-b border-border bg-background md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="sticky top-[105px] md:top-16">
        <div className="border-b border-border px-4 py-5 md:px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Кабинет байера</p>
          <p className="mt-2 text-lg font-medium">Concept Store Volna</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 py-3 md:flex-col md:gap-1 md:px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard/buyer" ? pathname === item.href : pathname.startsWith(item.href);
            const label = item.href.endsWith("/cart")
              ? `${item.label} (${cartCount})`
              : item.href.endsWith("/favorites")
                ? `${item.label} (${favoritesCount})`
                : item.label;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-3 border border-transparent px-4 text-sm text-muted transition-colors hover:text-foreground focus-visible:border-foreground focus-visible:outline-none md:w-full",
                  isActive && "border-border bg-surface text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
