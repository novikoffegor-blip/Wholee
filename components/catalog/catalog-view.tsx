"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  filterProducts,
  parseCatalogQuery,
  productCategories,
  productColors,
  productGenders,
  productMaterials,
  productSeasons,
  type CatalogFilters
} from "@/lib/catalog/search";
import { products } from "@/lib/mock";
import { formatPrice } from "@/lib/utils";
import type { ProductCategory, ProductColor, ProductGender, ProductMaterial, ProductSeason } from "@/types";

function valueOrUndefined<T extends string>(value: string | null, options: readonly T[]) {
  return value && options.includes(value as T) ? (value as T) : undefined;
}

function numberOrUndefined(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function initialFiltersFromParams(searchParams: URLSearchParams): CatalogFilters {
  const query = searchParams.get("q") ?? "";
  const parsedQuery = query ? parseCatalogQuery(query) : {};

  return {
    ...parsedQuery,
    query,
    category: valueOrUndefined<ProductCategory>(searchParams.get("category"), productCategories) ?? parsedQuery.category,
    color: valueOrUndefined<ProductColor>(searchParams.get("color"), productColors) ?? parsedQuery.color,
    gender: valueOrUndefined<ProductGender>(searchParams.get("gender"), productGenders),
    season: valueOrUndefined<ProductSeason>(searchParams.get("season"), productSeasons),
    material: valueOrUndefined<ProductMaterial>(searchParams.get("material"), productMaterials),
    minPrice: numberOrUndefined(searchParams.get("minPrice")),
    maxPrice: numberOrUndefined(searchParams.get("maxPrice"))
  };
}

export function CatalogView() {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => initialFiltersFromParams(searchParams), [searchParams]);
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);

  const filteredProducts = useMemo(() => filterProducts(products, filters), [filters]);

  function updateFilter(nextFilters: Partial<CatalogFilters>) {
    setFilters((current) => ({ ...current, ...nextFilters }));
  }

  function resetFilters() {
    setFilters({});
  }

  return (
    <main className="container py-14 md:py-20">
      <div className="flex flex-col justify-between gap-6 border-b border-border pb-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Каталог</p>
          <h1 className="mt-5 text-4xl font-medium tracking-normal md:text-5xl">Товары для оптовой закупки</h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Фильтруйте товары по категории, цвету, полу, сезону, материалу и оптовой цене.
          </p>
        </div>
        <p className="text-sm text-muted">{filteredProducts.length} из {products.length} товаров</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <h2 className="font-medium">Фильтры</h2>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
            >
              Сбросить
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <FilterSelect
              label="Категория"
              value={filters.category ?? ""}
              onChange={(value) => updateFilter({ category: value as ProductCategory || undefined })}
              options={productCategories}
            />
            <FilterSelect
              label="Цвет"
              value={filters.color ?? ""}
              onChange={(value) => updateFilter({ color: value as ProductColor || undefined })}
              options={productColors}
            />
            <FilterSelect
              label="Пол"
              value={filters.gender ?? ""}
              onChange={(value) => updateFilter({ gender: value as ProductGender || undefined })}
              options={productGenders}
            />
            <FilterSelect
              label="Сезон"
              value={filters.season ?? ""}
              onChange={(value) => updateFilter({ season: value as ProductSeason || undefined })}
              options={productSeasons}
            />
            <FilterSelect
              label="Материал"
              value={filters.material ?? ""}
              onChange={(value) => updateFilter({ material: value as ProductMaterial || undefined })}
              options={productMaterials}
            />
            <div>
              <p className="text-sm font-medium">Цена, ₽</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  value={filters.minPrice ?? ""}
                  onChange={(event) => updateFilter({ minPrice: numberOrUndefined(event.target.value) })}
                  type="number"
                  min="0"
                  placeholder="от"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-foreground focus:outline-none"
                />
                <input
                  value={filters.maxPrice ?? ""}
                  onChange={(event) => updateFilter({ maxPrice: numberOrUndefined(event.target.value) })}
                  type="number"
                  min="0"
                  placeholder="до"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.query ? <FilterChip label={`Поиск: ${filters.query}`} onClear={() => updateFilter({ query: "" })} /> : null}
            {filters.category ? <FilterChip label={filters.category} onClear={() => updateFilter({ category: undefined })} /> : null}
            {filters.color ? <FilterChip label={filters.color} onClear={() => updateFilter({ color: undefined })} /> : null}
            {filters.gender ? <FilterChip label={filters.gender} onClear={() => updateFilter({ gender: undefined })} /> : null}
            {filters.season ? <FilterChip label={filters.season} onClear={() => updateFilter({ season: undefined })} /> : null}
            {filters.material ? <FilterChip label={filters.material} onClear={() => updateFilter({ material: undefined })} /> : null}
          </div>

          {filteredProducts.length ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article key={product.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
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
                    <div className="mt-2 flex items-start justify-between gap-4">
                      <h3 className="text-base font-medium">{product.name}</h3>
                      <p className="shrink-0 text-sm font-medium">{formatPrice(product.wholesalePrice)}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted">{product.category} · {product.colors.join(", ")}</p>
                    <p className="mt-1 text-sm text-muted">{product.material} · {product.season} · {product.gender}</p>
                    <p className="mt-3 text-sm text-muted">Размеры: {product.sizeRange}</p>
                    <p className="mt-1 text-sm font-medium">от {product.moq} пар</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
              <h2 className="text-2xl font-medium">Ничего не найдено</h2>
              <p className="mx-auto mt-3 max-w-md leading-7 text-muted">
                Попробуйте убрать часть фильтров или изменить запрос: например, “кроссовки”, “жёлтые туфли” или “чёрные сумки”.
              </p>
              <Button type="button" variant="outline" className="mt-6" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

interface FilterSelectProps<T extends string> {
  label: string;
  value: string;
  options: readonly T[];
  onChange: (value: string) => void;
}

function FilterSelect<T extends string>({ label, value, options, onChange }: FilterSelectProps<T>) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-foreground focus:outline-none"
      >
        <option value="">Все</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}
