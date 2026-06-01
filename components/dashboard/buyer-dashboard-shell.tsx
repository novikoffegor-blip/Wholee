import type { ReactNode } from "react";

import { BuyerSidebar } from "@/components/dashboard/buyer-sidebar";

export function BuyerDashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[70vh] md:flex">
      <BuyerSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
