import { prisma } from "@/lib/prisma";

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

  async isMaintenanceMode(): Promise<boolean> {
    const val = await this.get("maintenance_mode", "false");
    return val === "true";
  }

  async setMaintenanceMode(active: boolean): Promise<void> {
    await this.set("maintenance_mode", active ? "true" : "false");
  }
}

export const appSettingModel = AppSettingModel.getInstance();
