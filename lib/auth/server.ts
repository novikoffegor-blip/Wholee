import "server-only";

import { cookies } from "next/headers";

import { DEMO_SESSION_COOKIE, getRoleFromSessionToken } from "@/lib/auth/session";

export async function getServerSessionRole() {
  return getRoleFromSessionToken(cookies().get(DEMO_SESSION_COOKIE)?.value);
}
