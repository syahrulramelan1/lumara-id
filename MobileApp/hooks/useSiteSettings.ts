"use client";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/models/AppSettingModel";
import { SITE_SETTINGS_DEFAULTS } from "@/lib/models/AppSettingModel";

let cache: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  if (cache) return cache;
  if (!fetchPromise) {
    fetchPromise = fetch("/api/settings", { next: { revalidate: 60 } } as RequestInit)
      .then((r) => r.json())
      .then((json) => {
        cache = json.success ? { ...SITE_SETTINGS_DEFAULTS, ...json.data } : SITE_SETTINGS_DEFAULTS;
        return cache!;
      })
      .catch(() => SITE_SETTINGS_DEFAULTS);
  }
  return fetchPromise;
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(cache ?? SITE_SETTINGS_DEFAULTS);

  useEffect(() => {
    if (cache) { setSettings(cache); return; }
    fetchSettings().then(setSettings);
  }, []);

  return settings;
}
