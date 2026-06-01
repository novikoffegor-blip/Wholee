"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { brandCompany, buyerCompany } from "@/lib/mock";

const navigation = [
  { href: "/catalog", label: "Каталог" },
  { href: "/for-brands", label: "Для брендов" },
  { href: "/for-buyers", label: "Для байеров" }
];

const linkFocusClass =
  "focus-visible:outline-none focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-8";
const logoFocusClass = "rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground";

export function Header() {
  const pathname = usePathname();
  const dashboardCompany = pathname.startsWith("/dashboard/brand")
    ? brandCompany.brandName
    : pathname.startsWith("/dashboard/buyer")
      ? buyerCompany.companyName
      : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-3 md:gap-6">
          <Link href="/" className={`flex shrink-0 items-center gap-3 ${logoFocusClass}`} aria-label="Wholee Store">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-xs font-bold tracking-normal text-background">
              WS
            </span>
            <span className="text-xl font-semibold leading-none tracking-normal sm:text-[26px]">Wholee Store</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground ${linkFocusClass}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {dashboardCompany ? (
            <div className="flex min-w-0 items-center gap-2 md:gap-3">
              <span className="max-w-[120px] truncate text-sm font-medium text-foreground sm:max-w-[180px] md:max-w-none">
                {dashboardCompany}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href="/">Выйти</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Вход</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Регистрация</Link>
              </Button>
            </div>
          )}
        </div>

        <nav className="flex gap-5 overflow-x-auto border-t border-border py-3 text-sm text-muted md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 transition-colors hover:text-foreground ${linkFocusClass}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
