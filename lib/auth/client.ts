"use client";

import type { AccountRole, DemoSessionResponse } from "@/lib/auth/types";

async function readResponse(response: Response) {
  if (!response.ok) {
    throw new Error("Не удалось обновить демо-сессию");
  }

  return (await response.json()) as DemoSessionResponse;
}

export async function getDemoSession() {
  return readResponse(
    await fetch("/api/demo-session", {
      cache: "no-store"
    })
  );
}

export async function createDemoSession(role: AccountRole) {
  return readResponse(
    await fetch("/api/demo-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role })
    })
  );
}

export async function deleteDemoSession() {
  return readResponse(
    await fetch("/api/demo-session", {
      method: "DELETE"
    })
  );
}
