import Image from "next/image";

import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">{product.brandName}</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{product.category}</p>
          </div>
          <p className="shrink-0 text-sm font-medium">{formatPrice(product.wholesalePrice)}</p>
        </div>
        <p className="text-sm text-muted">от {product.moq} пар</p>
      </div>
    </article>
  );
}
