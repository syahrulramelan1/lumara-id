import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONT — Plus Jakarta Sans
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  preload: true,
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METADATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const metadata: Metadata = {
  title: {
    default: "lumara.id — Modest Fashion Premium Indonesia",
    template: "%s | lumara.id",
  },
  description:
    "Platform belanja modest fashion premium Indonesia. Temukan koleksi gamis, hijab, abaya, mukena, dan aksesoris syar'i berkualitas dengan harga terjangkau.",
  keywords: [
    "modest fashion",
    "gamis premium",
    "hijab voal",
    "abaya elegant",
    "mukena syar'i",
    "muslimah indonesia",
    "fashion muslim",
    "lumara.id",
  ],
  authors: [{ name: "lumara.id" }],
  creator: "lumara.id",
  publisher: "lumara.id",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://lumara.id",
    siteName: "lumara.id",
    title: "lumara.id — Modest Fashion Premium",
    description: "Tampil Anggun, Tetap Syar'i — Koleksi modest fashion eksklusif untuk muslimah Indonesia",
  },
  twitter: {
    card: "summary_large_image",
    title: "lumara.id — Modest Fashion Premium",
    description: "Tampil Anggun, Tetap Syar'i",
  },
  manifest: "/manifest.json",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIEWPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#630ED4" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0A1E" },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROOT LAYOUT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased min-h-screen bg-background text-text-primary`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={3000}
            toastOptions={{
              style: {
                fontFamily: "var(--font-jakarta)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              className: "font-sans",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
