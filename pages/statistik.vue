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
              <span class="text-amber-300 font-extrabold">Tahun 2025</span>
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
              <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Permohonan 2025</p>
              <p class="text-2xl lg:text-3xl font-black text-amber-300 mt-0.5">25</p>
              <p class="text-[10px] text-blue-200 font-semibold mt-0.5"><i class="fas fa-globe mr-1"></i>7 Jalur Online</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left">
              <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Kunjungan</p>
              <p class="text-2xl lg:text-3xl font-black text-white mt-0.5">4.062</p>
              <p class="text-[10px] text-indigo-200 font-semibold mt-0.5"><i class="fas fa-eye mr-1"></i>1.990 Pageviews</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left">
              <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Tingkat Layanan</p>
              <p class="text-2xl lg:text-3xl font-black text-emerald-400 mt-0.5">100%</p>
              <p class="text-[10px] text-slate-300 font-semibold mt-0.5"><i class="fas fa-star mr-1 text-amber-300"></i>Rating 4.85</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="container mx-auto px-4 max-w-7xl -mt-6 relative z-20 space-y-8">
      <!-- FILTER & CONTROL BAR (TAHUN & KATEGORI) -->
      <div class="bg-white rounded-3xl p-4 lg:p-5 shadow-lg shadow-slate-200/50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Filter Kategori Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <button
            v-for="cat in categoryTabs"
            :key="cat.id"
            @click="activeCategory = cat.id"
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
              {{ cat.badge }}
            </span>
          </button>
        </div>

        <!-- Filter Tahun Selector -->
        <div class="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <i class="fas fa-calendar-alt text-blue-500"></i> Tahun:
          </span>
          <div class="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              v-for="yr in yearOptions"
              :key="yr.val"
              @click="selectedYear = yr.val"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all',
                selectedYear === yr.val
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              {{ yr.label }}
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
            <span>Ulasan Pemohon 2025</span>
          </div>

          <div class="flex-1 overflow-hidden relative bg-amber-50/30 py-3">
            <div class="animate-marquee whitespace-nowrap flex items-center gap-10">
              <div
                v-for="(item, idx) in [...sampleReviews, ...sampleReviews]"
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
                </div>
                <div class="flex text-amber-400 text-[10px]">
                  <i class="fas fa-star" v-for="s in item.rating" :key="s"></i>
                </div>
                <span class="text-slate-300">|</span>
                <span class="text-xs text-slate-700 font-medium italic">"{{ item.ulasan }}"</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION: PERMOHONAN INFORMASI 2025 (FOKUS UTAMA) -->
      <section v-if="activeCategory === 'all' || activeCategory === 'permohonan'" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-amber-500/20">
                <i class="fas fa-file-signature"></i>
              </span>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Rekapitulasi Permohonan Informasi Tahun 2025
              </h2>
            </div>
            <p class="text-xs md:text-sm text-slate-500 font-medium mt-1">
              Rincian 25 permohonan informasi publik tahun berjalan dengan kepatuhan anonimitas data pemohon sesuai prinsip UU Perlindungan Data Pribadi (UU PDP).
            </p>
          </div>
          <span class="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-xs font-extrabold border border-amber-200">
            Total 25 Permohonan
          </span>
        </div>

        <!-- 4 Grid Metrik Permohonan 2025 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Permohonan -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Permohonan</p>
                <h3 class="text-3xl font-black text-slate-900 mt-1.5">25</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">Tahun 2025 (Tahun Berjalan)</p>
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
                <h3 class="text-3xl font-black text-indigo-600 mt-1.5">7</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">28% dari Total Permohonan</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-globe"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Formulir Elektronik PPID</span>
              <span class="text-indigo-600 font-bold">7 Pemohon</span>
            </div>
          </div>

          <!-- Permohonan Langsung / Meja Layanan -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jalur Langsung (Meja)</p>
                <h3 class="text-3xl font-black text-emerald-600 mt-1.5">18</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">72% Datang ke Desk PPID</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-handshake"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Kantor DKIP / Meja PPID</span>
              <span class="text-emerald-600 font-bold">18 Pemohon</span>
            </div>
          </div>

          <!-- Status Penyelesaian -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Layanan</p>
                <h3 class="text-3xl font-black text-slate-900 mt-1.5">23 <span class="text-xs font-bold text-emerald-600">Selesai</span></h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">2 Sedang Proses Telaah</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-tasks"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Kecepatan Rata-rata</span>
              <span class="text-blue-600 font-bold">3 Hari Kerja</span>
            </div>
          </div>
        </div>

        <!-- Visualisasi Perbandingan Jalur & Status Permohonan 2025 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <!-- Rasio Jalur Pengajuan (Online vs Langsung) -->
          <div class="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fas fa-chart-pie text-blue-600"></i> Distribusi Jalur Permohonan 2025
              </h3>
              <span class="text-xs font-bold text-slate-500">25 Total</span>
            </div>

            <div class="space-y-3 pt-2">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-emerald-700 flex items-center gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-500"></span> Jalur Langsung (Meja Layanan)
                  </span>
                  <span class="text-slate-800">18 Pemohon (72%)</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style="width: 72%;"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-indigo-700 flex items-center gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-indigo-600"></span> Jalur Online (Portal PPID)
                  </span>
                  <span class="text-slate-800">7 Pemohon (28%)</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full" style="width: 28%;"></div>
                </div>
              </div>
            </div>

            <div class="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-900 mt-2">
              <i class="fas fa-info-circle text-blue-600 text-sm mt-0.5 shrink-0"></i>
              <p class="leading-relaxed">
                Pemohon yang datang langsung dilayani di Desk Layanan Informasi DKIP Kabupaten Sinjai, sedangkan pemohon daring mengajukan permohonan mandiri melalui formulir online PPID.
              </p>
            </div>
          </div>

          <!-- Indeks Kepuasan & Standar Waktu -->
          <div class="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fas fa-medal text-amber-500"></i> Indeks Kepuasan & Kualitas Layanan
              </h3>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Sangat Memuaskan
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-1">
              <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                <p class="text-xs font-bold text-amber-800">Nilai Kepuasan (IKM)</p>
                <p class="text-3xl font-black text-amber-600 mt-1">4.85<span class="text-sm font-semibold text-amber-800"> / 5.0</span></p>
                <div class="flex justify-center text-amber-400 text-xs mt-1.5 gap-1">
                  <i class="fas fa-star" v-for="n in 5" :key="n"></i>
                </div>
              </div>
              <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                <p class="text-xs font-bold text-blue-800">Rerata Respon</p>
                <p class="text-3xl font-black text-blue-700 mt-1">3 <span class="text-sm font-semibold text-blue-800">Hari</span></p>
                <p class="text-[10px] text-blue-700 font-semibold mt-1.5">Standar SOP: Max 10+7 Hari</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p class="font-black text-emerald-600 text-base">23</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Dikabulkan</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p class="font-black text-amber-600 text-base">2</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Proses Berkas</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p class="font-black text-slate-400 text-base">0</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Ditolak / Sengketa</p>
              </div>
            </div>
          </div>
        </div>

        <!-- TABEL RINCIAN 25 PEMOHON 2025 (ANONIM DENGAN PRIVASI) -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <i class="fas fa-list-check text-blue-600"></i> Daftar 25 Pemohon Informasi Publik (Tahun 2025)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Nama disensor otomatis (<span class="font-mono font-bold text-slate-700">A***i</span>) guna menjaga kerahasiaan identitas pemohon.
              </p>
            </div>

            <div class="flex items-center gap-2.5">
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
                <option value="">Semua Jalur</option>
                <option value="Online">Hanya Online (7)</option>
                <option value="Langsung">Hanya Langsung (18)</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th class="py-3.5 px-4 w-12 text-center">No</th>
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
                  :key="row.id"
                  class="hover:bg-blue-50/30 transition-colors"
                >
                  <td class="py-3.5 px-4 text-center font-bold text-slate-400">{{ idx + 1 }}</td>
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
                  <td colspan="8" class="py-10 text-center text-slate-400 font-bold">
                    Tidak ditemukan data pemohon yang cocok dengan kata kunci "{{ searchPemohonQuery }}".
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
            <h3 class="text-3xl font-black text-emerald-600 mt-1.5">255</h3>
            <p class="text-xs text-slate-500 mt-1 font-medium">File PDF & Regulasi Resmi</p>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span class="text-slate-600">Akses Unduhan:</span>
              <span class="text-emerald-700 font-black">Publik Bebas Biaya</span>
            </div>
          </div>

          <!-- Status Permohonan Admin -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Dashboard Permohonan</p>
            <h3 class="text-3xl font-black text-slate-900 mt-1.5">20</h3>
            <p class="text-xs text-slate-500 mt-1 font-medium">Wait: 0 | Proses: 7 | Done: 13</p>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span class="text-slate-600">Penyelesaian Selesai:</span>
              <span class="text-emerald-600 font-black">13 Permohonan</span>
            </div>
          </div>
        </div>

        <!-- Breakdown Kategori Informasi Publik -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i class="fas fa-layer-group text-blue-600"></i> Sebaran Kategori Dokumen Publik (509 Dokumen)
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-blue-900 uppercase">Informasi Berkala</span>
                <span class="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] font-black">79.9%</span>
              </div>
              <p class="text-3xl font-black text-blue-700">407</p>
              <p class="text-xs text-blue-800 mt-1 leading-snug">
                Laporan Keuangan, Profil Badan Publik, Rencana Kerja, dan Akuntabilitas Kinerja.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-indigo-900 uppercase">Informasi Setiap Saat</span>
                <span class="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-black">19.7%</span>
              </div>
              <p class="text-3xl font-black text-indigo-700">100</p>
              <p class="text-xs text-indigo-800 mt-1 leading-snug">
                Daftar Informasi Publik (DIP), SOP Pelayanan, Perjanjian Kerjasama, dan Regulasi.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-amber-900 uppercase">Informasi Serta Merta</span>
                <span class="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">0.4%</span>
              </div>
              <p class="text-3xl font-black text-amber-700">2</p>
              <p class="text-xs text-amber-800 mt-1 leading-snug">
                Peringatan dini kebencanaan, tanggap darurat, dan gangguan pelayanan umum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: SDM & STRUKTUR ORGANISASI (DASHBOARD ADMIN DATA) -->
      <section v-if="activeCategory === 'all' || activeCategory === 'sdm'" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-purple-600/20">
              <i class="fas fa-sitemap"></i>
            </span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                SDM, Ekosistem OPD & Kepatuhan LHKPN
              </h2>
              <p class="text-xs md:text-sm text-slate-500 font-medium">
                Pilar tata kelola organisasi PPID dan aparatur pengelola informasi di Kabupaten Sinjai.
              </p>
            </div>
          </div>
          <span class="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-extrabold border border-purple-200">
            132 OPD Terkoordinasi
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Pimpinan -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pejabat / Pimpinan</p>
                <h3 class="text-3xl font-black text-slate-900 mt-1.5">128</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">Pimpinan Daerah & OPD</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-user-tie"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Profil & Foto Resmi:</span>
              <span class="text-purple-700 font-black">Terpublikasi</span>
            </div>
          </div>

          <!-- LHKPN -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kepatuhan LHKPN</p>
                <h3 class="text-3xl font-black text-emerald-600 mt-1.5">40</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">Pejabat Wajib Lapor Terdata</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-shield-halved"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Status Kepatuhan:</span>
              <span class="text-emerald-700 font-black">100% Terverifikasi</span>
            </div>
          </div>

          <!-- OPD / Unit Kerja -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Perangkat Daerah (OPD)</p>
                <h3 class="text-3xl font-black text-blue-600 mt-1.5">132</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">Dinas, Badan, Kecamatan & Desa</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-landmark"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>PPID Pelaksana:</span>
              <span class="text-blue-700 font-black">Terintegrasi</span>
            </div>
          </div>

          <!-- User Admin Pengelola -->
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">User Admin Sistem</p>
                <h3 class="text-3xl font-black text-indigo-600 mt-1.5">121</h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">Operator & Verifikator OPD</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-xs">
                <i class="fas fa-users-cog"></i>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Hak Akses:</span>
              <span class="text-indigo-700 font-black">Role-Based Access</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: WEBSITE & INTERAKSI PUBLIK + PEMASANGAN WIDGET LUAR (DASHBOARD ADMIN DATA) -->
      <section v-if="activeCategory === 'all' || activeCategory === 'widget'" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-teal-600/20">
              <i class="fas fa-network-wired"></i>
            </span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Website, Interaksi Publik & Pemasangan Luar (Live Widget Hits)
              </h2>
              <p class="text-xs md:text-sm text-slate-500 font-medium">
                Distribusi lalu lintas jaringan widget PPID yang terpasang di portal resmi dinas, blog desa, dan website instansi luar.
              </p>
            </div>
          </div>
          <span class="px-3 py-1.5 bg-teal-50 text-teal-800 rounded-xl text-xs font-extrabold border border-teal-200">
            13 Website Pemasangan
          </span>
        </div>

        <!-- 4 Highlights Website & Interaksi -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-3xl border border-slate-200 text-center shadow-xs">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 text-base">
              <i class="fas fa-images"></i>
            </div>
            <p class="text-2xl font-black text-slate-900">2</p>
            <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Sliders Banner</p>
          </div>
          <div class="bg-white p-4 rounded-3xl border border-slate-200 text-center shadow-xs">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 text-base">
              <i class="fas fa-camera"></i>
            </div>
            <p class="text-2xl font-black text-slate-900">31</p>
            <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Galeri Dokumentasi</p>
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
import { ref, computed } from 'vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

useHead({
  title: 'Statistik Layanan & Transparansi Informasi Publik 2025 - PPID Kabupaten Sinjai',
  meta: [
    {
      name: 'description',
      content: 'Portal statistik resmi keterbukaan informasi publik Pemerintah Kabupaten Sinjai tahun 2025: rekapitulasi 25 permohonan (7 online), 509 dokumen publik, kunjungan web, dan jaringan widget.'
    },
    { property: 'og:title', content: 'Statistik Keterbukaan Informasi Publik 2025 - PPID Sinjai' },
    { property: 'og:description', content: 'Rekapitulasi resmi permohonan informasi publik tahun 2025 dan portal data terbuka PPID Kabupaten Sinjai.' }
  ]
})

const breadcrumbItems = getBreadcrumbs.statistik()

// State Filters
const activeCategory = ref('all')
const selectedYear = ref('2025')
const searchPemohonQuery = ref('')
const filterJalur = ref('')

const categoryTabs = [
  { id: 'all', label: 'Semua Statistik', icon: 'fas fa-th-large' },
  { id: 'permohonan', label: 'Permohonan Informasi 2025', icon: 'fas fa-file-signature', badge: '25' },
  { id: 'informasi', label: 'Informasi Publik', icon: 'fas fa-folder-open', badge: '509' },
  { id: 'sdm', label: 'SDM & Organisasi', icon: 'fas fa-sitemap', badge: '132' },
  { id: 'widget', label: 'Jaringan Widget', icon: 'fas fa-network-wired', badge: '13' }
]

const yearOptions = [
  { val: '2025', label: '2025 (Aktif)' },
  { val: '2024', label: '2024' },
  { val: 'all', label: 'Semua' }
]

// Data Pemasangan Luar / Top Domain Hits (Sesuai Dashboard Admin Backend)
const externalWidgets = [
  { domain: 'diskopnaker.sinjaikab.go.id', hits: 413, waktu: '1 bulan yang lalu' },
  { domain: 'salohe01.blogspot.com', hits: 364, waktu: '1 bulan yang lalu' },
  { domain: 'ppidkab.sinjaikab.go.id', hits: 293, waktu: '2 hari yang lalu' },
  { domain: 'ppid.sinjaikab.go.id', hits: 51, waktu: '1 hari yang lalu' },
  { domain: 'dinkes.sinjaikab.go.id', hits: 42, waktu: '1 bulan yang lalu' }
]

// Data 25 Pemohon Tahun 2025 (Anonimitas A***i, 7 Online, 18 Langsung)
const pemohonList = [
  {
    id: 1,
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
    kode: 'REG-2025-005',
    nama: 'R***n',
    pekerjaan: 'Jurnalis / Media',
    dokumen: 'Peraturan Bupati tentang Penjabaran APBD Kabupaten Sinjai Tahun 2025',
    jalur: 'Online',
    status: 'Selesai',
    rating: 4,
    ulasan: 'Akses informasi publik terbuka dan akuntabel sesuai amanat UU KIP.'
  },
  {
    id: 6,
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
    kode: 'REG-2025-010',
    nama: 'W***i',
    pekerjaan: 'Lembaga Riset Sosial',
    dokumen: 'Data Statistik Ketenagakerjaan dan UMK Kabupaten Sinjai',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 4,
    ulasan: 'Data disajikan dalam bentuk softcopy yang mudah diolah kembali.'
  },
  {
    id: 11,
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
    kode: 'REG-2025-020',
    nama: 'F***l',
    pekerjaan: 'Perangkat Desa',
    dokumen: 'Petunjuk Teknis Tata Cara Pengelolaan Alokasi Dana Desa (ADD)',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 4,
    ulasan: 'Transparansi aturan desa mempermudah aparatur desa dalam bekerja.'
  },
  {
    id: 21,
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
    kode: 'REG-2025-023',
    nama: 'J***i',
    pekerjaan: 'Wiraswasta',
    dokumen: 'SOP Andalalin (Analisis Dampak Lalu Lintas) Dinas Perhubungan',
    jalur: 'Langsung',
    status: 'Selesai',
    rating: 4,
    ulasan: 'Pelayanan cepat dan proses verifikasi persyaratan tidak berbelit-belit.'
  },
  {
    id: 24,
    kode: 'REG-2025-024',
    nama: 'L***a',
    pekerjaan: 'Pemerhati Kebijakan Daerah',
    dokumen: 'Ringkasan Kontrak Pengadaan Konstruksi Jembatan dan Jalan Dinas PUPR',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Sedang dalam tahap konfirmasi ketersediaan berkas teknis dari PPK terkait.'
  },
  {
    id: 25,
    kode: 'REG-2025-025',
    nama: 'R***y',
    pekerjaan: 'Mahasiswa Pascasarjana',
    dokumen: 'Laporan Hasil Survei Kepuasan Masyarakat (SKM) Tingkat Kabupaten 2024',
    jalur: 'Langsung',
    status: 'Sedang Diproses',
    rating: 5,
    ulasan: 'Permohonan sudah diterima di meja desk dan sedang dalam tahap rekapitulasi.'
  }
]

// Cuplikan Ulasan Running Ticker (12 sampel ulasan)
const sampleReviews = pemohonList.slice(0, 12)

// Computed Filter Pemohon
const filteredPemohonList = computed(() => {
  return pemohonList.filter(item => {
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