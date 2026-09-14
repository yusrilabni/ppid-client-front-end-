module.exports = {
  apps: [
    {
      name: 'ppid-client-nuxt',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max', // Membelah proses (fake cloning) sebanyak jumlah Core CPU yang tersedia
      script: './.output/server/index.mjs', // Titik masuk (entry point) aplikasi SSR Nuxt
      env: {
        NODE_ENV: 'production',
        // Secara default Nitro akan membaca PORT dan HOST
        PORT: 3000,
        HOST: '127.0.0.1' // Hanya diizinkan diakses dari Nginx lokal, tidak terbuka langsung ke publik
      }
    }
  ]
}
