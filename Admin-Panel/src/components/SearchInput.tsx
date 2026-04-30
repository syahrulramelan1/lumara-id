import { useRef, useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ value, onChange, placeholder = "Cari...", className = "" }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState("");
  const controlled = value !== undefined;
  const displayValue = controlled ? value! : internal;
  const handleChange = (v: string) => { if (controlled) onChange?.(v); else setInternal(v); };

  return (
    <div
      className={`group flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 focus-within:border-[var(--brand)] focus-within:shadow-[0_0_0_3px_rgba(124,58,237,.12)] overflow-hidden ${className}`}
    >
      <div className="pl-3.5 pr-2 flex items-center flex-shrink-0">
        <HiSearch className="text-[1.05rem] text-[var(--text-muted)] group-focus-within:text-[var(--brand)] transition-colors duration-200" />
      </div>

      <input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-[42px] bg-transparent text-[var(--text)] text-sm placeholder:text-[var(--text-muted)] outline-none min-w-0"
      />

      {displayValue && (
        <button
          type="button"
          onClick={() => { handleChange(""); ref.current?.focus(); }}
          className="mr-2 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] transition-all"
          aria-label="Hapus pencarian"
        >
          <HiX className="text-xs" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
