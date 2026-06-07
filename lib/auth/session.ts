import type { AccountRole, AuthRole } from "@/lib/auth/types";

export const DEMO_SESSION_COOKIE = "wholee-demo-session";

const SESSION_VERSION = "v1";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

function getSecret() {
  return process.env.DEMO_SESSION_SECRET ?? "wholee-store-local-demo-session";
}

function isAccountRole(value: string): value is AccountRole {
  return value === "buyer" || value === "brand";
}

function toBase64Url(value: ArrayBuffer) {
  const bytes = new Uint8Array(value);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return toBase64Url(signature);
}

function signaturesMatch(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function createSessionToken(role: AccountRole) {
  const payload = `${SESSION_VERSION}.${role}`;
  return `${payload}.${await sign(payload)}`;
}

export async function getRoleFromSessionToken(token: string | undefined): Promise<AuthRole> {
  if (!token) {
    return "guest";
  }

  const [version, role, signature, ...rest] = token.split(".");
  if (version !== SESSION_VERSION || !isAccountRole(role) || !signature || rest.length > 0) {
    return "guest";
  }

  const expectedSignature = await sign(`${version}.${role}`);
  return signaturesMatch(signature, expectedSignature) ? role : "guest";
}

export async function getDemoSession() {
  const { cookies } = await import("next/headers");
  const role = await getRoleFromSessionToken(cookies().get(DEMO_SESSION_COOKIE)?.value);

  return { role };
}

export const demoSessionCookieOptions = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production"
};
