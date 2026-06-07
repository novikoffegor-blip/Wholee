"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Heart, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

import { CartAddedToast } from "@/components/cart/cart-added-toast";
import { FavoriteButton } from "@/components/products/favorite-button";
import { Button } from "@/components/ui/button";
import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";
import { formatPrice, getProductUnit } from "@/lib/utils";

export function BuyerFavorites() {
  const catalog = useServerCommerceStore((state) => state.catalog);
  const cart = useServerCommerceStore((state) => state.cart);
  const favoriteProductIds = useServerCommerceStore((state) => state.favoriteProductIds);
  const toggleFavorite = useServerCommerceStore((state) => state.toggleFavorite);
  const addToCart = useServerCommerceStore((state) => state.add);
  const [addedProduct, setAddedProduct] = useState("");
  const [addingProductId, setAddingProductId] = useState("");

  const favoriteProducts = useMemo(
    () => favoriteProductIds.flatMap((id) => {
      const product = catalog.find((item) => item.id === id);
      return product ? [product] : [];
    }),
    [catalog, favoriteProductIds]
  );

  return (
    <main className="px-4 py-10 md:px-10 md:py-12">
      <div className="max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Рабочая подборка</p>
            <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">Избранное</h1>
          </div>
          <p className="text-sm text-muted">{favoriteProducts.length} сохранённых позиций</p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-8 text-center">
            <Heart className="mx-auto h-6 w-6" />
            <h2 className="mt-5 text-xl font-medium">Пока нет избранных товаров</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-muted">
              Сохраняйте интересные модели, чтобы вернуться к ним и собрать оптовую закупку.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/buyer/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {favoriteProducts.map((product) => {
              const isInCart = cart.some((item) => item.product.id === product.id);
              const isAdding = addingProductId === product.id;

              return (
                <article key={product.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                    <Link href={`/products/${product.id}`} className="block h-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                    <FavoriteButton
                      productId={product.id}
                      productName={product.name}
                      initialFavorite
                      isBuyer
                      next="/dashboard/buyer/favorites"
                      onToggle={() => toggleFavorite(product.id)}
                      className="absolute right-3 top-3"
                    />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">{product.brandName}</p>
                  <Link href={`/products/${product.id}`} className="mt-2 block font-medium hover:text-muted focus-visible:outline-none focus-visible:underline">
                    {product.name}
                  </Link>
                  <p className="mt-2 font-medium">{formatPrice(product.wholesalePrice)}</p>
                  <p className="mt-1 text-sm text-muted">MOQ {product.moq} {getProductUnit(product)} · остаток {product.stock}</p>
                  <Button
                    type="button"
                    className="mt-4 w-full"
                    variant={isInCart ? "outline" : "default"}
                    disabled={isAdding || product.stock < product.moq}
                    onClick={async () => {
                      setAddingProductId(product.id);
                      try {
                        await addToCart(product.id);
                        setAddedProduct(product.name);
                      } finally {
                        setAddingProductId("");
                      }
                    }}
                  >
                    {isInCart ? <CheckCircle2 className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                    {isAdding ? "Добавляем..." : isInCart ? "Добавить ещё" : "В корзину"}
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <CartAddedToast productName={addedProduct} visible={Boolean(addedProduct)} onClose={() => setAddedProduct("")} />
    </main>
  );
}
