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

                <!-- BANNER STATUS PENGUNCIAN SAQ -->
        <div v-if="isLocked && !authStore.isSuperAdmin"
          class="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm">
          <div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-sm shadow">
            <i class="fas fa-lock"></i>
          </div>
          <div>
            <p class="font-bold text-sm text-amber-950 mb-0.5">Pengisian SAQ Sedang Dikunci</p>
            <p class="text-xs text-amber-800 leading-relaxed">
              Pengisian dan perubahan jawaban SAQ saat ini sedang dikunci oleh Superadmin. Hanya Superadmin yang memiliki hak akses untuk mengisi atau memperbarui jawaban.
            </p>
          </div>
        </div>
        <div v-else-if="authStore.isSuperAdmin && isLocked"
          class="mb-4 flex flex-wrap items-center justify-between gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 shadow-sm text-xs text-indigo-900">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              <i class="fas fa-user-shield"></i>
            </span>
            <div>
              <span class="font-bold">Mode Superadmin:</span> Pengisian SAQ dikunci untuk admin OPD, namun Anda memiliki hak akses penuh untuk mengisi/mengubah jawaban baik OPD maupun Kabupaten.
            </div>
          </div>
          <NuxtLink to="/admin/saq" class="text-indigo-600 hover:text-indigo-800 font-bold underline shrink-0">
            Kelola di Admin Panel &rarr;
          </NuxtLink>
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
                    <div v-if="q.jawaban === 'tidak' && q.alasan" class="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                      <i class="fas fa-comment-dots text-amber-600 mt-0.5 shrink-0"></i>
                      <div class="min-w-0 flex-1">
                        <span class="font-bold text-amber-900 block text-[11px] uppercase tracking-wide">Alasan Tidak Ada:</span>
                        <span class="italic text-gray-800 leading-relaxed">{{ q.alasan }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Tombol aksi -->
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button @click="openAnswerModal(q)"
                      class="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                      :class="q.terisi
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                        : (!canAnswer
                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#0052FF] to-[#0041CC] text-white shadow-md shadow-blue-600/25 hover:shadow-lg')">
                      <i :class="q.terisi ? 'fas fa-eye mr-1.5' : (!canAnswer ? 'fas fa-lock mr-1.5' : 'fas fa-pen mr-1.5')"></i>{{ q.terisi ? (canAnswer ? 'Ubah' : 'Lihat') : (canAnswer ? 'Isi' : 'Terkunci') }}
                    </button>
                    <button v-if="q.terisi && canAnswer" @click.stop="quickDeleteAnswer(q)"
                      :disabled="deletingId === q.id"
                      class="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 transition-all active:scale-95 disabled:opacity-50"
                      title="Hapus Jawaban & Dokumen Bukti">
                      <i :class="deletingId === q.id ? 'fas fa-spinner fa-spin' : 'fas fa-trash-alt'"></i>
                    </button>
                  </div>
                </div>
                <!-- DAFTAR JAWABAN KONSOLIDASI (mode full, superadmin) -->
                <div v-if="isFullMode" class="mt-3 pt-3 border-t border-gray-100">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-[11px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                      <i class="fas fa-reply-all text-[#0052FF]"></i> Jawaban OPD ({{ getQuestionAnswers(q.id).length }})
                    </p>
                    <span v-if="getQuestionAnswers(q.id).length" class="text-[10px] text-gray-400">
                      Gunakan tombol <span class="font-bold text-gray-600">Salin</span> untuk meng-copy URL
                    </span>
                  </div>
                  <div v-if="getQuestionAnswers(q.id).length === 0" class="text-xs text-gray-400 italic bg-gray-50/70 p-3 rounded-xl border border-dashed border-gray-200">
                    Belum ada jawaban dari OPD manapun.
                  </div>
                  <div v-else class="space-y-2">
                    <div v-for="ans in getQuestionAnswers(q.id)" :key="ans.id"
                      class="p-3 bg-gray-50/90 hover:bg-gray-50 rounded-2xl border border-gray-200/90 transition-all space-y-2.5">
                      <!-- Baris Atas: Info OPD & Status Ya/Tidak -->
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <span class="w-7 h-7 rounded-lg bg-blue-100 text-[#0052FF] flex items-center justify-center text-xs font-bold shrink-0">
                            <i class="fas fa-building"></i>
                          </span>
                          <div class="min-w-0">
                            <p class="font-bold text-gray-900 text-xs truncate">{{ ans.opd_name }}</p>
                            <p v-if="ans.penulis" class="text-[10px] text-gray-500 truncate">
                              Pengisi: <span class="font-medium text-gray-700">{{ ans.penulis }}</span>
                            </p>
                          </div>
                        </div>
                        <span class="shrink-0 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wide flex items-center gap-1"
                          :class="ans.jawaban === 'ya' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-200 text-gray-700 border border-gray-300'">
                          <i :class="ans.jawaban === 'ya' ? 'fas fa-check-circle text-emerald-600' : 'fas fa-times-circle text-gray-500'"></i>
                          {{ ans.jawaban === 'ya' ? 'Ya, Ada' : 'Tidak Ada' }}
                        </span>
                      </div>

                      <!-- Alasan jika Tidak Ada -->
                      <div v-if="ans.jawaban === 'tidak' && ans.alasan" class="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                        <i class="fas fa-comment-dots text-amber-600 mt-0.5 shrink-0"></i>
                        <div class="min-w-0 flex-1">
                          <span class="font-bold text-amber-900 block text-[10px] uppercase tracking-wide">Alasan Tidak Ada:</span>
                          <span class="italic text-gray-800 leading-relaxed">{{ ans.alasan }}</span>
                        </div>
                      </div>

                      <!-- DAFTAR BUKTI DUKUNG & LINK (DIBEDAKAN SECARA JELAS + TOMBOL SALIN) -->
                      <div v-if="ans.links && ans.links.length" class="space-y-1.5 pt-0.5">
                        <div v-for="lnk in ans.links" :key="lnk.id"
                          class="flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition-all shadow-xs"
                          :class="getLinkBadge(lnk).containerClass">
                          <!-- Sisi Kiri: Ikon, Tipe, Judul/Nama Link -->
                          <div class="flex items-center gap-2.5 min-w-0 flex-1">
                            <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 shadow-xs"
                              :class="getLinkBadge(lnk).iconBg">
                              <i :class="getLinkBadge(lnk).icon"></i>
                            </span>
                            <div class="min-w-0 flex-1">
                              <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs"
                                  :class="getLinkBadge(lnk).badgeClass">
                                  {{ getLinkBadge(lnk).label }}
                                </span>
                                <span class="font-bold text-gray-900 truncate text-[11px]">
                                  {{ lnk.judul || getLinkBadge(lnk).defaultTitle(lnk) }}
                                </span>
                              </div>
                              <p class="text-[10px] text-gray-500 truncate font-mono mt-0.5" :title="lnk.link">
                                {{ lnk.link }}
                              </p>
                            </div>
                          </div>

                          <!-- Sisi Kanan: Tombol Unduh, Salin & Buka -->
                          <div class="flex items-center gap-1.5 shrink-0">
                            <!-- Tombol Unduh Berkas Bukti Dukung (Nama Otomatis Disesuaikan dengan Kode Soal & Nama OPD) -->
                            <a v-if="isDownloadable(lnk)"
                              :href="getDownloadEvidenceUrl(q, ans, lnk)"
                              target="_blank"
                              download
                              class="px-2 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all flex items-center gap-1 active:scale-95"
                              :title="'Unduh Berkas ' + (lnk.judul || 'Bukti Dukung')">
                              <i class="fas fa-download text-[10px]"></i>
                              <span class="text-[10px]">Unduh</span>
                            </a>

                            <!-- Tombol Salin Link dengan Tooltip URL saat Pointer Diarahkan -->
                            <div class="relative group/copy">
                              <button type="button" @click.stop="copyToClipboard(lnk.link, lnk.id || lnk.link)"
                                class="px-2 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                                :class="copiedLinkId === (lnk.id || lnk.link)
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/30'
                                  : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'"
                                :title="'Salin: ' + lnk.link">
                                <i :class="copiedLinkId === (lnk.id || lnk.link) ? 'fas fa-check' : 'fas fa-copy text-gray-500'"></i>
                                <span class="text-[10px]">{{ copiedLinkId === (lnk.id || lnk.link) ? 'Tersalin!' : 'Salin' }}</span>
                              </button>
                              <!-- Popover / Tooltip URL yang diisi saat pointer diarahkan -->
                              <div class="absolute bottom-full right-0 mb-1.5 hidden group-hover/copy:flex flex-col z-50 pointer-events-none w-max max-w-xs sm:max-w-sm">
                                <div class="bg-gray-900 text-white text-[11px] font-mono px-3 py-1.5 rounded-xl shadow-xl border border-gray-700 break-all leading-snug">
                                  <span class="text-amber-400 block text-[9px] font-sans font-bold uppercase tracking-wider mb-0.5">Tautan yang Diisi:</span>
                                  <span class="text-white">{{ lnk.link }}</span>
                                </div>
                                <div class="w-2.5 h-2.5 bg-gray-900 rotate-45 self-end mr-4 -mt-1 border-r border-b border-gray-700"></div>
                              </div>
                            </div>

                            <!-- Tombol Buka Tautan / File -->
                            <a :href="lnk.link" target="_blank" rel="noopener"
                              class="px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm transition-all flex items-center gap-1 active:scale-95"
                              :class="getLinkBadge(lnk).buttonClass"
                              :title="'Buka ' + getLinkBadge(lnk).label">
                              <span class="text-[10px]">{{ getLinkBadge(lnk).buttonText }}</span>
                              <i class="fas fa-external-link-alt text-[9px]"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div v-else-if="ans.jawaban === 'ya'" class="text-[11px] text-gray-400 italic pt-1">
                        <i class="fas fa-info-circle mr-1"></i>Belum ada link atau berkas yang dilampirkan.
                      </div>
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
                    <div v-if="q.jawaban === 'tidak' && q.alasan" class="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                      <i class="fas fa-comment-dots text-amber-600 mt-0.5 shrink-0"></i>
                      <div class="min-w-0 flex-1">
                        <span class="font-bold text-amber-900 block text-[11px] uppercase tracking-wide">Alasan Tidak Ada:</span>
                        <span class="italic text-gray-800 leading-relaxed">{{ q.alasan }}</span>
                      </div>
                    </div>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <button @click="openAnswerModal(q)"
                          class="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                          :class="q.terisi
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                            : (!canAnswer
                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#0052FF] to-[#0041CC] text-white shadow-md shadow-blue-600/25 hover:shadow-lg')">
                          <i :class="q.terisi ? 'fas fa-eye mr-1.5' : (!canAnswer ? 'fas fa-lock mr-1.5' : 'fas fa-pen mr-1.5')"></i>{{ q.terisi ? (canAnswer ? 'Ubah' : 'Lihat') : (canAnswer ? 'Isi' : 'Terkunci') }}
                        </button>
                        <button v-if="q.terisi && canAnswer" @click.stop="quickDeleteAnswer(q)"
                          :disabled="deletingId === q.id"
                          class="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 transition-all active:scale-95 disabled:opacity-50"
                          title="Hapus Jawaban & Dokumen Bukti">
                          <i :class="deletingId === q.id ? 'fas fa-spinner fa-spin' : 'fas fa-trash-alt'"></i>
                        </button>
                      </div>
                    </div>
                    <!-- DAFTAR JAWABAN KONSOLIDASI (mode full, superadmin) -->
                    <div v-if="isFullMode" class="mt-3 pt-3 border-t border-gray-100">
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-[11px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                          <i class="fas fa-reply-all text-[#0052FF]"></i> Jawaban OPD ({{ getQuestionAnswers(q.id).length }})
                        </p>
                        <span v-if="getQuestionAnswers(q.id).length" class="text-[10px] text-gray-400">
                          Gunakan tombol <span class="font-bold text-gray-600">Salin</span> untuk meng-copy URL
                        </span>
                      </div>
                      <div v-if="getQuestionAnswers(q.id).length === 0" class="text-xs text-gray-400 italic bg-gray-50/70 p-3 rounded-xl border border-dashed border-gray-200">
                        Belum ada jawaban dari OPD manapun.
                      </div>
                      <div v-else class="space-y-2">
                        <div v-for="ans in getQuestionAnswers(q.id)" :key="ans.id"
                          class="p-3 bg-gray-50/90 hover:bg-gray-50 rounded-2xl border border-gray-200/90 transition-all space-y-2.5">
                          <!-- Baris Atas: Info OPD & Status Ya/Tidak -->
                          <div class="flex items-start justify-between gap-2">
                            <div class="flex items-center gap-2 min-w-0">
                              <span class="w-7 h-7 rounded-lg bg-blue-100 text-[#0052FF] flex items-center justify-center text-xs font-bold shrink-0">
                                <i class="fas fa-building"></i>
                              </span>
                              <div class="min-w-0">
                                <p class="font-bold text-gray-900 text-xs truncate">{{ ans.opd_name }}</p>
                                <p v-if="ans.penulis" class="text-[10px] text-gray-500 truncate">
                                  Pengisi: <span class="font-medium text-gray-700">{{ ans.penulis }}</span>
                                </p>
                              </div>
                            </div>
                            <span class="shrink-0 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wide flex items-center gap-1"
                              :class="ans.jawaban === 'ya' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-200 text-gray-700 border border-gray-300'">
                              <i :class="ans.jawaban === 'ya' ? 'fas fa-check-circle text-emerald-600' : 'fas fa-times-circle text-gray-500'"></i>
                              {{ ans.jawaban === 'ya' ? 'Ya, Ada' : 'Tidak Ada' }}
                            </span>
                          </div>

                          <!-- Alasan jika Tidak Ada -->
                          <div v-if="ans.jawaban === 'tidak' && ans.alasan" class="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                            <i class="fas fa-comment-dots text-amber-600 mt-0.5 shrink-0"></i>
                            <div class="min-w-0 flex-1">
                              <span class="font-bold text-amber-900 block text-[10px] uppercase tracking-wide">Alasan Tidak Ada:</span>
                              <span class="italic text-gray-800 leading-relaxed">{{ ans.alasan }}</span>
                            </div>
                          </div>

                          <!-- DAFTAR BUKTI DUKUNG & LINK (DIBEDAKAN SECARA JELAS + TOMBOL SALIN) -->
                          <div v-if="ans.links && ans.links.length" class="space-y-1.5 pt-0.5">
                            <div v-for="lnk in ans.links" :key="lnk.id"
                              class="flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition-all shadow-xs"
                              :class="getLinkBadge(lnk).containerClass">
                              <!-- Sisi Kiri: Ikon, Tipe, Judul/Nama Link -->
                              <div class="flex items-center gap-2.5 min-w-0 flex-1">
                                <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 shadow-xs"
                                  :class="getLinkBadge(lnk).iconBg">
                                  <i :class="getLinkBadge(lnk).icon"></i>
                                </span>
                                <div class="min-w-0 flex-1">
                                  <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs"
                                      :class="getLinkBadge(lnk).badgeClass">
                                      {{ getLinkBadge(lnk).label }}
                                    </span>
                                    <span class="font-bold text-gray-900 truncate text-[11px]">
                                      {{ lnk.judul || getLinkBadge(lnk).defaultTitle(lnk) }}
                                    </span>
                                  </div>
                                  <p class="text-[10px] text-gray-500 truncate font-mono mt-0.5" :title="lnk.link">
                                    {{ lnk.link }}
                                  </p>
                                </div>
                              </div>

                              <!-- Sisi Kanan: Tombol Unduh, Salin & Buka -->
                              <div class="flex items-center gap-1.5 shrink-0">
                                <!-- Tombol Unduh Berkas Bukti Dukung (Nama Otomatis Disesuaikan dengan Kode Soal & Nama OPD) -->
                                <a v-if="isDownloadable(lnk)"
                                  :href="getDownloadEvidenceUrl(q, ans, lnk)"
                                  target="_blank"
                                  download
                                  class="px-2 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all flex items-center gap-1 active:scale-95"
                                  :title="'Unduh Berkas ' + (lnk.judul || 'Bukti Dukung')">
                                  <i class="fas fa-download text-[10px]"></i>
                                  <span class="text-[10px]">Unduh</span>
                                </a>

                                <!-- Tombol Salin Link dengan Tooltip URL saat Pointer Diarahkan -->
                                <div class="relative group/copy">
                                  <button type="button" @click.stop="copyToClipboard(lnk.link, lnk.id || lnk.link)"
                                    class="px-2 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                                    :class="copiedLinkId === (lnk.id || lnk.link)
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/30'
                                      : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'"
                                    :title="'Salin: ' + lnk.link">
                                    <i :class="copiedLinkId === (lnk.id || lnk.link) ? 'fas fa-check' : 'fas fa-copy text-gray-500'"></i>
                                    <span class="text-[10px]">{{ copiedLinkId === (lnk.id || lnk.link) ? 'Tersalin!' : 'Salin' }}</span>
                                  </button>
                                  <!-- Popover / Tooltip URL yang diisi saat pointer diarahkan -->
                                  <div class="absolute bottom-full right-0 mb-1.5 hidden group-hover/copy:flex flex-col z-50 pointer-events-none w-max max-w-xs sm:max-w-sm">
                                    <div class="bg-gray-900 text-white text-[11px] font-mono px-3 py-1.5 rounded-xl shadow-xl border border-gray-700 break-all leading-snug">
                                      <span class="text-amber-400 block text-[9px] font-sans font-bold uppercase tracking-wider mb-0.5">Tautan yang Diisi:</span>
                                      <span class="text-white">{{ lnk.link }}</span>
                                    </div>
                                    <div class="w-2.5 h-2.5 bg-gray-900 rotate-45 self-end mr-4 -mt-1 border-r border-b border-gray-700"></div>
                                  </div>
                                </div>

                                <!-- Tombol Buka Tautan / File -->
                                <a :href="lnk.link" target="_blank" rel="noopener"
                                  class="px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm transition-all flex items-center gap-1 active:scale-95"
                                  :class="getLinkBadge(lnk).buttonClass"
                                  :title="'Buka ' + getLinkBadge(lnk).label">
                                  <span class="text-[10px]">{{ getLinkBadge(lnk).buttonText }}</span>
                                  <i class="fas fa-external-link-alt text-[9px]"></i>
                                </a>
                              </div>
                            </div>
                          </div>

                          <div v-else-if="ans.jawaban === 'ya'" class="text-[11px] text-gray-400 italic pt-1">
                            <i class="fas fa-info-circle mr-1"></i>Belum ada link atau berkas yang dilampirkan.
                          </div>
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
        <div class="relative bg-white w-full md:max-w-xl rounded-t-3xl md:rounded-3xl p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
          <!-- HEADER MODAL -->
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Formulir SAQ Monev</span>
              <h3 class="font-black text-xl text-gray-900">{{ modal.existing ? 'Detail / Ubah Jawaban' : 'Isi Jawaban Indikator' }}</h3>
            </div>
            <button @click="modal.open = false" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors shrink-0">
              <i class="fas fa-times text-base"></i>
            </button>
          </div>

          <!-- KOTAK PERTANYAAN (DITEGASKAN SANGAT JELAS) -->
          <div class="mb-5 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white border-2 border-blue-200 shadow-sm relative overflow-hidden">
            <div class="absolute -right-3 -top-3 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0052FF] text-white text-xs font-mono font-black tracking-wide shadow-sm shadow-blue-500/25">
                <i class="fas fa-hashtag text-[10px]"></i>
                {{ modal.question?.kode }}
              </span>
              <span v-if="modal.question?.tab" class="px-2.5 py-0.5 rounded-lg bg-blue-100 text-[#0052FF] text-xs font-bold">
                Tab: {{ modal.question?.tab }}
              </span>
              <span v-if="modal.question?.bagian" class="px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                {{ modal.question?.bagian }}
              </span>
              <span v-if="modal.question?.input_type" class="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold">
                Bukti: {{ modal.question?.input_type === 'foto' ? 'Foto / Galeri' : (modal.question?.input_type === 'situs' ? 'Tautan Situs' : 'Dokumen / Berkas') }}
              </span>
            </div>
            <p class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <i class="fas fa-question-circle"></i> Pertanyaan / Indikator yang dinilai:
            </p>
            <h4 class="text-base md:text-lg font-black text-gray-900 leading-snug">
              {{ modal.question?.pertanyaan }}
            </h4>
            <div v-if="modal.question?.dokumen_upload" class="mt-2.5 pt-2.5 border-t border-blue-200/60 flex items-start gap-2 text-xs text-blue-900/90">
              <i class="fas fa-paperclip text-[#0052FF] mt-0.5 shrink-0"></i>
              <span class="leading-relaxed"><strong>Contoh Bukti/Acuan:</strong> {{ modal.question?.dokumen_upload }}</span>
            </div>
          </div>

          <!-- Info otomatis (read-only) -->
          <div class="mb-5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
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
            <div class="flex justify-between items-center">
              <span class="text-gray-500">Status</span>
              <span class="font-bold px-2 py-0.5 rounded text-[11px]" :class="modal.existing ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                {{ modal.existing ? 'Sudah Terisi' : 'Belum Diisi' }}
              </span>
            </div>
            <div v-if="modal.existing?.jawaban" class="flex justify-between items-center pt-1.5 border-t border-gray-200/70">
              <span class="text-gray-500">Jawaban Terpilih</span>
              <span class="font-bold px-2 py-0.5 rounded text-[11px]" :class="modal.existing.jawaban === 'ya' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-white'">
                {{ modal.existing.jawaban === 'ya' ? 'Ya, Ada' : 'Tidak Ada' }}
              </span>
            </div>
            <div v-if="modal.existing?.jawaban === 'tidak' && (modal.existing?.alasan || form.alasan)" class="pt-2 border-t border-gray-200 text-xs">
              <span class="text-gray-500 block mb-0.5">Alasan Tersimpan:</span>
              <span class="font-medium text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 block italic leading-relaxed">
                {{ modal.existing?.alasan || form.alasan }}
              </span>
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
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Apakah OPD memiliki/memenuhi indikator ini? *</label>
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
                    ? 'bg-gray-700 border-gray-700 text-white shadow-lg shadow-gray-700/25'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'">
                  <i class="fas fa-times mr-2"></i>Tidak Ada
                </button>
              </div>
            </div>

            <!-- FORM JIKA JAWABAN TIDAK ADA: ALASAN (WAJIB DIISI) -->
            <div v-if="form.jawaban === 'tidak'" class="p-4 md:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-3 shadow-sm animate-fadeIn">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                  <i class="fas fa-exclamation-triangle text-amber-600"></i>
                  Alasan Tidak Memiliki / Tidak Ada <span class="text-rose-600 font-bold">* (Wajib Diisi)</span>
                </label>
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Harus Dijawab
                </span>
              </div>
              <p class="text-xs text-amber-900 leading-relaxed">
                Jelaskan secara jelas mengapa OPD Anda belum atau tidak memenuhi indikator <strong>{{ modal.question?.kode }}</strong> ini (misal: regulasi SOP masih dalam penyusunan, aplikasi masih dalam pengembangan, atau bukan merupakan tugas pokok & fungsi OPD). Alasan ini wajib dicatat untuk evaluasi Tim Monev.
              </p>
              <textarea
                v-model="form.alasan"
                rows="4"
                required
                placeholder="Tuliskan alasan mengapa indikator ini tidak ada / belum terpenuhi secara rinci..."
                class="w-full text-xs md:text-sm rounded-xl border-2 border-amber-300 p-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 bg-white shadow-sm leading-relaxed"
              ></textarea>
              <p v-if="!form.alasan?.trim()" class="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                <i class="fas fa-circle-exclamation"></i> Alasan tidak boleh kosong jika memilih "Tidak Ada".
              </p>
            </div>

            <!-- KHUSUS INDIKATOR DIGITALISASI (TANPA TAB: LANGSUNG LINK + BUKTI DUKUNG DOKUMENTASI/PDF OPSIONAL) -->
            <div v-if="form.jawaban === 'ya' && isDigitalQuestion" class="space-y-4">
              <!-- Info Box Penjelasan Digitalisasi -->
              <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
                <i class="fas fa-info-circle text-blue-600 text-sm mt-0.5 shrink-0"></i>
                <div class="space-y-0.5">
                  <p class="font-bold">Format Pengisian Indikator Digitalisasi</p>
                  <p class="text-blue-800 leading-relaxed">
                    Untuk indikator Digitalisasi, silakan masukkan tautan langsung website / portal / aplikasi resmi. Anda juga dapat melampirkan file dokumen/tangkapan layar (PDF) sebagai bukti dukung dokumentasi.
                  </p>
                </div>
              </div>

              <!-- BAGIAN 1: INPUT LINK WEBSITE / PORTAL / APLIKASI (WAJIB) -->
              <div class="p-4 rounded-2xl border-2 border-blue-100 bg-white space-y-3 shadow-sm">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <i class="fas fa-link text-[#0052FF]"></i>
                    Link Website / Portal / Aplikasi <span class="text-rose-500">*</span>
                  </span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0052FF]">
                    Wajib Diisi
                  </span>
                </div>

                <div v-for="(l, idx) in form.links" :key="'digi-link-'+idx" class="space-y-2 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-gray-500">Tautan {{ idx + 1 }}</span>
                    <button v-if="form.links.length > 1" type="button" @click="form.links.splice(idx, 1)"
                      class="text-xs font-bold text-rose-500 hover:text-rose-700">
                      <i class="fas fa-trash-alt mr-1"></i>Hapus
                    </button>
                  </div>

                  <div class="space-y-1.5">
                    <input v-model="l.link" required type="url"
                      placeholder="https://... (contoh: https://sinjaikab.go.id, portal layanan, atau Play Store)"
                      :class="[
                        'w-full px-4 py-2.5 rounded-xl border-2 bg-white outline-none transition-all text-sm',
                        isDriveUrl(l.link)
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-gray-200 focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10'
                      ]" />

                    <!-- PERINGATAN LINK GOOGLE DRIVE DITOLAK -->
                    <div v-if="isDriveUrl(l.link)" class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                      <i class="fas fa-exclamation-triangle mt-0.5 shrink-0 text-rose-600"></i>
                      <span>
                        <strong>Link Google Drive tidak diterima di sini!</strong> Untuk indikator Digitalisasi, harap masukkan tautan langsung website/portal/aplikasi. Bukti dokumen atau tangkapan layar diunggah pada bagian file PDF di bawah.
                      </span>
                    </div>
                  </div>

                  <input v-model="l.judul" type="text"
                    placeholder="Judul / Keterangan link (opsional, misal: Portal PPID Resmi Sinjai)"
                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs" />
                </div>

                <button type="button" @click="form.links.push({ judul: '', link: '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false })"
                  class="w-full py-2 rounded-xl border-2 border-dashed border-[#0052FF]/30 text-[#0052FF] text-xs font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5">
                  <i class="fas fa-plus"></i> Tambah Tautan Lain
                </button>
              </div>

              <!-- BAGIAN 2: UPLOAD BUKTI DUKUNG DOKUMENTASI (PDF / GAMBAR) - OPSIONAL -->
              <div class="p-4 rounded-2xl border-2 border-indigo-100 bg-white space-y-3 shadow-sm">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <i class="fas fa-file-pdf text-indigo-600"></i>
                    Bukti Dukung Dokumentasi (PDF / Tangkapan Layar)
                  </span>
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    Opsional
                  </span>
                </div>

                <!-- CATATAN DOKUMENTASI DARI USER -->
                <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <i class="fas fa-lightbulb text-amber-600 text-sm mt-0.5 shrink-0"></i>
                  <div class="space-y-1">
                    <p class="font-bold text-amber-950">Catatan Penguatan Bukti Dukung:</p>
                    <p class="leading-relaxed">
                      Untuk memperkuat link yang di-upload, tambahkan dokumentasi pendukung pada jawaban yang dimaksud (bisa berupa file PDF hasil tangkapan layar/dokumen pendukung). 
                      <strong>Disarankan menandai/menyoroti bagian yang relevan pada gambar/lampiran yang diunggah</strong> (misal: tanda panah atau kotak penunjuk pada menu/fitur yang bersangkutan).
                    </p>
                  </div>
                </div>

                <!-- List File Baru Dipilih -->
                <div v-for="(u, uidx) in docUploads" :key="'digi-doc-'+uidx"
                  class="p-3 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-indigo-700">
                      <i class="fas fa-file-alt mr-1"></i>File {{ uidx + 1 }}: {{ u.file?.name }}
                    </span>
                    <button type="button" @click="docUploads.splice(uidx, 1)"
                      class="text-xs font-bold text-rose-500 hover:text-rose-700">
                      <i class="fas fa-trash-alt mr-1"></i>Hapus
                    </button>
                  </div>
                  <input v-model="u.judul" type="text" placeholder="Keterangan dokumen bukti (opsional)"
                    class="w-full px-3.5 py-2 rounded-lg border border-gray-200 bg-white focus:border-indigo-600 outline-none text-xs" />
                </div>

                <!-- List File Tersimpan Sebelumnya -->
                <div v-for="(sv, svidx) in savedUploads" :key="'digi-sv-'+svidx"
                  class="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-amber-900">
                      <i class="fas fa-check-circle text-emerald-600 mr-1"></i>Bukti Tersimpan: {{ sv.name || sv.link }}
                    </span>
                    <button type="button" @click="savedUploads.splice(svidx, 1)"
                      class="text-xs font-bold text-rose-500 hover:text-rose-700">
                      <i class="fas fa-trash-alt mr-1"></i>Hapus
                    </button>
                  </div>
                  <a v-if="sv.link" :href="sv.link" target="_blank" rel="noopener" class="text-xs text-blue-600 font-bold underline break-all block">
                    Lihat Bukti PDF/Lampiran
                  </a>
                </div>

                <!-- Input File Uploader -->
                <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                  @change="onDocFilesChange"
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 outline-none text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                <p class="text-[11px] text-gray-500">Menerima format PDF, JPG, PNG (maks. 10 MB). Boleh lebih dari satu file.</p>
              </div>
            </div>

            <!-- JIKA JAWABAN YA: NON-DIGITALISASI (ALUR 2 PILIHAN DOKUMEN / FOTO GALERI / SITUS) -->
            <div v-else-if="form.jawaban === 'ya'" class="space-y-4">
              <!-- KHUSUS PERTANYAAN FOTO: MENYEDIAKAN OPSI GALERI & LINK -->
              <div v-if="modal.question?.input_type === 'foto'" class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <button type="button" @click="answerTab = 'galeri'"
                    class="py-2.5 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all"
                    :class="answerTab === 'galeri' ? 'bg-[#0052FF] border-[#0052FF] text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'">
                    <i class="fas fa-images mr-1.5"></i>Upload ke Galeri
                  </button>
                  <button type="button" @click="answerTab = 'link'"
                    class="py-2.5 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all"
                    :class="answerTab === 'link' ? 'bg-[#0052FF] border-[#0052FF] text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'">
                    <i class="fas fa-link mr-1.5"></i>Tautan Foto Luar
                  </button>
                </div>

                <!-- TAB GALERI -->
                <div v-if="answerTab === 'galeri'" class="space-y-3">
                  <div class="p-4 rounded-2xl border-2 border-violet-200 bg-violet-50/50 space-y-3">
                    <p class="text-xs font-extrabold text-violet-800"><i class="fas fa-images mr-1.5"></i>Upload Foto Dokumentasi ke Galeri Web</p>
                    <p class="text-xs text-gray-600 leading-relaxed">Foto diunggah ke Galeri publik web dan tautannya otomatis tersimpan sebagai bukti pemenuhan indikator ini.</p>
                    <div v-if="savedFoto && !fotoPreview" class="space-y-2">
                      <div class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200">
                        <img :src="savedFoto.link" class="w-16 h-16 object-cover rounded-xl border border-gray-200" alt="Foto Galeri tersimpan" />
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-bold truncate">{{ savedFoto.judul || savedFoto.name }}</p>
                          <a :href="savedFoto.link" target="_blank" rel="noopener" class="text-[11px] text-[#0052FF] font-bold underline break-all">{{ savedFoto.link }}</a>
                        </div>
                        <button type="button" @click="removeSavedFoto" class="text-xs font-bold text-rose-500 hover:text-rose-700">Hapus</button>
                      </div>
                      <input v-model="savedFoto.judul" type="text" placeholder="Judul foto"
                        class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs" />
                    </div>
                    <input type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" @change="onFotoFileChange"
                      class="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-100 file:text-violet-800 cursor-pointer" />
                    <div v-if="fotoPreview" class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-violet-200">
                      <img :src="fotoPreview" class="w-16 h-16 object-cover rounded-xl border border-gray-200" alt="Pratinjau foto" />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold truncate">{{ fotoFile?.name }}</p>
                        <p class="text-[11px] text-gray-500">{{ fotoFile ? (fotoFile.size / 1024).toFixed(0) + ' KB' : '' }}</p>
                      </div>
                      <button type="button" @click="removeFotoFile" class="text-xs font-bold text-rose-500 hover:text-rose-700">Hapus</button>
                    </div>
                    <input v-model="form.fotoJudul" :required="!!fotoFile" type="text" placeholder="Judul foto * (wajib bila mengunggah foto)"
                      class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs" />
                    <label class="block text-xs font-bold text-gray-700">Tanggal upload</label>
                    <input v-model="form.fotoTanggal" type="date"
                      class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs" />
                  </div>
                </div>

                <!-- TAB LINK FOTO -->
                <div v-if="answerTab === 'link'" class="space-y-3">
                  <div v-for="(l, idx) in form.links" :key="idx" class="p-3 rounded-2xl border-2 border-blue-100 bg-blue-50/40 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-[#0052FF]">Tautan Foto {{ idx + 1 }}</span>
                      <button v-if="form.links.length > 1" type="button" @click="form.links.splice(idx, 1)" class="text-xs font-bold text-rose-500 hover:text-rose-700">Hapus</button>
                    </div>
                    <input v-model="l.link" required type="url" placeholder="https://... *"
                      class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs" />
                    <input v-model="l.judul" type="text" placeholder="Keterangan / judul foto"
                      class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white outline-none text-xs" />
                  </div>
                  <button type="button" @click="form.links.push({ judul: '', link: '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false })"
                    class="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#0052FF]/30 text-[#0052FF] text-xs font-bold hover:bg-blue-50 transition-all">
                    <i class="fas fa-plus mr-1.5"></i>Tambah Tautan Foto Lain
                  </button>
                </div>
              </div>

              <!-- ALUR UTAMA UNTUK JENIS DOKUMEN (2 PILIHAN DITERANGKAN DENGAN JELAS) -->
              <div v-else class="space-y-4">
                <!-- PANDUAN DUA PILIHAN ALUR -->
                <div class="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-xs text-blue-950 space-y-1">
                  <div class="font-extrabold flex items-center gap-1.5 text-[#0052FF]">
                    <i class="fas fa-layer-group"></i>
                    <span>Pilih Metode Penyediaan Dokumen Bukti:</span>
                  </div>
                  <p class="text-gray-600 leading-relaxed text-[11px]">
                    Silakan tentukan apakah dokumen belum pernah diunggah (akan diunggah baru / tautan Google Drive), atau dokumen sudah pernah terdaftar di website PPID / Portal Sinjaikab untuk disinkronkan secara otomatis.
                  </p>
                </div>

                <!-- 2 KARTU PILIHAN BESAR -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- KARTU PILIHAN 1 -->
                  <button type="button" @click="docFlowMode = 'new'"
                    class="p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between"
                    :class="docFlowMode === 'new'
                      ? 'border-[#0052FF] bg-blue-50/60 shadow-md ring-2 ring-[#0052FF]/20'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50/60'">
                    <div class="flex items-start gap-3">
                      <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        :class="docFlowMode === 'new' ? 'bg-[#0052FF] text-white shadow-sm' : 'bg-gray-100 text-gray-500'">
                        <i class="fas fa-cloud-upload-alt text-base"></i>
                      </div>
                      <div class="min-w-0">
                        <span class="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md inline-block mb-1"
                          :class="docFlowMode === 'new' ? 'bg-blue-200/70 text-blue-900' : 'bg-gray-100 text-gray-600'">
                          PILIHAN 1
                        </span>
                        <p class="text-xs font-black tracking-tight" :class="docFlowMode === 'new' ? 'text-[#0052FF]' : 'text-gray-900'">
                          Belum Mengunggah Dokumen
                        </p>
                        <p class="text-[11px] text-gray-500 mt-1 leading-snug">
                          Upload berkas langsung (maks. 2 MB) atau masukkan tautan Google Drive (> 2 MB).
                        </p>
                      </div>
                    </div>
                    <div v-if="docFlowMode === 'new'" class="mt-3 pt-2 border-t border-blue-200/60 flex items-center gap-1.5 text-[11px] font-bold text-[#0052FF]">
                      <i class="fas fa-check-circle"></i> Opsi Aktif
                    </div>
                  </button>

                  <!-- KARTU PILIHAN 2 -->
                  <button type="button" @click="docFlowMode = 'sync'"
                    class="p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between"
                    :class="docFlowMode === 'sync'
                      ? 'border-cyan-600 bg-cyan-50/60 shadow-md ring-2 ring-cyan-500/20'
                      : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-gray-50/60'">
                    <div class="flex items-start gap-3">
                      <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        :class="docFlowMode === 'sync' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'">
                        <i class="fas fa-sync-alt text-base"></i>
                      </div>
                      <div class="min-w-0">
                        <span class="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md inline-block mb-1"
                          :class="docFlowMode === 'sync' ? 'bg-cyan-200/70 text-cyan-900' : 'bg-gray-100 text-gray-600'">
                          PILIHAN 2
                        </span>
                        <p class="text-xs font-black tracking-tight" :class="docFlowMode === 'sync' ? 'text-cyan-800' : 'text-gray-900'">
                          Sudah Pernah Diunggah
                        </p>
                        <p class="text-[11px] text-gray-500 mt-1 leading-snug">
                          Sinkronkan dari tautan dokumen yang ada di web PPID atau Portal Pemkab Sinjai.
                        </p>
                      </div>
                    </div>
                    <div v-if="docFlowMode === 'sync'" class="mt-3 pt-2 border-t border-cyan-200/60 flex items-center gap-1.5 text-[11px] font-bold text-cyan-800">
                      <i class="fas fa-check-circle"></i> Opsi Aktif
                    </div>
                  </button>
                </div>

                <!-- FORM PILIHAN 1: BELUM MENGUNGGAH DOKUMEN -->
                <div v-if="docFlowMode === 'new'" class="space-y-3 pt-1">
                  <div class="p-4 rounded-2xl border-2 border-blue-200/80 bg-blue-50/30 space-y-3.5 shadow-sm">
                    <!-- Ketentuan & Upload Berkas Langsung -->
                    <div class="space-y-2.5">
                      <div class="p-3 bg-white rounded-xl border border-blue-200 text-xs text-gray-600 space-y-1">
                        <p class="font-bold text-blue-900 flex items-center gap-1.5">
                          <i class="fas fa-file-upload text-blue-600"></i>
                          <span>Unggah Berkas Dokumen Bukti:</span>
                        </p>
                        <p class="text-[11px] leading-relaxed">
                          Silakan unggah dokumen bukti (PDF, DOCX, XLSX, PPT, atau Gambar JPG/PNG) maksimal 2 MB. Berkas ini otomatis dihubungkan ke sistem informasi publik resmi.
                        </p>
                      </div>

                      <input type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                        @change="onDocSingleFileChange"
                        class="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />

                      <!-- Alert Error Ukuran File Melebihi 2 MB -->
                      <div v-if="docFileSizeError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                        <i class="fas fa-exclamation-triangle mt-0.5 shrink-0 text-rose-600"></i>
                        <span class="leading-relaxed">{{ docFileSizeError }}</span>
                      </div>

                      <!-- Berkas yang Baru Dipilih -->
                      <div v-for="(u, uidx) in docUploads" :key="'up-'+uidx"
                        class="p-3 rounded-xl border border-blue-200 bg-white space-y-1 shadow-sm">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold text-blue-950 flex items-center gap-1.5 truncate">
                            <i class="fas fa-file-pdf text-rose-600"></i>
                            {{ u.file?.name }}
                          </span>
                          <button type="button" @click="docUploads.splice(uidx, 1)"
                            class="text-xs font-bold text-rose-500 hover:text-rose-700 shrink-0 ml-2">
                            <i class="fas fa-trash-alt mr-1"></i>Hapus
                          </button>
                        </div>
                        <p class="text-[11px] text-gray-500">
                          Ukuran: {{ u.file ? (u.file.size / 1024).toFixed(0) + ' KB' : '' }} · Berkas siap diunggah ke server.
                        </p>
                      </div>

                      <!-- Berkas Tersimpan Sebelumnya (saat edit) -->
                      <div v-for="(sv, svidx) in savedUploads" :key="'sv-f-'+svidx"
                        class="p-3 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold text-amber-900 flex items-center gap-1.5 truncate">
                            <i class="fas fa-check-circle text-emerald-600"></i>
                            File Tersimpan: {{ sv.name || sv.link }}
                          </span>
                          <button type="button" @click="savedUploads.splice(svidx, 1)"
                            class="text-xs font-bold text-rose-500 hover:text-rose-700 shrink-0 ml-2">
                            Hapus
                          </button>
                        </div>
                        <a v-if="sv.link" :href="sv.link" target="_blank" rel="noopener" class="text-xs text-[#0052FF] font-bold underline break-all block">
                          Lihat Berkas Tersimpan
                        </a>
                      </div>
                    </div>

                    <!-- PENGATURAN MAPPING DOKUMEN & METADATA OTOMATIS -->
                    <div class="pt-3 border-t border-blue-200/80 space-y-3">
                      <!-- Mapping Box Otomatis Sesuai Pertanyaan -->
                      <div class="p-3 bg-white rounded-xl border border-blue-200 space-y-2 text-xs text-gray-700 shadow-sm">
                        <div class="flex items-center gap-1.5 font-extrabold text-[#0052FF]">
                          <i class="fas fa-sitemap"></i>
                          <span>Pengaturan Otomatis Berdasarkan Pertanyaan Indikator</span>
                        </div>
                        <div class="space-y-1 text-[11px] bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                          <span class="text-gray-500 block">Judul & Deskripsi Dokumen:</span>
                          <strong class="text-gray-900 font-bold leading-snug block">
                            {{ modal.question?.pertanyaan }}
                          </strong>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span class="text-gray-500">Target Sistem:</span>
                            <strong class="text-gray-900 block font-bold">
                              {{ modal.question?.target_upload === 'pemkab' ? 'Portal Informasi Pemkab Sinjai' : 'Informasi Publik PPID Utama' }}
                            </strong>
                          </div>
                          <div>
                            <span class="text-gray-500">Klasifikasi Kategori:</span>
                            <strong class="text-gray-900 block font-bold">
                              {{ modal.question?.klasifikasi_otomatis || 'Informasi Berkala' }}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <!-- Tanggal Dokumen Mulai Berlaku (Bukan created_at) -->
                      <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">
                          Tanggal Mulai Berlaku Dokumen *
                        </label>
                        <input v-model="docTanggal" type="date" required
                          class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-[#0052FF] outline-none text-xs font-semibold" />
                        <p class="text-[11px] text-gray-500">
                          Pilih tanggal resmi dokumen Anda mulai berlaku / disahkan (bukan tanggal pengisian SAQ hari ini).
                        </p>
                      </div>

                      <!-- Visibilitas Dokumen -->
                      <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-gray-700">Visibilitas Dokumen di Website *</label>
                        <div class="grid grid-cols-2 gap-2">
                          <button type="button" @click="form.visibility = 'public'"
                            class="py-2.5 px-3 rounded-xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-1.5"
                            :class="form.visibility === 'public'
                              ? 'bg-[#0052FF] border-[#0052FF] text-white shadow-md shadow-blue-600/25'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'">
                            <i class="fas fa-globe"></i> Publik (Tampil di Website)
                          </button>
                          <button type="button" @click="form.visibility = 'private'"
                            class="py-2.5 px-3 rounded-xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-1.5"
                            :class="form.visibility === 'private'
                              ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/25'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'">
                            <i class="fas fa-lock"></i> Private (Khusus Admin)
                          </button>
                        </div>
                        <p class="text-[11px] text-gray-500">
                          <span v-if="form.visibility === 'public'">
                            <i class="fas fa-check-circle text-emerald-600 mr-1"></i>Dokumen ini akan ditampilkan pada halaman daftar informasi publik website untuk semua pengunjung.
                          </span>
                          <span v-else>
                            <i class="fas fa-lock text-amber-600 mr-1"></i>Dokumen ini tidak tampil untuk publik umum, namun akan muncul di daftar dokumen saat Anda login sebagai Super Admin atau Admin OPD yang mengunggah (ditandai dengan warna berbeda).
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- FORM PILIHAN 2: SUDAH PERNAH DIUNGGAH (SINKRONISASI) -->
                <div v-if="docFlowMode === 'sync'" class="space-y-3 pt-1">
                  <div class="p-4 rounded-2xl border-2 border-cyan-200/90 bg-cyan-50/40 space-y-3.5 shadow-sm">
                    <!-- Keterangan Jelas -->
                    <div class="p-3 bg-white rounded-xl border border-cyan-200 text-xs text-gray-600 space-y-1">
                      <p class="font-bold text-cyan-900 flex items-center gap-1.5">
                        <i class="fas fa-info-circle text-cyan-600"></i>
                        <span>Ketentuan Sinkronisasi Dokumen Terdaftar:</span>
                      </p>
                      <p class="text-[11px] leading-relaxed">
                        Jika dokumen sudah pernah diunggah sebelumnya pada website PPID (<code>https://ppid.sinjaikab.go.id/informasi/detail/...</code>) atau website Portal Pemkab Sinjai (<code>https://sinjaikab.go.id/informasi/...</code>), masukkan tautan dokumen tersebut di bawah. Sistem akan memverifikasi dan menyinkronkan dokumen dari database server tanpa menduplikasi data di server.
                      </p>
                      <p class="text-[11px] text-amber-800 font-semibold">
                        <i class="fas fa-shield-alt mr-1"></i>Selain tautan resmi domain PPID atau Portal Pemkab Sinjai, tautan luar dibatasi dan wajib menggunakan <strong>Pilihan 1</strong> (Upload Berkas / Google Drive).
                      </p>
                    </div>

                    <!-- Input Tautan & Tombol Sinkronisasi -->
                    <div class="space-y-1.5">
                      <label class="block text-xs font-bold text-gray-700">Tautan Dokumen PPID / Pemkab Sinjai *</label>
                      <div class="flex flex-col sm:flex-row gap-2">
                        <input v-model="syncUrl" type="url"
                          placeholder="https://ppid.sinjaikab.go.id/informasi/detail/... atau https://sinjaikab.go.id/informasi/..."
                          class="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10 outline-none text-xs" />
                        <button type="button" @click="doSyncDocument" :disabled="syncLoading || !syncUrl"
                          class="px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0">
                          <i :class="syncLoading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
                          <span>{{ syncLoading ? 'Mencari...' : 'Cari & Sinkronkan Dokumen' }}</span>
                        </button>
                      </div>
                    </div>

                    <!-- Pesan Error Sinkronisasi -->
                    <div v-if="syncError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                      <i class="fas fa-exclamation-circle text-rose-600 mt-0.5 shrink-0"></i>
                      <span class="leading-relaxed">{{ syncError }}</span>
                    </div>

                    <!-- KARTU HASIL SINKRONISASI JIKA DITEMUKAN DI SERVER -->
                    <div v-if="syncResult && (syncResult.found || syncResult.judul)" class="p-4 rounded-xl bg-white border-2 border-emerald-300 shadow-sm space-y-2.5">
                      <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div class="flex items-center gap-1.5 text-xs font-black text-emerald-700">
                          <i class="fas fa-check-circle text-emerald-600"></i>
                          <span>DOKUMEN TERVERIFIKASI DI SERVER</span>
                        </div>
                        <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {{ syncResult.sumber_label || (syncResult.sumber === 'informasi_pemkab' ? 'Informasi Pemkab Sinjai' : 'Informasi PPID') }}
                        </span>
                      </div>

                      <div class="space-y-1.5 text-xs">
                        <div>
                          <span class="text-[11px] text-gray-500 block">Judul Dokumen:</span>
                          <p class="font-bold text-gray-900 leading-snug">{{ syncResult.judul }}</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div v-if="syncResult.kategori">
                            <span class="text-gray-500">Kategori:</span>
                            <strong class="text-gray-800 ml-1">{{ syncResult.kategori }}</strong>
                          </div>
                          <div v-if="syncResult.jenis_dokumen">
                            <span class="text-gray-500">Jenis Dokumen:</span>
                            <strong class="text-gray-800 ml-1">{{ syncResult.jenis_dokumen }}</strong>
                          </div>
                          <div v-if="syncResult.tanggal">
                            <span class="text-gray-500">Tanggal:</span>
                            <strong class="text-gray-800 ml-1">{{ syncResult.tanggal }}</strong>
                          </div>
                          <div v-if="syncResult.pengupload">
                            <span class="text-gray-500">Pengunggah:</span>
                            <strong class="text-gray-800 ml-1">{{ syncResult.pengupload }} {{ syncResult.opd ? `(${syncResult.opd})` : '' }}</strong>
                          </div>
                        </div>
                      </div>

                      <!-- Tombol Buka Dokumen Asli -->
                      <div class="pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
                        <a :href="syncResult.detail_url || syncUrl" target="_blank" rel="noopener"
                          class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold flex items-center gap-1.5 border border-blue-200">
                          <i class="fas fa-external-link-alt text-[10px]"></i> Buka Halaman Dokumen
                        </a>
                        <a v-if="syncResult.file_url" :href="syncResult.file_url" target="_blank" rel="noopener"
                          class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold flex items-center gap-1.5 border border-emerald-200">
                          <i class="fas fa-file-download text-[10px]"></i> Unduh / Lihat File Asli
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div v-if="formError" class="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600">{{ formError }}</div>
            <div v-if="!canAnswer" class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
              <i class="fas fa-lock text-amber-600 text-sm"></i>
              <span>Pengisian dan perubahan jawaban SAQ saat ini sedang dikunci oleh Superadmin (Hanya dapat dilihat).</span>
            </div>
            <div v-else class="space-y-3">
              <button type="submit" :disabled="submitting || deleting || (form.jawaban === 'tidak' && !form.alasan?.trim())"
                class="w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                :class="form.jawaban === 'tidak'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-gray-700/25 hover:shadow-gray-700/40'
                  : 'bg-gradient-to-r from-[#0052FF] to-[#0041CC] text-white shadow-blue-600/25 hover:shadow-blue-600/40'">
                <i :class="submitting ? 'fas fa-spinner fa-spin' : (form.jawaban === 'tidak' ? 'fas fa-check-circle' : 'fas fa-save')"></i>
                <span>{{ submitting ? 'Menyimpan...' : (form.jawaban === 'tidak' ? 'Simpan Jawaban (Tidak Ada)' : 'Simpan Jawaban') }}</span>
              </button>

              <button v-if="modal.existing && canAnswer" type="button" @click="deleteExistingAnswer"
                :disabled="submitting || deleting"
                class="w-full py-3 rounded-2xl font-bold text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 disabled:opacity-50">
                <i :class="deleting ? 'fas fa-spinner fa-spin' : 'fas fa-trash-alt'"></i>
                <span>{{ deleting ? 'Menghapus Dokumen & Jawaban...' : 'Hapus Dokumen & Jawaban Ini' }}</span>
              </button>
            </div>
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
const form = ref({ judul: '', link: '', klasifikasi: '', deskripsi: '', docJudul: '', fotoJudul: '', fotoTanggal: '' })
const submitting = ref(false)
const formError = ref('')
const fotoFile = ref(null)
const fotoPreview = ref('')
const savedFoto = ref(null)

// State untuk Alur Dua Pilihan Dokumen SAQ
const docFlowMode = ref('new') // 'new' (Pilihan 1: Belum Diunggah) | 'sync' (Pilihan 2: Sudah Pernah Diunggah)
const newDocMethod = ref('file') // 'file' (Upload File <= 2MB) | 'drive' (Google Drive > 2MB)
const driveLinkInput = ref('')
const docTanggal = ref('')
const syncUrl = ref('')
const syncResult = ref(null)
const syncLoading = ref(false)
const syncError = ref('')
const docFileSizeError = ref('')

// Fitur Salin Link & Klasifikasi Tampilan Bukti Dukung vs Tautan
const copiedLinkId = ref(null)
const copyToClipboard = async (text, id) => {
  if (!text) return
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    } else if (typeof document !== 'undefined') {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copiedLinkId.value = id
    setTimeout(() => {
      if (copiedLinkId.value === id) copiedLinkId.value = null
    }, 2000)
  } catch (e) {
    console.error('Gagal menyalin:', e)
  }
}

const getLinkBadge = (lnk) => {
  const src = lnk?.sumber_informasi
  const rawUrl = (lnk?.link || '').toLowerCase()

  // 1. Dokumen Resmi PPID Utama Sinjai
  if (src === 'informasi' || (rawUrl.includes('ppid.sinjaikab.go.id/informasi') && !rawUrl.includes('/storage/'))) {
    return {
      type: 'ppid',
      label: 'Dokumen PPID',
      icon: 'fas fa-shield-alt text-emerald-600',
      iconBg: 'bg-emerald-100 text-emerald-700',
      containerClass: 'bg-emerald-50/70 border-emerald-200/90 hover:border-emerald-300',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
      buttonText: 'Buka PPID',
      defaultTitle: () => 'Dokumen Terpublikasi PPID',
    }
  }

  // 2. Dokumen Resmi Portal Pemkab Sinjai
  if (src === 'informasi_pemkab' || (rawUrl.includes('sinjaikab.go.id/informasi') && !rawUrl.includes('ppid.sinjaikab.go.id') && !rawUrl.includes('/storage/'))) {
    return {
      type: 'pemkab',
      label: 'Dokumen Pemkab Sinjai',
      icon: 'fas fa-landmark text-teal-600',
      iconBg: 'bg-teal-100 text-teal-700',
      containerClass: 'bg-teal-50/70 border-teal-200/90 hover:border-teal-300',
      badgeClass: 'bg-teal-100 text-teal-800 border border-teal-300',
      buttonClass: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25',
      buttonText: 'Buka Pemkab',
      defaultTitle: () => 'Dokumen Portal Pemkab Sinjai',
    }
  }

  // 3. Bukti Dokumen / File Lampiran Mentah (PDF, Tangkapan Layar, Dokumen Storage)
  if (src === 'lampiran' || rawUrl.includes('/storage/saq/') || /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|png|jpg|jpeg|webp)($|\?)/i.test(rawUrl)) {
    const isImage = /\.(png|jpg|jpeg|webp)($|\?)/i.test(rawUrl)
    return {
      type: 'file',
      label: isImage ? 'Bukti Tangkapan Layar' : 'Bukti Dokumen PDF',
      icon: isImage ? 'fas fa-file-image text-rose-600' : 'fas fa-file-pdf text-rose-600',
      iconBg: 'bg-rose-100 text-rose-600',
      containerClass: 'bg-rose-50/70 border-rose-200/90 hover:border-rose-300',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300',
      buttonClass: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25',
      buttonText: 'Lihat Bukti',
      defaultTitle: (l) => (l.link || '').split('/').filter(Boolean).pop() || 'Dokumentasi Bukti',
    }
  }

  // 4. Google Drive
  if (src === 'drive' || rawUrl.includes('drive.google.com') || rawUrl.includes('docs.google.com')) {
    return {
      type: 'drive',
      label: 'Google Drive',
      icon: 'fab fa-google-drive text-amber-600',
      iconBg: 'bg-amber-100 text-amber-700',
      containerClass: 'bg-amber-50/70 border-amber-200/90 hover:border-amber-300',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
      buttonClass: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25',
      buttonText: 'Buka Drive',
      defaultTitle: () => 'Berkas Google Drive',
    }
  }

  // 5. Foto Galeri
  if (src === 'galeri' || rawUrl.includes('/storage/galeri/')) {
    return {
      type: 'galeri',
      label: 'Foto Galeri',
      icon: 'fas fa-images text-purple-600',
      iconBg: 'bg-purple-100 text-purple-700',
      containerClass: 'bg-purple-50/70 border-purple-200/90 hover:border-purple-300',
      badgeClass: 'bg-purple-100 text-purple-800 border border-purple-300',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25',
      buttonText: 'Lihat Foto',
      defaultTitle: () => 'Dokumentasi Galeri',
    }
  }

  // 6. Link Website / Portal / Aplikasi
  return {
    type: 'web',
    label: 'Link Website / Portal',
    icon: 'fas fa-globe text-[#0052FF]',
    iconBg: 'bg-blue-100 text-[#0052FF]',
    containerClass: 'bg-blue-50/70 border-blue-200/90 hover:border-blue-300',
    badgeClass: 'bg-blue-100 text-[#0052FF] border border-blue-300',
    buttonClass: 'bg-[#0052FF] hover:bg-[#0041CC] shadow-blue-600/25',
    buttonText: 'Kunjungi Web',
    defaultTitle: (l) => {
      try {
        const u = new URL(l.link)
        return u.hostname + (u.pathname !== '/' ? u.pathname : '')
      } catch {
        return 'Tautan Website'
      }
    },
  }
}

// Cek apakah tautan dapat diunduh langsung (file storage lokal, Google Drive dokumen/file, PDF/Office, dokumen PPID/Pemkab)
const isDownloadable = (lnk) => {
  const url = (lnk?.link || '').trim().toLowerCase()
  if (!url) return false
  if (url.includes('/storage/')) return true
  if (url.includes('drive.google.com/file/d/') || url.includes('drive.google.com/open?id=') || url.includes('drive.google.com/uc?')) return true
  if (url.includes('docs.google.com/document/d/') || url.includes('docs.google.com/spreadsheets/d/') || url.includes('docs.google.com/presentation/d/')) return true
  if (/\.(pdf|docx?|xlsx?|pptx?|jpe?g|png|webp|zip|rar)($|\?|#)/i.test(url)) return true
  const badge = getLinkBadge(lnk)
  return badge.type === 'file' || badge.type === 'galeri' || badge.type === 'drive' || badge.type === 'ppid' || badge.type === 'pemkab'
}

// Format nama file saat didownload (mengandung kode indikator dan nama OPD)
const formatEvidenceFileName = (q, ans, lnk) => {
  const qKode = (q?.kode || 'SOAL').replace(/[^a-zA-Z0-9_-]/g, '_')
  const opdName = (ans?.opd_name || 'OPD')
    .replace(/^Pemerintah Kabupaten Sinjai/i, 'Pemkab_Sinjai')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 40)

  const rawUrl = lnk?.link || ''
  const cleanUrl = rawUrl.split('?')[0].split('#')[0]
  const hasExt = cleanUrl.includes('.') && /\.(pdf|docx?|xlsx?|pptx?|jpe?g|png|webp|zip|rar)$/i.test(cleanUrl)
  const ext = hasExt ? cleanUrl.split('.').pop().toLowerCase() : 'pdf'

  let title = (lnk?.judul || '').trim()
  if (!title || title === cleanUrl) {
    const rawFileName = cleanUrl.split('/').filter(Boolean).pop() || 'Bukti_Dukung'
    title = rawFileName.replace(/\.[^.]+$/, '')
  }
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s_-]/g, '').trim().replace(/\s+/g, '_').substring(0, 50)

  return `[${qKode}]_[${opdName}]_${cleanTitle || 'Bukti'}.${ext}`
}

const getDownloadEvidenceUrl = (q, ans, lnk) => {
  const customFileName = formatEvidenceFileName(q, ans, lnk)
  const baseApi = api.defaults.baseURL || 'https://ppidkab.sinjaikab.go.id/api/v1'
  return `${baseApi}/saq/download-evidence?url=${encodeURIComponent(lnk.link)}&filename=${encodeURIComponent(customFileName)}`
}
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

// Handler khusus single/multi berkas Pilihan 1 dengan batas ketat 2 MB
const onDocSingleFileChange = (e) => {
  const files = Array.from(e.target.files || [])
  docFileSizeError.value = ''
  formError.value = ''
  if (!files.length) return

  for (const f of files) {
    const ext = (f.name.split('.').pop() || '').toLowerCase()
    if (!DOC_EXTS.includes(ext)) {
      formError.value = `File "${f.name}" ditolak: hanya menerima PDF / DOC / DOCX / XLS / XLSX / PPT / JPG / PNG.`
      continue
    }
    // Batas 2 MB (2 * 1024 * 1024 bytes)
    if (f.size > 2 * 1024 * 1024) {
      const mbSize = (f.size / (1024 * 1024)).toFixed(2)
      docFileSizeError.value = `Ukuran file "${f.name}" adalah ${mbSize} MB (melebihi batas maksimal 2 MB). Silakan gunakan opsi "Link Google Drive" di atas untuk berkas lebih dari 2 MB.`
      e.target.value = ''
      return
    }
    const base = f.name.replace(/\.[^.]+$/, '')
    docUploads.value.push({
      file: f,
      judul: form.value.docJudul || base || modal.value.question?.pertanyaan || 'Dokumen SAQ',
      deskripsi: modal.value.question?.pertanyaan || '',
      jadikanInformasi: true,
    })
  }
  e.target.value = ''
}

// Validasi domain tautan resmi sinkronisasi
const isValidDomainForSync = (raw) => {
  try {
    const u = new URL((raw || '').trim())
    const host = u.hostname.replace(/^www\./, '').toLowerCase()
    return host === 'ppid.sinjaikab.go.id' || host === 'sinjaikab.go.id'
  } catch {
    return false
  }
}

// Fungsi sinkronisasi dokumen dari database server (PPID & Pemkab Sinjai)
const doSyncDocument = async () => {
  syncError.value = ''
  syncResult.value = null
  const url = (syncUrl.value || '').trim()
  if (!url) {
    syncError.value = 'Silakan masukkan tautan dokumen PPID atau Portal Pemkab Sinjai.'
    return
  }
  if (!isValidDomainForSync(url)) {
    syncError.value = 'Hanya tautan resmi PPID (ppid.sinjaikab.go.id) atau Portal Sinjaikab (sinjaikab.go.id) yang dapat disinkronkan di sini. Tautan di luar domain tersebut wajib menggunakan Pilihan 1 (Upload Berkas / Google Drive).'
    return
  }
  syncLoading.value = true
  try {
    const res = await api.get('/saq/sync', { params: { url }, skipAuthRedirect: true })
    if (res.data && res.data.found) {
      syncResult.value = { found: true, ...(res.data.data || {}) }
    } else {
      syncResult.value = null
      syncError.value = res.data?.message || 'Dokumen tidak ditemukan di database server PPID maupun Pemkab Sinjai. Silakan periksa kembali tautan Anda atau gunakan Pilihan 1 untuk mengunggah berkas baru.'
    }
  } catch (err) {
    syncResult.value = null
    syncError.value = err.response?.data?.message || err.message || 'Gagal menyinkronkan dokumen dari database server.'
  } finally {
    syncLoading.value = false
  }
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
  refetchOnMount: 'always',
})
const opd = computed(() =>
  (opdsResponse.value?.data || []).find(o => o.slug === route.params.slug)
)

// Status Penguncian SAQ
const { data: lockStatusResponse } = useQuery({
  queryKey: ['saq-lock-status'],
  queryFn: async () => (await api.get('/saq/lock-status')).data,
  staleTime: 0,
  refetchOnWindowFocus: true,
  refetchOnMount: 'always',
})
const isLocked = computed(() => {
  return lockStatusResponse.value?.data?.locked ?? false
})

const isDigitalQuestion = computed(() => {
  const q = modal.value?.question
  if (!q) return false
  if (q.kode && q.kode.startsWith('2.')) return true
  if (q.tab && q.tab.toLowerCase().includes('digital')) return true
  const currentTab = tabs.value[activeTab.value]
  if (currentTab && currentTab.tab && currentTab.tab.toLowerCase().includes('digital')) return true
  return false
})

const canAnswer = computed(() => {
  // 1. Superadmin SELALU bisa isi (baik di OPD maupun Kabupaten)
  if (authStore.isSuperAdmin || authStore.user?.role === 'superadmin') return true

  // 2. Jika penguncian sedang aktif (locked), admin OPD diblokir
  if (isLocked.value) return false

  // 3. Jika backend sudah mengonfirmasi hak edit (can_edit: true dari structure), langsung izinkan
  if (structResponse.value?.can_edit === true) return true

  // 4. Jika tidak login, tidak bisa isi
  if (!authStore.user) return false

  // 5. Cek kecocokan organization_slug langsung jika ada
  if (authStore.user.organization_slug && authStore.user.organization_slug === route.params.slug) {
    return true
  }

  // 6. Cek kecocokan unit_id user dengan remote_id, unit_id, atau id OPD
  const uUnit = String(authStore.user.unit_id || '').trim()
  const opdRemote = String(opd.value?.remote_id || '').trim()
  const opdUnit = String(opd.value?.unit_id || '').trim()
  const opdId = String(opd.value?.id || '').trim()

  if (uUnit && (uUnit === opdRemote || uUnit === opdUnit || uUnit === opdId)) {
    return true
  }

  // 7. Cek kecocokan organization_id
  if (authStore.user.organization_id && String(authStore.user.organization_id) === opdId) {
    return true
  }

  return false
})

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
  refetchOnMount: 'always',
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
  fotoFile.value = null
  if (fotoPreview.value) { URL.revokeObjectURL(fotoPreview.value); fotoPreview.value = '' }
  savedFoto.value = null

  // Reset alur dua pilihan dokumen SAQ
  docFlowMode.value = 'new'
  newDocMethod.value = 'file'
  driveLinkInput.value = ''
  docTanggal.value = todayLocal()
  syncUrl.value = ''
  syncResult.value = null
  syncLoading.value = false
  syncError.value = ''
  docFileSizeError.value = ''

  form.value = {
    jawaban: null,
    alasan: q.alasan || '',
    visibility: 'public',
    docJudul: q.pertanyaan || '',
    links: [{ judul: '', link: '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false }],
    fotoJudul: '',
    fotoTanggal: todayLocal()
  }

  if (q.terisi && opd.value) {
    try {
      const res = await api.get('/saq/answers', { params: { organization_id: opd.value.id } })
      const found = (res.data.data || []).find(a => a.indicator_id === q.id)
      if (found) {
        modal.value.existing = found
        form.value.jawaban = found.jawaban || null
        form.value.alasan = found.alasan || (found.judul && found.judul.startsWith('Tidak Ada: ') ? found.judul.replace('Tidak Ada: ', '') : '') || q.alasan || ''
        form.value.visibility = found.visibility || 'public'
        form.value.docJudul = found.judul && !found.judul.startsWith('Tidak Ada: ') ? found.judul : (q.pertanyaan || '')

        if (found.links && found.links.length) {
          const nl = []
          const ns = []
          for (const l of found.links) {
            const src = l.sumber_informasi
            // Round-trip Tab Galeri
            const isGaleriLink = modal.value.question?.input_type === 'foto' && (src === 'galeri' || (!src && (l.link || '').includes('/storage/galeri/')))
            if (isGaleriLink && !savedFoto.value) {
              const nm = (l.link || '').split('/').filter(Boolean).pop() || l.link || ''
              savedFoto.value = { judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', name: nm }
              continue
            }
            if (src === 'lampiran') {
              const nm = (l.link || '').split('/').filter(Boolean).pop() || l.link || ''
              ns.push({ kind: 'file', judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', jadikanInformasi: true, name: nm })
            } else if (src === 'drive') {
              ns.push({ kind: 'drive', judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', jadikanInformasi: true, name: l.link || '' })
              driveLinkInput.value = l.link || ''
            } else {
              const isSync = src === 'informasi' || src === 'informasi_pemkab' || l.mode === 'sync_ppid'
              nl.push({ judul: l.judul || '', link: l.link || '', deskripsi: l.deskripsi || '', mode: isSync ? 'sync_ppid' : 'link', sync: isSync ? { found: true, judul: l.judul || '', sumber: src, kategori: '', tanggal: '', pengupload: '', opd: '', file_url: '' } : null, syncError: '', jadikanInformasi: (modal.value.question?.input_type || 'dokumen') === 'dokumen' && !isSync && src !== 'link' })
            }
          }
          form.value.links = nl.length ? nl : [{ judul: '', link: '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false }]
          savedUploads.value = ns

          // Deteksi mode dokumen aktif untuk antarmuka 2 pilihan
          const syncItem = found.links.find(l => l.sumber_informasi === 'informasi' || l.sumber_informasi === 'informasi_pemkab' || l.mode === 'sync_ppid')
          if (syncItem) {
            docFlowMode.value = 'sync'
            syncUrl.value = syncItem.link
            doSyncDocument()
          } else if (driveLinkInput.value || found.links.some(l => isDriveUrl(l.link))) {
            docFlowMode.value = 'new'
            newDocMethod.value = 'drive'
            if (!driveLinkInput.value) {
              const dr = found.links.find(l => isDriveUrl(l.link))
              if (dr) driveLinkInput.value = dr.link
            }
          } else if (ns.length) {
            docFlowMode.value = 'new'
            newDocMethod.value = 'file'
          }
        } else {
          form.value.links = [{ judul: found.judul || '', link: found.link || '', deskripsi: '', mode: 'link', sync: null, syncError: '', jadikanInformasi: false }]
        }
      }
    } catch (e) { /* abaikan */ }
  }
}

const isPpidDetailUrl = (raw) => {
  try {
    const u = new URL((raw || '').trim())
    const host = u.hostname.replace(/^www\./, '').toLowerCase()
    if (!['ppid.sinjaikab.go.id', 'sinjaikab.go.id'].includes(host)) return false
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
  if (!canAnswer.value) {
    formError.value = 'Pengisian SAQ saat ini sedang dikunci oleh Superadmin. Hanya Superadmin yang dapat mengisi jawaban.'
    return
  }
  if (!form.value.jawaban) {
    formError.value = 'Pilih dulu: Ya atau Tidak.'
    return
  }
  if (form.value.jawaban === 'tidak') {
    if (!form.value.alasan || !form.value.alasan.trim()) {
      formError.value = 'Alasan wajib diisi jika Anda memilih "Tidak Ada".'
      return
    }
  }

  const inputType = modal.value.question?.input_type || 'dokumen'
  const isDokumen = inputType === 'dokumen'

  // Validasi Khusus Indikator Digitalisasi
  if (isDigitalQuestion.value && form.value.jawaban === 'ya') {
    const filledLinks = form.value.links.filter(l => l.link && l.link.trim())
    if (!filledLinks.length) {
      formError.value = 'Untuk indikator Digitalisasi, silakan masukkan minimal satu link website / portal / aplikasi.'
      return
    }
    for (const l of filledLinks) {
      if (isDriveUrl(l.link)) {
        formError.value = 'Link Google Drive tidak diterima untuk indikator Digitalisasi. Harap masukkan tautan website/portal langsung atau unggah dokumen bukti PDF di bawah.'
        return
      }
    }
    docUploads.value.forEach(u => {
      if (!u.judul || !u.judul.trim()) {
        u.judul = u.file ? u.file.name.replace(/\.[^.]+$/, '') : 'Dokumentasi Digitalisasi'
      }
    })
  }

  // Validasi Khusus Alur 2 Pilihan untuk Dokumen
  if (!isDigitalQuestion.value && isDokumen && form.value.jawaban === 'ya') {
    if (docFlowMode.value === 'new') {
      if (!docUploads.value.length && !savedUploads.value.length) {
        formError.value = 'Silakan pilih berkas dokumen bukti (PDF, DOCX, XLSX, PPT, atau Gambar maks. 2 MB).'
        return
      }
      if (docFileSizeError.value) {
        formError.value = docFileSizeError.value
        return
      }
      docUploads.value.forEach(u => {
        u.judul = modal.value.question?.pertanyaan || 'Dokumen SAQ'
        u.jadikanInformasi = true
      })
    } else if (docFlowMode.value === 'sync') {
      if (!syncUrl.value || !syncUrl.value.trim()) {
        formError.value = 'Silakan masukkan tautan dokumen PPID atau Portal Pemkab Sinjai.'
        return
      }
      if (!isValidDomainForSync(syncUrl.value)) {
        formError.value = 'Hanya tautan resmi domain PPID atau Portal Pemkab Sinjai yang dapat disinkronkan di sini.'
        return
      }
      if (!syncResult.value || !syncResult.value.found) {
        formError.value = 'Dokumen belum terverifikasi di server. Silakan klik tombol "Cari & Sinkronkan Dokumen" terlebih dahulu dan pastikan dokumen ditemukan.'
        return
      }
      form.value.visibility = 'public'
    }
  }

  // Kumpulkan links
  const links = []
  if (form.value.jawaban === 'ya') {
    if (!isDigitalQuestion.value && isDokumen) {
      if (docFlowMode.value === 'sync') {
        links.push({
          judul: syncResult.value.judul,
          link: syncUrl.value.trim(),
          deskripsi: syncResult.value.kategori ? ('Kategori: ' + syncResult.value.kategori) : '',
          mode: 'sync_ppid',
          sync_url: syncUrl.value.trim(),
        })
      }
      // Sertakan juga berkas tersimpan jika ada
      for (const sv of savedUploads.value.filter(s => s.link?.trim())) {
        links.push({
          judul: sv.judul || modal.value.question?.pertanyaan,
          link: sv.link.trim(),
          deskripsi: sv.deskripsi || '',
          mode: sv.kind === 'file' ? 'baru' : 'drive',
          sync_url: null,
          raw: sv,
        })
      }
    } else {
      // Alur link legacy / digitalisasi / foto
      for (const l of form.value.links.filter(l => l.link?.trim())) {
        const isSync = (l.mode === 'sync_ppid' && l.sync && l.sync.found)
        links.push({
          judul: l.judul.trim(),
          link: l.link.trim(),
          deskripsi: (l.deskripsi || '').trim(),
          mode: isSync ? 'sync_ppid' : ((isDokumen && l.jadikanInformasi) ? 'baru' : 'link'),
          sync_url: isSync ? l.link.trim() : null,
          raw: l,
        })
      }
      for (const dr of driveRows.value.filter(dr => dr.link?.trim())) {
        links.push({ judul: dr.judul.trim(), link: dr.link.trim(), deskripsi: (dr.deskripsi || '').trim(), mode: (isDokumen && dr.jadikanInformasi) ? 'baru' : 'drive', sync_url: null, raw: dr })
      }
      for (const sv of savedUploads.value.filter(sv => sv.link?.trim())) {
        const modeSv = sv.kind === 'file'
          ? ((isDokumen && sv.jadikanInformasi) ? 'baru' : 'lampiran')
          : ((isDokumen && sv.jadikanInformasi) ? 'baru' : 'drive')
        links.push({ judul: sv.judul.trim(), link: sv.link.trim(), deskripsi: (sv.deskripsi || '').trim(), mode: modeSv, sync_url: null, raw: sv })
      }
    }
  }

  const uploads = form.value.jawaban === 'ya' ? docUploads.value.filter(u => u.file) : []
  const isSavedFoto = form.value.jawaban === 'ya' && inputType === 'foto' && !!savedFoto.value && !fotoFile.value
  if (isSavedFoto) {
    links.push({ judul: (savedFoto.value.judul || '').trim(), link: savedFoto.value.link.trim(), deskripsi: '', mode: 'galeri', sync_url: null, raw: savedFoto.value })
  }
  const isFotoUpload = form.value.jawaban === 'ya' && inputType === 'foto' && !!fotoFile.value

  if (form.value.jawaban === 'ya' && !links.length && !uploads.length && !isFotoUpload && !isSavedFoto) {
    formError.value = 'Jawaban "Ya" wajib disertai minimal satu dokumen upload, link, atau foto Galeri.'
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
      if (form.value.jawaban === 'tidak') {
        fd.append('alasan', (form.value.alasan || '').trim())
      }
      fd.append('visibility', form.value.visibility)
      if (docTanggal.value) {
        fd.append('tanggal_dokumen', docTanggal.value)
      }
      links.forEach((l, i) => {
        fd.append(`links[${i}][judul]`, l.judul)
        fd.append(`links[${i}][link]`, l.link)
        fd.append(`links[${i}][deskripsi]`, l.deskripsi)
        fd.append(`links[${i}][mode]`, l.mode)
        if (l.sync_url) fd.append(`links[${i}][sync_url]`, l.sync_url)
      })
      uploads.forEach((u, i) => {
        fd.append('dokumen_files[]', u.file)
        fd.append('dokumen_judul[]', (modal.value.question.pertanyaan || 'Dokumen SAQ').trim())
        fd.append('dokumen_deskripsi[]', (modal.value.question.pertanyaan || '').trim())
        fd.append('dokumen_jadikan[]', isDokumen ? '1' : (u.jadikanInformasi ? '1' : '0'))
      })
      if (isFotoUpload) {
        fd.append('foto', fotoFile.value)
        fd.append('judul_foto', form.value.fotoJudul.trim())
        if (form.value.fotoTanggal) fd.append('tanggal_upload', form.value.fotoTanggal)
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('ppid_token') : null
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
        alasan: form.value.jawaban === 'tidak' ? (form.value.alasan || '').trim() : null,
        visibility: form.value.visibility,
        tanggal_dokumen: docTanggal.value || todayLocal(),
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
    queryClient.invalidateQueries({ queryKey: ['saq-all-answers'] })
  } catch (e) {
    formError.value = e.response?.data?.message || e.message || 'Gagal menyimpan jawaban.'
  } finally {
    submitting.value = false
  }
}

const deleting = ref(false)
const deletingId = ref(null)

const deleteExistingAnswer = async () => {
  if (!modal.value.existing || !canAnswer.value) return
  const confirmDelete = typeof window !== 'undefined'
    ? window.confirm('Apakah Anda yakin ingin menghapus jawaban dan dokumen bukti untuk indikator ini? Dokumen terkait di sistem informasi publik juga akan dibersihkan.')
    : true
  if (!confirmDelete) return

  deleting.value = true
  formError.value = ''
  try {
    await api.delete(`/saq/answers/${modal.value.existing.id}`)
    modal.value.open = false
    docUploads.value = []
    driveRows.value = []
    savedUploads.value = []
    savedFoto.value = null
    queryClient.invalidateQueries({ queryKey: ['saq-opds'] })
    queryClient.invalidateQueries({ queryKey: ['saq-structure'] })
    queryClient.invalidateQueries({ queryKey: ['saq-all-answers'] })
  } catch (e) {
    formError.value = e.response?.data?.message || e.message || 'Gagal menghapus jawaban.'
  } finally {
    deleting.value = false
  }
}

const quickDeleteAnswer = async (q) => {
  if (!canAnswer.value) return
  const kodeLabel = q.kode ? ` [${q.kode}]` : ''
  const confirmDelete = typeof window !== 'undefined'
    ? window.confirm(`Apakah Anda yakin ingin menghapus jawaban dan dokumen bukti untuk indikator${kodeLabel}? Dokumen terkait di sistem informasi publik juga akan dibersihkan.`)
    : true
  if (!confirmDelete) return

  deletingId.value = q.id
  try {
    let answerId = q.answer_id
    if (!answerId && opd.value) {
      const res = await api.get('/saq/answers', { params: { organization_id: opd.value.id } })
      const found = (res.data?.data || []).find(a => a.indicator_id === q.id)
      if (found) answerId = found.id
    }
    if (!answerId) throw new Error('Data jawaban tidak ditemukan di server.')

    await api.delete(`/saq/answers/${answerId}`)
    queryClient.invalidateQueries({ queryKey: ['saq-opds'] })
    queryClient.invalidateQueries({ queryKey: ['saq-structure'] })
    queryClient.invalidateQueries({ queryKey: ['saq-all-answers'] })
  } catch (e) {
    if (typeof window !== 'undefined') {
      window.alert(e.response?.data?.message || e.message || 'Gagal menghapus jawaban.')
    }
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})

</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-active > div:last-child, .modal-leave-active > div:last-child { transition: transform .3s cubic-bezier(.32,.72,.35,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div:last-child { transform: translateY(40px) scale(.98); }
.modal-leave-to > div:last-child { transform: translateY(40px) scale(.98); }
</style>
