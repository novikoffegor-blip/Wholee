import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandProfile } from "@/components/brands/brand-profile";
import { getDemoSession } from "@/lib/auth/session";
import { canViewWholesalePrices, toCatalogProductViews } from "@/lib/catalog/views";
import { getBuyerCommerce } from "@/lib/demo-commerce/server-state";
import { brands, products } from "@/lib/mock";

interface BrandPageProps {
  params: {
    brandId: string;
  };
}

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: BrandPageProps): Metadata {
  const brand = brands.find((item) => item.id === params.brandId);

  if (!brand) {
    return {};
  }

  return {
    title: `${brand.name} — оптовая витрина | Wholee Store`,
    description: `${brand.description} Посмотрите коллекцию и условия сотрудничества с ${brand.name}.`,
    openGraph: {
      images: [brand.cover]
    }
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const brand = brands.find((item) => item.id === params.brandId);

  if (!brand) {
    notFound();
  }

  const session = await getDemoSession();
  const revealWholesalePrices = canViewWholesalePrices(session);
  const buyerCommerce = revealWholesalePrices ? getBuyerCommerce() : null;
  const sourceProducts = buyerCommerce?.catalog ?? products;
  const brandProducts = sourceProducts.filter((product) => product.brandId === brand.id);

  return (
    <BrandProfile
      brand={brand}
      products={toCatalogProductViews(brandProducts, revealWholesalePrices)}
      canViewWholesalePrices={revealWholesalePrices}
      isBuyer={session.role === "buyer"}
      favoriteProductIds={buyerCommerce?.favoriteProductIds ?? []}
    />
  );
}
