"use client";

import { create } from "zustand";
import type { Program } from "@/lib/json-db";
import { ADMIN_TOKEN_KEY } from "@/lib/site-config";

export type AdminView = "login" | "list" | "form";
/** Mode penyimpanan program yang dilaporkan API */
export type StorageMode = "database" | "file";

interface AppStore {
  /** Daftar program dari database */
  programs: Program[];
  programsLoading: boolean;
  /** Backend penyimpanan aktif (database = permanen di Vercel) */
  storage: StorageMode | null;
  fetchPrograms: () => Promise<void>;

  /** Sesi admin (dikelola via event, bukan effect) */
  adminOpen: boolean;
  adminToken: string | null;
  adminView: AdminView;
  openAdmin: () => void;
  closeAdmin: () => void;
  setAdminToken: (token: string | null) => void;
  setAdminView: (view: AdminView) => void;
  logoutAdmin: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  programs: [],
  programsLoading: true,
  storage: null,
  fetchPrograms: async () => {
    set({ programsLoading: true });
    try {
      const res = await fetch("/api/programs", { cache: "no-store" });
      const data = await res.json();
      set({
        programs: Array.isArray(data.programs) ? data.programs : [],
        storage: data.storage === "database" ? "database" : data.storage === "file" ? "file" : null,
      });
    } catch {
      // Jika gagal, biarkan daftar kosong (UI menampilkan pesan)
    } finally {
      set({ programsLoading: false });
    }
  },

  adminOpen: false,
  adminToken: null,
  adminView: "login",
  openAdmin: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(ADMIN_TOKEN_KEY);
    set({
      adminOpen: true,
      adminToken: saved,
      adminView: saved ? "list" : "login",
    });
  },
  closeAdmin: () => set({ adminOpen: false }),
  setAdminToken: (token) => set({ adminToken: token }),
  setAdminView: (view) => set({ adminView: view }),
  logoutAdmin: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
    set({ adminToken: null, adminView: "login" });
  },
}));
