import "server-only";

import type { AuthRole } from "@/lib/auth/types";
import type { Product } from "@/types";

export type CatalogProductView = Omit<Product, "wholesalePrice" | "retailPrice"> & {
  wholesalePrice?: number;
  retailPrice?: number;
};

type DemoSessionShape = {
  role?: AuthRole | null;
  user?: {
    role?: AuthRole | null;
  } | null;
} | null;

export function canViewWholesalePrices(session: unknown): boolean {
  if (session === "buyer") return true;
  if (!session || typeof session !== "object") return false;

  const demoSession = session as DemoSessionShape;
  return demoSession?.role === "buyer" || demoSession?.user?.role === "buyer";
}

export function toCatalogProductView(product: Product, revealWholesalePrice: boolean): CatalogProductView {
  if (revealWholesalePrice) return { ...product };

  const { wholesalePrice, retailPrice, ...publicProduct } = product;
  void wholesalePrice;
  void retailPrice;
  return publicProduct;
}

export function toCatalogProductViews(products: Product[], revealWholesalePrice: boolean): CatalogProductView[] {
  return products.map((product) => toCatalogProductView(product, revealWholesalePrice));
}
