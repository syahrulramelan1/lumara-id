import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { appSettingModel } from "@/lib/models/AppSettingModel";

// Cache hasil pengecekan maintenance 30 detik — tidak hit DB setiap request
const getMaintenanceStatus = unstable_cache(
  () => appSettingModel.isMaintenanceMode(),
  ["maintenance-status"],
  { revalidate: 30 }
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
    </>
  );
}
