"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { deleteDemoSession, getDemoSession } from "@/lib/auth/client";
import { getDashboardPath } from "@/lib/auth/redirects";
import type { AuthRole } from "@/lib/auth/types";
import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";

const demoCompanyNames = {
  brand: "Aurora Atelier",
  buyer: "Concept Store Volna"
} as const;

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
  const router = useRouter();
  const [role, setRole] = useState<AuthRole>("guest");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dashboardCompany = role === "brand" || role === "buyer" ? demoCompanyNames[role] : null;

  useEffect(() => {
    let isCurrent = true;

    getDemoSession()
      .then((session) => {
        if (isCurrent) {
          setRole(session.role);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setRole("guest");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [pathname]);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await deleteDemoSession();
      useServerCommerceStore.setState({
        role: "guest",
        catalog: [],
        cart: [],
        orders: [],
        brandProducts: [],
        brandOrders: [],
        favoriteProductIds: [],
        error: null
      });
      window.localStorage.removeItem("wholee-demo-commerce-v1");
      setRole("guest");
      router.replace("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

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
              <Button asChild variant="ghost" size="sm">
                <Link href={getDashboardPath(role === "guest" ? "buyer" : role)}>Кабинет</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout} disabled={isLoggingOut}>
                Выйти
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
