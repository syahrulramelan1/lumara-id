"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { getT } from "@/lib/i18n";
import { useUIStore } from "@/store/uiStore";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { EASE_OUT_EXPO } from "@/components/motion/variants";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function FooterNavLink({ label, href, delay }: { label: string; href: string; delay: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO, delay }}
    >
      <Link href={href} className="hover:text-white transition-colors">{label}</Link>
    </motion.li>
  );
}

export function Footer() {
  const language = useUIStore((s) => s.language);
  const t = getT(language);
  const site = useSiteSettings();

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInView1 = useInView(col1Ref, { once: true, margin: "-60px" });
  const isInView2 = useInView(col2Ref, { once: true, margin: "-60px" });
  const isInView3 = useInView(col3Ref, { once: true, margin: "-60px" });
  const isBottomInView = useInView(bottomRef, { once: true });

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
          ref={col1Ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        >
          {/* Logo footer — oval jika ada custom logo, fallback teks */}
          {site.logo_white_url ? (
            <div className="h-10 w-[120px] rounded-full overflow-hidden mb-4 bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.logo_white_url}
                alt={site.site_name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <p className="text-lg font-bold text-white mb-2">{site.site_name}</p>
          )}
          <p className="text-sm text-white/60 leading-relaxed mb-4">{t.footer.tagline}</p>
          <SocialLinks variant="footer" />
        </motion.div>

        {/* Kolom 2 */}
        <motion.div
          ref={col2Ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.1 }}
        >
          <h4 className="font-semibold mb-3 text-sm">{t.footer.info}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {navLinks.map(({ label, href }, i) => (
              <FooterNavLink key={href} label={label} href={href} delay={0.15 + i * 0.05} />
            ))}
          </ul>
        </motion.div>

        {/* Kolom 3 */}
        <motion.div
          ref={col3Ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.2 }}
        >
          <h4 className="font-semibold mb-3 text-sm">{t.footer.contact_title}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <a
                href={site.site_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                📍 {site.site_address}<br />
                <span className="pl-5">{site.site_address2}</span>
              </a>
            </li>
            <li>📞 {site.site_phone}</li>
            <li>✉️ {site.site_email}</li>
            <li className="mt-2 whitespace-pre-line">{t.footer.hours}</li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        ref={bottomRef}
        initial={{ opacity: 0 }}
        animate={isBottomInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40"
      >
        © {new Date().getFullYear()} Lumara.id — {t.footer.copyright}
      </motion.div>
    </footer>
  );
}
