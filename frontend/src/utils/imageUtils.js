export function compressImageBase64(base64Str, maxSizeMB = 2.5) {
  return new Promise((resolve) => {
    if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }

    const sizeInBytes = Math.ceil((base64Str.length * 3) / 4);
    if (sizeInBytes < maxSizeMB * 1024 * 1024) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 1024;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
}

/** Strip `data:image/...;base64,` prefix; return raw base64 or pass through URLs/plain strings. */
export function stripBase64Prefix(str) {
  if (!str || typeof str !== 'string') return str;
  const m = str.match(/^data:image\/[^;]+;base64,(.+)$/i);
  return m ? m[1] : str;
}
