import type { Metadata } from "next";
import { categoryModel } from "@/lib/models/CategoryModel";
import { CategoriesClientPage } from "@/components/shared/CategoriesClientPage";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await categoryModel.findAllWithCount();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategoriesClientPage categories={categories} />
    </div>
  );
}
