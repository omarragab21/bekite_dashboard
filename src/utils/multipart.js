export const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

export async function dataUrlToBlob(dataUrl) {
  if (!isDataUrl(dataUrl)) return null;
  const response = await fetch(dataUrl);
  return response.blob();
}

const DEFAULT_FALLBACK_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export async function appendUpload(formData, field, value, filename = 'upload.png') {
  if (typeof File !== 'undefined' && value instanceof File) {
    formData.append(field, value, value.name || filename);
    return;
  }
  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    formData.append(field, value, filename);
    return;
  }
  if (isDataUrl(value)) {
    const blob = await dataUrlToBlob(value);
    if (blob) {
      formData.append(field, blob, filename);
      return;
    }
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      const res = await fetch(value);
      if (res.ok) {
        const blob = await res.blob();
        formData.append(field, blob, filename);
        return;
      }
    } catch {
      // ignore fetch failure, continue to fallback
    }
  }
  // If no valid file/blob is provided, generate a lightweight valid PNG blob
  try {
    const res = await fetch(DEFAULT_FALLBACK_PNG);
    const blob = await res.blob();
    formData.append(field, blob, filename);
  } catch {
    // fallback if environment doesn't support data uri fetch
  }
}

export function appendValue(formData, field, value) {
  if (value === null || value === undefined || value === '') return;
  formData.append(field, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
}
