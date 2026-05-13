import { useRef, useEffect, useCallback } from "react";
import {
  FaBold, FaItalic, FaUnderline,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
} from "react-icons/fa6";

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextarea = ({ value, onChange, placeholder = "Tulis deskripsi..." }: RichTextareaProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);

  // Sync value dari luar hanya saat bukan user yang mengetik
  useEffect(() => {
    if (!editorRef.current || skipSync.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = useCallback((command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
  }, []);

  const handleInput = () => {
    skipSync.current = true;
    onChange(editorRef.current?.innerHTML ?? "");
    // reset flag setelah render cycle
    setTimeout(() => { skipSync.current = false; }, 0);
  };

  const Btn = ({
    onClick, title, children, className = "",
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:border-[var(--brand,#7C3AED)] focus-within:ring-1 focus-within:ring-[var(--brand,#7C3AED)] transition-colors">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">

        {/* Ukuran / Format blok */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            editorRef.current?.focus();
            document.execCommand("formatBlock", false, e.target.value);
            e.target.value = "p"; // reset visual
          }}
          defaultValue="p"
          title="Format teks"
          className="text-xs rounded px-1 py-1 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 cursor-pointer focus:outline-none"
        >
          <option value="p">Normal</option>
          <option value="h2">Judul 2</option>
          <option value="h3">Judul 3</option>
        </select>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Bold / Italic / Underline */}
        <Btn onClick={() => exec("bold")} title="Tebal (Ctrl+B)">
          <FaBold size={12} />
        </Btn>
        <Btn onClick={() => exec("italic")} title="Miring (Ctrl+I)">
          <FaItalic size={12} />
        </Btn>
        <Btn onClick={() => exec("underline")} title="Garis bawah (Ctrl+U)">
          <FaUnderline size={12} />
        </Btn>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Alignment */}
        <Btn onClick={() => exec("justifyLeft")} title="Rata kiri">
          <FaAlignLeft size={12} />
        </Btn>
        <Btn onClick={() => exec("justifyCenter")} title="Rata tengah">
          <FaAlignCenter size={12} />
        </Btn>
        <Btn onClick={() => exec("justifyRight")} title="Rata kanan">
          <FaAlignRight size={12} />
        </Btn>
        <Btn onClick={() => exec("justifyFull")} title="Rata kanan-kiri (justify)">
          <FaAlignJustify size={12} />
        </Btn>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* List */}
        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list">
          <span className="text-xs font-mono leading-none">• =</span>
        </Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered list">
          <span className="text-xs font-mono leading-none">1.</span>
        </Btn>
      </div>

      {/* ── Editor area ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className={[
          "min-h-[120px] px-3 py-2.5 text-sm outline-none",
          "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800",
          "leading-relaxed",
          // placeholder via CSS
          "[&:empty]:before:content-[attr(data-placeholder)]",
          "[&:empty]:before:text-gray-400 dark:[&:empty]:before:text-gray-500",
          "[&:empty]:before:pointer-events-none",
          // heading styles dalam editor
          "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1",
          "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-1.5 [&_h3]:mb-0.5",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
        ].join(" ")}
      />
    </div>
  );
};

export default RichTextarea;
