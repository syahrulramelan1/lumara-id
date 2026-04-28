/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        // Legacy (keep for compatibility)
        blackPrimary: "#0D0B14",
        blackSecondary: "rgba(28,24,41,0.95)",
        whiteSecondary: "#F5F3FF",
        // New design tokens
        brand: {
          50:  "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6d28d9",
          900: "#5b21b6",
        },
        surface: {
          light: "#ffffff",
          "light-2": "#f5f3ff",
          "light-3": "#ede9fe",
          dark:  "#0D0B14",
          "dark-2": "#1C1829",
          "dark-3": "#251f38",
        },
      },
      boxShadow: {
        "card": "0 1px 3px rgba(109,40,217,.08), 0 4px 16px rgba(109,40,217,.06)",
        "card-dark": "0 1px 3px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.3)",
        "glow": "0 0 20px rgba(168,85,247,.25)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
        "sidebar-gradient": "linear-gradient(180deg, #1C1829 0%, #0D0B14 100%)",
      },
      borderRadius: {
        "xl2": "1rem",
        "xl3": "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
