import { FAQSection, SearchInput, Sidebar } from "../components";
import { faqs } from "../utils/data";

const HelpDesk = () => {
  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Help Desk</h2>
            <p className="page-subtitle">Pertanyaan umum & panduan penggunaan</p>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-6">
          <SearchInput placeholder="Cari pertanyaan..." />
          <FAQSection faqs={faqs} />
        </div>
      </div>
    </div>
  );
};
export default HelpDesk;
