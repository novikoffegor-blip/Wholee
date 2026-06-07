"use client";

import { useEffect } from "react";

import { useServerCommerceStore } from "@/lib/stores/server-commerce-store";

export function CommerceHydrator() {
  const hydrate = useServerCommerceStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return null;
}
