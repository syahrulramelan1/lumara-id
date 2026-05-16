/** Compress + resize image sebelum upload — cegah 413 dari Vercel (batas 4.5MB).
 *  maxWidth dinaikkan ke 2400 supaya gambar produk tetap tajam saat di-zoom 2x+.
 *  quality dinaikkan ke 0.92 — beda tipis di file size tapi jauh lebih tajam.
 */
export async function compressImage(
  file: File,
  maxWidth = 2400,
  quality = 0.92,
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // Sudah kecil (<800KB) dan tidak perlu resize → lewati
  if (file.size < 800 * 1024) return file;

  const isPng = file.type === "image/png";

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

      // Aktifkan high-quality interpolation untuk canvas — gambar lebih tajam
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (!isPng) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = isPng ? "image/png" : "image/jpeg";
      const ext      = isPng ? "png" : "jpg";

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const result = blob.size < file.size
            ? new File([blob], file.name.replace(/\.[^.]+$/, `.${ext}`), { type: mimeType })
            : file;
          resolve(result);
        },
        mimeType,
        quality,
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}
