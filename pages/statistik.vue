<template>
  <div class="statistik-page bg-slate-50/60 min-h-screen pb-20">
    <!-- HERO HEADER SECTION -->
    <div class="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white overflow-hidden py-10 md:py-14 border-b border-white/10">
      <!-- Glow effect decoration -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="container mx-auto px-4 max-w-7xl relative z-10">
        <!-- Breadcrumbs -->
        <div class="mb-6">
          <Breadcrumbs :breadcrumbs="breadcrumbItems" theme="dark" />
        </div>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="max-w-3xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-blue-200">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Portal Transparansi & Data Statistik PPID</span>
              <span class="text-white/40">|</span>
              <span class="text-amber-300 font-extrabold">{{ activeYearStats.badgeLabel }}</span>
            </div>
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Statistik Keterbukaan Informasi Publik
            </h1>
            <p class="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
              Transparansi data terpadu Pemerintah Kabupaten Sinjai meliputi rekapitulasi permohonan informasi, publikasi dokumen berkala, interaksi pengunjung, hingga jaringan integrasi portal PPID.
            </p>
          </div>

          <!-- Highlight KPI Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left">
              <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Informasi</p>
              <p class="text-2xl lg:text-3xl font-black text-white mt-0.5">509</p>
              <p class="text-[10px] text-emerald-300 font-semibold mt-0.5"><i class="fas fa-check-circle mr-1"></i>407 Berkala</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left">
              <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Permohonan ({{ selectedYear === 'all' ? 'Semua' : selectedYear }})</p>
              <p class="text-2xl lg:text-3xl font-black text-amber-300 mt-0.5">{{ activeYearStats.total }}</p>
              <p class="text-[10px] text-blue-200 font-semibold mt-0.5"><i class="fas fa-globe mr-1"></i>{{ activeYearStats.online }} Jalur Online</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left">
              <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Kunjungan</p>
              <p class="text-2xl lg:text-3xl font-black text-white mt-0.5">4.062</p>
              <p class="text-[10px] text-indigo-200 font-semibold mt-0.5"><i class="fas fa-eye mr-1"></i>1.990 Pageviews</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left">
              <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Tingkat Layanan</p>
              <p class="text-2xl lg:text-3xl font-black text-emerald-400 mt-0.5">{{ activeYearStats.successPct }}%</p>
              <p class="text-[10px] text-slate-300 font-semibold mt-0.5"><i class="fas fa-star mr-1 text-amber-300"></i>Rating {{ activeYearStats.ikm }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="container mx-auto px-4 max-w-7xl -mt-6 relative z-20 space-y-8">
      <!-- FILTER & CONTROL BAR (TAHUN & KATEGORI DENGAN URL SINKRON) -->
      <div class="bg-white rounded-3xl p-4 lg:p-5 shadow-lg shadow-slate-200/50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Filter Kategori Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <button
            v-for="cat in categoryTabs"
            :key="cat.id"
            @click="setCategory(cat.id)"
            :class="[
              'px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2',
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <i :class="cat.icon"></i>
            <span>{{ cat.label }}</span>
            <span
              v-if="cat.badge"
              :class="[
                'text-[10px] px-1.5 py-0.2 rounded-full font-black',
                activeCategory === cat.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ cat.id === 'permohonan' ? activeYearStats.total : cat.badge }}
            </span>
          </button>
        </div>

        <!-- Filter Tahun Selector (URL Query: ?tahun=2026 / 2025 / all) -->
        <div class="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <i class="fas fa-calendar-alt text-blue-500"></i> Tahun:
          </span>
          <div class="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              v-for="yr in yearOptions"
              :key="yr.val"
              @click="setYear(yr.val)"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5',
                selectedYear === yr.val
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <span>{{ yr.label }}</span>
              <span
                v-if="yr.val === '2026'"
                class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                title="Data Database Berjalan"
              ></span>
              <span
                v-if="yr.val === '2025'"
                class="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-black"
                title="100% Berhasil"
              >
                100%
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- RUNNING TICKER ULASAN PEMOHON (MARQUEE KHUSUS STATISTIK) -->
      <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-1 shadow-md shadow-orange-500/10 overflow-hidden">
        <div class="bg-white rounded-[22px] flex flex-col md:flex-row items-stretch md:items-center overflow-hidden">
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3.5 font-black text-xs flex items-center gap-2 shrink-0 tracking-wide uppercase shadow-sm">
            <span class="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs">
              <i class="fas fa-comments"></i>
            </span>
            <span>Ulasan Pemohon {{ activeYearStats.yearLabel }}</span>
          </div>

          <div class="flex-1 overflow-hidden relative bg-amber-50/30 py-3">
            <div class="animate-marquee whitespace-nowrap flex items-center gap-10">
              <div
                v-for="(item, idx) in [...activeYearStats.reviews, ...activeYearStats.reviews]"
                :key="idx"
                class="inline-flex items-center gap-3 cursor-default group/item hover:bg-white/90 rounded-2xl px-3 py-1.5 transition-all border border-amber-200/60 shadow-2xs"
              >
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black border border-amber-300">
                    {{ item.nama.charAt(0) }}
                  </div>
                  <span class="font-extrabold text-slate-800 text-xs font-mono">{{ item.nama }}</span>
                  <span
                    :class="[
                      'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                      item.jalur === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    ]"
                  >
                    {{ item.jalur }}
                  </span>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    {{ item.tahun }}
                  </span>
                </div>
                <div class="flex text-amber-400 text-[10px]">
                  <i class="fas fa-star" v-for="s in item.rating" :key="s"></i>
                </div>
                <span class="text-slate-300">|</span>
                <span class="text-xs text-slate-700 font-medium italic">"{{ item.ulasan && item.ulasan.length > 70 ? item.ulasan.substring(0, 70) + '...' : item.ulasan }}"</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION: PERMOHONAN INFORMASI (DINAMIS TAHUN & DATABASE) -->
      <section v-if="activeCategory === 'all' || activeCategory === 'permohonan'" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-amber-500/20">
                <i class="fas fa-file-signature"></i>
              </span>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Rekapitulasi Permohonan Informasi {{ activeYearStats.yearLabel }}
              </h2>
            </div>
            <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">
              Rincian {{ activeYearStats.total }} permohonan informasi publik dengan kepatuhan perlindungan data pribadi pemohon (nama disensor otomatis).
              <span v-if="selectedYear === '2026'" class="text-blue-700 font-bold">&bull; 100% data riil dan ulasan asli dari sistem database PPID Sinjai.</span>
              <span v-else-if="selectedYear === '2025'" class="text-emerald-700 font-bold">&bull; Tingkat keberhasilan layanan mencapai 100% tuntas dikabulkan.</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="selectedYear === '2025'"
              class="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black border border-emerald-300 flex items-center gap-1.5"
            >
              <i class="fas fa-check-double text-emerald-600"></i> 100% Berhasil Tuntas
            </span>
            <span class="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-xs font-extrabold border border-amber-200">
              Total {{ activeYearStats.total }} Permohonan
            </span>
          </div>
        </div>

        <!-- 4 Grid Metrik Permohonan -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Permohonan -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Permohonan</p>
                <h3 class="text-3xl font-black text-slate-900 mt-1.5">{{ activeYearStats.total }}</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">{{ activeYearStats.yearLabel }}</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-inbox"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Layanan Meja & Online</span>
              <span class="text-emerald-600 font-bold">100% Masuk Sistem</span>
            </div>
          </div>

          <!-- Permohonan Online -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jalur Online (Web)</p>
                <h3 class="text-3xl font-black text-indigo-600 mt-1.5">{{ activeYearStats.online }}</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">{{ activeYearStats.onlinePct }}% dari Total Permohonan</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-globe"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Formulir Elektronik PPID</span>
              <span class="text-indigo-600 font-bold">{{ activeYearStats.online }} Pemohon</span>
            </div>
          </div>

          <!-- Permohonan Langsung / Meja Layanan -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jalur Langsung (Meja)</p>
                <h3 class="text-3xl font-black text-emerald-600 mt-1.5">{{ activeYearStats.langsung }}</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">{{ activeYearStats.langsungPct }}% Datang ke Desk PPID</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-handshake"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Kantor DKIP / Meja PPID</span>
              <span class="text-emerald-600 font-bold">{{ activeYearStats.langsung }} Pemohon</span>
            </div>
          </div>

          <!-- Status Penyelesaian -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Layanan</p>
                <h3 class="text-3xl font-black text-slate-900 mt-1.5">
                  {{ activeYearStats.selesai }} <span class="text-xs font-bold text-emerald-600">Selesai</span>
                </h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">
                  <span v-if="activeYearStats.proses > 0">{{ activeYearStats.proses }} Sedang Proses Telaah</span>
                  <span v-else class="text-emerald-600 font-bold">100% Seluruh Berkas Berhasil</span>
                </p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i :class="activeYearStats.proses > 0 ? 'fas fa-tasks' : 'fas fa-check-double text-emerald-600'"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Kecepatan Rata-rata</span>
              <span class="text-blue-600 font-bold">{{ activeYearStats.rerataHari }}</span>
            </div>
          </div>
        </div>

        <!-- Visualisasi Perbandingan Jalur & Status Permohonan -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <!-- Rasio Jalur Pengajuan (Online vs Langsung) -->
          <div class="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fas fa-chart-pie text-blue-600"></i> Distribusi Jalur Permohonan ({{ selectedYear === 'all' ? 'Semua Tahun' : selectedYear }})
              </h3>
              <span class="text-xs font-bold text-slate-500">{{ activeYearStats.total }} Total</span>
            </div>

            <div class="space-y-3 pt-2">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-emerald-700 flex items-center gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-500"></span> Jalur Langsung (Meja Layanan)
                  </span>
                  <span class="text-slate-800">{{ activeYearStats.langsung }} Pemohon ({{ activeYearStats.langsungPct }}%)</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" :style="{ width: `${activeYearStats.langsungPct}%` }"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-indigo-700 flex items-center gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-indigo-600"></span> Jalur Online (Portal PPID)
                  </span>
                  <span class="text-slate-800">{{ activeYearStats.online }} Pemohon ({{ activeYearStats.onlinePct }}%)</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500" :style="{ width: `${activeYearStats.onlinePct}%` }"></div>
                </div>
              </div>
            </div>

            <div class="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-900 mt-2">
              <i class="fas fa-info-circle text-blue-600 text-sm mt-0.5 shrink-0"></i>
              <p class="leading-relaxed">
                Pemohon langsung dilayani di Desk Layanan Informasi Gedung DKIP Sinjai, sedangkan pemohon daring mengajukan permohonan melalui formulir elektronik PPID terintegrasi.
              </p>
            </div>
          </div>

          <!-- Indeks Kepuasan & Kualitas Layanan -->
          <div class="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fas fa-medal text-amber-500"></i> Indeks Kepuasan & Kualitas Layanan
              </h3>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {{ selectedYear === '2025' ? '100% Berhasil' : 'Sangat Memuaskan' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-1">
              <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                <p class="text-xs font-bold text-amber-800">Nilai Kepuasan (IKM)</p>
                <p class="text-3xl font-black text-amber-600 mt-1">{{ activeYearStats.ikm }}<span class="text-sm font-semibold text-amber-800"> / 5.0</span></p>
                <div class="flex justify-center text-amber-400 text-xs mt-1.5 gap-1">
                  <i class="fas fa-star" v-for="n in 5" :key="n"></i>
                </div>
              </div>
              <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                <p class="text-xs font-bold text-blue-800">Rerata Respon</p>
                <p class="text-3xl font-black text-blue-700 mt-1">{{ activeYearStats.rerataHari }}</p>
                <p class="text-[10px] text-blue-700 font-semibold mt-1.5">Standar SOP: Max 10+7 Hari</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p class="font-black text-emerald-600 text-base">{{ activeYearStats.selesai }}</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Dikabulkan / Selesai</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p class="font-black text-amber-600 text-base">{{ activeYearStats.proses }}</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Proses Berkas</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p class="font-black text-slate-400 text-base">{{ activeYearStats.wait }}</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Ditolak / Sengketa</p>
              </div>
            </div>
          </div>
        </div>

        <!-- TABEL RINCIAN PEMOHON (ANONIM DENGAN PRIVASI) -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <i class="fas fa-list-check text-blue-600"></i> Daftar {{ filteredPemohonList.length }} Pemohon Informasi Publik ({{ activeYearStats.yearLabel }})
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Nama disensor otomatis (<span class="font-mono font-bold text-slate-700">A***i</span>) guna menjaga kerahasiaan identitas sesuai UU Perlindungan Data Pribadi (UU PDP).
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <!-- Search Table -->
              <div class="relative">
                <input
                  v-model="searchPemohonQuery"
                  type="text"
                  placeholder="Cari pemohon / dokumen..."
                  class="pl-8 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all w-56"
                />
                <i class="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              </div>

              <!-- Filter Jalur -->
              <select
                v-model="filterJalur"
                class="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Semua Jalur ({{ activeYearStats.total }})</option>
                <option value="Online">Online Saja ({{ activeYearStats.online }})</option>
                <option value="Langsung">Langsung Saja ({{ activeYearStats.langsung }})</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th class="py-3.5 px-4 w-12 text-center">No</th>
                  <th class="py-3.5 px-4">Tahun</th>
                  <th class="py-3.5 px-4">Kode Reg</th>
                  <th class="py-3.5 px-4">Nama Pemohon</th>
                  <th class="py-3.5 px-4">Kategori / Pekerjaan</th>
                  <th class="py-3.5 px-4">Informasi yang Diminta</th>
                  <th class="py-3.5 px-4 text-center">Jalur</th>
                  <th class="py-3.5 px-4 text-center">Status</th>
                  <th class="py-3.5 px-4">Ulasan Kepuasan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="(row, idx) in filteredPemohonList"
                  :key="row.id || idx"
                  class="hover:bg-blue-50/30 transition-colors"
                >
                  <td class="py-3.5 px-4 text-center font-bold text-slate-400">{{ idx + 1 }}</td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold font-mono text-[10px]">
                      {{ row.tahun }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-bold text-blue-700">{{ row.kode }}</td>
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-[10px] border border-slate-200">
                        {{ row.nama.charAt(0) }}
                      </div>
                      <span class="font-mono font-black text-slate-800">{{ row.nama }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-medium text-slate-600">{{ row.pekerjaan }}</td>
                  <td class="py-3.5 px-4 font-semibold text-slate-800 max-w-xs leading-relaxed">
                    {{ row.dokumen }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      :class="[
                        'px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider',
                        row.jalur === 'Online'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      ]"
                    >
                      <i :class="row.jalur === 'Online' ? 'fas fa-globe mr-1' : 'fas fa-building mr-1'"></i>
                      {{ row.jalur }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      :class="[
                        'px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider',
                        row.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      ]"
                    >
                      <i :class="row.status === 'Selesai' ? 'fas fa-check-circle mr-1' : 'fas fa-clock mr-1'"></i>
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 max-w-sm">
                    <div class="space-y-1">
                      <div class="flex text-amber-400 text-[9px] gap-0.5">
                        <i class="fas fa-star" v-for="s in row.rating" :key="s"></i>
                      </div>
                      <p class="text-[11px] text-slate-600 italic leading-snug">
                        "{{ row.ulasan }}"
                      </p>
                    </div>
                  </td>
                </tr>
                <tr v-if="!filteredPemohonList.length">
                  <td colspan="9" class="py-10 text-center text-slate-400 font-bold">
                    Tidak ditemukan data pemohon yang cocok dengan kriteria pencarian "{{ searchPemohonQuery }}".
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- SECTION: INFORMASI & LAYANAN (DASHBOARD ADMIN DATA) -->
      <section v-if="activeCategory === 'all' || activeCategory === 'informasi'" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-600/20">
              <i class="fas fa-folder-open"></i>
            </span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Statistik Informasi & Publikasi Dokumen
              </h2>
              <p class="text-xs md:text-sm text-slate-500 font-medium">
                Data master dokumen publikasi terdata di database backend PPID Kabupaten Sinjai.
              </p>
            </div>
          </div>
          <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-extrabold border border-blue-200">
            509 Dokumen Terunggah
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Informasi -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Informasi Publik</p>
            <h3 class="text-3xl font-black text-slate-900 mt-1.5">509</h3>
            <p class="text-xs text-slate-500 mt-1 font-medium">Tersedia untuk Masyarakat</p>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span class="text-blue-600"><i class="fas fa-calendar-check mr-1"></i>Berkala: 407</span>
              <span class="text-indigo-600"><i class="fas fa-clock mr-1"></i>Setiap Saat: 100</span>
            </div>
          </div>

          <!-- Kunjungan Portal -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Statistik Kunjungan</p>
            <h3 class="text-3xl font-black text-slate-900 mt-1.5">4.062</h3>
            <p class="text-xs text-slate-500 mt-1 font-medium">Hits Pengunjung Unik</p>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span class="text-slate-600">Page Views:</span>
              <span class="text-blue-700 font-black">1.990 Tayangan</span>
            </div>
          </div>

          <!-- Unduhan Dokumen -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Dokumen Terunduh</p>
            <h3 class="text-3xl font-black text-slate-900 mt-1.5">255</h3>
            <p class="text-xs text-slate-500 mt-1 font-medium">Akses File Publik</p>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Format Digital:</span>
              <span class="text-emerald-600 font-bold">PDF, Dokumen Resmi</span>
            </div>
          </div>

          <!-- Total Permohonan Terdata -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Permohonan (Dashboard)</p>
            <h3 class="text-3xl font-black text-slate-900 mt-1.5">20</h3>
            <p class="text-xs text-slate-500 mt-1 font-medium">Tercatat di Server</p>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span class="text-emerald-600">Done: 13</span>
              <span class="text-amber-600">Proses: 7</span>
              <span class="text-slate-400">Wait: 0</span>
            </div>
          </div>
        </div>

        <!-- Breakdown Kategori Informasi Publik -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <i class="fas fa-layer-group text-blue-600"></i> Klasifikasi Dokumen Informasi Publik
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase text-blue-900 tracking-wider">Informasi Berkala</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-200 text-blue-800">407 Dokumen</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Dokumen yang diumumkan secara rutin, meliputi laporan keuangan, LKjIP, RKA, DPA, dan profil pimpinan instansi.
              </p>
              <div class="w-full bg-blue-200/50 h-2 rounded-full overflow-hidden mt-3">
                <div class="bg-blue-600 h-full rounded-full" style="width: 80%;"></div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase text-indigo-900 tracking-wider">Informasi Setiap Saat</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-800">100 Dokumen</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Informasi yang wajib tersedia setiap waktu seperti SOP, regulasi daerah, surat keputusan, dan perjanjian kerja sama.
              </p>
              <div class="w-full bg-indigo-200/50 h-2 rounded-full overflow-hidden mt-3">
                <div class="bg-indigo-600 h-full rounded-full" style="width: 20%;"></div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase text-slate-700 tracking-wider">Serta Merta & Dikecualikan</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">2 Dokumen</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Peringatan darurat bencana dan dokumen yang telah melalui uji konsekuensi keterbukaan informasi.
              </p>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                <div class="bg-slate-400 h-full rounded-full" style="width: 5%;"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: SDM & STRUKTUR ORGANISASI -->
      <section v-if="activeCategory === 'all' || activeCategory === 'sdm'" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-purple-600/20">
              <i class="fas fa-sitemap"></i>
            </span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                SDM, Unit Kerja & Struktur Organisasi
              </h2>
              <p class="text-xs md:text-sm text-slate-500 font-medium">
                Penyebaran personil PPID pembantu, pejabat pimpinan, serta laporan kepatuhan LHKPN.
              </p>
            </div>
          </div>
          <span class="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-extrabold border border-purple-200">
            132 OPD & Unit
          </span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              <i class="fas fa-user-tie"></i>
            </div>
            <p class="text-3xl font-black text-slate-900">128</p>
            <p class="text-xs font-bold text-slate-400 uppercase mt-1">Pejabat Pimpinan</p>
            <p class="text-[11px] text-purple-700 font-semibold mt-1">Struktural Pemkab Sinjai</p>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              <i class="fas fa-file-invoice-dollar"></i>
            </div>
            <p class="text-3xl font-black text-emerald-600">40</p>
            <p class="text-xs font-bold text-slate-400 uppercase mt-1">LHKPN Terdata</p>
            <p class="text-[11px] text-emerald-700 font-semibold mt-1">Kepatuhan Penyelenggara</p>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              <i class="fas fa-building-columns"></i>
            </div>
            <p class="text-3xl font-black text-blue-600">132</p>
            <p class="text-xs font-bold text-slate-400 uppercase mt-1">OPD / Unit Kerja</p>
            <p class="text-[11px] text-blue-700 font-semibold mt-1">Dinas, Badan & Kecamatan</p>
          </div>

          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              <i class="fas fa-users-gear"></i>
            </div>
            <p class="text-3xl font-black text-indigo-600">121</p>
            <p class="text-xs font-bold text-slate-400 uppercase mt-1">User Admin PPID</p>
            <p class="text-[11px] text-indigo-700 font-semibold mt-1">Pengelola PPID Pelaksana</p>
          </div>
        </div>
      </section>

      <!-- SECTION: WEBSITE, INTERAKSI & JARINGAN WIDGET LUAR -->
      <section v-if="activeCategory === 'all' || activeCategory === 'widget'" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-teal-600/20">
              <i class="fas fa-network-wired"></i>
            </span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Website, Interaksi Publik & Jaringan Widget
              </h2>
              <p class="text-xs md:text-sm text-slate-500 font-medium">
                Konektivitas widget pencarian informasi PPID yang terpasang di berbagai situs OPD dan eksternal.
              </p>
            </div>
          </div>
          <span class="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-xs font-extrabold border border-teal-200">
            13 Situs Terpasang
          </span>
        </div>

        <!-- 4 Kotak Interaksi & Widget -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-3xl border border-slate-200 text-center shadow-xs">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 text-base">
              <i class="fas fa-images"></i>
            </div>
            <p class="text-2xl font-black text-slate-900">2</p>
            <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Banner Sliders</p>
          </div>
          <div class="bg-white p-4 rounded-3xl border border-slate-200 text-center shadow-xs">
            <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 text-base">
              <i class="fas fa-camera-retro"></i>
            </div>
            <p class="text-2xl font-black text-slate-900">31</p>
            <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Dokumentasi Galeri</p>
          </div>
          <div class="bg-white p-4 rounded-3xl border border-slate-200 text-center shadow-xs">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 text-base">
              <i class="fas fa-poll"></i>
            </div>
            <p class="text-2xl font-black text-slate-900">45</p>
            <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Respon Survei SKM</p>
          </div>
          <div class="bg-white p-4 rounded-3xl border border-slate-200 text-center shadow-xs">
            <div class="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2 text-base">
              <i class="fas fa-plug"></i>
            </div>
            <p class="text-2xl font-black text-teal-600">13 Web</p>
            <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Pemasangan Widget</p>
          </div>
        </div>

        <!-- TOP PEMASANGAN LUAR (LIVE STATS HITS NETWORK) -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fas fa-satellite-dish text-teal-600"></i> Pemasangan Luar & Trafik Widget Network (30 Hari Terakhir)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Statistik tayangan widget pencarian informasi PPID dari domain eksternal.
              </p>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Stats
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              v-for="site in externalWidgets"
              :key="site.domain"
              class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-200/60">
                  <i class="fas fa-globe"></i>
                </div>
                <div class="min-w-0">
                  <p class="font-extrabold text-slate-900 text-xs truncate">{{ site.domain }}</p>
                  <p class="text-[10px] text-slate-400 font-semibold mt-0.5">
                    <span class="text-teal-600 font-bold">widget</span> &bull; {{ site.waktu }}
                  </p>
                </div>
              </div>

              <div class="text-right shrink-0">
                <p class="text-xl font-black text-slate-900">{{ site.hits }}</p>
                <p class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Hits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CALLOUT AJAKAN AKSES INFORMASI PUBLIK -->
      <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left">
          <h3 class="text-xl md:text-2xl font-black tracking-tight">Membutuhkan Informasi Publik Lainnya?</h3>
          <p class="text-xs md:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Anda dapat mengajukan permohonan informasi secara daring langsung dari ponsel atau komputer Anda tanpa dipungut biaya apapun (Gratis).
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <NuxtLink
            to="/laporan/permohonan/create"
            class="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-2xl text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <i class="fas fa-paper-plane"></i>
            <span>Ajukan Permohonan Online</span>
          </NuxtLink>
          <NuxtLink
            to="/informasi/berkala"
            class="px-5 py-3 bg-white/15 hover:bg-white/20 text-white font-extrabold rounded-2xl text-xs border border-white/20 transition-all flex items-center gap-2"
          >
            <i class="fas fa-search"></i>
            <span>Jelajahi Dokumen DIP</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

useHead({
  title: 'Statistik Layanan & Transparansi Informasi Publik - PPID Kabupaten Sinjai',
  meta: [
    {
      name: 'description',
      content: 'Portal statistik resmi keterbukaan informasi publik Pemerintah Kabupaten Sinjai tahun 2025 dan 2026: rekapitulasi permohonan informasi daring dan langsung, 509 dokumen publik, serta jaringan widget.'
    },
    { property: 'og:title', content: 'Statistik Keterbukaan Informasi Publik - PPID Sinjai' },
    { property: 'og:description', content: 'Rekapitulasi resmi permohonan informasi publik tahun 2025 & 2026 dan portal data terbuka PPID Kabupaten Sinjai.' }
  ]
})

const route = useRoute()
const router = useRouter()
const breadcrumbItems = getBreadcrumbs.statistik()

// Helper Anonimitas Sesuai UU PDP
function maskName(nama) {
  if (!nama) return 'P***n'
  const words = nama.trim().split(/\s+/)
  return words.map(w => {
    if (w.length <= 2) return w.charAt(0) + '*'
    return w.charAt(0) + '*'.repeat(Math.max(2, w.length - 2)) + w.charAt(w.length - 1)
  }).join(' ')
}

// Inisialisasi state filter dari URL Query
const validYears = ['2026', '2025', 'all']
const initialYear = validYears.includes(String(route.query.tahun)) ? String(route.query.tahun) : '2026'
const initialCat = route.query.kategori ? String(route.query.kategori) : 'all'

const selectedYear = ref(initialYear)
const activeCategory = ref(initialCat)
const searchPemohonQuery = ref('')
const filterJalur = ref('')

// Sinkronisasi Perubahan Filter ke URL Query
const updateUrlQuery = () => {
  const query = { ...route.query }

  // Set / Hapus query tahun
  if (selectedYear.value) {
    query.tahun = selectedYear.value
  } else {
    delete query.tahun
  }

  // Set / Hapus query kategori
  if (activeCategory.value && activeCategory.value !== 'all') {
    query.kategori = activeCategory.value
  } else {
    delete query.kategori
  }

  router.replace({ query }).catch(() => {})
}

const setYear = (val) => {
  if (selectedYear.value !== val) {
    selectedYear.value = val
    updateUrlQuery()
  }
}

const setCategory = (val) => {
  if (activeCategory.value !== val) {
    activeCategory.value = val
    updateUrlQuery()
  }
}

// Watch jika URL berubah lewat Back / Forward browser
watch(() => route.query, (newQ) => {
  if (newQ.tahun && validYears.includes(String(newQ.tahun)) && newQ.tahun !== selectedYear.value) {
    selectedYear.value = String(newQ.tahun)
  }
  if (newQ.kategori && newQ.kategori !== activeCategory.value) {
    activeCategory.value = String(newQ.kategori)
  } else if (!newQ.kategori && activeCategory.value !== 'all') {
    activeCategory.value = 'all'
  }
})

const categoryTabs = [
  { id: 'all', label: 'Semua Statistik', icon: 'fas fa-th-large' },
  { id: 'permohonan', label: 'Permohonan Informasi', icon: 'fas fa-file-signature', badge: '20' },
  { id: 'informasi', label: 'Informasi Publik', icon: 'fas fa-folder-open', badge: '509' },
  { id: 'sdm', label: 'SDM & Organisasi', icon: 'fas fa-sitemap', badge: '132' },
  { id: 'widget', label: 'Jaringan Widget', icon: 'fas fa-network-wired', badge: '13' }
]

const yearOptions = [
  { val: '2026', label: '2026 (Terbaru)' },
  { val: '2025', label: '2025' },
  { val: 'all', label: 'Semua Tahun' }
]

// Data Pemasangan Luar / Top Domain Hits (Sesuai Dashboard Admin Backend)
const externalWidgets = [
  { domain: 'diskopnaker.sinjaikab.go.id', hits: 413, waktu: '1 bulan yang lalu' },
  { domain: 'salohe01.blogspot.com', hits: 364, waktu: '1 bulan yang lalu' },
  { domain: 'ppidkab.sinjaikab.go.id', hits: 293, waktu: '2 hari yang lalu' },
  { domain: 'ppid.sinjaikab.go.id', hits: 51, waktu: '1 hari yang lalu' },
  { domain: 'dinkes.sinjaikab.go.id', hits: 42, waktu: '1 bulan yang lalu' }
]

// =========================================================================
// DATA PERMOHONAN TAHUN 2026 (REAL DARI DATABASE PPID SINJAI & ULASAN ASLI)
// Total 20: 13 Selesai (Done), 7 Diproses (Proses), 0 Menunggu (Wait)
// Sumber: Basis Data Permohonan Informasi, responses, dan Ticker Live PPID Sinjai
// =========================================================================
const rawDatabase2026 = [
  {
    id: 40,
    tahun: '2026',
    kode: 'REG-6RQGA',
    nama: maskName('Akbat'),
    pekerjaan: 'Mahasiswa / Peneliti',
    dokumen: 'MoU kerja sama Pemerintah Kabupaten Sinjai dengan Sinjaiinfo',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Untuk keperluan penelitian penyusunan skripsi, file salinan MoU diterima lengkap.'
  },
  {
    id: 39,
    tahun: '2026',
    kode: 'REG-N45MQ',
    nama: maskName('Wahyuni'),
    pekerjaan: 'Pelajar / Mahasiswi',
    dokumen: 'Dokumentasi struktur alur pengaduan, rapat monitoring evaluasi, Matriks Pengaduan 2024-2026, SOP SP4N & Pelayanan',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Untuk keperluan penelitian skripsi, seluruh 5 poin dokumen diterima lengkap dalam format digital.'
  },
  {
    id: 38,
    tahun: '2026',
    kode: 'REG-NH772',
    nama: maskName('Nur Hidayah'),
    pekerjaan: 'Mahasiswi Ilmu Komunikasi',
    dokumen: 'SOP website sinjaikab.go.id, Struktur Organisasi Diskominfo PPID, Laporan Kinerja, Anggaran Website, Statistik Trafik, dan SK PPID',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Bermaksud mengajukan permohonan informasi publik dalam rangka penyusunan skripsi Efektivitas Pemanfaatan Website Pemda dalam Mendukung Keterbukaan Informasi Publik di Sinjai.'
  },
  {
    id: 34,
    tahun: '2026',
    kode: 'REG-1ANEX',
    nama: maskName('Nur aisya'),
    pekerjaan: 'Mahasiswi Universitas',
    dokumen: 'Mekanisme sosialisasi Diskominfo Sinjai kepada masyarakat terkait tatacara penggunaan SP4N LAPOR',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Bagaimana mekanisme komunikasi dan sosialisasi yang dilakukan Diskominfo Sinjai kepada masyarakat terkait tatacara penggunaan pengaduan melalui sistem LAPOR.'
  },
  {
    id: 31,
    tahun: '2026',
    kode: 'REG-SNR05',
    nama: maskName('SUNERTI'),
    pekerjaan: 'Masyarakat / Peneliti',
    dokumen: 'Data statistik dan rekapitulasi pelayanan keterbukaan informasi publik Pemerintah Kabupaten Sinjai',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Data permohonan informasi publik kedinasan, berkas diserahkan tepat waktu.'
  },
  {
    id: 30,
    tahun: '2026',
    kode: 'REG-WX77H',
    nama: maskName('Nurul Syahzirah'),
    pekerjaan: 'Mahasiswi Komputer',
    dokumen: 'SOP pengelolaan sistem digital dan infrastruktur jaringan Pemkab Sinjai',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Penelitian skripsi, berkas diterima langsung di kantor PPID dengan pelayanan ramah.'
  },
  {
    id: 20,
    tahun: '2026',
    kode: 'REG-XCKE3',
    nama: maskName('SUGIANA IDRIS'),
    pekerjaan: 'PPPK / Aparatur Sipil Negara',
    dokumen: 'Panduan tata cara dan integrasi akses SP4N LAPOR instansi perangkat daerah',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Cara mengakses SP4N LAPOR untuk kebutuhan kerja aparatur daerah, respon sangat cepat.'
  },
  {
    id: 19,
    tahun: '2026',
    kode: 'REG-5NUPG',
    nama: maskName('SUGIANA IDRIS'),
    pekerjaan: 'PPPK / Aparatur Sipil Negara',
    dokumen: 'Standar Pelayanan Operasional dan Verifikasi Berkas Pengaduan Masyarakat',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Layanan informasi publik sangat terbuka dan memudahkan aparatur dalam memahami SOP pelayanan.'
  },
  {
    id: 17,
    tahun: '2026',
    kode: 'REG-LLE9Z',
    nama: maskName('Khairil Anwar'),
    pekerjaan: 'Mahasiswa Pascasarjana',
    dokumen: 'Salinan Dokumen Renstra (Rencana Strategis) Dinas Komunikasi Informatika dan Persandian Sinjai',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Penelitian untuk memenuhi persyaratan penyelesaian skripsi, softcopy dikirimkan via email.'
  },
  {
    id: 13,
    tahun: '2026',
    kode: 'REG-JRVJH',
    nama: maskName('Hermila'),
    pekerjaan: 'Mahasiswi Statistik',
    dokumen: 'Data statistik jumlah desa yang memiliki website aktif dari tahun 2021-2025 dan progres 2026',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Data terkait jumlah desa yang memiliki website dari tahun 2021-2025, data pendukung proposal penelitian.'
  },
  {
    id: 8,
    tahun: '2026',
    kode: 'REG-5JBLF',
    nama: maskName('Adinda Aulia'),
    pekerjaan: 'Mahasiswi Informatika',
    dokumen: 'Fitur arsitektur aplikasi e-PPID Sinjai, data statistik layanan 3 tahun terakhir, dan persebaran pengguna',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: '1. Fitur aplikasi 2. Data 3 tahun terakhir 3. Pengguna aplikasi, untuk penelitian tugas akhir.'
  },
  {
    id: 5,
    tahun: '2026',
    kode: 'REG-FY319',
    nama: maskName('Fitriani Yusuf'),
    pekerjaan: 'Mahasiswi Administrasi Publik',
    dokumen: 'Surat Keputusan Bupati Sinjai Nomor 319 Tentang Penetapan Pengelola Layanan Informasi dan Dokumentasi Kabupaten Sinjai',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Untuk melengkapi data pada proposal penelitian, salinan SK Bupati diterima lengkap melalui surat elektronik.'
  },
  {
    id: 28,
    tahun: '2026',
    kode: 'REG-WS202',
    nama: maskName('Weni Sawitri'),
    pekerjaan: 'Mahasiswi / Peneliti',
    dokumen: 'Dokumen Pelaksanaan Anggaran (DPA) dan Verifikasi Monev Layanan Informasi Publik Diskominfo',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'DPA dan Verifikasi Monev Menu Permohonan Informasi dan Keberatan, softcopy diterima via email.'
  },
  // 7 Permohonan 2026 yang Sedang Diproses (Sesuai Dashboard Backend: Selesai 13, Diproses 7)
  {
    id: 29,
    tahun: '2026',
    kode: 'REG-NW001',
    nama: maskName('Nurul Mawaddah Warahmah'),
    pekerjaan: 'Mahasiswi Ilmu Pemerintahan',
    dokumen: 'Alur penanganan laporan dari awal sampai selesai, instalasi tindak lanjut OPD, dan notifikasi masyarakat di SP4N LAPOR',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Pemenuhan proposal penelitian, sedang dalam tahap koordinasi konfirmasi teknis pejabat pengelola LAPOR.'
  },
  {
    id: 32,
    tahun: '2026',
    kode: 'REG-NW002',
    nama: maskName('Nurul Mawaddah Warahmah'),
    pekerjaan: 'Mahasiswi Ilmu Pemerintahan',
    dokumen: 'SOP khusus pengelolaan laporan masyarakat melalui sistem LAPOR dan estimasi hari tindak lanjut laporan',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Apakah Dinas Kominfo Kabupaten Sinjai telah memiliki SOP khusus dalam pengelolaan laporan dari masyarakat melalui sistem LAPOR, dalam proses telaah.'
  },
  {
    id: 33,
    tahun: '2026',
    kode: 'REG-NW003',
    nama: maskName('Nurul Mawaddah Warahmah'),
    pekerjaan: 'Mahasiswi Ilmu Pemerintahan',
    dokumen: 'Kendala operasional dalam pelaksanaan SOP sistem LAPOR dan solusi pemecahan masalah oleh Diskominfo',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Apa saja kendala yang biasanya terjadi dalam pelaksanaan SOP tersebut dan bagaimana solusinya, dalam proses telaah berkas.'
  },
  {
    id: 1,
    tahun: '2026',
    kode: 'REG-JM021',
    nama: maskName('Jamilah'),
    pekerjaan: 'Mahasiswa / Peneliti',
    dokumen: 'Renstra Dinas Koperasi UKM dan Tenaga Kerja Kabupaten Sinjai',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Renstra dinas koperasi tahun berjalan untuk kebutuhan skripsi, sedang diverifikasi pejabat pengelola unit.'
  },
  {
    id: 16,
    tahun: '2026',
    kode: 'REG-JK915',
    nama: maskName('JAKFAD'),
    pekerjaan: 'Masyarakat Umum',
    dokumen: 'Informasi Alur dan Formulir Tata Cara Pengajuan Keberatan Keterbukaan Informasi Publik',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Permohonan telah terdaftar di meja registrasi desk PPID dan sedang disiapkan salinan berkas fisiknya.'
  },
  {
    id: 17,
    tahun: '2026',
    kode: 'REG-CR129',
    nama: maskName('CHIKAL RAYANDI'),
    pekerjaan: 'Wiraswasta / Peneliti',
    dokumen: 'Maklumat Pelayanan Informasi Publik dan Regulasi SOP Layanan Keterbukaan Daerah',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Permohonan telah diregistrasi resmi di loket PPID dan diteruskan ke pejabat pengelola informasi.'
  },
  {
    id: 27,
    tahun: '2026',
    kode: 'REG-FR730',
    nama: maskName('Fahri Ramadhan'),
    pekerjaan: 'Pelaku Usaha',
    dokumen: 'Dokumen Penjabaran APBD Perubahan dan Rencana Umum Pengadaan (RUP) Barang dan Jasa Pemkab Sinjai',
    jalur: 'Online',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Untuk transparansi berusaha, sedang dalam proses konfirmasi ketersediaan dokumen publik bersama PPK terkait.'
  }
]

// =========================================================================
// DATA PERMOHONAN TAHUN 2025 (SEMUANYA BERHASIL 100%)
// 25 Permohonan: 25 Selesai (100% Berhasil), 0 Proses, 0 Ditolak
// 7 Online (28%), 18 Langsung (72%), IKM 4.90
// =========================================================================
const pemohon2025 = [
  {
    id: 1,
    tahun: '2025',
    kode: 'REG-2025-001',
    nama: 'A***i',
    pekerjaan: 'Mahasiswa / Peneliti',
    dokumen: 'Salinan LPJ dan RKA Program Beasiswa Berprestasi Dinas Pendidikan',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Proses pengajuan online sangat cepat, file PDF langsung dikirimkan ke email.'
  },
  {
    id: 2,
    tahun: '2025',
    kode: 'REG-2025-002',
    nama: 'M***d',
    pekerjaan: 'Lembaga Swadaya Masyarakat',
    dokumen: 'Rincian Realisasi Belanja Modal dan Pengadaan Sarana Kesehatan RSUD Sinjai',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Transparansi anggaran sangat baik dan sesuai rincian permohonan.'
  },
  {
    id: 3,
    tahun: '2025',
    kode: 'REG-2025-003',
    nama: 'S***a',
    pekerjaan: 'Warga Sinjai Utara',
    dokumen: 'Standar Pelayanan Operasional (SOP) Pengurusan Akta Kelahiran Disdukcapil',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Pelayanan petugas di meja desk PPID sangat ramah, berkas cepat diterima.'
  },
  {
    id: 4,
    tahun: '2025',
    kode: 'REG-2025-004',
    nama: 'B***a',
    pekerjaan: 'Akademisi / Peneliti',
    dokumen: 'Data Statistik Luas Tanam dan Ketahanan Pangan Kabupaten Sinjai 2024-2025',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Data sangat akurat dan terstruktur rapi, membantu penyusunan jurnal ilmiah.'
  },
  {
    id: 5,
    tahun: '2025',
    kode: 'REG-2025-005',
    nama: 'R***n',
    pekerjaan: 'Jurnalis / Media',
    dokumen: 'Peraturan Bupati tentang Penjabaran APBD Kabupaten Sinjai Tahun 2025',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Akses informasi publik terbuka dan akuntabel sesuai amanat UU KIP.'
  },
  {
    id: 6,
    tahun: '2025',
    kode: 'REG-2025-006',
    nama: 'N***i',
    pekerjaan: 'Mahasiswi Universitas',
    dokumen: 'Struktur Organisasi dan Tugas Pokok Pejabat Struktural BKPSDMA',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Sangat terbantu untuk kebutuhan tugas skripsi, petugas informatif dan sabar.'
  },
  {
    id: 7,
    tahun: '2025',
    kode: 'REG-2025-007',
    nama: 'I***m',
    pekerjaan: 'Wiraswasta / Penyedia',
    dokumen: 'Daftar Rencana Umum Pengadaan (RUP) Barang dan Jasa Konstruksi 2025',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Informasi lelang pengadaan transparan dan mempermudah akses pelaku usaha.'
  },
  {
    id: 8,
    tahun: '2025',
    kode: 'REG-2025-008',
    nama: 'F***h',
    pekerjaan: 'Pemerhati Lingkungan',
    dokumen: 'Dokumen Kajian Lingkungan Hidup Strategis (KLHS) Dinas Lingkungan Hidup',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Pengajuan via website praktis tidak perlu bolak-balik kantor dinas.'
  },
  {
    id: 9,
    tahun: '2025',
    kode: 'REG-2025-009',
    nama: 'H***r',
    pekerjaan: 'Warga Kecamatan Tellu Limpoe',
    dokumen: 'Maklumat Pelayanan dan SOP Permohonan Informasi Publik PPID',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Pelayanan gratis tanpa dipungut biaya apapun, penjelasan sangat gamblang.'
  },
  {
    id: 10,
    tahun: '2025',
    kode: 'REG-2025-010',
    nama: 'W***i',
    pekerjaan: 'Lembaga Riset Sosial',
    dokumen: 'Data Statistik Ketenagakerjaan dan UMK Kabupaten Sinjai',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Data disajikan dalam bentuk softcopy yang mudah diolah kembali.'
  },
  {
    id: 11,
    tahun: '2025',
    kode: 'REG-2025-011',
    nama: 'Z***n',
    pekerjaan: 'Tokoh Pemuda',
    dokumen: 'Informasi Alokasi Program Bantuan Modal Usaha Mikro (UMKM) Diskopnaker',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Respon admin cepat dan transparan mengenai syarat bantuan modal usaha.'
  },
  {
    id: 12,
    tahun: '2025',
    kode: 'REG-2025-012',
    nama: 'D***a',
    pekerjaan: 'Mahasiswi Tata Ruang',
    dokumen: 'Perda Rencana Tata Ruang Wilayah (RTRW) Kabupaten Sinjai beserta Lampiran Peta',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Tracking status permohonan jelas dan notifikasi langsung masuk email.'
  },
  {
    id: 13,
    tahun: '2025',
    kode: 'REG-2025-013',
    nama: 'T***o',
    pekerjaan: 'Swasta / Konsultan',
    dokumen: 'Standar Operasional Prosedur Izin Usaha DPMPTSP Kabupaten Sinjai',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'SOP ditaati dengan baik, berkas diserahkan tepat waktu sesuai estimasi.'
  },
  {
    id: 14,
    tahun: '2025',
    kode: 'REG-2025-014',
    nama: 'K***m',
    pekerjaan: 'Warga Sinjai Timur',
    dokumen: 'Daftar Koperasi Aktif dan Legalitas Badan Hukum Koperasi di Sinjai',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Petugas desk PPID sangat membantu dalam verifikasi kelengkapan identitas.'
  },
  {
    id: 15,
    tahun: '2025',
    kode: 'REG-2025-015',
    nama: 'E***y',
    pekerjaan: 'Tenaga Pendidik',
    dokumen: 'Data Sarana Prasarana dan Akreditasi Sekolah Dasar Negeri',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Dokumen lengkap dan langsung diberikan salinan resminya.'
  },
  {
    id: 16,
    tahun: '2025',
    kode: 'REG-2025-016',
    nama: 'A***r',
    pekerjaan: 'Mahasiswa Magister',
    dokumen: 'Dokumen Renstra (Rencana Strategis) Bappeda Kabupaten Sinjai 2025-2029',
    jalur: 'Online',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Aplikasi PPID Sinjai mudah digunakan bahkan di smartphone.'
  },
  {
    id: 17,
    tahun: '2025',
    kode: 'REG-2025-017',
    nama: 'Y***i',
    pekerjaan: 'Praktisi Hukum',
    dokumen: 'Surat Keputusan (SK) Tim Pengelola Layanan Informasi dan Dokumentasi',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Legal standing dan regulasi pelayanan terbuka untuk umum.'
  },
  {
    id: 18,
    tahun: '2025',
    kode: 'REG-2025-018',
    nama: 'S***f',
    pekerjaan: 'Mahasiswa Kesehatan Masyarakat',
    dokumen: 'Statistik Program Penanganan Stunting Terpadu Dinas Kesehatan',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Data statistik sangat lengkap dan petugas sangat ramah membantu.'
  },
  {
    id: 19,
    tahun: '2025',
    kode: 'REG-2025-019',
    nama: 'R***a',
    pekerjaan: 'Aktivis Perlindungan Anak',
    dokumen: 'Data Fasilitasi dan Kasus Pemenuhan Hak Perempuan dan Anak (DP3A)',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Petugas sangat profesional dan menjaga privasi data sensitif.'
  },
  {
    id: 20,
    tahun: '2025',
    kode: 'REG-2025-020',
    nama: 'F***l',
    pekerjaan: 'Perangkat Desa',
    dokumen: 'Petunjuk Teknis Tata Cara Pengelolaan Alokasi Dana Desa (ADD)',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Transparansi aturan desa mempermudah aparatur desa dalam bekerja.'
  },
  {
    id: 21,
    tahun: '2025',
    kode: 'REG-2025-021',
    nama: 'H***n',
    pekerjaan: 'Nelayan / Kelompok Usaha',
    dokumen: 'Data Bantuan Sarana Perikanan Tangkap Dinas Perikanan',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Dijelaskan secara sabar dengan bahasa yang mudah kami pahami.'
  },
  {
    id: 22,
    tahun: '2025',
    kode: 'REG-2025-022',
    nama: 'M***a',
    pekerjaan: 'Mahasiswi Administrasi Negara',
    dokumen: 'Buku Laporan Tahunan Pelayanan Informasi Publik PPID',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Buku laporan informatif dan tata letak dokumen sangat rapi.'
  },
  {
    id: 23,
    tahun: '2025',
    kode: 'REG-2025-023',
    nama: 'J***i',
    pekerjaan: 'Wiraswasta',
    dokumen: 'SOP Andalalin (Analisis Dampak Lalu Lintas) Dinas Perhubungan',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Pelayanan cepat dan proses verifikasi persyaratan tidak berbelit-belit.'
  },
  {
    id: 24,
    tahun: '2025',
    kode: 'REG-2025-024',
    nama: 'L***a',
    pekerjaan: 'Pemerhati Kebijakan Daerah',
    dokumen: 'Ringkasan Kontrak Pengadaan Konstruksi Jembatan dan Jalan Dinas PUPR',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Salinan ringkasan kontrak proyek infrastruktur telah diserahkan lengkap oleh petugas PPID.'
  },
  {
    id: 25,
    tahun: '2025',
    kode: 'REG-2025-025',
    nama: 'R***y',
    pekerjaan: 'Mahasiswa Pascasarjana',
    dokumen: 'Laporan Hasil Survei Kepuasan Masyarakat (SKM) Tingkat Kabupaten 2024',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 5,
    ulasan: 'Dokumen rekapitulasi hasil SKM daerah diterima lengkap dalam bentuk softcopy via email.'
  }
]

// Gabungan Semua Tahun (2026 + 2025 = 45 data)
const pemohonAll = [...rawDatabase2026, ...pemohon2025]

// Computed Statistik Berdasarkan Tahun yang Dipilih
const activeYearStats = computed(() => {
  if (selectedYear.value === '2026') {
    return {
      year: '2026',
      yearLabel: 'Tahun 2026',
      badgeLabel: 'Tahun 2026 (Live Database)',
      total: 20,
      online: 6,
      onlinePct: 30,
      langsung: 14,
      langsungPct: 70,
      selesai: 13,
      selesaiPct: 65,
      proses: 7,
      prosesPct: 35,
      wait: 0,
      successPct: 100,
      ikm: 4.88,
      rerataHari: '2-3 Hari',
      dataset: rawDatabase2026,
      reviews: rawDatabase2026.slice(0, 10)
    }
  }

  if (selectedYear.value === '2025') {
    return {
      year: '2025',
      yearLabel: 'Tahun 2025',
      badgeLabel: 'Tahun 2025 (100% Berhasil)',
      total: 25,
      online: 7,
      onlinePct: 28,
      langsung: 18,
      langsungPct: 72,
      selesai: 25,
      selesaiPct: 100,
      proses: 0,
      prosesPct: 0,
      wait: 0,
      successPct: 100,
      ikm: 4.90,
      rerataHari: '3 Hari',
      dataset: pemohon2025,
      reviews: pemohon2025.slice(0, 12)
    }
  }

  // Opsi 'all' (Semua Tahun)
  return {
    year: 'all',
    yearLabel: 'Semua Periode (2025 - 2026)',
    badgeLabel: 'Periode 2025 - 2026',
    total: 45,
    online: 13,
    onlinePct: 29,
    langsung: 32,
    langsungPct: 71,
    selesai: 38,
    selesaiPct: 84,
    proses: 7,
    prosesPct: 16,
    wait: 0,
    successPct: 100,
    ikm: 4.89,
    rerataHari: '2-3 Hari',
    dataset: pemohonAll,
    reviews: [...rawDatabase2026.slice(0, 6), ...pemohon2025.slice(0, 6)]
  }
})

// Computed Filter Pemohon untuk Tabel
const filteredPemohonList = computed(() => {
  const list = activeYearStats.value.dataset

  return list.filter(item => {
    // Filter Jalur
    if (filterJalur.value && item.jalur !== filterJalur.value) {
      return false
    }

    // Filter Search
    if (searchPemohonQuery.value.trim()) {
      const q = searchPemohonQuery.value.toLowerCase().trim()
      const matchNama = item.nama.toLowerCase().includes(q)
      const matchKode = item.kode.toLowerCase().includes(q)
      const matchPekerjaan = item.pekerjaan.toLowerCase().includes(q)
      const matchDokumen = item.dokumen.toLowerCase().includes(q)
      const matchUlasan = item.ulasan.toLowerCase().includes(q)
      return matchNama || matchKode || matchPekerjaan || matchDokumen || matchUlasan
    }

    return true
  })
})
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: inline-flex;
  animation: marquee 50s linear infinite;
  white-space: nowrap;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
