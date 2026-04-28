import { userModel } from "@/lib/models/UserModel";
import type { User } from "@prisma/client";

export class AuthService {
  private static instance: AuthService;
  static getInstance() {
    if (!this.instance) this.instance = new AuthService();
    return this.instance;
  }

  async getOrCreateUser(email: string, name?: string, avatar?: string): Promise<User> {
    const existing = await userModel.findByEmail(email);
    if (existing) return existing;
    return userModel.create({ email, name, avatar });
  }

  async getUserById(id: string): Promise<User | null> {
    return userModel.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return userModel.findByEmail(email);
  }

  async updateProfile(id: string, data: Partial<{ name: string; phone: string; avatar: string }>) {
    return userModel.updateProfile(id, data);
  }

  isAdmin(user: User): boolean {
    return user.role === "ADMIN";
  }
}

export const authService = AuthService.getInstance();
