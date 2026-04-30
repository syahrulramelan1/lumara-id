"use client";
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  role: string;
}

interface AuthStore {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setDbUser: (dbUser: DbUser | null) => void;
  setLoading: (v: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  dbUser: null,
  loading: true,
  setUser:    (user)    => set({ user }),
  setDbUser:  (dbUser)  => set({ dbUser }),
  setLoading: (loading) => set({ loading }),
  clear: () => set({ user: null, dbUser: null, loading: false }),
}));
