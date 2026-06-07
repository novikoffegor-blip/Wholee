import { Suspense } from "react";

import { CatalogView } from "@/components/catalog/catalog-view";
import { getDemoSession } from "@/lib/auth/session";
import { canViewWholesalePrices, toCatalogProductViews } from "@/lib/catalog/views";
import { getBuyerCommerce } from "@/lib/demo-commerce/server-state";
import { products } from "@/lib/mock";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const session = await getDemoSession();
  const revealWholesalePrices = canViewWholesalePrices(session);
  const buyerCommerce = revealWholesalePrices ? getBuyerCommerce() : null;
  const sourceProducts = buyerCommerce?.catalog ?? products;
  const catalogProducts = toCatalogProductViews(sourceProducts, revealWholesalePrices);

  return (
    <Suspense fallback={<main className="container py-14 md:py-20">Загрузка каталога...</main>}>
      <CatalogView
        products={catalogProducts}
        canViewWholesalePrices={revealWholesalePrices}
        isBuyer={session.role === "buyer"}
        favoriteProductIds={buyerCommerce?.favoriteProductIds ?? []}
      />
    </Suspense>
  );
}
