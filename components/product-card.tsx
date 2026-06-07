import Image from "next/image";
import Link from "next/link";

import { LockedPrice } from "@/components/catalog/locked-price";
import { FavoriteButton } from "@/components/products/favorite-button";
import { getDemoSession } from "@/lib/auth/session";
import { canViewWholesalePrices } from "@/lib/catalog/views";
import { getBuyerCommerce } from "@/lib/demo-commerce/server-state";
import { formatPrice, getProductUnit } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export async function ProductCard({ product }: ProductCardProps) {
  const session = await getDemoSession();
  const revealWholesalePrice = canViewWholesalePrices(session);
  const favoriteProductIds = revealWholesalePrice ? getBuyerCommerce().favoriteProductIds : [];

  return (
    <article>
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
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
        <FavoriteButton
          productId={product.id}
          productName={product.name}
          initialFavorite={favoriteProductIds.includes(product.id)}
          isBuyer={session.role === "buyer"}
          next={`/products/${product.id}`}
          className="absolute right-3 top-3"
        />
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">{product.brandName}</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/products/${product.id}`}
              className="group rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            >
              <h3 className="text-sm font-medium text-foreground transition-colors group-hover:text-muted">{product.name}</h3>
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{product.category}</p>
          </div>
          {revealWholesalePrice ? (
            <p className="shrink-0 text-sm font-medium">{formatPrice(product.wholesalePrice)}</p>
          ) : (
            <LockedPrice next={`/products/${product.id}`} />
          )}
        </div>
        <p className="text-sm text-muted">от {product.moq} {getProductUnit(product)}</p>
      </div>
    </article>
  );
}
