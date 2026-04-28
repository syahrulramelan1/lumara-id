"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Theme Provider untuk lumara.id
 *
 * Menggunakan next-themes dengan konfigurasi:
 * - attribute: "class" → toggle .dark class di <html>
 * - defaultTheme: "system" → ikuti preferensi OS user
 * - enableSystem: true → support prefers-color-scheme
 * - disableTransitionOnChange: true → cegah flash saat toggle
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
