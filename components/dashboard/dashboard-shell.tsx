import type { ReactNode } from "react";

import { BrandSidebar } from "@/components/dashboard/brand-sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-[70vh] md:flex">
      <BrandSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
