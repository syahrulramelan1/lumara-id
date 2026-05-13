"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { getT } from "@/lib/i18n";
import { useUIStore } from "@/store/uiStore";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { EASE_OUT_EXPO } from "@/components/motion/variants";

export function Footer() {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  const navLinks = [
    { label: t.footer.about, href: "/about" },
    { label: t.footer.how_to_order, href: "/how-to-order" },
    { label: t.footer.shipping, href: "/shipping" },
    { label: t.footer.return, href: "/return" },
    { label: t.footer.contact_link, href: "/contact" },
  ];

  return (
    <footer className="bg-dark text-white mt-16 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        >
          <p className="text-sm text-white/60 leading-relaxed mb-4">{t.footer.tagline}</p>
          <SocialLinks variant="footer" />
        </motion.div>

        {/* Kolom 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.1 }}
        >
          <h4 className="font-semibold mb-3 text-sm">{t.footer.info}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {navLinks.map(({ label, href }, i) => (
              <motion.li
                key={href}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO, delay: 0.15 + i * 0.05 }}
              >
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Kolom 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.2 }}
        >
          <h4 className="font-semibold mb-3 text-sm">{t.footer.contact_title}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>📍 Jakarta, Indonesia</li>
            <li>📞 +62 852-8573-3391</li>
            <li>✉️ hello@lumara.id</li>
            <li className="mt-2 whitespace-pre-line">{t.footer.hours}</li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40"
      >
        © {new Date().getFullYear()} Lumara.id — {t.footer.copyright}
      </motion.div>
    </footer>
  );
}
