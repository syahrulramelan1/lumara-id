import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ━━━━━━ FONT ━━━━━━
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },

      // ━━━━━━ COLORS ━━━━━━
      colors: {
        // Brand
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          container: "var(--primary-container)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          container: "var(--secondary-container)",
          foreground: "var(--secondary-foreground)",
        },

        // Surfaces
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          low: "var(--surface-low)",
          high: "var(--surface-high)",
        },
        card: {
          DEFAULT: "var(--card)",
          border: "var(--card-border)",
          foreground: "var(--card-foreground)",
        },

        // Text
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },

        // Dark footer
        dark: "#111111",

        // States
        outline: "var(--outline)",
        success: "var(--success)",
        error: "var(--error)",
        rating: "var(--rating)",

        // shadcn compatibility
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },

      // ━━━━━━ BORDER RADIUS ━━━━━━
      borderRadius: {
        card: "14px",
        btn: "12px",
        pill: "9999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // ━━━━━━ TYPOGRAPHY SCALE ━━━━━━
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["36px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["28px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "title-lg": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.03em", fontWeight: "500" }],
      },

      // ━━━━━━ SPACING ━━━━━━
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },

      // ━━━━━━ BOX SHADOW ━━━━━━
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 6px 20px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        violet: "0 8px 32px -4px rgba(99, 14, 212, 0.16)",
        "violet-sm": "0 4px 16px -2px rgba(99, 14, 212, 0.08)",
        "violet-lg": "0 16px 48px -8px rgba(99, 14, 212, 0.24)",
      },

      // ━━━━━━ ANIMATIONS ━━━━━━
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
