"use client";
import Link from "next/link";
import { getT } from "@/lib/i18n";
import { useUIStore } from "@/store/uiStore";
import { SocialLinks } from "@/components/shared/SocialLinks";

export function Footer() {
  const language = useUIStore((s) => s.language);
  const t = getT(language);
  return (
    <footer className="bg-dark text-white mt-16 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            Lumara.id
          </h3>
          <p className="text-sm text-white/60 leading-relaxed mb-4">{t.footer.tagline}</p>
          <SocialLinks variant="footer" />
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">{t.footer.info}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {[
              { label: t.footer.about, href: "/about" },
              { label: t.footer.how_to_order, href: "/how-to-order" },
              { label: t.footer.shipping, href: "/shipping" },
              { label: t.footer.return, href: "/return" },
              { label: t.footer.contact_link, href: "/contact" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">{t.footer.contact_title}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>📍 Jakarta, Indonesia</li>
            <li>📞 +62 812-3456-7890</li>
            <li>✉️ hello@lumara.id</li>
            <li className="mt-2 whitespace-pre-line">{t.footer.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Lumara.id — {t.footer.copyright}
      </div>
    </footer>
  );
}
