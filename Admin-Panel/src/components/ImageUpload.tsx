import { useRef, useState } from "react";

interface ImageUploadProps {
  onFileSelect?: (file: File) => void;
  multiple?: boolean;
  onFilesSelect?: (files: File[]) => void;
}

const ImageUpload = ({ onFileSelect, multiple = false, onFilesSelect }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (multiple && onFilesSelect) {
      onFilesSelect(files);
      setPreviews(files.map((f) => URL.createObjectURL(f)));
    } else if (onFileSelect) {
      onFileSelect(files[0]);
      setPreviews([URL.createObjectURL(files[0])]);
    }
  };

  return (
    <div className="mt-5">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer dark:bg-blackPrimary bg-whiteSecondary dark:hover:border-gray-500 hover:border-gray-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-3 dark:text-whiteSecondary text-blackPrimary" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p className="text-sm dark:text-whiteSecondary text-blackPrimary">
            <span className="font-semibold">Klik untuk upload</span> atau drag & drop
          </p>
          <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">PNG, JPG, WEBP (maks. 5MB)</p>
        </div>
      </label>
      <input
        ref={inputRef}
        id="dropzone-file"
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {previews.map((src, i) => (
            <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded border dark:border-gray-600 border-gray-300" />
          ))}
        </div>
      )}
    </div>
  );
};
export default ImageUpload;
