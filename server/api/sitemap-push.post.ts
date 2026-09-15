// POST /api/sitemap-push
// sitemapStore auto-import dari server/utils/sitemap-store.ts

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!Array.isArray(body?.urls)) {
      setResponseStatus(event, 400);
      return { success: false, message: 'Expected { urls: string[], reset?: boolean }' };
    }

    if (body.reset === true) {
      sitemapStore.urls = [];
    }

    sitemapStore.urls.push(...body.urls);

    return {
      success: true,
      total: sitemapStore.urls.length,
      message: `Batch diterima: ${body.urls.length} URL. Total: ${sitemapStore.urls.length}`
    };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { success: false, message: err?.message || 'Unknown error' };
  }
});
