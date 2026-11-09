<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const dashboardData = ref(null)

const stats = computed(() => dashboardData.value?.stats || {})
const externalLogs = computed(() => dashboardData.value?.externalLogs || [])
const aiStats = computed(() => dashboardData.value?.aiStats || [])
const aiUserStats = computed(() => dashboardData.value?.aiUserStats || [])
const recentActivities = computed(() => dashboardData.value?.recentActivity || [])
const chartInfo = computed(() => dashboardData.value?.chart || { labels: [], data: [] })

function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

async function fetchDashboard() {
  loading.value = true
  try {
    const res = await api.get('/admin/dashboard')
    if (res.data?.success && res.data?.data) {
      dashboardData.value = res.data.data
    }
  } catch (e) {
    console.error('Failed to load dashboard data:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header Page -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">Dashboard Ringkasan Eksekutif</h1>
        <p class="text-xs text-gray-500 mt-1">Pantau seluruh statistik layanan informasi, permohonan, OPD, dan aktivitas PPID terintegrasi</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchDashboard"
          class="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <i class="fas fa-rotate" :class="{ 'fa-spin': loading }"></i>
          <span>Segarkan Data</span>
        </button>
        <NuxtLink
          to="/admin/permohonan"
          class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
        >
          <i class="fas fa-inbox"></i>
          <span>Permohonan Masuk</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-32 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-28 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse"></div>
      </div>
    </div>

    <template v-else>
      <!-- I. GRUP: INFORMASI & LAYANAN PUBLIK -->
      <section class="space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-6 bg-blue-600 rounded-full"></span>
          <h2 class="text-sm font-black text-gray-800 uppercase tracking-wider">Informasi & Layanan Publik</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Informasi -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <i class="fas fa-file-alt"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Informasi</p>
                <p class="text-2xl font-black text-gray-900 mt-0.5">{{ formatNumber(stats.informasi?.total) }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-100 text-[10px] font-bold text-gray-500">
              <div>Berkala: <span class="text-blue-600 font-black">{{ stats.informasi?.berkala || 0 }}</span></div>
              <div>Setiap Saat: <span class="text-emerald-600 font-black">{{ stats.informasi?.setiap_saat || 0 }}</span></div>
            </div>
          </div>

          <!-- Permohonan Masuk -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <i class="fas fa-paper-plane"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permohonan Masuk</p>
                <p class="text-2xl font-black text-gray-900 mt-0.5">{{ formatNumber(stats.permohonan?.total) }}</p>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-1 mt-5 pt-4 border-t border-gray-100 text-center">
              <div>
                <p class="text-[9px] font-bold text-gray-400 uppercase">Wait</p>
                <p class="text-xs font-black text-amber-600">{{ stats.permohonan?.pending || 0 }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400 uppercase">Proses</p>
                <p class="text-xs font-black text-blue-600">{{ stats.permohonan?.diproses || 0 }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400 uppercase">Selesai</p>
                <p class="text-xs font-black text-emerald-600">{{ stats.permohonan?.selesai || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Total Pengunjung -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <i class="fas fa-users"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Kunjungan</p>
                <p class="text-2xl font-black text-gray-900 mt-0.5">{{ formatNumber(stats.activity?.visitors) }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-[10px] font-bold text-gray-500">
              <span>Page Views Total:</span>
              <span class="text-purple-600 font-black">{{ formatNumber(stats.activity?.views) }}</span>
            </div>
          </div>

          <!-- Total Unduhan Dokumen -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <i class="fas fa-cloud-download-alt"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dokumen Terunduh</p>
                <p class="text-2xl font-black text-gray-900 mt-0.5">{{ formatNumber(stats.activity?.downloads) }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-[10px] font-bold text-gray-500">
              <span>Laporan Publik:</span>
              <span class="text-amber-600 font-black">{{ stats.laporan?.total || 0 }} Berkas</span>
            </div>
          </div>
        </div>
      </section>

      <!-- II. GRUP: SDM & STRUKTUR ORGANISASI -->
      <section class="space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-6 bg-emerald-600 rounded-full"></span>
          <h2 class="text-sm font-black text-gray-800 uppercase tracking-wider">SDM & Struktur Organisasi</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            to="/admin/officials"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <i class="fas fa-user-tie"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profil Pimpinan</p>
              <p class="text-2xl font-black text-gray-900">{{ formatNumber(stats.official?.total) }}</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/organizations"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <i class="fas fa-sitemap"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">OPD / Unit Kerja</p>
              <p class="text-2xl font-black text-gray-900">{{ formatNumber(stats.organization?.total) }}</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/users"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <i class="fas fa-users-gear"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Akun Pengguna</p>
              <p class="text-2xl font-black text-gray-900">{{ formatNumber(stats.user?.total) }}</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/standar-layanan"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <i class="fas fa-file-contract"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standar Layanan</p>
              <p class="text-2xl font-black text-gray-900">{{ formatNumber(stats.sub_standar_layanan?.total) }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- III. GRUP: WEBSITE & INTERAKSI PUBLIK -->
      <section class="space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-6 bg-pink-600 rounded-full"></span>
          <h2 class="text-sm font-black text-gray-800 uppercase tracking-wider">Website & Interaksi Publik</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            to="/admin/sliders"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <i class="fas fa-images"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Banner Slider</p>
              <p class="text-2xl font-black text-gray-900">{{ formatNumber(stats.slider?.total) }} <span class="text-xs text-emerald-600 font-bold">({{ stats.slider?.active || 0 }} aktif)</span></p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/galeri"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <i class="fas fa-photo-film"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Galeri Multimedia</p>
              <p class="text-2xl font-black text-gray-900">{{ formatNumber(stats.galeri?.total) }}</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/surveys"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <i class="fas fa-square-poll-vertical"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Respon SKM</p>
              <p class="text-2xl font-black text-gray-900">{{ formatNumber(stats.survey_response?.total) }} <span class="text-xs text-gray-400">Respon</span></p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/pbj"
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-4 group"
          >
            <div class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <i class="fas fa-balance-scale"></i>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transparansi PBJ</p>
              <p class="text-2xl font-black text-gray-900">Aktif</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- IV. DETAIL AKTIVITAS TERBARU & INTEGRASI -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Aktivitas Terbaru -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-1.5 h-5 bg-teal-600 rounded-full"></div>
              <h3 class="text-sm font-black text-gray-800 uppercase tracking-wider">Aktivitas Terkini Portal</h3>
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sinkronisasi Realtime</span>
          </div>

          <div class="divide-y divide-gray-50 flex-1 overflow-y-auto max-h-[460px]">
            <div
              v-for="(item, idx) in recentActivities"
              :key="idx"
              class="p-4 sm:p-5 hover:bg-gray-50/60 transition-colors flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 text-sm">
                  <i :class="item.icon || 'fas fa-bell'"></i>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase rounded-md tracking-wider">
                      {{ item.type }}
                    </span>
                    <span v-if="item.status" class="px-2 py-0.5 bg-teal-50 text-teal-700 text-[9px] font-bold rounded-md">
                      {{ item.status }}
                    </span>
                  </div>
                  <p class="text-xs font-bold text-gray-800 truncate">{{ item.title }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Oleh: {{ item.uploader }}</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-gray-400 flex-shrink-0">{{ item.date }}</span>
            </div>

            <div v-if="!recentActivities.length" class="p-12 text-center text-gray-400 text-xs font-semibold">
              Belum ada log aktivitas yang tercatat.
            </div>
          </div>
        </div>

        <!-- Pemasangan Widget Luar & AI Tracking -->
        <div class="space-y-6 flex flex-col">
          <!-- Widget External -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <i class="fas fa-globe text-teal-600"></i>
                <span>Pemasangan Luar (Domain)</span>
              </h3>
              <span class="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                {{ externalLogs.length }} Terdeteksi
              </span>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="(log, i) in externalLogs"
                :key="i"
                class="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div class="min-w-0">
                  <p class="text-xs font-bold text-gray-800 truncate">{{ log.domain }}</p>
                  <p class="text-[9px] text-gray-400 uppercase">{{ log.type }}</p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-black text-gray-900">{{ formatNumber(log.access_count) }}</span>
                  <p class="text-[8px] text-gray-400 uppercase">Hits</p>
                </div>
              </div>

              <div v-if="!externalLogs.length" class="text-center py-6 text-xs text-gray-400">
                Belum ada domain luar yang mengakses widget PPID.
              </div>
            </div>
          </div>

          <!-- Quick Access Cards -->
          <div class="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl">
            <h3 class="text-sm font-black mb-1">Akses Cepat Pengelolaan</h3>
            <p class="text-[11px] text-teal-200/80 mb-4">Konfigurasi cepat ke modul portal utama</p>

            <div class="grid grid-cols-2 gap-2 text-xs font-bold">
              <NuxtLink to="/admin/profil-ppid" class="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2">
                <i class="fas fa-building text-teal-300"></i>
                <span>Profil PPID</span>
              </NuxtLink>
              <NuxtLink to="/admin/security" class="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2">
                <i class="fas fa-shield-halved text-teal-300"></i>
                <span>Keamanan IP</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
