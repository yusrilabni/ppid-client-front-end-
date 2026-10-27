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
                  :stroke-dasharray="`${(headerProgres.persen / 100) * 213.6} 213.6`" class="transition-all duration-700"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-white font-extrabold">{{ headerProgres.persen }}%</span>
            </div>
            <div class="text-white">
              <p class="text-2xl font-extrabold">{{ headerProgres.terisi }}<span class="text-base text-blue-200">/{{ headerProgres.total }}</span></p>
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
                <!-- DAFTAR JAWABAN KONSOLIDASI (mode full, superadmin) -->
                <div v-if="isFullMode" class="mt-3 pt-3 border-t border-gray-100">
                  <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                    <i class="fas fa-reply-all mr-1"></i> Jawaban OPD ({{ getQuestionAnswers(q.id).length }})
                  </p>
                  <div v-if="getQuestionAnswers(q.id).length === 0" class="text-xs text-gray-400 italic">
                    Belum ada jawaban
                  </div>
                  <div v-else class="space-y-1.5">
                    <div v-for="ans in getQuestionAnswers(q.id)" :key="ans.id"
                      class="flex items-center gap-2 text-xs bg-gray-50 rounded-xl px-3 py-2">
                      <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        <i class="fas fa-building"></i>
                      </span>
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-gray-800 truncate">{{ ans.opd_name }}</p>
                        <p v-if="ans.penulis" class="text-[10px] text-gray-500 truncate">
                          oleh {{ ans.penulis }}
                          <span :class="ans.jawaban === 'ya' ? 'text-emerald-600 font-bold' : 'text-gray-500 font-bold'">
                            · {{ ans.jawaban === 'ya' ? 'Ya' : 'Tidak' }}
                          </span>
                        </p>
                      </div>
                      <a v-for="lnk in ans.links" :key="lnk.id" :href="lnk.link" target="_blank" rel="noopener"
                        class="shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[#0052FF] hover:bg-blue-50 hover:border-blue-300 transition-all"
                        :title="lnk.judul || lnk.link">
                        <i class="fas fa-external-link-alt mr-1"></i>{{ lnk.judul ? (lnk.judul.length > 20 ? lnk.judul.substring(0, 20) + '…' : lnk.judul) : 'Lihat' }}
                      </a>
                      <span v-if="!ans.links?.length" class="text-[10px] text-gray-400 italic shrink-0">tanpa link</span>
                    </div>
                  </div>
                </div>
              </div>
            
              <!-- PARENT GROUPS (level 4 - induk non-answerable) -->
              <div v-for="g in sec.groups" :key="'group-'+g.id" class="mt-1">
                <!-- Header induk (tidak bisa diisi) -->
                <div class="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200/50 rounded-2xl px-4 py-3 mb-2">
                  <div class="flex items-start gap-2.5">
                    <span class="mt-0.5 w-7 h-7 rounded-xl bg-[#0052FF] text-white flex items-center justify-center text-xs shrink-0 shadow-md shadow-blue-600/20">
                      <i class="fas fa-layer-group text-[10px]"></i>
                    </span>
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-wrap items-center gap-1.5 mb-1">
                        <span class="font-mono text-[11px] font-extrabold text-[#0052FF] bg-white px-2 py-0.5 rounded-lg border border-blue-200">{{ g.kode }}</span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Induk</span>
                      </div>
                      <p class="text-sm text-gray-800 leading-relaxed font-semibold">{{ g.pertanyaan }}</p>
                    </div>
                    <span class="shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-full"
                      :class="g.terisi === g.total ? 'bg-emerald-100 text-emerald-700' : g.terisi > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'">
                      {{ g.terisi }}/{{ g.total }}
                    </span>
                  </div>
                </div>
                <!-- Pertanyaan anak di dalam grup -->
                <div class="ml-3 md:ml-5 pl-3 border-l-2 border-blue-200/60 space-y-2.5">
                  <div v-for="q in g.questions" :key="q.id"
                    class="group bg-white rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    :class="q.terisi ? 'border-emerald-200/60' : 'border-gray-200/80 hover:border-[#0052FF]/30'">
                    <div class="flex items-start gap-3">
                      <span class="mt-1 w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 transition-transform group-hover:scale-110"
                        :class="q.terisi ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' : 'bg-gray-100 text-gray-400'">
                        <i :class="q.terisi ? 'fas fa-check' : 'fas fa-pen text-[10px]'"></i>
                      </span>
                      <div class="flex-1 min-w-0">
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
                        <p class="text-sm text-gray-800 leading-relaxed font-medium">{{ q.pertanyaan }}</p>
                        <p v-if="q.dokumen_upload" class="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5"><i class="fas fa-paperclip text-gray-400"></i><span class="line-clamp-1">{{ q.dokumen_upload }}</span></p>
                        <p v-if="q.klasifikasi_otomatis" class="mt-1 text-[11px] text-gray-400"><i class="fas fa-tag mr-1"></i>{{ q.klasifikasi_otomatis }}</p>
                      </div>
                      <button @click="openAnswerModal(q)"
                        class="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                        :class="q.terisi
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-gradient-to-r from-[#0052FF] to-[#0041CC] text-white shadow-md shadow-blue-600/25 hover:shadow-lg'">
                        <i :class="q.terisi ? 'fas fa-eye mr-1.5' : 'fas fa-pen mr-1.5'"></i>{{ q.terisi ? 'Lihat' : 'Isi' }}
                      </button>
                    </div>
                    <div v-if="isFullMode" class="mt-3 pt-3 border-t border-gray-100">
                      <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                        <i class="fas fa-reply-all mr-1"></i> Jawaban OPD ({{ getQuestionAnswers(q.id).length }})
                      </p>
                      <div v-if="getQuestionAnswers(q.id).length === 0" class="text-xs text-gray-400 italic">
                        Belum ada jawaban
                      </div>
                      <div v-else class="space-y-1.5">
                        <div v-for="ans in getQuestionAnswers(q.id)" :key="ans.id"
                          class="flex items-center gap-2 text-xs bg-gray-50 rounded-xl px-3 py-2">
                          <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            <i class="fas fa-building"></i>
                          </span>
                          <div class="flex-1 min-w-0">
                            <p class="font-bold text-gray-800 truncate">{{ ans.opd_name }}</p>
                            <p v-if="ans.penulis" class="text-[10px] text-gray-500 truncate">
                              oleh {{ ans.penulis }}
                              <span :class="ans.jawaban === 'ya' ? 'text-emerald-600 font-bold' : 'text-gray-500 font-bold'">
                                · {{ ans.jawaban === 'ya' ? 'Ya' : 'Tidak' }}
                              </span>
                            </p>
                          </div>
                          <a v-for="lnk in ans.links" :key="lnk.id" :href="lnk.link" target="_blank" rel="noopener"
                            class="shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[#0052FF] hover:bg-blue-50 hover:border-blue-300 transition-all"
                            :title="lnk.judul || lnk.link">
                            <i class="fas fa-external-link-alt mr-1"></i>{{ lnk.judul ? (lnk.judul.length > 20 ? lnk.judul.substring(0, 20) + '…' : lnk.judul) : 'Lihat' }}
                          </a>
                          <span v-if="!ans.links?.length" class="text-[10px] text-gray-400 italic shrink-0">tanpa link</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
</div>
          </div>
        </div>
      </template>
    </div>

    <!-- MODAL JAWABAN -->
    <Transition name="modal">
      <div v-if="modal.open" class="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6">
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
            <template v-if="modal.question?.input_type === 'dokumen' || !modal.question?.input_type">
              <div class="flex justify-between">
                <span class="text-gray-500">Kategori Informasi</span>
                <span class="font-bold text-[#0052FF]">{{ modal.question?.klasifikasi_otomatis || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Target Upload</span>
                <span class="font-bold text-gray-900">{{ modal.question?.target_upload === 'pemkab' ? 'Informasi Pemkab' : 'PPID' }}</span>
              </div>
            </template>
            <template v-else>
              <div class="flex justify-between">
                <span class="text-gray-500">Jenis Bukti</span>
                <span class="font-bold text-[#0052FF]">{{ modal.question?.input_type === 'situs' ? 'Link Situs/Web' : 'Link Foto' }}</span>
              </div>
            </template>
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

            <!-- TAB BUKTI (hanya bila Ya): Upload Dokumen / Link / Galeri (Galeri hanya soal foto) -->
            <div v-if="form.jawaban === 'ya'" class="space-y-3">
              <div :class="modal.question?.input_type === 'foto' ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'">
                <button type="button" @click="answerTab = 'dokumen'"
                  class="py-2.5 rounded-2xl font-bold text-sm border-2 transition-all"
                  :class="answerTab === 'dokumen' ? 'bg-[#0052FF] border-[#0052FF] text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'">
                  <i class="fas fa-cloud-upload-alt mr-1.5"></i>Upload Dokumen
                </button>
                <button type="button" @click="answerTab = 'link'"
                  class="py-2.5 rounded-2xl font-bold text-sm border-2 transition-all"
                  :class="answerTab === 'link' ? 'bg-[#0052FF] border-[#0052FF] text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'">
                  <i class="fas fa-link mr-1.5"></i>Link
                </button>
                <button v-if="modal.question?.input_type === 'foto'" type="button" @click="answerTab = 'galeri'"
                  class="py-2.5 rounded-2xl font-bold text-sm border-2 transition-all"
                  :class="answerTab === 'galeri' ? 'bg-[#0052FF] border-[#0052FF] text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'">
                  <i class="fas fa-images mr-1.5"></i>Galeri
                </button>
              </div>
              <p class="text-xs text-gray-500">Cukup isi salah satu tab saja: dokumen saja, link saja<span v-if="modal.question?.input_type === 'foto'">, atau galeri saja</span>. Bisa juga diisi lebih dari satu.</p>

              <!-- TAB UPLOAD DOKUMEN -->
              <div v-if="answerTab === 'dokumen'" class="space-y-3">
                <div v-for="(u, uidx) in docUploads" :key="uidx"
                  class="p-3 rounded-2xl border-2 border-blue-100 bg-blue-50/40 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-[#0052FF]"><i class="fas fa-file-alt mr-1"></i>Dokumen {{ uidx + 1 }} — {{ u.file?.name || u.name || '' }}</span>
                    <button type="button" @click="docUploads.splice(uidx, 1)"
                      class="text-xs font-bold text-rose-500 hover:text-rose-700"><i class="fas fa-trash-alt mr-1"></i>Hapus</button>
                  </div>
                  <p class="text-[11px] text-gray-500">{{ u.file ? (u.file.size / 1024).toFixed(0) + ' KB' : '' }} · PDF / DOC / DOCX / XLS / XLSX / PPT / JPG / PNG, maks 10 MB per file. JPG/PNG otomatis di-convert jadi WebP di server.</p>
                  <input v-model="u.judul" required type="text" placeholder="Judul dokumen *"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                  <input v-model="u.deskripsi" type="text" placeholder="Deskripsi singkat (opsional)"
                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-xs" />
                  <label v-if="modal.question?.input_type === 'dokumen' || !modal.question?.input_type"
                    class="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="u.jadikanInformasi" class="mt-0.5 w-4 h-4 accent-[#0052FF]" />
                    <span><strong>Jadikan Informasi {{ modal.question?.target_upload === 'pemkab' ? 'Pemkab' : '' }}</strong> — bila dimatikan (default), file ini hanya lampiran jawaban, <strong>tidak</strong> masuk daftar Informasi / Informasi Pemkab.</span>
                  </label>
                  <p v-else class="text-xs text-gray-500">File ini hanya lampiran jawaban, tidak masuk daftar Informasi.</p>
                </div>
                <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" @change="onDocFilesChange"
                  class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-sm" />
                <p class="text-xs text-gray-500">Boleh lebih dari 1 file. File lampiran tidak masuk Informasi kecuali toggle di atas diaktifkan. JPG/PNG otomatis di-convert jadi WebP.</p>
                <div v-for="(sv, svidx) in savedUploads" :key="'sv'+svidx"
                  class="p-3 rounded-2xl border-2 border-amber-200 bg-amber-50/50 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-amber-800"><i class="fas fa-file-alt mr-1"></i>{{ sv.kind === 'drive' ? 'Link Drive Tersimpan' : 'File Tersimpan' }} — {{ sv.name || sv.link }}</span>
                    <button type="button" @click="savedUploads.splice(svidx, 1)"
                      class="text-xs font-bold text-rose-500 hover:text-rose-700"><i class="fas fa-trash-alt mr-1"></i>Hapus</button>
                  </div>
                  <p class="text-[11px] text-gray-500">File tersimpan tidak bisa diisi ulang otomatis oleh browser — baris ini dipertahankan apa adanya bila disimpan ulang tanpa diubah. Hapus untuk menggantinya.</p>
                  <a v-if="sv.link" :href="sv.link" target="_blank" rel="noopener" class="text-xs text-[#0052FF] font-bold underline break-all">{{ sv.link }}</a>
                  <input v-model="sv.judul" :required="!!sv.jadikanInformasi" type="text" placeholder="Judul dokumen * (wajib bila dijadikan Informasi)"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-sm" />
                  <input v-model="sv.deskripsi" type="text" placeholder="Deskripsi singkat (opsional)"
                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-xs" />
                  <label v-if="modal.question?.input_type === 'dokumen' || !modal.question?.input_type"
                    class="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="sv.jadikanInformasi" class="mt-0.5 w-4 h-4 accent-[#0052FF]" />
                    <span><strong>Jadikan Informasi {{ modal.question?.target_upload === 'pemkab' ? 'Pemkab' : '' }}</strong> — bila dimatikan (default), bukti ini hanya lampiran/link jawaban, <strong>tidak</strong> masuk daftar Informasi / Informasi Pemkab.</span>
                  </label>
                  <p v-else class="text-xs text-gray-500">Bukti ini hanya lampiran jawaban, tidak masuk daftar Informasi.</p>
                </div>
                <div v-for="(dr, dridx) in driveRows" :key="'dr'+dridx"
                  class="p-3 rounded-2xl border-2 border-cyan-200 bg-cyan-50/50 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-cyan-800"><i class="fab fa-google-drive mr-1"></i>Link Google Drive {{ dridx + 1 }}</span>
                    <button type="button" @click="driveRows.splice(dridx, 1)"
                      class="text-xs font-bold text-rose-500 hover:text-rose-700"><i class="fas fa-trash-alt mr-1"></i>Hapus</button>
                  </div>
                  <p class="text-xs text-gray-500">Hanya link Google Drive (drive.google.com / docs.google.com) yang diterima di sini. Tanpa upload file — cukup judul + link Drive.</p>
                  <input v-model="dr.judul" :required="!!dr.jadikanInformasi" type="text" placeholder="Judul dokumen * (wajib bila dijadikan Informasi)"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-sm" />
                  <input v-model="dr.link" required type="url" placeholder="https://drive.google.com/... *"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-sm" />
                  <input v-model="dr.deskripsi" type="text" placeholder="Deskripsi singkat (opsional)"
                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-xs" />
                  <label v-if="modal.question?.input_type === 'dokumen' || !modal.question?.input_type"
                    class="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="dr.jadikanInformasi" class="mt-0.5 w-4 h-4 accent-[#0052FF]" />
                    <span><strong>Jadikan Informasi {{ modal.question?.target_upload === 'pemkab' ? 'Pemkab' : '' }}</strong> — bila dimatikan (default), link Drive ini hanya bukti jawaban, <strong>tidak</strong> masuk daftar Informasi / Informasi Pemkab.</span>
                  </label>
                  <p v-else class="text-xs text-gray-500">Link Drive ini hanya bukti jawaban, tidak masuk daftar Informasi.</p>
                </div>
                <button type="button" @click="driveRows.push({ judul: '', link: '', deskripsi: '', jadikanInformasi: false })"
                  class="w-full py-2.5 rounded-2xl border-2 border-dashed border-cyan-600/40 text-cyan-700 text-sm font-bold hover:bg-cyan-50 transition-all">
                  <i class="fab fa-google-drive mr-2"></i>Tambah Link Google Drive
                </button>
              </div>

              <!-- TAB LINK -->
              <div v-if="answerTab === 'link'" class="space-y-3">
                <div v-for="(l, idx) in form.links" :key="idx"
                  class="p-3 rounded-2xl border-2 border-blue-100 bg-blue-50/40 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-[#0052FF]">
                      {{ modal.question?.input_type === 'foto' ? 'Foto ' : modal.question?.input_type === 'situs' ? 'Situs ' : 'Link ' }}{{ idx + 1 }}
                    </span>
                    <button v-if="form.links.length > 1" type="button" @click="form.links.splice(idx, 1)"
                      class="text-xs font-bold text-rose-500 hover:text-rose-700">
                      <i class="fas fa-trash-alt mr-1"></i>Hapus
                    </button>
                  </div>
                  <div class="flex gap-2">
                    <input v-model="l.link" required type="url" placeholder="https://... * (medsos, situs, Drive, atau link detail PPID)"
                      class="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                    <button v-if="isPpidDetailUrl(l.link)" type="button" @click="syncFromPpid(idx)" :disabled="syncing || !l.link"
                      class="shrink-0 px-3 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 disabled:opacity-40 transition-all"
                      title="Sinkronisasi dari web PPID">
                      <i :class="syncing ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i> Sinkronisasi
                    </button>
                  </div>
                  <p v-if="l.link && !isPpidDetailUrl(l.link)" class="text-xs text-gray-500">Link apa saja boleh (medsos, situs, Drive, dll) — disimpan sebagai link biasa, tanpa wajib sinkronisasi.</p>
                  <p v-if="l.link && isPpidDetailUrl(l.link)" class="text-xs text-cyan-700">Link detail PPID terdeteksi — tekan Sinkronisasi untuk mengisi judul otomatis tanpa membuat dokumen baru.</p>
                  <input v-model="l.judul" :required="!!l.jadikanInformasi" type="text" :placeholder="l.mode === 'sync_ppid' ? 'Judul terisi otomatis setelah sinkronisasi' : 'Judul / keterangan (opsional, wajib bila dijadikan Informasi)'"
                    :readonly="l.mode === 'sync_ppid'"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                  <input v-model="l.deskripsi" type="text" placeholder="Deskripsi singkat (opsional)"
                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-xs" />
                  <div v-if="l.sync?.found" class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-gray-700 space-y-1">
                    <p class="font-bold text-emerald-700"><i class="fas fa-check-circle mr-1"></i>Ditemukan di PPID ({{ l.sync.sumber === 'informasi_pemkab' ? 'Informasi Pemkab' : 'Informasi PPID' }})</p>
                    <p><span class="text-gray-500">Judul:</span> {{ l.sync.judul }}</p>
                    <p v-if="l.sync.kategori"><span class="text-gray-500">Kategori:</span> {{ l.sync.kategori }}</p>
                    <p v-if="l.sync.tanggal"><span class="text-gray-500">Tanggal:</span> {{ l.sync.tanggal }}</p>
                    <p v-if="l.sync.pengupload"><span class="text-gray-500">Pengupload:</span> {{ l.sync.pengupload }}<span v-if="l.sync.opd"> ({{ l.sync.opd }})</span></p>
                    <p v-if="l.sync.file_url"><a :href="l.sync.file_url" target="_blank" class="text-[#0052FF] font-bold underline">Lihat file dokumen</a></p>
                    <p><a :href="l.link" target="_blank" class="text-[#0052FF] font-bold underline">Buka halaman detail PPID</a></p>
                  </div>
                  <p v-if="l.syncError" class="text-xs text-rose-600">{{ l.syncError }}</p>
                  <label v-if="(modal.question?.input_type === 'dokumen' || !modal.question?.input_type) && l.mode !== 'sync_ppid'"
                    class="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="l.jadikanInformasi" class="mt-0.5 w-4 h-4 accent-[#0052FF]" />
                    <span><strong>Jadikan Informasi {{ modal.question?.target_upload === 'pemkab' ? 'Pemkab' : '' }}</strong> — bila dimatikan (default), link ini hanya bukti jawaban, <strong>tidak</strong> masuk daftar Informasi / Informasi Pemkab.</span>
                  </label>
                </div>
                <button type="button" @click="form.links.push({ judul: '', link: '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false })"
                  class="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#0052FF]/30 text-[#0052FF] text-sm font-bold hover:bg-blue-50 transition-all">
                  <i class="fas fa-plus mr-2"></i>Tambah {{ modal.question?.input_type === 'situs' ? 'Link Situs' : modal.question?.input_type === 'foto' ? 'Link Foto' : 'Link' }}
                </button>
              </div>
              <!-- TAB GALERI (hanya soal foto; tombolnya hanya tampil untuk soal foto) -->
              <div v-if="answerTab === 'galeri'" class="space-y-3">
                <div class="p-3 rounded-2xl border-2 border-violet-200 bg-violet-50/50 space-y-2">
                  <p class="text-xs font-extrabold text-violet-700"><i class="fas fa-images mr-1"></i>Upload Foto ke Galeri</p>
                  <p class="text-xs text-gray-500">Foto diunggah ke Galeri publik web (halaman Galeri), dan link-nya otomatis tersimpan sebagai bukti jawaban ini. Bisa dipakai sendiri tanpa dokumen/link, atau digabung dengan tab lain. Foto Galeri tidak masuk daftar Informasi / Informasi Pemkab.</p>
                  <div v-if="savedFoto && !fotoPreview" class="space-y-2">
                    <div class="flex items-center gap-3">
                      <img :src="savedFoto.link" class="w-20 h-20 object-cover rounded-xl border border-gray-200" alt="Foto Galeri tersimpan" />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold truncate">{{ savedFoto.judul || savedFoto.name }}</p>
                        <a :href="savedFoto.link" target="_blank" rel="noopener" class="text-[11px] text-[#0052FF] font-bold underline break-all">{{ savedFoto.link }}</a>
                      </div>
                      <button type="button" @click="removeSavedFoto" class="text-xs font-bold text-rose-500 hover:text-rose-700">Hapus</button>
                    </div>
                    <input v-model="savedFoto.judul" type="text" placeholder="Judul foto"
                      class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-sm" />
                    <p class="text-xs text-gray-500">Foto tersimpan ini dipertahankan apa adanya bila disimpan ulang tanpa diubah. Hapus untuk menghilangkan bukti foto ini (record Galeri publik tetap ada). Unggah foto baru di bawah untuk menggantinya.</p>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" @change="onFotoFileChange"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-sm" />
                  <div v-if="fotoPreview" class="flex items-center gap-3">
                    <img :src="fotoPreview" class="w-20 h-20 object-cover rounded-xl border border-gray-200" alt="Pratinjau foto" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold truncate">{{ fotoFile?.name }}</p>
                      <p class="text-[11px] text-gray-500">{{ fotoFile ? (fotoFile.size / 1024).toFixed(0) + ' KB' : '' }}</p>
                    </div>
                    <button type="button" @click="removeFotoFile" class="text-xs font-bold text-rose-500 hover:text-rose-700">Hapus</button>
                  </div>
                  <p v-if="fotoPreview && savedFoto" class="text-xs text-amber-700">Foto baru ini akan mengganti foto tersimpan saat Simpan.</p>
                  <input v-model="form.fotoJudul" :required="!!fotoFile" type="text" placeholder="Judul foto * (wajib bila mengunggah foto)"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10 outline-none transition-all text-sm" />
                  <label class="block text-xs font-bold text-gray-700">Tanggal upload</label>
                  <input v-model="form.fotoTanggal" type="date"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none transition-all text-sm" />
                  <p class="text-xs text-gray-500">Tanggal upload bisa diubah; berbeda dari tanggal simpan jawaban (created_at). Default: hari ini.</p>
                </div>
              </div>
              <p v-if="syncMsg" class="text-xs" :class="syncFound ? 'text-emerald-600' : 'text-gray-500'">{{ syncMsg }}</p>
            </div>

            <!-- INFO (bila Tidak) -->
            <div v-if="form.jawaban === 'tidak'"
              class="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-600">
              <i class="fas fa-info-circle mr-2 text-gray-400"></i>
              OPD dinyatakan <strong>tidak memiliki</strong> indikator ini — tidak perlu mengisi link dokumen.
            </div>

            <div v-if="form.jawaban === 'ya' && showVisibility">
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
            <p v-if="form.jawaban === 'ya' && !showVisibility" class="text-[11px] text-gray-500">Visibilitas publik tidak berlaku untuk link / lampiran saja — hanya berlaku bila ada bukti yang dijadikan Informasi.</p>
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
const answerTab = ref('dokumen')
const docUploads = ref([])
const driveRows = ref([])
const savedUploads = ref([])
const form = ref({ judul: '', link: '', klasifikasi: '', deskripsi: '' })
const submitting = ref(false)
const formError = ref('')
const fotoFile = ref(null)
const fotoPreview = ref('')
const savedFoto = ref(null)
const todayLocal = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const onFotoFileChange = (e) => {
  const f = e.target.files && e.target.files[0]
  formError.value = ''
  if (!f) { fotoFile.value = null; fotoPreview.value = ''; return }
  if (!f.type.startsWith('image/')) {
    formError.value = 'File harus berupa gambar.'
    e.target.value = ''; fotoFile.value = null; fotoPreview.value = ''; return
  }
  if (f.size > 2 * 1024 * 1024) {
    formError.value = 'Ukuran foto maksimal 2 MB.'
    e.target.value = ''; fotoFile.value = null; fotoPreview.value = ''; return
  }
  fotoFile.value = f
  if (fotoPreview.value) URL.revokeObjectURL(fotoPreview.value)
  fotoPreview.value = URL.createObjectURL(f)
}
const removeFotoFile = () => {
  fotoFile.value = null
  if (fotoPreview.value) { URL.revokeObjectURL(fotoPreview.value); fotoPreview.value = '' }
}
const removeSavedFoto = () => {
  savedFoto.value = null
}
const showVisibility = computed(() => {
  if (form.value.jawaban !== 'ya') return false
  const qt = modal.value.question?.input_type || 'dokumen'
  if (qt !== 'dokumen') return false
  const linkInfo = form.value.links.some(l => l.mode === 'sync_ppid' ? false : (l.jadikanInformasi && l.link.trim()))
  const uploadInfo = docUploads.value.some(u => u.jadikanInformasi && u.file)
  const driveInfo = driveRows.value.some(dr => dr.jadikanInformasi && dr.link.trim())
  const savedInfo = savedUploads.value.some(sv => sv.jadikanInformasi && sv.link.trim())
  // Legacy: link lama yang dulu mode 'baru' tetap dihitung bila toggle-nya hidup (diisi saat open).
  return linkInfo || uploadInfo || driveInfo || savedInfo
})
const DOC_EXTS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png']
const onDocFilesChange = (e) => {
  const files = Array.from(e.target.files || [])
  formError.value = ''
  for (const f of files) {
    const ext = (f.name.split('.').pop() || '').toLowerCase()
    if (!DOC_EXTS.includes(ext)) { formError.value = `File ${f.name} ditolak: hanya PDF / DOC / DOCX / XLS / XLSX / PPT / JPG / PNG.`; continue }
    if (f.size > 10 * 1024 * 1024) { formError.value = `File ${f.name} ditolak: maks 10 MB per file.`; continue }
    const base = f.name.replace(/\.[^.]+$/, '')
    docUploads.value.push({ file: f, judul: base, deskripsi: '', jadikanInformasi: false })
  }
  e.target.value = ''
}
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

// Mode full Kabupaten (perintah Yusril 26 Okt 2026): halaman kabupaten-sinjai
// menampilkan SEMUA 203 pertanyaan, dan di bawah tiap soal tampil list jawaban
// semua OPD yang menjawab soal itu. Tanpa guard login: publik bisa melihat
// konsolidasi ini, sama seperti halaman OPD lain.
const isFullMode = computed(() => route.params.slug === 'kabupaten-sinjai')

// Struktur SAQ + jawaban
const { data: structResponse, isLoading, refetch: refetchStruct } = useQuery({
  queryKey: ['saq-structure', computed(() => opd.value?.id)],
  queryFn: async () => {
    if (!opd.value) return null
    return (await api.get('/saq/structure', { params: isFullMode.value ? { full: 1 } : { organization_id: opd.value.id } })).data
  },
  enabled: computed(() => !!opd.value),
  // SAQ tidak boleh pakai cache: selalu fetch ulang tiap buka halaman
  staleTime: 0,
  refetchOnWindowFocus: true,
})
const tabs = computed(() => structResponse.value?.data || [])

// Header progres: mode full memakai total/terisi dari struktur full (203 soal,
// terisi = soal yang punya minimal satu jawaban OPD), bukan progres OPD 127 (19).
const headerProgres = computed(() => {
  if (!isFullMode.value) return opd.value?.progres || { terisi: 0, total: 0, persen: 0 }
  const total = tabs.value.reduce((s, t) => s + t.sections.reduce((a, x) => a + x.total, 0), 0)
  const terisi = tabs.value.reduce((s, t) => s + t.sections.reduce((a, x) => a + x.terisi, 0), 0)
  return { terisi, total, persen: total > 0 ? Math.round(terisi / total * 100) : 0 }
})

// Konsolidasi jawaban semua OPD (hanya mode full)
const { data: allAnswersResponse } = useQuery({
  queryKey: ['saq-all-answers'],
  queryFn: async () => (await api.get('/saq/all-answers')).data,
  enabled: computed(() => isFullMode.value),
  staleTime: 0,
})
const allAnswers = computed(() => allAnswersResponse.value?.data || {})
const getQuestionAnswers = (questionId) => allAnswers.value[questionId] || []

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
  answerTab.value = 'dokumen'
  docUploads.value = []
  driveRows.value = []
  savedUploads.value = []
  form.value = { jawaban: null, visibility: 'public', links: [{ judul: '', link: '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false }], fotoJudul: '', fotoTanggal: todayLocal() }
  fotoFile.value = null
  if (fotoPreview.value) { URL.revokeObjectURL(fotoPreview.value); fotoPreview.value = '' }
  savedFoto.value = null
  if (q.terisi && opd.value) {
    try {
      const res = await api.get('/saq/answers', { params: { organization_id: opd.value.id } })
      const found = (res.data.data || []).find(a => a.indicator_id === q.id)
      if (found) {
        modal.value.existing = found
        form.value.jawaban = found.jawaban || null
        form.value.visibility = found.visibility || 'public'
        if (found.links && found.links.length) {
          const nl = []
          const ns = []
          for (const l of found.links) {
            const src = l.sumber_informasi
            // Round-trip Tab Galeri: link foto baru (sumber 'galeri') maupun
            // link foto lama (sumber kosong + URL /storage/galeri/) kembali
            // ke tab Galeri sebagai foto tersimpan, bukan ke tab Link.
            // Foto pertama saja yang jadi savedFoto; bila ada lebih dari
            // satu, sisanya jatuh ke tab Link agar URL-nya tidak hilang.
            const isGaleriLink = modal.value.question?.input_type === 'foto' && (src === 'galeri' || (!src && (l.link || '').includes('/storage/galeri/')))
            if (isGaleriLink && !savedFoto.value) {
              const nm = (l.link || '').split('/').filter(Boolean).pop() || l.link || ''
              savedFoto.value = { judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', name: nm }
              continue
            }
            if (src === 'lampiran') {
              const nm = (l.link || '').split('/').filter(Boolean).pop() || l.link || ''
              ns.push({ kind: 'file', judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', jadikanInformasi: false, name: nm })
            } else if (src === 'drive') {
              ns.push({ kind: 'drive', judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', jadikanInformasi: false, name: l.link || '' })
            } else {
              const isSync = src === 'informasi' || src === 'informasi_pemkab'
              nl.push({ judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', mode: isSync ? 'sync_ppid' : 'link', sync: isSync ? { found: true, judul: l.judul || '', sumber: src, kategori: '', tanggal: '', pengupload: '', opd: '', file_url: '' } : null, syncError: '', jadikanInformasi: (modal.value.question?.input_type || 'dokumen') === 'dokumen' && !isSync && src !== 'link' })
            }
          }
          form.value.links = nl.length ? nl : [{ judul: '', link: '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false }]
          savedUploads.value = ns
        } else {
          form.value.links = [{ judul: found.judul || '', link: found.link || '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false }]
        }
      }
    } catch (e) { /* abaikan */ }
  }
}

const isPpidDetailUrl = (raw) => {
  try {
    const u = new URL(raw.trim())
    if (!['ppid.sinjaikab.go.id', 'www.ppid.sinjaikab.go.id'].includes(u.hostname)) return false
    const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/')
    return parts.length >= 2 && parts[0] === 'informasi' && !!parts[1]
  } catch { return false }
}

const isDriveUrl = (raw) => {
  try {
    const u = new URL((raw || '').trim())
    return ['drive.google.com', 'www.drive.google.com', 'docs.google.com', 'www.docs.google.com'].includes(u.hostname)
  } catch { return false }
}

const syncFromPpid = async (idx = 0) => {
  const target = form.value.links[idx]
  if (!target || !target.link) return
  // Sinkronisasi hanya untuk link detail PPID; link lain tetap disimpan sebagai link biasa.
  if (!isPpidDetailUrl(target.link)) {
    target.sync = null
    target.syncError = 'Sinkronisasi hanya untuk link detail PPID: https://ppid.sinjaikab.go.id/informasi/... Link lain tetap bisa disimpan sebagai link biasa.'
    syncFound.value = false
    return
  }
  target.mode = 'sync_ppid'
  target.jadikanInformasi = false
  target.syncError = ''
  syncing.value = true
  syncMsg.value = ''
  try {
    const res = await api.get('/saq/sync', { params: { url: target.link }, skipAuthRedirect: true })
    if (res.data.found) {
      const d = res.data.data
      if (target.mode === 'sync_ppid') {
        // Judul diambil dari data asli, tidak boleh diedit manual.
        target.judul = d.judul || ''
        target.sync = { found: true, ...d }
      } else {
        target.judul = target.judul || d.judul || ''
        target.deskripsi = d.deskripsi || ''
      }
      syncFound.value = true
      syncMsg.value = `Ditemukan di PPID: "${d.judul}" — diupload ${d.pengupload || 'admin'}${d.opd ? ` (${d.opd})` : ''}.`
    } else {
      target.sync = null
      const msg = res.data.message || 'Link belum ada di data PPID.'
      if (target.mode === 'sync_ppid') target.syncError = msg
      syncFound.value = false
      syncMsg.value = msg
    }
  } catch (e) {
    target.sync = null
    const msg = e.response?.status === 401 ? 'Perlu login untuk sinkronisasi.' : 'Gagal sinkronisasi.'
    if (target.mode === 'sync_ppid') target.syncError = msg
    syncFound.value = false
    syncMsg.value = msg
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
  const inputType = modal.value.question?.input_type || 'dokumen'
  const isDokumen = inputType === 'dokumen'
  // Link tab: mode efektif — sync bila sudah tersync, 'baru' bila toggle Informasi hidup (dokumen saja), sisanya 'link' (link biasa, tanpa Informasi).
  const links = form.value.jawaban === 'ya'
    ? form.value.links.filter(l => l.link.trim()).map(l => ({
        judul: l.judul.trim(),
        link: l.link.trim(),
        deskripsi: (l.deskripsi || '').trim(),
        mode: (l.mode === 'sync_ppid' && l.sync && l.sync.found) ? 'sync_ppid' : ((isDokumen && l.jadikanInformasi) ? 'baru' : 'link'),
        sync_url: (l.mode === 'sync_ppid' && l.sync && l.sync.found) ? l.link.trim() : null,
        raw: l,
      }))
    : []
  const uploads = form.value.jawaban === 'ya' ? docUploads.value.filter(u => u.file) : []
  const driveList = form.value.jawaban === 'ya' ? driveRows.value.filter(dr => dr.link.trim()) : []
  const savedList = form.value.jawaban === 'ya' ? savedUploads.value.filter(sv => sv.link.trim()) : []
  for (const dr of driveList) {
    links.push({ judul: dr.judul.trim(), link: dr.link.trim(), deskripsi: (dr.deskripsi || '').trim(), mode: (isDokumen && dr.jadikanInformasi) ? 'baru' : 'drive', sync_url: null, raw: dr })
  }
  for (const sv of savedList) {
    const modeSv = sv.kind === 'file'
      ? ((isDokumen && sv.jadikanInformasi) ? 'baru' : 'lampiran')
      : ((isDokumen && sv.jadikanInformasi) ? 'baru' : 'drive')
    links.push({ judul: sv.judul.trim(), link: sv.link.trim(), deskripsi: (sv.deskripsi || '').trim(), mode: modeSv, sync_url: null, raw: sv })
  }
  // Foto Galeri tersimpan yang tidak diganti: kirim lagi sebagai mode
  // 'galeri' supaya backend mempertahankannya (bukan jadi link biasa /
  // Informasi). Bila ada file foto baru, file baru yang dipakai.
  const isSavedFoto = form.value.jawaban === 'ya' && inputType === 'foto' && !!savedFoto.value && !fotoFile.value
  if (isSavedFoto) {
    links.push({ judul: (savedFoto.value.judul || '').trim(), link: savedFoto.value.link.trim(), deskripsi: '', mode: 'galeri', sync_url: null, raw: savedFoto.value })
  }
  const isFotoUpload = form.value.jawaban === 'ya' && inputType === 'foto' && !!fotoFile.value
  if (form.value.jawaban === 'ya' && form.value.links.some(l => l.link.trim() && l.mode === 'sync_ppid' && !(l.sync && l.sync.found))) {
    formError.value = 'Ada baris link PPID yang belum tersinkronisasi: tekan Sinkronisasi sampai detailnya muncul.'
    return
  }
  if (form.value.jawaban === 'ya' && links.some(l => l.mode === 'baru' && !l.judul)) {
    formError.value = 'Judul wajib diisi untuk link yang dijadikan Informasi.'
    return
  }
  if (form.value.jawaban === 'ya' && driveList.some(dr => !isDriveUrl(dr.link))) {
    formError.value = 'Link Drive harus berupa link Google Drive (drive.google.com / docs.google.com). Domain lain ditolak di sub-mode Drive.'
    return
  }
  if (form.value.jawaban === 'ya' && driveList.some(dr => isDokumen && dr.jadikanInformasi && !dr.judul.trim())) {
    formError.value = 'Judul wajib diisi untuk link Drive yang dijadikan Informasi.'
    return
  }
  if (form.value.jawaban === 'ya' && savedList.some(sv => isDokumen && sv.jadikanInformasi && !sv.judul.trim())) {
    formError.value = 'Judul wajib diisi untuk bukti tersimpan yang dijadikan Informasi.'
    return
  }
  if (form.value.jawaban === 'ya' && uploads.some(u => !u.judul.trim())) {
    formError.value = 'Judul wajib diisi untuk setiap dokumen yang diunggah.'
    return
  }
  if (form.value.jawaban === 'ya' && !links.length && !uploads.length && !driveList.length && !savedList.length && !isFotoUpload && !isSavedFoto) {
    formError.value = 'Jawaban "Ya" wajib disertai minimal satu bukti: dokumen upload, link, atau foto Galeri.'
    return
  }
  if (isFotoUpload && !form.value.fotoJudul.trim()) {
    formError.value = 'Judul foto wajib diisi bila mengunggah foto.'
    return
  }
  submitting.value = true
  formError.value = ''
  try {
    if (uploads.length || isFotoUpload) {
      const fd = new FormData()
      fd.append('organization_id', String(opd.value.id))
      fd.append('indicator_id', String(modal.value.question.id))
      fd.append('jawaban', form.value.jawaban)
      fd.append('visibility', form.value.visibility)
      links.forEach((l, i) => {
        fd.append(`links[${i}][judul]`, l.judul)
        fd.append(`links[${i}][link]`, l.link)
        fd.append(`links[${i}][deskripsi]`, l.deskripsi)
        fd.append(`links[${i}][mode]`, l.mode)
        if (l.sync_url) fd.append(`links[${i}][sync_url]`, l.sync_url)
      })
      uploads.forEach((u, i) => {
        fd.append('dokumen_files[]', u.file)
        fd.append('dokumen_judul[]', u.judul.trim())
        fd.append('dokumen_deskripsi[]', (u.deskripsi || '').trim())
        fd.append('dokumen_jadikan[]', (isDokumen && u.jadikanInformasi) ? '1' : '0')
      })
      if (isFotoUpload) {
        fd.append('foto', fotoFile.value)
        fd.append('judul_foto', form.value.fotoJudul.trim())
        if (form.value.fotoTanggal) fd.append('tanggal_upload', form.value.fotoTanggal)
      }
      const token = localStorage.getItem('ppid_token')
      const res = await fetch(`${api.defaults.baseURL}/saq/answers`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan jawaban.')
    } else {
      await api.post('/saq/answers', {
        organization_id: opd.value.id,
        indicator_id: modal.value.question.id,
        jawaban: form.value.jawaban,
        visibility: form.value.visibility,
        links: links.map(l => ({ judul: l.judul, link: l.link, deskripsi: l.deskripsi || null, mode: l.mode, sync_url: l.sync_url })),
      }, { skipAuthRedirect: true })
    }
    modal.value.open = false
    docUploads.value = []
    driveRows.value = []
    savedUploads.value = []
    savedFoto.value = null
    queryClient.invalidateQueries({ queryKey: ['saq-opds'] })
    queryClient.invalidateQueries({ queryKey: ['saq-structure'] })
  } catch (e) {
    formError.value = e.response?.data?.message || e.message || 'Gagal menyimpan jawaban.'
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
