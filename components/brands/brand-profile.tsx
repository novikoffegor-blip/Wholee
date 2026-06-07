import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  Building2,
  CalendarClock,
  CreditCard,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck
} from "lucide-react";

import { LockedPrice } from "@/components/catalog/locked-price";
import { FavoriteButton } from "@/components/products/favorite-button";
import { Button } from "@/components/ui/button";
import type { CatalogProductView } from "@/lib/catalog/views";
import { formatPrice, getProductUnit } from "@/lib/utils";
import type { Brand } from "@/types";

interface BrandProfileProps {
  brand: Brand;
  products: CatalogProductView[];
  canViewWholesalePrices: boolean;
  isBuyer: boolean;
  favoriteProductIds: string[];
}

export function BrandProfile({ brand, products, canViewWholesalePrices, isBuyer, favoriteProductIds }: BrandProfileProps) {
  const categories = Array.from(new Set(products.map((product) => product.category)));
  const wholesalePrices = products.flatMap((product) =>
    typeof product.wholesalePrice === "number" ? [product.wholesalePrice] : []
  );
  const minPrice = wholesalePrices.length > 0 ? Math.min(...wholesalePrices) : null;

  const conditions = [
    { label: "Минимальный заказ", value: brand.conditions.minimumOrder, icon: Box },
    {
      label: "Оптовые цены",
      value: canViewWholesalePrices && minPrice !== null ? `от ${formatPrice(minPrice)}` : "Доступны байерам",
      icon: CreditCard
    },
    { label: "Срок отгрузки", value: brand.conditions.delivery, icon: CalendarClock },
    { label: "Локация", value: brand.contact.city, icon: MapPin }
  ];

  const trustItems = [
    {
      title: "Прозрачные условия",
      description: "Оптовая цена и минимальная партия указаны у каждого товара.",
      icon: BadgeCheck
    },
    {
      title: "Профиль компании",
      description: "Категория, специализация и условия поставки собраны в одном месте.",
      icon: Building2
    },
    {
      title: "Заказ через платформу",
      description: "После регистрации байер может обсудить детали и оформить закупку.",
      icon: ShieldCheck
    }
  ];

  return (
    <main>
      <section className="border-b border-border py-14 md:py-20">
        <div className="container">
          <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
            Главная / Поставщики / {brand.name}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-border bg-surface">
                  <Image src={brand.logo} alt={`Логотип ${brand.name}`} fill sizes="80px" className="object-contain p-4" priority />
                </div>
                <div className="h-20 w-2 rounded-full" style={{ backgroundColor: brand.accent }} aria-hidden="true" />
              </div>
              <p className="mt-8 text-xs uppercase tracking-[0.22em] text-muted">{brand.category}</p>
              <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-normal md:text-7xl">{brand.name}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">{brand.description}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {brand.badges.map((badge) => (
                  <span key={badge} className="border border-border bg-surface px-3 py-1.5 text-xs font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                <Image
                  src={brand.cover}
                  alt={`Коллекция ${brand.name}`}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <Button asChild size="lg">
                <Link href={`mailto:${brand.contact.email}`} className="mt-4 w-full">
                  Запросить условия
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-14 grid gap-6 border-t border-border pt-7 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-medium">{products.length}</p>
              <p className="mt-2 text-sm text-muted">товаров в витрине</p>
            </div>
            <div>
              <p className="text-3xl font-medium">{categories.length}</p>
              <p className="mt-2 text-sm text-muted">{categories.length === 1 ? "товарная категория" : "товарные категории"}</p>
            </div>
            <div>
              <p className="text-xl font-medium">{brand.conditions.minimumOrder}</p>
              <p className="mt-2 text-sm text-muted">минимальный заказ</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">О поставщике</p>
            <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">Условия сотрудничества</h2>
            <p className="mt-5 max-w-xl leading-7 text-muted">
              {brand.conditions.assortment}. {brand.conditions.payment}.
            </p>
            <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
              <p className="font-medium">{brand.contact.manager}</p>
              <a
                href={`mailto:${brand.contact.email}`}
                className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                {brand.contact.email}
              </a>
              <a
                href={`tel:${brand.contact.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                {brand.contact.phone}
              </a>
            </div>
          </div>
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {conditions.map((condition) => {
              const Icon = condition.icon;

              return (
                <div key={condition.label} className="border-t border-border pt-5">
                  <Icon className="h-5 w-5" />
                  <p className="mt-5 text-sm text-muted">{condition.label}</p>
                  <p className="mt-2 font-medium">{condition.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-20">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Коллекция</p>
              <h2 className="mt-5 text-3xl font-medium tracking-normal md:text-4xl">Товары {brand.name}</h2>
            </div>
            <p className="text-sm text-muted">{categories.join(" · ")}</p>
          </div>

          {products.length ? (
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article key={product.id}>
                  <div className="relative">
                    <Link
                      href={`/products/${product.id}`}
                      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      </div>
                    </Link>
                    <FavoriteButton
                      productId={product.id}
                      productName={product.name}
                      initialFavorite={favoriteProductIds.includes(product.id)}
                      isBuyer={isBuyer}
                      next={`/brands/${brand.id}`}
                      className="absolute right-3 top-3"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">{product.category}</p>
                    <div className="mt-2 flex items-start justify-between gap-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                      >
                        <h3 className="text-base font-medium transition-colors hover:text-muted">{product.name}</h3>
                      </Link>
                      {typeof product.wholesalePrice === "number" ? (
                        <p className="shrink-0 text-sm font-medium">{formatPrice(product.wholesalePrice)}</p>
                      ) : (
                        <LockedPrice next={`/products/${product.id}`} />
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {product.material} · {product.season} · {product.sizeRange}
                    </p>
                    <p className="mt-3 text-sm font-medium">от {product.moq} {getProductUnit(product)}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-border bg-surface p-8">
              <p className="font-medium">Коллекция готовится к публикации</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Условия и контакты бренда уже доступны, товары появятся в витрине позже.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <PackageCheck className="h-7 w-7" />
            <h2 className="mt-6 text-3xl font-medium tracking-normal">Что помогает принять решение</h2>
            <p className="mt-5 leading-7 text-muted">
              Витрина собрана на демонстрационных данных. Финальные условия поставщик подтверждает перед заказом.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="border-t border-border pt-6">
                  <Icon className="h-5 w-5" />
                  <h3 className="mt-6 font-medium">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
