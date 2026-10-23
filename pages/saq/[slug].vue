<template>
  <div class="min-h-screen bg-slate-50">
    <!-- HEADER OPD -->
    <div class="relative overflow-hidden bg-gradient-to-br from-[#0052FF] via-[#0041CC] to-[#002a86]">
      <div class="absolute -top-20 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NuxtLink to="/saq" class="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
          <i class="fas fa-arrow-left"></i> Semua OPD
        </NuxtLink>
        <div v-if="opd" class="flex flex-col md:flex-row md:items-center gap-6">
          <div class="flex-1">
            <h1 class="text-2xl md:text-4xl font-extrabold text-white leading-tight">{{ opd.name }}</h1>
            <div v-if="opd.pimpinan?.length" class="mt-3 flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold overflow-hidden">
                <img v-if="opd.pimpinan[0].foto" :src="getStorageUrl(opd.pimpinan[0].foto)" class="w-full h-full object-cover" alt="" />
                <span v-else>{{ (opd.pimpinan[0].nama || '?')[0] }}</span>
              </div>
              <div>
                <p class="text-white font-semibold text-sm">{{ opd.pimpinan[0].nama }}</p>
                <p class="text-blue-200 text-xs">{{ opd.pimpinan[0].jabatan || 'Pimpinan OPD' }}</p>
              </div>
            </div>
          </div>
          <!-- Progress besar -->
          <div v-if="opd" class="flex items-center gap-4 bg-white/10 backdrop-blur rounded-3xl px-6 py-4 border border-white/15">
            <div class="relative w-20 h-20">
              <svg viewBox="0 0 80 80" class="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="8"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#22d3ee" stroke-width="8" stroke-linecap="round"
                  :stroke-dasharray="`${(opd.progres.persen / 100) * 213.6} 213.6`" class="transition-all duration-700"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-white font-extrabold">{{ opd.progres.persen }}%</span>
            </div>
            <div class="text-white">
              <p class="text-2xl font-extrabold">{{ opd.progres.terisi }}<span class="text-base text-blue-200">/{{ opd.progres.total }}</span></p>
              <p class="text-xs text-blue-200">pertanyaan terisi</p>
            </div>
          </div>
        </div>
      </div>
      <svg class="relative block w-full text-slate-50 -mb-px" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="currentColor"><path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z"/></svg>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-24 rounded-2xl bg-blue-50 animate-pulse"></div>
      </div>

      <template v-else-if="tabs.length">
        <!-- TAB NAV -->
        <div class="sticky top-0 z-20 bg-slate-50/95 backdrop-blur py-3">
          <div class="flex gap-2 overflow-x-auto pb-1" ref="tabBar">
            <button v-for="(tab, i) in tabs" :key="tab.kode" @click="activeTab = i"
              class="relative shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
              :class="activeTab === i ? 'text-white shadow-lg shadow-blue-600/25' : 'text-gray-600 bg-white border border-gray-200 hover:border-[#0052FF]/40'">
              <span v-if="activeTab === i" class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#0041CC]"></span>
              <span class="relative flex items-center gap-2">
                {{ tab.tab }}
                <span v-if="tab.scope === 'ppid_utama'"
                  class="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide"
                  :class="activeTab === i ? 'bg-amber-300 text-amber-900' : 'bg-amber-100 text-amber-700'">
                  PPID Utama
                </span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-full"
                  :class="activeTab === i ? 'bg-white/25 text-white' : 'bg-blue-50 text-[#0052FF]'">
                  {{ tabDone(tab) }}/{{ tabTotal(tab) }}
                </span>
              </span>
            </button>
          </div>
        </div>

        <!-- SECTIONS -->
        <div v-if="tabs[activeTab]?.kode === '1'"
          class="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <span class="text-amber-500 text-lg leading-none mt-0.5">★</span>
          <p class="text-sm text-amber-800">
            <strong>Khusus PPID Utama.</strong> Indikator Sarana dan Prasarana hanya diisi oleh
            PPID Utama Kabupaten Sinjai.
          </p>
        </div>
        <div class="mt-4 space-y-4">
          <div v-for="sec in tabs[activeTab].sections" :key="sec.kode"
            class="bg-white rounded-3xl border border-gray-200/70 shadow-[0_2px_12px_rgba(0,82,255,0.04)] overflow-hidden transition-shadow hover:shadow-[0_4px_20px_rgba(0,82,255,0.08)]">
            <button @click="toggleSection(sec.kode)"
              class="w-full flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-transparent transition-all text-left">
              <div class="flex items-center gap-3.5">
                <span class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#0041CC] text-white flex items-center justify-center text-xs font-extrabold shadow-md shadow-blue-600/20">{{ sec.kode }}</span>
                <div>
                  <span class="font-bold text-gray-800 text-sm md:text-base block leading-snug">{{ sec.section }}</span>
                  <!-- progress bar mini -->
                  <div class="mt-1.5 w-32 md:w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="sec.terisi === sec.total ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-[#0052FF] to-cyan-400'"
                      :style="{ width: (sec.total ? (sec.terisi / sec.total * 100) : 0) + '%' }"></div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-extrabold px-3 py-1.5 rounded-full"
                  :class="sec.terisi === sec.total ? 'bg-emerald-100 text-emerald-700' : sec.terisi > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'">
                  {{ sec.terisi }}/{{ sec.total }}
                </span>
                <span class="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                  <i class="fas fa-chevron-down text-gray-400 text-xs transition-transform duration-300"
                    :class="{ 'rotate-180': openSections.includes(sec.kode) }"></i>
                </span>
              </div>
            </button>
            <div v-show="openSections.includes(sec.kode)" class="border-t border-gray-100 p-3 space-y-2.5 bg-slate-50/50">
              <div v-for="q in sec.questions" :key="q.id"
                class="group bg-white rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                :class="q.terisi ? 'border-emerald-200/60' : 'border-gray-200/80 hover:border-[#0052FF]/30'">
                <div class="flex items-start gap-3">
                  <!-- Status icon -->
                  <span class="mt-1 w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 transition-transform group-hover:scale-110"
                    :class="q.terisi ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' : 'bg-gray-100 text-gray-400'">
                    <i :class="q.terisi ? 'fas fa-check' : 'fas fa-pen text-[10px]'"></i>
                  </span>
                  <div class="flex-1 min-w-0">
                    <!-- Kode + badges -->
                    <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span class="font-mono text-[11px] font-extrabold text-[#0052FF] bg-blue-50 px-2 py-0.5 rounded-lg">{{ q.kode }}</span>
                      <span v-if="q.input_type === 'foto'" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700"><i class="fas fa-camera mr-1"></i>Foto</span>
                      <span v-else-if="q.input_type === 'situs'" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700"><i class="fas fa-globe mr-1"></i>Situs</span>
                      <span v-else class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700"><i class="fas fa-file-alt mr-1"></i>Dokumen</span>
                      <span v-if="q.target_upload === 'pemkab'" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><i class="fas fa-landmark mr-1"></i>Pemkab</span>
                      <span v-if="q.bagian" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700"><i class="fas fa-sitemap mr-1"></i>{{ q.bagian }}</span>
                      <span v-if="q.jawaban === 'ya'" class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">Ya</span>
                      <span v-else-if="q.jawaban === 'tidak'" class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 uppercase tracking-wide">Tidak</span>
                    </div>
                    <!-- Pertanyaan -->
                    <p class="text-sm text-gray-800 leading-relaxed font-medium">{{ q.pertanyaan }}</p>
                    <p v-if="q.dokumen_upload" class="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5"><i class="fas fa-paperclip text-gray-400"></i><span class="line-clamp-1">{{ q.dokumen_upload }}</span></p>
                    <p v-if="q.klasifikasi_otomatis" class="mt-1 text-[11px] text-gray-400"><i class="fas fa-tag mr-1"></i>{{ q.klasifikasi_otomatis }}</p>
                  </div>
                  <!-- Tombol aksi -->
                  <button @click="openAnswerModal(q)"
                    class="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                    :class="q.terisi
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-gradient-to-r from-[#0052FF] to-[#0041CC] text-white shadow-md shadow-blue-600/25 hover:shadow-lg'">
                    <i :class="q.terisi ? 'fas fa-eye mr-1.5' : 'fas fa-pen mr-1.5'"></i>{{ q.terisi ? 'Lihat' : 'Isi' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- MODAL JAWABAN -->
    <Transition name="modal">
      <div v-if="modal.open" class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="modal.open = false"></div>
        <div class="relative bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
          <div class="flex items-start justify-between mb-1">
            <h3 class="font-extrabold text-lg text-gray-900">{{ modal.existing ? 'Jawaban Tersimpan' : 'Isi Jawaban' }}</h3>
            <button @click="modal.open = false" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <p class="text-xs text-gray-500 mb-3"><span class="font-mono text-[#0052FF] font-bold">{{ modal.question?.kode }}</span> — {{ modal.question?.pertanyaan }}</p>

          <!-- Info otomatis (read-only) -->
          <div class="mb-5 p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
            <div class="flex justify-between">
              <span class="text-gray-500">Pengguna</span>
              <span class="font-bold text-gray-900">{{ authStore.userName || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kantor/OPD</span>
              <span class="font-bold text-gray-900 text-right">{{ opd?.name || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kategori Informasi</span>
              <span class="font-bold text-[#0052FF]">{{ modal.question?.klasifikasi_otomatis || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Target Upload</span>
              <span class="font-bold text-gray-900">{{ modal.question?.target_upload === 'pemkab' ? 'Informasi Pemkab' : 'PPID' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Status</span>
              <span class="font-bold" :class="modal.existing ? 'text-emerald-600' : 'text-amber-600'">{{ modal.existing ? 'Sudah Terisi' : 'Belum Diisi' }}</span>
            </div>
          </div>

          <div v-if="!authStore.isAuthenticated" class="text-center py-6">
            <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-lock text-2xl text-[#0052FF]"></i>
            </div>
            <p class="text-sm text-gray-600 mb-5">Anda harus login sebagai admin untuk mengisi jawaban SAQ.</p>
            <NuxtLink :to="`/login?redirect=/saq/${route.params.slug}`"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0052FF] text-white font-bold text-sm shadow-lg shadow-blue-600/25 hover:bg-[#0041CC] transition-all">
              <i class="fas fa-sign-in-alt"></i> Login Admin
            </NuxtLink>
          </div>

          <form v-else @submit.prevent="submitAnswer" class="space-y-4">
            <!-- YA / TIDAK -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Apakah OPD memiliki/memenuhi ini? *</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" @click="form.jawaban = 'ya'"
                  class="py-3 rounded-2xl font-bold text-sm border-2 transition-all"
                  :class="form.jawaban === 'ya'
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300'">
                  <i class="fas fa-check mr-2"></i>Ya, Ada
                </button>
                <button type="button" @click="form.jawaban = 'tidak'"
                  class="py-3 rounded-2xl font-bold text-sm border-2 transition-all"
                  :class="form.jawaban === 'tidak'
                    ? 'bg-gray-500 border-gray-500 text-white shadow-lg shadow-gray-500/25'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'">
                  <i class="fas fa-times mr-2"></i>Tidak Ada
                </button>
              </div>
            </div>

            <!-- DAFTAR LINK (hanya bila Ya) - dinamis per input_type -->
            <div v-if="form.jawaban === 'ya'" class="space-y-3">
              <div v-for="(l, idx) in form.links" :key="idx"
                class="p-3 rounded-2xl border-2 border-blue-100 bg-blue-50/40 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-[#0052FF]">
                    {{ modal.question?.input_type === 'foto' ? 'Foto ' : modal.question?.input_type === 'situs' ? 'Situs ' : 'Dokumen ' }}{{ idx + 1 }}
                  </span>
                  <button v-if="form.links.length > 1" type="button" @click="form.links.splice(idx, 1)"
                    class="text-xs font-bold text-rose-500 hover:text-rose-700">
                    <i class="fas fa-trash-alt mr-1"></i>Hapus
                  </button>
                </div>
                <!-- Tipe DOKUMEN: judul + link -->
                <template v-if="modal.question?.input_type === 'dokumen' || !modal.question?.input_type">
                  <input v-model="l.judul" required type="text" placeholder="Judul dokumen *"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                  <div class="flex gap-2">
                    <input v-model="l.link" required type="url" placeholder="https://drive.google.com/... *"
                      class="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                    <button type="button" @click="syncFromPpid(idx)" :disabled="syncing || !l.link"
                      class="shrink-0 px-3 py-2.5 rounded-xl bg-cyan-50 text-cyan-700 text-xs font-bold hover:bg-cyan-100 disabled:opacity-40 transition-all"
                      title="Sinkronkan dari data PPID bila link sudah ada">
                      <i :class="syncing ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
                    </button>
                  </div>
                  <input v-model="l.deskripsi" type="text" placeholder="Deskripsi singkat (opsional)"
                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-xs" />
                </template>
                <!-- Tipe FOTO: link foto langsung (tanpa judul wajib) -->
                <template v-else-if="modal.question?.input_type === 'foto'">
                  <input v-model="l.link" required type="url" placeholder="Link foto (https://...) *"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                  <input v-model="l.judul" type="text" placeholder="Keterangan foto (opsional)"
                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-xs" />
                  <p class="text-xs text-gray-500"><i class="fas fa-info-circle mr-1"></i>Bisa link Google Drive, atau URL gambar langsung</p>
                </template>
                <!-- Tipe SITUS: URL saja (tanpa judul) -->
                <template v-else-if="modal.question?.input_type === 'situs'">
                  <input v-model="l.link" required type="url" placeholder="https://situs-pemkab.go.id *"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                  <p class="text-xs text-gray-500"><i class="fas fa-globe mr-1"></i>Masukkan alamat situs/web langsung</p>
                </template>
              </div>
              <button type="button" @click="form.links.push({ judul: '', link: '', deskripsi: '' })"
                class="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#0052FF]/30 text-[#0052FF] text-sm font-bold hover:bg-blue-50 transition-all">
                <i class="fas fa-plus mr-2"></i>Tambah Link Dokumen
              </button>
              <p v-if="syncMsg" class="text-xs" :class="syncFound ? 'text-emerald-600' : 'text-gray-500'">{{ syncMsg }}</p>
            </div>

            <!-- INFO (bila Tidak) -->
            <div v-if="form.jawaban === 'tidak'"
              class="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-600">
              <i class="fas fa-info-circle mr-2 text-gray-400"></i>
              OPD dinyatakan <strong>tidak memiliki</strong> indikator ini — tidak perlu mengisi link dokumen.
            </div>

            <div v-if="form.jawaban === 'ya'">
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Visibilitas Dokumen *</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" @click="form.visibility = 'public'"
                  class="py-2.5 rounded-xl font-bold text-xs border-2 transition-all"
                  :class="form.visibility === 'public'
                    ? 'bg-[#0052FF] border-[#0052FF] text-white shadow-md shadow-blue-600/25'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'">
                  <i class="fas fa-globe mr-1.5"></i>Public
                </button>
                <button type="button" @click="form.visibility = 'private'"
                  class="py-2.5 rounded-xl font-bold text-xs border-2 transition-all"
                  :class="form.visibility === 'private'
                    ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/25'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300'">
                  <i class="fas fa-lock mr-1.5"></i>Private
                </button>
              </div>
              <p class="mt-1.5 text-[11px] text-gray-500">
                <span v-if="form.visibility === 'public'">Dokumen tampil di daftar informasi publik.</span>
                <span v-else>Dokumen hanya terlihat oleh unit OPD penyedia (tidak tampil publik).</span>
              </p>
            </div>
            <div v-if="formError" class="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600">{{ formError }}</div>
            <button type="submit" :disabled="submitting"
              class="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0052FF] to-[#0041CC] text-white font-bold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 disabled:opacity-50 transition-all">
              <i :class="submitting ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
              {{ submitting ? 'Menyimpan...' : 'Simpan Jawaban' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import api, { getStorageUrl } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

definePageMeta({ layout: 'default' })
const route = useRoute()
const authStore = useAuthStore()
const queryClient = useQueryClient()

useHead({ title: 'SAQ OPD — PPID Kabupaten Sinjai' })
useSeoMeta({
  ogTitle: 'SAQ OPD — PPID Kabupaten Sinjai',
  description: 'Pengisian Self Assessment Questionnaire E-Monev per OPD Kabupaten Sinjai.',
  ogDescription: 'Pengisian Self Assessment Questionnaire E-Monev per OPD Kabupaten Sinjai.',
  ogImage: 'https://ppid.sinjaikab.go.id/logo/ppid_og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const activeTab = ref(0)
const openSections = ref([])
const modal = ref({ open: false, question: null, existing: null })
const form = ref({ judul: '', link: '', klasifikasi: '', deskripsi: '' })
const submitting = ref(false)
const formError = ref('')
const syncing = ref(false)
const syncMsg = ref('')
const syncFound = ref(false)

// OPD aktif
const { data: opdsResponse } = useQuery({
  queryKey: ['saq-opds'],
  queryFn: async () => (await api.get('/saq/opds')).data,
  staleTime: 0,
  refetchOnWindowFocus: true,
})
const opd = computed(() =>
  (opdsResponse.value?.data || []).find(o => o.slug === route.params.slug)
)

// Struktur SAQ + jawaban
const { data: structResponse, isLoading, refetch: refetchStruct } = useQuery({
  queryKey: ['saq-structure', computed(() => opd.value?.id)],
  queryFn: async () => {
    if (!opd.value) return null
    return (await api.get('/saq/structure', { params: { organization_id: opd.value.id } })).data
  },
  enabled: computed(() => !!opd.value),
})
const tabs = computed(() => structResponse.value?.data || [])

watch(tabs, (t) => {
  if (t.length && t[0].sections.length) openSections.value = [t[0].sections[0].kode]
}, { immediate: true })

const tabTotal = (tab) => tab.sections.reduce((s, x) => s + x.total, 0)
const tabDone = (tab) => tab.sections.reduce((s, x) => s + x.terisi, 0)
const toggleSection = (kode) => {
  openSections.value = openSections.value.includes(kode)
    ? openSections.value.filter(k => k !== kode)
    : [...openSections.value, kode]
}

// Modal jawaban
const openAnswerModal = async (q) => {
  formError.value = ''
  syncMsg.value = ''
  modal.value = { open: true, question: q, existing: null }
  form.value = { jawaban: null, visibility: 'public', links: [{ judul: '', link: '', deskripsi: '' }] }
  if (q.terisi && opd.value) {
    try {
      const res = await api.get('/saq/answers', { params: { organization_id: opd.value.id } })
      const found = (res.data.data || []).find(a => a.indicator_id === q.id)
      if (found) {
        modal.value.existing = found
        form.value.jawaban = found.jawaban || null
        form.value.visibility = found.visibility || 'public'
        form.value.links = (found.links && found.links.length)
          ? found.links.map(l => ({ judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '' }))
          : [{ judul: found.judul || '', link: found.link || '', deskripsi: '' }]
      }
    } catch (e) { /* abaikan */ }
  }
}

const syncFromPpid = async (idx = 0) => {
  const target = form.value.links[idx]
  if (!target || !target.link) return
  syncing.value = true
  syncMsg.value = ''
  try {
    const res = await api.get('/saq/sync', { params: { url: target.link }, skipAuthRedirect: true })
    if (res.data.found) {
      const d = res.data.data
      target.judul = target.judul || d.judul || ''
      target.deskripsi = d.deskripsi || ''
      syncFound.value = true
      syncMsg.value = `Ditemukan di PPID: "${d.judul}" — diupload ${d.pengupload || 'admin'}${d.opd ? ` (${d.opd})` : ''}.`
    } else {
      syncFound.value = false
      syncMsg.value = 'Link belum ada di data PPID.'
    }
  } catch (e) {
    syncFound.value = false
    syncMsg.value = e.response?.status === 401 ? 'Perlu login untuk sinkronisasi.' : 'Gagal sinkronisasi.'
  } finally {
    syncing.value = false
  }
}

const submitAnswer = async () => {
  if (!opd.value || !modal.value.question) return
  if (!form.value.jawaban) {
    formError.value = 'Pilih dulu: Ya atau Tidak.'
    return
  }
  const links = form.value.jawaban === 'ya'
    ? form.value.links.filter(l => l.judul.trim() && l.link.trim())
    : []
  if (form.value.jawaban === 'ya' && !links.length) {
    formError.value = 'Jawaban "Ya" wajib disertai minimal satu link dokumen.'
    return
  }
  submitting.value = true
  formError.value = ''
  try {
    await api.post('/saq/answers', {
      organization_id: opd.value.id,
      indicator_id: modal.value.question.id,
      jawaban: form.value.jawaban,
      visibility: form.value.visibility,
      links: links.map(l => ({ judul: l.judul.trim(), link: l.link.trim(), deskripsi: (l.deskripsi || '').trim() || null })),
    }, { skipAuthRedirect: true })
    modal.value.open = false
    queryClient.invalidateQueries({ queryKey: ['saq-opds'] })
    queryClient.invalidateQueries({ queryKey: ['saq-structure'] })
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan jawaban.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-active > div:last-child, .modal-leave-active > div:last-child { transition: transform .3s cubic-bezier(.32,.72,.35,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div:last-child { transform: translateY(40px) scale(.98); }
.modal-leave-to > div:last-child { transform: translateY(40px) scale(.98); }
</style>
