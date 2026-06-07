import type { AccountRole } from "@/lib/auth/types";

const DEFAULT_REDIRECT = "/";

export function getSafeNext(value: string | null | undefined, fallback = DEFAULT_REDIRECT) {
  if (!value) {
    return fallback;
  }

  try {
    let decodedValue = value;

    for (let pass = 0; pass < 4; pass += 1) {
      if (
        !decodedValue.startsWith("/") ||
        decodedValue.startsWith("//") ||
        decodedValue.includes("\\") ||
        /[\r\n]/.test(decodedValue)
      ) {
        return fallback;
      }

      try {
        const nextDecodedValue = decodeURIComponent(decodedValue);
        if (nextDecodedValue === decodedValue) {
          break;
        }
        decodedValue = nextDecodedValue;
      } catch {
        break;
      }
    }

    const url = new URL(value, "https://wholee-store.local");

    if (url.origin !== "https://wholee-store.local") {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function getDashboardPath(role: AccountRole) {
  return `/dashboard/${role}`;
}

export function isDashboardPath(pathname: string, role: AccountRole) {
  const dashboardPath = getDashboardPath(role);
  return pathname === dashboardPath || pathname.startsWith(`${dashboardPath}/`);
}

export function getLoginRedirect(role: AccountRole, next?: string | null) {
  return getSafeNext(next, getDashboardPath(role));
}

export function getRegistrationRedirect(role: AccountRole, next?: string | null) {
  return role === "brand" ? getDashboardPath(role) : getSafeNext(next, getDashboardPath(role));
}
