// server/utils/sitemap-store.ts
// Gunakan plain object (bukan reactive Vue) karena ini berjalan di Node.js server (Nitro)

export const sitemapStore = {
  urls: [] as string[]
};
