import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { brands, products } from "@/lib/mock";

export function PopularBrands() {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Поставщики</p>
            <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">Популярные поставщики</h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Изучайте специализацию брендов и открывайте их оптовые коллекции.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted"
          >
            Смотреть все товары
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => {
            const productCount = products.filter((product) => product.brandId === brand.id).length;

            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="group overflow-hidden border border-border bg-surface transition-colors hover:bg-background"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-background">
                  <Image
                    src={brand.cover}
                    alt={`Коллекция ${brand.name}`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: brand.accent }} />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background p-3">
                      <Image
                        src={brand.logo}
                        alt={`Логотип ${brand.name}`}
                        fill
                        sizes="64px"
                        className="object-contain p-3"
                      />
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted">{brand.category}</p>
                  <h3 className="mt-3 text-xl font-medium">{brand.name}</h3>
                  <p className="mt-3 min-h-14 leading-7 text-muted">{brand.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {brand.badges.slice(0, 2).map((badge) => (
                      <span key={badge} className="border border-border px-2.5 py-1 text-xs text-muted">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 border-t border-border pt-4 text-sm text-muted">{productCount} товаров в витрине</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
