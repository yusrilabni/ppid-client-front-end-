// POST /api/sitemap-push
// Menerima array URL dari browser, menyimpannya di server memory
import { setSitemapCache } from '../utils/sitemap-store';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  if (!Array.isArray(body?.urls)) {
    return { success: false, message: 'Invalid payload. Expected { urls: string[] }' };
  }

  setSitemapCache(body.urls);

  return { 
    success: true, 
    message: `Sitemap cache diperbarui: ${body.urls.length} URL tersimpan` 
  };
});
