/** Compress + resize image sebelum upload — cegah 413 dari Vercel (batas 4.5MB) */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.75,
): Promise<File> {
  // Kalau bukan gambar atau ukurannya sudah kecil (<300KB), lewati
  if (!file.type.startsWith("image/") || file.size < 300 * 1024) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          // Kalau hasil kompresi lebih besar dari aslinya (jarang), pakai aslinya
          const result = blob.size < file.size
            ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })
            : file;
          resolve(result);
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}
