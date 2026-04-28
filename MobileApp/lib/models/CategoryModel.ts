import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";
import type { CategoryWithCount } from "@/types";

export class CategoryModel {
  private static instance: CategoryModel;
  static getInstance() {
    if (!this.instance) this.instance = new CategoryModel();
    return this.instance;
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  async findAllWithCount(): Promise<CategoryWithCount[]> {
    return prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } });
  }

  async create(data: { name: string; slug: string; description?: string; image?: string }): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; slug: string; description: string; image: string }>): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryModel = CategoryModel.getInstance();
