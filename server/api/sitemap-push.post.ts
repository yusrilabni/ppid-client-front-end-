// POST /api/sitemap-push
// Gunakan globalThis agar data tersimpan di memory proses Node.js yang sama

declare global {
  var __sitemapUrls: string[] | undefined
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!Array.isArray(body?.urls)) {
      setResponseStatus(event, 400);
      return { success: false, message: 'Invalid payload. Expected { urls: string[] }' };
    }

    // Simpan ke global memory - lebih andal dari useStorage di Vercel
    globalThis.__sitemapUrls = body.urls;

    return {
      success: true,
      message: `Sitemap cache diperbarui: ${body.urls.length} URL tersimpan`
    };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { success: false, message: err?.message || 'Unknown error' };
  }
});
