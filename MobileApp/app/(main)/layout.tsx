import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { appSettingModel } from "@/lib/models/AppSettingModel";

// Layout ini selalu dynamic — supaya maintenance check tidak ter-skip oleh static rendering.
export const dynamic = "force-dynamic";

// Cache hasil pengecekan maintenance — di-tag biar bisa di-invalidate
// langsung dari endpoint PATCH /api/admin/settings (revalidateTag("maintenance")).
// Revalidate fallback 60s untuk safety net.
const getMaintenanceStatus = unstable_cache(
  () => appSettingModel.isMaintenanceMode(),
  ["maintenance-status"],
  { revalidate: 60, tags: ["maintenance"] }
);

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const maintenance = await getMaintenanceStatus();
  if (maintenance) redirect("/maintenance");

  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BottomNav />
      <FloatingWhatsApp />
    </>
  );
}
