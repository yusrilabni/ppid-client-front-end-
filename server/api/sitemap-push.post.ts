// POST /api/sitemap-push
// Menerima array URL dari browser, simpan pakai Nitro useStorage (built-in)
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!Array.isArray(body?.urls)) {
      return { success: false, message: 'Invalid payload. Expected { urls: string[] }' };
    }

    // Nitro built-in storage - lebih andal dari custom module
    const storage = useStorage('data');
    await storage.setItem('sitemap:urls', body.urls);

    return {
      success: true,
      message: `Sitemap cache diperbarui: ${body.urls.length} URL tersimpan`
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});
