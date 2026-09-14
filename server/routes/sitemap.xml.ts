export default defineEventHandler(async (event) => {
  try {
    const apiUrl = process.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id';
    
    // Karena domain backend diblokir oleh Google, kita TIDAK BOLEH menggunakan Redirect.
    // Kita harus menyuruh server Vercel (Nuxt) untuk mendownload XML-nya secara diam-diam
    // dari backend, lalu Nuxt yang akan menyajikannya ke Google. 
    // Dengan cara ini, Google hanya melihat domain ppid.sinjaikab.go.id!
    
    const xmlContent = await $fetch(`${apiUrl}/api/v1/sitemap`, { 
        responseType: 'text' // Ambil sebagai string XML mentah
    });
    
    appendHeader(event, 'Content-Type', 'application/xml');
    return xmlContent;
    
  } catch (err) {
    appendHeader(event, 'Content-Type', 'text/plain');
    return "Terjadi kesalahan saat memuat sitemap dari backend.";
  }
});
