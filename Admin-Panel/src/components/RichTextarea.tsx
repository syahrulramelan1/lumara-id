import { useRef, useEffect, useCallback } from "react";
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaListUl, FaListOl, FaOutdent, FaIndent, FaEraser, FaMinus,
} from "react-icons/fa6";

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/**
 * Strip atribut & style yang merusak tampilan (color, font-family, dst)
 * dari sebuah HTMLElement subtree. Idempotent — aman dipanggil berulang.
 */
function sanitize(el: HTMLElement) {
  // Buang inline style yang ganggu warna/font
  el.querySelectorAll<HTMLElement>("[style]").forEach((node) => {
    const s = node.style;
    s.removeProperty("color");
    s.removeProperty("background-color");
    s.removeProperty("background");
    s.removeProperty("font-family");
    s.removeProperty("font-size");
    s.removeProperty("font-weight"); // biarkan tag <b>/<strong> handle
    s.removeProperty("line-height");
    s.removeProperty("white-space");
    // Hapus atribut style kalau sudah kosong
    if (!node.getAttribute("style")?.trim()) node.removeAttribute("style");
  });
  // Tag <font> legacy dari Word/browser lama
  el.querySelectorAll<HTMLElement>("font").forEach((f) => {
    f.removeAttribute("color");
    f.removeAttribute("face");
    f.removeAttribute("size");
  });
  // Hapus class asing (mis. dari Shopee/Word: QN2lPu, MsoNormal, dll)
  el.querySelectorAll<HTMLElement>("[class]").forEach((node) => {
    node.removeAttribute("class");
  });
}

// ── Tombol toolbar (di luar komponen agar tidak re-render tiap ketik) ──
interface BtnProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}
function ToolBtn({ onClick, title, children, danger }: BtnProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={
        danger
          ? "p-1.5 rounded text-sm transition-colors text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "p-1.5 rounded text-sm transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }
    >
      {children}
    </button>
  );
}
function Sep() {
  return <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1 self-center shrink-0" />;
}

// ── Komponen utama ──
const RichTextarea = ({
  value,
  onChange,
  placeholder = "Tulis deskripsi...",
  minHeight = "200px",
}: RichTextareaProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  // Simpan onChange di ref agar useEffect bisa pakai versi terbaru
  // TANPA jadi dependency (parent biasa pass inline arrow function).
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  // Pegang nilai HTML terakhir yang DI-EMIT oleh editor ini.
  // Mencegah useEffect reset innerHTML & loncatkan caret saat parent
  // re-render dengan value yang sama secara logika.
  const lastEmitted = useRef<string>("");

  // Inisialisasi & sync dari luar (load data produk, reset form)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (value === lastEmitted.current) return;
    el.innerHTML = value || "";
    sanitize(el);
    const cleaned = el.innerHTML;
    lastEmitted.current = cleaned;
    if (cleaned !== value) onChangeRef.current(cleaned);
  }, [value]);

  const focusEditor = () => editorRef.current?.focus();

  const exec = useCallback((cmd: string, arg?: string) => {
    focusEditor();
    document.execCommand(cmd, false, arg);
  }, []);

  const emit = () => {
    const el = editorRef.current;
    if (!el) return;
    sanitize(el);
    const html = el.innerHTML;
    lastEmitted.current = html;
    onChange(html);
  };

  // formatBlock cross-browser: Firefox wajib pakai angle brackets
  const setBlock = (tag: "p" | "h2" | "h3") => {
    exec("formatBlock", `<${tag}>`);
    emit();
  };

  // Paste: ambil HTML, strip style/class, atau fallback plain text
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    if (html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      sanitize(tmp);
      // Hapus tag asing yang tidak kita support
      tmp.querySelectorAll("script,style,meta,link,iframe").forEach((n) => n.remove());
      document.execCommand("insertHTML", false, tmp.innerHTML);
    } else {
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    }
  };

  // Enter di heading → keluar ke paragraf baru (UX umum)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === 1) {
        const tag = (node as HTMLElement).tagName;
        if (tag === "H2" || tag === "H3") {
          // Setelah newline default, paksa block ke <p>
          setTimeout(() => exec("formatBlock", "<p>"), 0);
          return;
        }
      }
      node = node.parentNode;
    }
  };

  // Pilih semua isi editor (utility untuk clearFormat)
  const selectAll = () => {
    const el = editorRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const insertHR = () => {
    exec("insertHTML", "<hr/><p><br/></p>");
    emit();
  };

  // Hapus SEMUA format — selection-aware, fallback select-all
  const clearFormat = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    const isCollapsed = !sel || sel.rangeCount === 0 || sel.getRangeAt(0).collapsed;
    if (isCollapsed) selectAll();
    document.execCommand("removeFormat");
    document.execCommand("formatBlock", false, "<p>");
    // Buang list secara manual (execCommand tidak unwrap list)
    document.execCommand("insertUnorderedList"); // toggle off
    document.execCommand("insertUnorderedList"); // toggle off lagi (no-op kalau sudah off)
    emit();
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:border-[var(--brand,#7C3AED)] focus-within:ring-1 focus-within:ring-[var(--brand,#7C3AED)] transition-colors">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">

        {/* Format blok */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            setBlock(e.target.value as "p" | "h2" | "h3");
            e.target.value = "p"; // reset visual
          }}
          defaultValue="p"
          title="Format teks"
          className="text-xs rounded px-1.5 py-1 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--brand,#7C3AED)]"
        >
          <option value="p">Normal</option>
          <option value="h2">Judul Besar</option>
          <option value="h3">Sub Judul</option>
        </select>

        <Sep />

        {/* Teks dasar */}
        <ToolBtn onClick={() => { exec("bold"); emit(); }}          title="Tebal (Ctrl+B)">      <FaBold          size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("italic"); emit(); }}        title="Miring (Ctrl+I)">     <FaItalic        size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("underline"); emit(); }}     title="Garis bawah (Ctrl+U)"><FaUnderline     size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("strikeThrough"); emit(); }} title="Coret">               <FaStrikethrough size={12} /></ToolBtn>

        <Sep />

        {/* Alignment */}
        <ToolBtn onClick={() => { exec("justifyLeft"); emit(); }}   title="Rata kiri">   <FaAlignLeft    size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("justifyCenter"); emit(); }} title="Rata tengah"> <FaAlignCenter  size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("justifyRight"); emit(); }}  title="Rata kanan">  <FaAlignRight   size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("justifyFull"); emit(); }}   title="Justify">     <FaAlignJustify size={12} /></ToolBtn>

        <Sep />

        {/* List + indent */}
        <ToolBtn onClick={() => { exec("insertUnorderedList"); emit(); }} title="Bullet list">       <FaListUl size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("insertOrderedList"); emit(); }}   title="Numbered list">     <FaListOl size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("outdent"); emit(); }}             title="Kurangi indentasi"> <FaOutdent size={12} /></ToolBtn>
        <ToolBtn onClick={() => { exec("indent"); emit(); }}              title="Tambah indentasi">  <FaIndent  size={12} /></ToolBtn>

        <Sep />

        {/* HR + Clear */}
        <ToolBtn onClick={insertHR}    title="Sisipkan garis pemisah"><FaMinus  size={12} /></ToolBtn>
        <ToolBtn onClick={clearFormat} title="Bersihkan semua format (hilangkan warna/style asing)" danger>
          <FaEraser size={12} />
        </ToolBtn>
      </div>

      {/* ── Area tulis ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={[
          "px-3 py-2.5 text-sm outline-none",
          "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800",
          "leading-relaxed",
          // ── KUNCI FIX MERAH: paksa semua child inherit warna parent ──
          "[&_*]:!text-inherit",
          // Placeholder via CSS (cuma tampil saat benar-benar kosong)
          "[&:empty]:before:content-[attr(data-placeholder)]",
          "[&:empty]:before:text-gray-400 dark:[&:empty]:before:text-gray-500",
          "[&:empty]:before:pointer-events-none [&:empty]:before:select-none",
          // Heading dalam editor — distinct ukuran biar kelihatan
          "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1",
          "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1",
          // Paragraf
          "[&_p]:my-1",
          // List
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
          "[&_li]:my-0.5",
          // HR pemisah
          "[&_hr]:border-0 [&_hr]:border-t [&_hr]:border-gray-200 dark:[&_hr]:border-gray-600 [&_hr]:my-2",
          // Bold/italic/underline visual
          "[&_strong]:font-semibold [&_b]:font-semibold",
          "[&_em]:italic [&_i]:italic",
          "[&_u]:underline",
          "[&_s]:line-through [&_strike]:line-through [&_del]:line-through",
        ].join(" ")}
      />
    </div>
  );
};

export default RichTextarea;
