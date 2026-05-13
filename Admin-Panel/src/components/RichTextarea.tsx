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

// Hapus semua inline color/font style — penyebab utama teks merah
function sanitize(el: HTMLElement) {
  el.querySelectorAll<HTMLElement>("[style]").forEach((node) => {
    node.style.removeProperty("color");
    node.style.removeProperty("background-color");
    node.style.removeProperty("font-family");
    node.style.removeProperty("font-size");
  });
  // Hapus tag <font color="..."> lama (hasil paste dari Word/browser lain)
  el.querySelectorAll<HTMLElement>("font").forEach((font) => {
    font.removeAttribute("color");
    font.removeAttribute("face");
    font.removeAttribute("size");
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
  minHeight = "180px",
}: RichTextareaProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const skipSync  = useRef(false);

  // Sync value dari luar (misal load data produk) — strip warna sekalian
  useEffect(() => {
    if (!editorRef.current || skipSync.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      sanitize(editorRef.current);
    }
  }, [value]);

  const exec = useCallback((cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
  }, []);

  // Tiap ketik: sanitasi inline color dulu, baru emit
  const handleInput = () => {
    skipSync.current = true;
    if (editorRef.current) sanitize(editorRef.current);
    onChange(editorRef.current?.innerHTML ?? "");
    setTimeout(() => { skipSync.current = false; }, 0);
  };

  // Paste: tolak HTML, ambil plain text saja — cegah warna/font dari luar masuk
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const insertHR = () =>
    exec("insertHTML", "<hr/><p><br></p>");

  const clearFormat = () => {
    exec("removeFormat");
    exec("formatBlock", "p");
    if (editorRef.current) sanitize(editorRef.current);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:border-[var(--brand,#7C3AED)] focus-within:ring-1 focus-within:ring-[var(--brand,#7C3AED)] transition-colors">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">

        {/* Format blok */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            editorRef.current?.focus();
            document.execCommand("formatBlock", false, e.target.value);
            e.target.value = "p";
          }}
          defaultValue="p"
          title="Format teks"
          className="text-xs rounded px-1 py-1 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 cursor-pointer focus:outline-none"
        >
          <option value="p">Normal</option>
          <option value="h2">Judul 2</option>
          <option value="h3">Judul 3</option>
        </select>

        <Sep />

        {/* Teks dasar */}
        <ToolBtn onClick={() => exec("bold")}          title="Tebal (Ctrl+B)">      <FaBold        size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("italic")}        title="Miring (Ctrl+I)">     <FaItalic      size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("underline")}     title="Garis bawah (Ctrl+U)"><FaUnderline   size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("strikeThrough")} title="Coret">               <FaStrikethrough size={12} /></ToolBtn>

        <Sep />

        {/* Alignment */}
        <ToolBtn onClick={() => exec("justifyLeft")}   title="Rata kiri">        <FaAlignLeft    size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("justifyCenter")} title="Rata tengah">      <FaAlignCenter  size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("justifyRight")}  title="Rata kanan">       <FaAlignRight   size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("justifyFull")}   title="Justify">          <FaAlignJustify size={12} /></ToolBtn>

        <Sep />

        {/* List + indent */}
        <ToolBtn onClick={() => exec("insertUnorderedList")} title="Bullet list">      <FaListUl size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("insertOrderedList")}   title="Numbered list">    <FaListOl size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("outdent")}             title="Kurangi indentasi"><FaOutdent size={12} /></ToolBtn>
        <ToolBtn onClick={() => exec("indent")}              title="Tambah indentasi"> <FaIndent  size={12} /></ToolBtn>

        <Sep />

        {/* Garis pemisah + bersihkan */}
        <ToolBtn onClick={insertHR}     title="Sisipkan garis pemisah"><FaMinus  size={12} /></ToolBtn>
        <ToolBtn onClick={clearFormat}  title="Bersihkan semua format (fix warna merah)" danger>
          <FaEraser size={12} />
        </ToolBtn>
      </div>

      {/* ── Area tulis ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={[
          "px-3 py-2.5 text-sm outline-none",
          "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800",
          "leading-relaxed",
          // ── KUNCI FIX MERAH: paksa semua child inherit warna parent ──
          "[&_*]:!text-inherit",
          // Placeholder CSS
          "[&:empty]:before:content-[attr(data-placeholder)]",
          "[&:empty]:before:text-gray-400 dark:[&:empty]:before:text-gray-500",
          "[&:empty]:before:pointer-events-none [&:empty]:before:select-none",
          // Heading dalam editor
          "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1",
          "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-0.5",
          // List
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
          "[&_li]:my-0.5",
          // HR pemisah
          "[&_hr]:border-0 [&_hr]:border-t [&_hr]:border-gray-200 dark:[&_hr]:border-gray-600 [&_hr]:my-2",
        ].join(" ")}
      />
    </div>
  );
};

export default RichTextarea;
