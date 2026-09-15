export default defineEventHandler((event) => {
  const staticUrls = [
    { loc: 'https://ppid.sinjaikab.go.id/', changefreq: 'daily', priority: 1.0 },
    { loc: 'https://ppid.sinjaikab.go.id/search', changefreq: 'weekly', priority: 0.8 },
    { loc: 'https://ppid.sinjaikab.go.id/kontak', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://ppid.sinjaikab.go.id/statistik', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/profil/bupati', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/profil/wakil-bupati', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/profil/sekretaris-daerah', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/profil/pejabat-daerah', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/profil/unit-lokal', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/profil/ppid', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/profil/tentang-opd', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/informasi/berkala', changefreq: 'weekly', priority: 0.9 },
    { loc: 'https://ppid.sinjaikab.go.id/informasi/setiap-saat', changefreq: 'weekly', priority: 0.9 },
    { loc: 'https://ppid.sinjaikab.go.id/informasi/serta-merta', changefreq: 'weekly', priority: 0.9 },
    { loc: 'https://ppid.sinjaikab.go.id/informasi/dikecualikan', changefreq: 'weekly', priority: 0.9 },
    { loc: 'https://ppid.sinjaikab.go.id/dip', changefreq: 'weekly', priority: 0.8 },
    { loc: 'https://ppid.sinjaikab.go.id/dipunit', changefreq: 'weekly', priority: 0.8 },
    { loc: 'https://ppid.sinjaikab.go.id/standar-layanan', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/maklumat-layanan', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/sop-layanan', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/laporan', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/galeri', changefreq: 'weekly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/regulasi', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://ppid.sinjaikab.go.id/lhkpn', changefreq: 'monthly', priority: 0.6 },
    { loc: 'https://ppid.sinjaikab.go.id/pbj', changefreq: 'monthly', priority: 0.6 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  appendHeader(event, 'Content-Type', 'application/xml');
  return xml;
});
