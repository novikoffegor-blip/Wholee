import { notFound } from "next/navigation";

import { ProductDetails } from "@/components/products/product-details";
import { getDemoSession } from "@/lib/auth/session";
import { canViewWholesalePrices, toCatalogProductView } from "@/lib/catalog/views";
import { getBuyerCommerce } from "@/lib/demo-commerce/server-state";
import { products } from "@/lib/mock";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getDemoSession();
  const revealWholesalePrices = canViewWholesalePrices(session);
  const buyerCommerce = revealWholesalePrices ? getBuyerCommerce() : null;
  const sourceProducts = buyerCommerce?.catalog ?? products;
  const product = sourceProducts.find((item) => item.id === params.productId);

  if (!product) notFound();

  const productView = toCatalogProductView(product, revealWholesalePrices);

  return (
    <ProductDetails
      product={productView}
      isBuyer={session.role === "buyer"}
      initialFavorite={buyerCommerce?.favoriteProductIds.includes(product.id) ?? false}
    />
  );
}
