"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { productCategories } from "@/lib/catalog/search";
import { buyerCatalogProducts } from "@/lib/mock";
import { useBuyerStore } from "@/lib/stores/buyer-store";
import { formatPrice } from "@/lib/utils";

const categories = ["Все категории", ...productCategories];

export function BuyerCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все категории");
  const [brand, setBrand] = useState("Все бренды");
  const [message, setMessage] = useState("");
  const addToCart = useBuyerStore((state) => state.addToCart);
  const brands = useMemo(
    () => ["Все бренды", ...Array.from(new Set(buyerCatalogProducts.map((product) => product.brandName)))],
    []
  );

  const filteredProducts = buyerCatalogProducts.filter((product) => {
    const matchesSearch = `${product.name} ${product.brandName}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Все категории" || product.category === category;
    const matchesBrand = brand === "Все бренды" || product.brandName === brand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-7xl">
        <div className="border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Закупки</p>
          <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">Каталог</h1>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по товару или бренду"
              className="h-12 w-full border border-border bg-surface pl-11 pr-4 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-12 border border-border bg-surface px-4 text-sm focus:border-foreground focus:outline-none"
            aria-label="Категория"
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="h-12 border border-border bg-surface px-4 text-sm focus:border-foreground focus:outline-none"
            aria-label="Бренд"
          >
            {brands.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {message ? <p className="mt-5 border border-border px-4 py-3 text-sm">{message}</p> : null}

        <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">{product.brandName}</p>
                <h2 className="mt-2 text-base font-medium">{product.name}</h2>
                <p className="mt-1 text-sm text-muted">{product.category}</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-medium">{formatPrice(product.wholesalePrice)}</p>
                    <p className="mt-1 text-sm text-muted">MOQ: {product.moq} шт.</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      addToCart(product);
                      setMessage(`${product.name} добавлен в корзину. Мин. партия: ${product.moq} шт.`);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />В корзину
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
