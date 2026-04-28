import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorTheme = "white" | "purple";
export type Language = "id" | "en";

interface UIStore {
  colorTheme: ColorTheme;
  language: Language;
  toggleColorTheme: () => void;
  toggleLanguage: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      colorTheme: "white",
      language: "id",
      toggleColorTheme: () =>
        set({ colorTheme: get().colorTheme === "white" ? "purple" : "white" }),
      toggleLanguage: () =>
        set({ language: get().language === "id" ? "en" : "id" }),
    }),
    { name: "lumara-ui-prefs" }
  )
);
