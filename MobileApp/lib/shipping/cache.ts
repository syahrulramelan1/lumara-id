/**
 * In-memory cache untuk shipping data — hemat quota Komerce.
 * Per-instance Vercel Lambda. Warm container → shared, cold start → kosong.
 *
 * Trade-off: bukan persistent storage. Kalau butuh shared across regions,
 * upgrade ke Upstash Redis. Untuk skala UMKM, in-memory cukup karena
 * kebanyakan traffic burst dilayani oleh warm container yang sama.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number; // Date.now() + ttl
}

const store = new Map<string, CacheEntry<unknown>>();

const MAX_ENTRIES = 1000;

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiry < Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  // Hindari memory bloat — evict entry oldest kalau penuh
  if (store.size >= MAX_ENTRIES) {
    const oldest = [...store.entries()].sort((a, b) => a[1].expiry - b[1].expiry)[0];
    if (oldest) store.delete(oldest[0]);
  }
  store.set(key, { data, expiry: Date.now() + ttlMs });
}

export const TTL = {
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;
