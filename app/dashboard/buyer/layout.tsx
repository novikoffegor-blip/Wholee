import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { BuyerDashboardShell } from "@/components/dashboard/buyer-dashboard-shell";
import { getDashboardPath } from "@/lib/auth/redirects";
import { getServerSessionRole } from "@/lib/auth/server";

export default async function BuyerDashboardLayout({ children }: { children: ReactNode }) {
  const role = await getServerSessionRole();

  if (role !== "buyer") {
    redirect(role === "brand" ? getDashboardPath(role) : "/login?next=/dashboard/buyer");
  }

  return <BuyerDashboardShell>{children}</BuyerDashboardShell>;
}
