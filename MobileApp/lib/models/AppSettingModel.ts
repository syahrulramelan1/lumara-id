import { prisma } from "@/lib/prisma";

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  site_address2: string;
  site_maps_url: string;
  site_hours: string;
  whatsapp_number: string;
  whatsapp_message: string;
  instagram_handle: string;
  instagram_url: string;
  tiktok_handle: string;
  tiktok_url: string;
  shopee_handle: string;
  shopee_url: string;
  // URL custom logo — kosong = pakai file statis /api/logo/[variant]
  logo_dark_url: string;   // logo untuk light mode (gelap di bg putih)
  logo_white_url: string;  // logo untuk dark mode (putih di bg gelap)
}

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  site_name: "Lumara.id",
  site_tagline: "Modest Fashion Premium Indonesia",
  site_email: "hello@lumara.id",
  site_phone: "+62 852-8573-3391",
  site_address: "Jl. Munggang No.52, Kramat Jati",
  site_address2: "Jakarta Timur 13530",
  site_maps_url: "https://maps.app.goo.gl/YP6yXntqmPhmMrQ87",
  site_hours: "Senin – Sabtu\n09.00 – 17.00 WIB",
  whatsapp_number: "6285285733391",
  whatsapp_message: "Halo Lumara.id, saya mau tanya tentang produk kakak.",
  instagram_handle: "@lumara.ind",
  instagram_url: "https://www.instagram.com/lumara.ind",
  tiktok_handle: "@lumaraid",
  tiktok_url: "https://www.tiktok.com/@lumaraid",
  shopee_handle: "lumaraid",
  shopee_url: "https://shopee.co.id/lumaraid",
  logo_dark_url: "",
  logo_white_url: "",
};

const SITE_SETTINGS_KEYS = Object.keys(SITE_SETTINGS_DEFAULTS) as (keyof SiteSettings)[];

export class AppSettingModel {
  private static instance: AppSettingModel;
  static getInstance() {
    if (!this.instance) this.instance = new AppSettingModel();
    return this.instance;
  }

  async get(key: string, defaultValue = ""): Promise<string> {
    const row = await prisma.appSetting.findUnique({ where: { key } });
    return row?.value ?? defaultValue;
  }

  async set(key: string, value: string): Promise<void> {
    await prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getMany(keys: string[]): Promise<Record<string, string>> {
    const rows = await prisma.appSetting.findMany({ where: { key: { in: keys } } });
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return map;
  }

  async setMany(settings: Record<string, string>): Promise<void> {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.appSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const rows = await this.getMany(SITE_SETTINGS_KEYS);
    const result = { ...SITE_SETTINGS_DEFAULTS };
    for (const key of SITE_SETTINGS_KEYS) {
      if (rows[key] !== undefined) result[key] = rows[key];
    }
    return result;
  }

  async setSiteSettings(data: Partial<SiteSettings>): Promise<void> {
    const filtered: Record<string, string> = {};
    for (const key of SITE_SETTINGS_KEYS) {
      if (data[key] !== undefined) filtered[key] = data[key] as string;
    }
    await this.setMany(filtered);
  }

  async isMaintenanceMode(): Promise<boolean> {
    const val = await this.get("maintenance_mode", "false");
    return val === "true";
  }

  async setMaintenanceMode(active: boolean): Promise<void> {
    await this.set("maintenance_mode", active ? "true" : "false");
  }
}

export const appSettingModel = AppSettingModel.getInstance();
