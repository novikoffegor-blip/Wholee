import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardPath } from "@/lib/auth/redirects";
import { getServerSessionRole } from "@/lib/auth/server";

export default async function BrandDashboardLayout({ children }: { children: ReactNode }) {
  const role = await getServerSessionRole();

  if (role !== "brand") {
    redirect(role === "buyer" ? getDashboardPath(role) : "/login?next=/dashboard/brand");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
