import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { appSettingModel } from "@/lib/models/AppSettingModel";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const maintenance = await appSettingModel.isMaintenanceMode();
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
