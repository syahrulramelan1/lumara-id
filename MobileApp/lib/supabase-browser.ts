import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton — cegah listener bocor & multiple Supabase clients di tab yang sama.
// Tanpa singleton, tiap render component bikin instance baru → onAuthStateChange
// listener numpuk, recovery event bisa missed.
let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClientComponent() {
  if (!cachedClient) {
    cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return cachedClient;
}
