import type { ReactNode } from "react";

import { BrandSidebar } from "@/components/dashboard/brand-sidebar";
import { CommerceHydrator } from "@/components/dashboard/commerce-hydrator";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-[70vh] md:flex">
      <CommerceHydrator />
      <BrandSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
