import { NextRequest, NextResponse } from "next/server";

import {
  createSessionToken,
  DEMO_SESSION_COOKIE,
  demoSessionCookieOptions,
  getRoleFromSessionToken
} from "@/lib/auth/session";
import type { AccountRole } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

function isAccountRole(value: unknown): value is AccountRole {
  return value === "buyer" || value === "brand";
}

export async function GET(request: NextRequest) {
  const role = await getRoleFromSessionToken(request.cookies.get(DEMO_SESSION_COOKIE)?.value);

  return NextResponse.json(
    { role },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { role?: unknown } | null;

  if (!isAccountRole(body?.role)) {
    return NextResponse.json({ error: "Допустимы роли buyer или brand" }, { status: 400 });
  }

  const response = NextResponse.json({ role: body.role });
  response.cookies.set(DEMO_SESSION_COOKIE, await createSessionToken(body.role), demoSessionCookieOptions);
  return response;
}

export function DELETE() {
  const response = NextResponse.json({ role: "guest" });
  response.cookies.set(DEMO_SESSION_COOKIE, "", {
    ...demoSessionCookieOptions,
    maxAge: 0
  });
  return response;
}
