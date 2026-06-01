import { Suspense } from "react";

import { CatalogView } from "@/components/catalog/catalog-view";

export default function CatalogPage() {
  return (
    <Suspense fallback={<main className="container py-14 md:py-20">Загрузка каталога...</main>}>
      <CatalogView />
    </Suspense>
  );
}
