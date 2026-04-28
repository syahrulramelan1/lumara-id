import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Client-side Supabase (browser)
// Gunakan di Client Components ('use client')
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function createClientComponent() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Server-side Supabase (RSC / API routes)
// Gunakan di Server Components & Route Handlers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function createServerComponent() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
          });
        } catch {
          // Server Components tidak bisa set cookies — diabaikan
        }
      },
    },
  });
}
