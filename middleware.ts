import { NextRequest, NextResponse } from "next/server";

import { getDashboardPath, isDashboardPath } from "@/lib/auth/redirects";
import { DEMO_SESSION_COOKIE, getRoleFromSessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const role = await getRoleFromSessionToken(request.cookies.get(DEMO_SESSION_COOKIE)?.value);
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (role === "guest") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (!isDashboardPath(pathname, role)) {
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
    }
  }

  if ((pathname === "/login" || pathname === "/register") && role !== "guest") {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"]
};
