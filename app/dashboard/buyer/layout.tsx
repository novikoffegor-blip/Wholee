import type { ReactNode } from "react";

import { BuyerDashboardShell } from "@/components/dashboard/buyer-dashboard-shell";

export default function BuyerDashboardLayout({ children }: { children: ReactNode }) {
  return <BuyerDashboardShell>{children}</BuyerDashboardShell>;
}
