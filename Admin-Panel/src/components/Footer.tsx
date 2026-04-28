const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">L</span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            lumara.id Admin Panel
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center">
          Developed by{" "}
          <a
            href="https://sync.id"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Sync.id
          </a>
          {" "}· © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </footer>
  );
};
export default Footer;
