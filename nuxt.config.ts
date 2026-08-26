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
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'PPID Kabupaten Sinjai',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Transparansi Informasi Publik' },
        { property: 'og:description', content: 'Transparansi Informasi Publik' },
        { property: 'og:image', content: 'https://ppid.sinjaikab.go.id/logo/ppid_og.png' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://ppid.sinjaikab.go.id/logo/ppid_og.png' }
      ]
    }
  },
  ssr: true,
})
