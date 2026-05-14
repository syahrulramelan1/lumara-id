/** Compress + resize image sebelum upload — cegah 413 dari Vercel (batas 4.5MB) */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.8,
): Promise<File> {
  // Bukan gambar → lewati
  if (!file.type.startsWith("image/")) return file;
  // Sudah kecil (<400KB) dan tidak perlu resize → lewati
  if (file.size < 400 * 1024) return file;

  // PNG dengan transparansi → tetap PNG (jangan ubah ke JPEG, background jadi hitam)
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

      // Untuk JPEG: isi background putih dulu supaya tidak ada artefak transparan
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
          // Kalau hasil kompresi malah lebih besar (gambar sudah optimal), pakai aslinya
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
