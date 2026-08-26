export default defineNuxtConfig({
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
        { property: 'og:image', content: 'https://ppidkab.sinjaikab.go.id/logo/Logo%20PPID%20With%20Caption.png' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://ppidkab.sinjaikab.go.id/logo/Logo%20PPID%20With%20Caption.png' }
      ]
    }
  },
  ssr: true,
})
