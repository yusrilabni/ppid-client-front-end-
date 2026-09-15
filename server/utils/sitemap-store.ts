// Storage sederhana di memory server Nitro
// Data ini akan diisi oleh halaman admin yang fetch dari browser

let cachedSitemapUrls: string[] = [];

export const getSitemapCache = () => cachedSitemapUrls;

export const setSitemapCache = (urls: string[]) => {
  cachedSitemapUrls = urls;
};
