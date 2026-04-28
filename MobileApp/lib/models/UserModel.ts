import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export class UserModel {
  private static instance: UserModel;
  static getInstance() {
    if (!this.instance) this.instance = new UserModel();
    return this.instance;
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; name?: string; avatar?: string; phone?: string; role?: string }): Promise<User> {
    return prisma.user.create({ data });
  }

  async updateProfile(
    id: string,
    data: Partial<{ name: string; phone: string; avatar: string }>
  ): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async findAll(page = 1, limit = 20): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.user.count(),
    ]);
    return { data, total };
  }
}

export const userModel = UserModel.getInstance();
