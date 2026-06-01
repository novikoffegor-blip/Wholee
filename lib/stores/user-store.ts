"use client";

import { create } from "zustand";
import type { User } from "@/types";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Zustand пригодится позже для авторизации и выбранной роли пользователя.
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));
