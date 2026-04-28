import { prisma } from "@/lib/prisma";

export abstract class BaseModel {
  protected static prisma = prisma;

  static async findById<T>(
    delegate: { findUnique: (args: { where: { id: string } }) => Promise<T | null> },
    id: string
  ): Promise<T | null> {
    return delegate.findUnique({ where: { id } });
  }

  static async count(
    delegate: { count: (args?: object) => Promise<number> },
    where?: object
  ): Promise<number> {
    return delegate.count(where ? { where } : undefined);
  }
}
