<script setup>
import { ref, onMounted, computed } from 'vue'
import api, { getStorageUrl } from '@/services/api'

const currentYear = computed(() => new Date().getFullYear())

const socialMedia = ref({
  instagram: '',
  facebook: '',
  twitter: '',
  tiktok: '',
  youtube: '',
  website: ''
})

const contactInfo = ref({
  email: 'ppid@sinjaikab.go.id',
  phone: '(0482) 21111',
  address: 'Jl. Persatuan Raya No. 1, Sinjai Utara, Kab. Sinjai, Sulawesi Selatan 92611'
})

const navLinks = [
  { url: '/profil-ppid', title: 'Profil PPID' },
  { url: '/galeri', title: 'Galeri' },
  { url: '/permohonan', title: 'Permohonan Informasi' }
]

const fetchProfilData = async () => {
  try {
    const res = await api.get('/profil')
    if (res.data?.success && res.data?.data) {
      const data = res.data.data
      socialMedia.value = {
        instagram: data.instagram || '',
        facebook: data.facebook || '',
        twitter: data.twitter || '',
        tiktok: data.tiktok || '',
        youtube: data.youtube || '',
        website: data.website || ''
      }
      contactInfo.value = {
        email: data.email || 'ppid@sinjaikab.go.id',
        phone: data.phone || '(0482) 21111',
        address: data.address || 'Jl. Persatuan Raya No. 1, Sinjai Utara, Kab. Sinjai'
      }
    }
  } catch (err) {
    console.error('Gagal mengambil data profil PPID', err)
  }
}

onMounted(() => {
  fetchProfilData()
})

</script>

<template>
  <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div class="flex flex-col items-center text-center md:items-start md:text-left">
                  <div class="-mt-8 mb-[-35px]">
                      <img src="/logo/favicon_io/android-chrome-512x512.png" alt="Logo PPID" width="160" height="160"
                          class="h-[160px] w-auto" />
                  </div>
                  <p class="text-gray-400 text-sm mb-4">
                      Pejabat Pengelola Informasi dan Dokumentasi
                  </p>
                  <!-- Social Media Icons -->
                  <div class="flex flex-wrap justify-center md:justify-start gap-3">
                      <a v-if="socialMedia.instagram" :href="socialMedia.instagram" target="_blank" aria-label="Instagram" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] transition-all duration-300" title="Instagram">
                          <i class="fab fa-instagram"></i>
                      </a>
                      <a v-if="socialMedia.facebook" :href="socialMedia.facebook" target="_blank" aria-label="Facebook" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all duration-300" title="Facebook">
                          <i class="fab fa-facebook-f"></i>
                      </a>
                      <a v-if="socialMedia.twitter" :href="socialMedia.twitter" target="_blank" aria-label="Twitter" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-all duration-300" title="Twitter">
                          <i class="fab fa-twitter"></i>
                      </a>
                      <a v-if="socialMedia.tiktok" :href="socialMedia.tiktok" target="_blank" aria-label="TikTok" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition-all duration-300" title="TikTok">
                          <i class="fab fa-tiktok"></i>
                      </a>
                      <a v-if="socialMedia.youtube" :href="socialMedia.youtube" target="_blank" aria-label="YouTube" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300" title="YouTube">
                          <i class="fab fa-youtube"></i>
                      </a>
                      <a v-if="socialMedia.website" :href="socialMedia.website" target="_blank" aria-label="Website" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300" title="Website Pemda">
                          <i class="fas fa-globe"></i>
                      </a>
                  </div>
              </div>
              <div id="footer-nav-section">
                  <h4 class="font-semibold mb-4">Navigasi</h4>
                  <ul class="space-y-2 text-sm text-gray-400">
                      <li v-for="(link, index) in navLinks" :key="index">
                          <router-link :to="link.url" class="hover:text-white">{{ link.title }}</router-link>
                      </li>
                      <li class="pt-2 mt-2 border-t border-gray-800"></li>
                      <li>
                          <router-link to="/kebijakan-privasi" class="hover:text-white flex items-center group">
                              <div class="bg-purple-500/10 p-1.5 rounded mr-2 group-hover:bg-purple-500 transition-colors">
                                  <i class="fas fa-user-shield text-purple-500 group-hover:text-white text-[10px]"></i>
                              </div>
                              Kebijakan Privasi
                          </router-link>
                      </li>
                      <li>
                          <router-link to="/rss" class="hover:text-white flex items-center group">
                              <div class="bg-orange-500/10 p-1.5 rounded mr-2 group-hover:bg-orange-500 transition-colors">
                                  <i class="fas fa-rss text-orange-500 group-hover:text-white text-[10px]"></i>
                              </div>
                              RSS Feed
                          </router-link>
                      </li>
                      <li>
                          <router-link to="/widget" class="hover:text-white flex items-center group">
                              <div class="bg-blue-500/10 p-1.5 rounded mr-2 group-hover:bg-blue-500 transition-colors">
                                  <i class="fas fa-plug text-blue-500 group-hover:text-white text-[10px]"></i>
                              </div>
                              Widget Informasi
                          </router-link>
                      </li>
                  </ul>
              </div>
              <div>
                  <h4 class="font-semibold mb-4">Kontak</h4>
                  <ul class="space-y-2 text-sm text-gray-400">
                      <li>Email: {{ contactInfo.email }}</li>
                      <li>Telepon: {{ contactInfo.phone }}</li>
                      <li>Alamat: {{ contactInfo.address }}</li>
                  </ul>
              </div>
              <div class="md:col-span-1 text-center">
                  <h4 class="font-semibold mb-4">Pengaduan</h4>
                  <a href="https://www.lapor.go.id/" target="_blank"
                      class="group px-[21px] py-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg flex flex-col items-center space-y-4 border border-gray-700 w-full hover:border-gray-500 transition duration-300 block">
                      <img src="/logo/lapor.png" alt="Lapor.go.id" width="120" height="40"
                          class="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                      <p class="text-sm font-semibold text-gray-200 leading-relaxed whitespace-nowrap uppercase italic">
                          <span class="text-yellow-400 font-bold">Sampaikan Laporan</span> & Aspirasi Anda
                      </p>
                  </a>
              </div>
          </div>
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {{ currentYear }} PPID Kabupaten Sinjai – Dikelola oleh Dinas Komunikasi, Informatika dan Persandian
                  Kabupaten Sinjai.</p>
          </div>
      </div>
  </footer>
</template>
