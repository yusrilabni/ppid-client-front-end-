export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/index.css'],
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  ssr: true,
})
