// POST /api/sitemap-push
// Menerima batch URL dari browser secara bertahap

// Module-level variable - persist selama container warm
let _sitemapUrls: string[] = [];

export const getSitemapUrls = () => _sitemapUrls;

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!Array.isArray(body?.urls)) {
      setResponseStatus(event, 400);
      return { success: false, message: 'Expected { urls: string[], reset?: boolean }' };
    }

    // Jika reset=true, kosongkan dulu (batch pertama)
    if (body.reset === true) {
      _sitemapUrls = [];
    }

    // Append URL baru ke list
    _sitemapUrls.push(...body.urls);

    return {
      success: true,
      total: _sitemapUrls.length,
      message: `Batch diterima: ${body.urls.length} URL. Total: ${_sitemapUrls.length}`
    };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { success: false, message: err?.message || 'Unknown error' };
  }
});
