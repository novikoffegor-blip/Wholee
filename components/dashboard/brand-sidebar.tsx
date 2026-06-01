"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Package, ReceiptText } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard/brand", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboard/brand/products", label: "Мои товары", icon: Package },
  { href: "/dashboard/brand/orders", label: "Заказы", icon: ReceiptText },
  { href: "/dashboard/brand/profile", label: "Профиль компании", icon: Building2 }
];

export function BrandSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border bg-background md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="sticky top-[105px] md:top-16">
        <div className="border-b border-border px-4 py-5 md:px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Кабинет бренда</p>
          <p className="mt-2 text-lg font-medium">Aurora Atelier</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 py-3 md:flex-col md:gap-1 md:px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard/brand" ? pathname === item.href : pathname.startsWith(item.href);

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
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
