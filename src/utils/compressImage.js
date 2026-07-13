/** Compress an image file to maxSize pixels on the longest side. Returns original File if no compression needed. */
export function compressImage(file, maxSize = 2048) {
  return new Promise((resolve) => {
    const img = new Image();
    const src = URL.createObjectURL(file);

    const cleanup = () => URL.revokeObjectURL(src);

    img.onload = () => {
      cleanup();
      const { naturalWidth: w, naturalHeight: h } = img;
      if (w <= maxSize && h <= maxSize) {
        resolve(file);
        return;
      }
      const ratio = Math.min(maxSize / w, maxSize / h);
      const cw = Math.round(w * ratio);
      const ch = Math.round(h * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, cw, ch);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        file.type || 'image/jpeg',
        0.85,
      );
    };

    img.onerror = () => {
      cleanup();
      resolve(file);
    };

    img.src = src;
  });
}
