"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildCatalogSearchParams, parseCatalogQuery } from "@/lib/catalog/search";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const filters = parseCatalogQuery(trimmedQuery);
    const params = buildCatalogSearchParams({ ...filters, query: trimmedQuery });
    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <form onSubmit={submitSearch} className="mt-10 max-w-3xl">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Найдите товар: кроссовки, жёлтые туфли, сумки..."
          className="h-14 w-full rounded-2xl border border-border bg-surface pl-14 pr-36 text-sm text-foreground shadow-soft placeholder:text-muted focus:border-foreground focus:outline-none"
        />
        <Button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 px-5">
          Найти
        </Button>
      </label>
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
        {["жёлтые туфли", "кроссовки", "чёрные сумки"].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              const filters = parseCatalogQuery(example);
              const params = buildCatalogSearchParams({ ...filters, query: example });
              router.push(`/catalog?${params.toString()}`);
            }}
            className="rounded-xl border border-border bg-surface px-3 py-1.5 transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}
