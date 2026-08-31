import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  features: {
    inlineStyles: false
  },
  modules: [
    '@pinia/nuxt',
  ],
  css: [
    '~/assets/css/index.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
    'swiper/css/bundle'
  ],
  // Gunakan @tailwindcss/vite langsung (jauh lebih cepat dari PostCSS)
  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false, // nonaktifkan sourcemap production (hemat ~1-2 detik)
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'pinia'],
            'vendor-query': ['@tanstack/vue-query'],
            'vendor-swiper': ['swiper'],
          }
        }
      }
    }
  },
  // Hapus postcss (sudah digantikan vite plugin di atas)
  app: {
    head: {
      title: 'PPID Kabupaten Sinjai',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Transparansi Informasi Publik' },
        { property: 'og:description', content: 'Transparansi Informasi Publik' },
        { property: 'og:image', content: 'https://ppid.sinjaikab.go.id/logo/Lambang_Kabupaten_Sinjai_OG.jpg' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://ppid.sinjaikab.go.id/logo/Lambang_Kabupaten_Sinjai_OG.jpg' }
      ]
    }
  },
  ssr: true,
  nitro: {
    sourceMap: false, // nonaktifkan sourcemap Nitro server (hemat waktu tambahan)
  }
})
