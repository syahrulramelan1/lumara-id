import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "id" | "en";

interface UIStore {
  language: Language;
  toggleLanguage: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      language: "id",
      toggleLanguage: () =>
        set({ language: get().language === "id" ? "en" : "id" }),
    }),
    { name: "lumara-ui-prefs" }
  )
);
