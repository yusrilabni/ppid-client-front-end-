export default defineEventHandler(async (event) => {
  try {
    const apiUrl = process.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id';
    
    // Server Vercel diblokir oleh Firewall saat nembak backend?
    // Solusi: Kita kembalikan instruksi Redirect 301 agar Google dan Browser
    // mendownload Sitemap XML-nya LANGSUNG dari backend Laravel, melewati blokir Vercel!
    return sendRedirect(event, `${apiUrl}/api/v1/sitemap`, 301);
  } catch (err) {
    return "Terjadi kesalahan saat memuat sitemap.";
  }
});
