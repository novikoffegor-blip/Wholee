"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ChevronLeft, PackagePlus } from "lucide-react";

import { CartAddedToast } from "@/components/cart/cart-added-toast";
import { LockedPrice } from "@/components/catalog/locked-price";
import { FavoriteButton } from "@/components/products/favorite-button";
import { Button } from "@/components/ui/button";
import type { CatalogProductView } from "@/lib/catalog/views";
import { formatPrice, getProductUnit } from "@/lib/utils";

interface ProductDetailsProps {
  product: CatalogProductView;
  isBuyer: boolean;
  initialFavorite: boolean;
}

export function ProductDetails({ product, isBuyer, initialFavorite }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  async function addProductToCart() {
    if (typeof product.wholesalePrice !== "number" || typeof product.retailPrice !== "number") return;

    setIsAdding(true);
    setCartMessage("");

    try {
      const response = await fetch("/api/demo-commerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addToCart", productId: product.id })
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Не удалось добавить товар.");
      }

      setIsAdded(true);
      setToastVisible(true);
      setCartMessage(result.message ?? "Товар добавлен в корзину байера с учётом минимальной партии.");
    } catch (error) {
      setCartMessage(error instanceof Error ? error.message : "Не удалось добавить товар.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <main className="container py-8 md:py-12">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Вернуться в каталог
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)] lg:gap-16">
        <section aria-label="Галерея товара">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
            <Image
              src={product.images[selectedImage]}
              alt={`${product.name}, изображение ${selectedImage + 1}`}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <FavoriteButton
              productId={product.id}
              productName={product.name}
              initialFavorite={initialFavorite}
              isBuyer={isBuyer}
              next={`/products/${product.id}`}
              className="absolute right-4 top-4"
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {product.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-label={`Показать изображение ${index + 1}`}
                aria-pressed={selectedImage === index}
                className={`relative aspect-square overflow-hidden rounded-xl border bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground ${
                  selectedImage === index ? "border-foreground" : "border-border hover:border-muted"
                }`}
              >
                <Image src={image} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="lg:pt-3">
          <Link
            href={`/brands/${product.brandId}`}
            className="text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
          >
            {product.brandName}
          </Link>
          <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-sm text-muted">
            {product.category} · {product.subcategory} · {product.gender}
          </p>

          <div className="mt-8 border-y border-border py-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm text-muted">Оптовая цена</p>
                {typeof product.wholesalePrice === "number" ? (
                  <p className="mt-2 text-3xl font-medium">{formatPrice(product.wholesalePrice)}</p>
                ) : (
                  <LockedPrice next={`/products/${product.id}`} variant="detail" className="mt-3" />
                )}
              </div>
              {typeof product.retailPrice === "number" ? (
                <div className="text-right">
                  <p className="text-sm text-muted">РРЦ</p>
                  <p className="mt-2 text-lg">{formatPrice(product.retailPrice)}</p>
                </div>
              ) : null}
            </div>
            <p className="mt-5 text-sm font-medium">
              Минимальный заказ: {product.moq} {getProductUnit(product)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-border py-6 text-sm">
            <ProductProperty label="Размеры" value={product.sizes.join(", ")} />
            <ProductProperty label="Диапазон размеров" value={product.sizeRange} />
            <ProductProperty label="Цвет" value={product.colors.join(", ")} />
            <ProductProperty label="Материал" value={product.material} />
            <ProductProperty label="Сезон" value={product.season} />
            <ProductProperty label="SKU" value={product.sku} />
          </dl>

          {typeof product.wholesalePrice === "number" ? (
            <>
              <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={addProductToCart}
                  disabled={isAdding}
                >
                  {isAdded ? <CheckCircle2 className="h-4 w-4" /> : <PackagePlus className="h-4 w-4" />}
                  {isAdding ? "Добавляем..." : isAdded ? "Добавить ещё" : "Добавить в заявку"}
                </Button>
                <FavoriteButton
                  productId={product.id}
                  productName={product.name}
                  initialFavorite={initialFavorite}
                  isBuyer={isBuyer}
                  next={`/products/${product.id}`}
                  variant="label"
                />
              </div>
              <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted">
                {cartMessage}
              </p>
            </>
          ) : null}
        </section>
      </div>
      <CartAddedToast productName={product.name} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </main>
  );
}

function ProductProperty({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
