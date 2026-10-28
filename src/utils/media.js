/**
 * Resolves media URLs to ensure both absolute cloud URLs (e.g. Cloudinary)
 * and relative local fallback URLs (e.g. /uploads/...) render properly.
 *
 * @param {string} url - The URL or relative path from MongoDB
 * @returns {string} Fully-qualified, renderable media URL
 */
export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  
  // Return directly if already absolute, blob, or data URI
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  // Prepend backend base URL if relative path
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  const backendBase = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  return `${backendBase}${cleanPath}`;
};

/**
 * Triggers a download of a media file (image, video, document).
 * Uses fetch + blob when possible so the browser initiates a direct download,
 * with graceful fallback to a download anchor element.
 *
 * @param {string} url - Target media URL
 * @param {string} defaultName - File name to save as
 */
export const downloadMedia = async (url, defaultName = 'mediova-file') => {
  if (!url) return;
  const resolved = resolveMediaUrl(url);
  try {
    const res = await fetch(resolved, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const blob = await res.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;

    // Detect extension if defaultName does not have one
    let finalName = defaultName;
    if (!finalName.includes('.')) {
      const match = resolved.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
      if (match) {
        finalName = `${defaultName}.${match[1]}`;
      } else if (blob.type) {
        const typeMatch = blob.type.split('/')[1];
        if (typeMatch) finalName = `${defaultName}.${typeMatch.split('+')[0]}`;
      }
    }

    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1500);
  } catch (err) {
    // Fallback: trigger anchor download
    const link = document.createElement('a');
    link.href = resolved;
    link.target = '_blank';
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
