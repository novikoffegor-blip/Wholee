import type { ReactNode } from "react";

import { BuyerSidebar } from "@/components/dashboard/buyer-sidebar";
import { CommerceHydrator } from "@/components/dashboard/commerce-hydrator";

export function BuyerDashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[70vh] md:flex">
      <CommerceHydrator />
      <BuyerSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
