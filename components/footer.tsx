import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "О платформе" },
  { href: "/catalog", label: "Каталог" },
  { href: "/for-brands", label: "Брендам" },
  { href: "/for-buyers", label: "Байерам" }
];

const linkFocusClass =
  "focus-visible:outline-none focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-8";
const logoFocusClass = "inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className={logoFocusClass} aria-label="Wholee Store">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-sm font-bold tracking-normal text-background">
              WS
            </span>
            <span className="text-2xl font-semibold leading-none tracking-normal">Wholee Store</span>
          </Link>
          <p className="mt-5 text-sm leading-6 text-muted">
            B2B-маркетплейс для оптовых закупок обуви, сумок и аксессуаров в России.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-muted md:flex md:gap-8">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-foreground ${linkFocusClass}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container border-t border-border py-5 text-xs text-muted">
        © 2026 Wholee Store. Все права защищены.
      </div>
    </footer>
  );
}
