"use client";
import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

export function UIProvider({ children }: { children: React.ReactNode }) {
  const colorTheme = useUIStore((s) => s.colorTheme);

  useEffect(() => {
    const html = document.documentElement;
    if (colorTheme === "purple") {
      html.setAttribute("data-theme", "purple");
    } else {
      html.removeAttribute("data-theme");
    }
  }, [colorTheme]);

  return <>{children}</>;
}
