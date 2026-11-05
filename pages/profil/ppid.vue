<template>
  <div class="profil-ppid-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Breadcrumbs -->
      <div class="mb-5">
        <Breadcrumbs :breadcrumbs="breadcrumbItems" />
      </div>

      <div v-if="!loading && profile" class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        <!-- Hero Banner Section -->
        <div class="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white p-8 md:p-12 lg:p-14 overflow-hidden">
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          </div>
          
          <div class="relative z-10 max-w-4xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase mb-4 text-cyan-200">
              <i class="fas fa-shield-alt"></i> Profil Resmi Badan Publik
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight">
              Profil PPID & Pemerintah Kabupaten Sinjai
            </h1>
            <p class="text-base sm:text-lg md:text-xl font-light text-blue-100 leading-relaxed max-w-3xl">
              Pejabat Pengelola Informasi dan Dokumentasi (PPID) Utama serta Informasi Resmi Alamat Lengkap, Tugas, Fungsi, dan Ruang Lingkup Kegiatan Pemerintah Kabupaten Sinjai, Provinsi Sulawesi Selatan.
            </p>
            
            <!-- Quick Anchor Buttons -->
            <div class="flex flex-wrap gap-2.5 mt-6 pt-6 border-t border-white/15 text-xs sm:text-sm">
              <a href="#profil-ppid" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-medium flex items-center gap-2">
                <i class="fas fa-info-circle text-cyan-300"></i> Profil PPID
              </a>
              <a href="#alamat-pemkab" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-medium flex items-center gap-2">
                <i class="fas fa-map-marked-alt text-amber-300"></i> Alamat Lengkap Pemkab
              </a>
              <a href="#tupoksi-pemkab" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-medium flex items-center gap-2">
                <i class="fas fa-balance-scale text-emerald-300"></i> Tugas & Fungsi
              </a>
              <a href="#ruang-lingkup" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-medium flex items-center gap-2">
                <i class="fas fa-layer-group text-purple-300"></i> Ruang Lingkup Kegiatan
              </a>
            </div>
          </div>
        </div>

        <!-- Sticky Filter Tabs Bar -->
        <div class="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
          <div class="flex items-center gap-2 text-xs sm:text-sm font-semibold whitespace-nowrap">
            <button
              v-for="t in filterTabs"
              :key="t.id"
              @click="activeFilter = t.id"
              :class="[
                'px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2',
                activeFilter === t.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              ]"
            >
              <i :class="t.icon"></i>
              <span>{{ t.label }}</span>
            </button>
          </div>
          
          <button
            @click="handlePrint"
            class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0"
            title="Cetak atau Simpan PDF Halaman Ini"
          >
            <i class="fas fa-print text-blue-600"></i>
            <span>Cetak / PDF</span>
          </button>
        </div>

        <!-- =================================================================== -->
        <!-- 1. SECTION: PROFIL PPID (Visi, Misi, Struktur Organisasi) -->
        <!-- =================================================================== -->
        <div v-show="activeFilter === 'all' || activeFilter === 'ppid'" id="profil-ppid" class="transition-all duration-300">
          
          <!-- Section Title Header -->
          <div class="px-8 pt-10 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">01</span>
              <div>
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Visi, Misi & Struktur PPID</h2>
                <p class="text-xs sm:text-sm text-slate-500">Komitmen Keterbukaan Informasi Publik di Lingkungan Pemerintah Kabupaten Sinjai</p>
              </div>
            </div>
          </div>

          <!-- Visi Section -->
          <div class="p-8 md:p-12">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg text-white">
                <i class="fas fa-eye text-2xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-800">Visi PPID</h3>
                <div class="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mt-2 rounded-full"></div>
              </div>
            </div>
            <div class="md:ml-18">
              <p class="text-gray-700 leading-relaxed text-base sm:text-lg bg-blue-50/80 p-6 rounded-2xl border-l-4 border-blue-500 shadow-sm font-medium">
                "{{ profile.vision }}"
              </p>
            </div>
          </div>

          <!-- Misi Section -->
          <div v-if="profile.mission && profile.mission.length > 0" class="p-8 md:p-12 border-t border-gray-100 bg-gradient-to-b from-white to-slate-50/40">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg text-white">
                <i class="fas fa-bullseye text-2xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-800">Misi PPID</h3>
                <div class="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mt-2 rounded-full"></div>
              </div>
            </div>
            <div class="md:ml-18">
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li
                  v-for="(mission, index) in profile.mission"
                  :key="index"
                  class="flex items-start p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div class="flex-shrink-0 mr-4">
                    <div class="w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center shadow-md font-bold text-sm">
                      {{ index + 1 }}
                    </div>
                  </div>
                  <span class="text-gray-700 leading-relaxed text-sm sm:text-base pt-1 font-medium">{{ mission }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Struktur Organisasi PPID -->
          <div class="p-8 md:p-12 border-t border-gray-100 bg-slate-50">
            <div class="text-center mb-10">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4 text-white">
                <i class="fas fa-sitemap text-2xl"></i>
              </div>
              <h3 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Struktur Organisasi PPID</h3>
              <p class="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Bagan tata hubungan kerja dan hierarki Pejabat Pengelola Informasi dan Dokumentasi Kabupaten Sinjai</p>
            </div>
            
            <div v-if="profile.structure_image" class="flex justify-center">
              <div class="relative group max-w-4xl w-full">
                <div class="absolute -inset-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img :src="profile.structure_image" alt="Struktur Organisasi PPID" class="relative w-full h-auto rounded-2xl shadow-xl border-4 border-white transform transition-transform duration-500 group-hover:scale-[1.01]" />
              </div>
            </div>
            <div v-else class="max-w-4xl mx-auto">
              <div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 text-center py-12">
                <i class="fas fa-project-diagram text-4xl text-blue-400 mb-4"></i>
                <h4 class="text-xl font-bold text-gray-700 mb-2">Struktur Organisasi</h4>
                <p class="text-gray-500 text-sm">Gambar struktur organisasi belum diunggah.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- 2. SECTION: ALAMAT LENGKAP PEMERINTAH KABUPATEN SINJAI -->
        <!-- =================================================================== -->
        <div v-show="activeFilter === 'all' || activeFilter === 'alamat'" id="alamat-pemkab" class="border-t border-slate-200 transition-all duration-300">
          
          <div class="px-8 pt-10 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">02</span>
              <div>
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Alamat Lengkap Pemerintah Kabupaten Sinjai</h2>
                <p class="text-xs sm:text-sm text-slate-500">Pusat Pemerintahan Daerah, Layanan Sekretariat Daerah, PPID Utama, dan Direktori Seluruh Satuan Kerja (OPD)</p>
              </div>
            </div>
          </div>

          <div class="p-8 md:p-12 space-y-8">
            
            <!-- Cards Grid: Pusat Pemerintahan & PPID Utama -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <!-- Card 1: Kantor Bupati & Sekretariat Daerah -->
              <div class="bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-7 border-2 border-amber-200/80 shadow-md flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                        <i class="fas fa-landmark text-xl"></i>
                      </div>
                      <div>
                        <span class="text-[11px] font-bold tracking-wider text-amber-700 uppercase">Pusat Pemerintahan Daerah</span>
                        <h3 class="text-xl font-bold text-slate-800">Kantor Bupati & Sekretariat Daerah</h3>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">Pusat</span>
                  </div>

                  <div class="space-y-4 text-sm text-slate-700 mb-6">
                    <div class="flex items-start gap-3">
                      <i class="fas fa-map-marker-alt text-amber-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Alamat Kantor Bupati Sinjai:</strong>
                        <p class="font-semibold text-slate-800 leading-snug">
                          Kompleks Perkantoran Pemerintah Daerah Kabupaten Sinjai, Jl. Tanassang, Kelurahan Alehanuae, Kecamatan Sinjai Utara, Kabupaten Sinjai, Provinsi Sulawesi Selatan, Kode Pos 92615.
                        </p>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fas fa-phone-alt text-amber-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Telepon / Fax Sentral:</strong>
                        <p class="font-medium text-slate-800">(0482) 21111 / (0482) 21001</p>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fas fa-envelope text-amber-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Email Resmi Pemkab Sinjai:</strong>
                        <a href="mailto:info@sinjaikab.go.id" class="text-blue-600 hover:underline font-semibold">info@sinjaikab.go.id</a> / 
                        <a href="mailto:humas@sinjaikab.go.id" class="text-blue-600 hover:underline font-semibold">humas@sinjaikab.go.id</a>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fas fa-globe text-amber-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Website Portal Resmi:</strong>
                        <a href="https://sinjaikab.go.id" target="_blank" rel="noopener" class="text-blue-600 hover:underline font-bold">
                          https://sinjaikab.go.id <i class="fas fa-external-link-alt text-[10px] ml-1"></i>
                        </a>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fas fa-clock text-amber-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Jam Kerja Pelayanan:</strong>
                        <p class="font-medium text-slate-800">Senin - Kamis: 07.30 - 16.00 WITA | Jumat: 07.30 - 16.30 WITA</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-amber-100 flex items-center justify-between">
                  <span class="text-xs text-slate-500 font-medium"><i class="fas fa-city mr-1 text-amber-500"></i> Ibukota: Sinjai Utara</span>
                  <a href="https://maps.google.com/?q=Kantor+Bupati+Sinjai" target="_blank" rel="noopener" class="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1">
                    Buka Peta Kantor Bupati <i class="fas fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
              </div>

              <!-- Card 2: PPID Utama (Diskominfo Sinjai) -->
              <div class="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-7 border-2 border-blue-200/80 shadow-md flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4 pb-3 border-b border-blue-100">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <i class="fas fa-headset text-xl"></i>
                      </div>
                      <div>
                        <span class="text-[11px] font-bold tracking-wider text-blue-700 uppercase">Pelayanan Informasi Publik</span>
                        <h3 class="text-xl font-bold text-slate-800">Sekretariat PPID Utama (Diskominfo)</h3>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">Layanan KIP</span>
                  </div>

                  <div class="space-y-4 text-sm text-slate-700 mb-6">
                    <div class="flex items-start gap-3">
                      <i class="fas fa-map-marker-alt text-blue-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Alamat Meja Layanan PPID Utama:</strong>
                        <p class="font-semibold text-slate-800 leading-snug">
                          Gedung Dinas Komunikasi Informatika dan Persandian Kab. Sinjai, Jl. Persatuan Raya No. 101, Kelurahan Biringere, Kec. Sinjai Utara, Kabupaten Sinjai, Sulawesi Selatan 92611.
                        </p>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fab fa-whatsapp text-blue-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Kontak WhatsApp & Pengaduan:</strong>
                        <a :href="`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`" target="_blank" rel="noopener" class="font-bold text-slate-900 hover:text-green-600">
                          {{ profile.phone || '085156878911' }} <i class="fab fa-whatsapp text-green-500 ml-1"></i>
                        </a>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fas fa-envelope text-blue-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Email Khusus PPID:</strong>
                        <a :href="`mailto:${profile.email}`" class="text-blue-600 hover:underline font-semibold">{{ profile.email || 'ppidkabsinjai@gmail.com' }}</a>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fas fa-globe text-blue-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">Portal Website PPID:</strong>
                        <a href="https://ppid.sinjaikab.go.id" class="text-blue-600 hover:underline font-bold">
                          https://ppid.sinjaikab.go.id <i class="fas fa-external-link-alt text-[10px] ml-1"></i>
                        </a>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <i class="fas fa-user-shield text-blue-600 mt-1 shrink-0 text-base"></i>
                      <div>
                        <strong class="text-slate-900 block text-xs uppercase tracking-wide text-slate-500">PPID Pelaksana:</strong>
                        <p class="font-medium text-slate-800">Tersedia pada setiap Dinas, Badan, Kantor, RSUD, dan Kecamatan lingkup Pemkab Sinjai.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-blue-100 flex items-center justify-between">
                  <span class="text-xs text-slate-500 font-medium"><i class="fas fa-check-circle mr-1 text-emerald-500"></i> Terverifikasi Komisi Informasi</span>
                  <a href="#lokasi-peta" class="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1">
                    Lihat Peta Lokasi <i class="fas fa-arrow-down text-[10px]"></i>
                  </a>
                </div>
              </div>

            </div>

            <!-- Direktori Alamat Seluruh Satuan Kerja (OPD) Banner -->
            <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex items-start gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-2xl text-cyan-300">
                  <i class="fas fa-address-book"></i>
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-bold mb-1">Direktori Alamat Lengkap Setiap Satuan Kerja (OPD) Lingkup Pemkab Sinjai</h3>
                  <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Sesuai Indikator Monev KIP 3.6.6, masyarakat dapat mengakses daftar alamat lengkap, kontak telepon, website resmi, dan tugas pokok seluruh Dinas, Badan, Kantor, dan Kecamatan di Kabupaten Sinjai.
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-3 shrink-0">
                <NuxtLink
                  to="/profil/tentang-opd"
                  class="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                  <i class="fas fa-building"></i>
                  <span>Alamat Lengkap OPD</span>
                </NuxtLink>
                <NuxtLink
                  to="/profil/unit-lokal"
                  class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all flex items-center gap-2"
                >
                  <i class="fas fa-map-marked-alt"></i>
                  <span>Peta Unit Lokal</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Peta Lokasi Google Maps Embed -->
            <div id="lokasi-peta" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold">
                    <i class="fas fa-map-marked-alt"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-800">Peta Lokasi Kantor Pelayanan</h3>
                    <p class="text-xs text-slate-500">Navigasi langsung menuju Pusat Pemerintahan dan Meja Layanan Informasi Publik Sinjai</p>
                  </div>
                </div>
                <span class="text-xs font-semibold text-slate-400">Google Maps Terintegrasi</span>
              </div>

              <div v-if="profile.maps_url" class="relative overflow-hidden rounded-2xl border border-slate-200 h-[380px] shadow-inner">
                <iframe
                  :src="profile.maps_url"
                  class="absolute top-0 left-0 w-full h-full border-0"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Kantor Pemerintah Kabupaten Sinjai"
                ></iframe>
              </div>
            </div>

          </div>
        </div>

        <!-- =================================================================== -->
        <!-- 3. SECTION: TUGAS DAN FUNGSI PEMERINTAH KABUPATEN SINJAI -->
        <!-- =================================================================== -->
        <div v-show="activeFilter === 'all' || activeFilter === 'tupoksi'" id="tupoksi-pemkab" class="border-t border-slate-200 transition-all duration-300">
          
          <div class="px-8 pt-10 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">03</span>
              <div>
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Tugas dan Fungsi Pemerintah Kabupaten Sinjai</h2>
                <p class="text-xs sm:text-sm text-slate-500">Landasan Hukum, Kedudukan Tata Kelola, Tugas Pokok, dan 6 Fungsi Utama Pemerintahan Daerah</p>
              </div>
            </div>
          </div>

          <div class="p-8 md:p-12 space-y-8">
            
            <!-- Dasar Hukum & Kedudukan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-6 rounded-2xl bg-blue-50/80 border border-blue-200">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <i class="fas fa-gavel"></i>
                  </div>
                  <h3 class="text-lg font-bold text-slate-900">Landasan Hukum Penyelenggaraan</h3>
                </div>
                <ul class="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li class="flex items-start gap-2">
                    <i class="fas fa-check text-blue-600 mt-1 shrink-0 text-xs"></i>
                    <span><strong>Undang-Undang Nomor 23 Tahun 2014</strong> tentang Pemerintahan Daerah (beserta perubahan dan peraturan pelaksanaannya).</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fas fa-check text-blue-600 mt-1 shrink-0 text-xs"></i>
                    <span><strong>Undang-Undang Nomor 14 Tahun 2008</strong> tentang Keterbukaan Informasi Publik.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fas fa-check text-blue-600 mt-1 shrink-0 text-xs"></i>
                    <span><strong>Peraturan Daerah Kabupaten Sinjai</strong> tentang Pembentukan dan Susunan Perangkat Daerah Kabupaten Sinjai.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fas fa-check text-blue-600 mt-1 shrink-0 text-xs"></i>
                    <span><strong>Peraturan Bupati Sinjai</strong> tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi, serta Tata Kerja Perangkat Daerah di Lingkungan Pemkab Sinjai.</span>
                  </li>
                </ul>
              </div>

              <div class="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                  <h3 class="text-lg font-bold text-slate-900">Kedudukan Pemerintahan Daerah</h3>
                </div>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  Pemerintah Kabupaten Sinjai merupakan unsur penyelenggara Pemerintahan Daerah otonom yang dipimpin oleh <strong>Bupati Sinjai</strong> bersama <strong>Wakil Bupati Sinjai</strong>, dibantu oleh Perangkat Daerah (Sekretariat Daerah, Sekretariat DPRD, Inspektorat, Dinas Daerah, Badan Daerah, dan Kecamatan).
                </p>
                <div class="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs text-slate-700 font-medium">
                  <i class="fas fa-info-circle text-emerald-600 mr-1"></i> Berkedudukan di Kabupaten Sinjai, Provinsi Sulawesi Selatan, dan bertanggung jawab kepada masyarakat melalui Dewan Perwakilan Rakyat Daerah (DPRD) Kabupaten Sinjai.
                </div>
              </div>
            </div>

            <!-- Tugas Pokok Highlight Box -->
            <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-lg">
              <div class="flex items-center gap-3 mb-4 text-cyan-300 font-bold text-xs tracking-wider uppercase">
                <i class="fas fa-star"></i> Tugas Pokok Pemerintah Kabupaten Sinjai
              </div>
              <h3 class="text-xl sm:text-2xl font-bold mb-4 leading-snug">
                Menyelenggarakan Urusan Pemerintahan Daerah Otonom, Tugas Pembantuan, dan Urusan Pemerintahan Umum
              </h3>
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed max-w-4xl font-light">
                Pemerintah Kabupaten Sinjai mempunyai tugas pokok memimpin, mengatur, dan mengkoordinasikan pelaksanaan urusan pemerintahan konkuren yang diserahkan kepada daerah otonom Kabupaten Sinjai, melaksanakan tugas pembantuan dari Pemerintah Pusat dan Pemerintah Provinsi Sulawesi Selatan, serta melaksanakan urusan pemerintahan umum guna mempercepat perwujudan kesejahteraan umum melalui peningkatan pelayanan, pemberdayaan, dan peran serta masyarakat Sinjai.
              </p>
            </div>

            <!-- 6 Fungsi Utama Pemkab Sinjai -->
            <div>
              <div class="text-center mb-8">
                <span class="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Fungsi Utama</span>
                <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">6 Fungsi Pokok Pemerintah Kabupaten Sinjai</h3>
                <p class="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-1">Dalam rangka mewujudkan tata kelola pemerintahan yang bersih, efektif, demokratis, dan terpercaya</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- Fungsi 1 -->
                <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4 font-bold">
                    1
                  </div>
                  <h4 class="font-bold text-slate-900 text-base mb-2">Perumusan & Penetapan Kebijakan Daerah</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Menyusun, merumuskan, dan menetapkan Peraturan Daerah (Perda) bersama DPRD serta Peraturan Bupati (Perbup) dan Keputusan Bupati sebagai payung hukum pembangunan dan pelayanan publik di Kabupaten Sinjai.
                  </p>
                </div>

                <!-- Fungsi 2 -->
                <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-4 font-bold">
                    2
                  </div>
                  <h4 class="font-bold text-slate-900 text-base mb-2">Perencanaan & Pelaksanaan Pembangunan Daerah</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Menyusun dokumen perencanaan jangka panjang (RPJPD), jangka menengah (RPJMD), dan tahunan (RKPD) serta mengeksekusi program pembangunan infrastruktur, ekonomi, dan sosial terpadu.
                  </p>
                </div>

                <!-- Fungsi 3 -->
                <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4 font-bold">
                    3
                  </div>
                  <h4 class="font-bold text-slate-900 text-base mb-2">Penyelenggaraan Pelayanan Publik Prima</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Menyelenggarakan pelayanan administrasi kependudukan, perizinan berusaha melalui Mal Pelayanan Publik (MPP), kesehatan, pendidikan, dan layanan dasar yang mudah, cepat, dan bebas pungli.
                  </p>
                </div>

                <!-- Fungsi 4 -->
                <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4 font-bold">
                    4
                  </div>
                  <h4 class="font-bold text-slate-900 text-base mb-2">Pembinaan, Pengawasan & Pengendalian Intern</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Melaksanakan fungsi pengawasan internal melalui Inspektorat Daerah terhadap kinerja dan pengelolaan keuangan daerah berbasis akuntabilitas, sistem pengendalian intern (SPIP), serta reformasi birokrasi.
                  </p>
                </div>

                <!-- Fungsi 5 -->
                <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mb-4 font-bold">
                    5
                  </div>
                  <h4 class="font-bold text-slate-900 text-base mb-2">Pemberdayaan Masyarakat & Ekonomi Daerah</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Memberdayakan potensi masyarakat pedesaan dan kelurahan, penguatan UMKM, modernisasi pertanian, peternakan, perikanan kelautan, dan pariwisata guna meningkatkan kesejahteraan warga Sinjai.
                  </p>
                </div>

                <!-- Fungsi 6 -->
                <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div class="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-xl mb-4 font-bold">
                    6
                  </div>
                  <h4 class="font-bold text-slate-900 text-base mb-2">Ketenteraman, Ketertiban Umum & Linmas</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Memelihara ketenteraman dan ketertiban umum masyarakat, penegakan Peraturan Daerah oleh Satpol PP, mitigasi bencana daerah oleh BPBD, serta perlindungan masyarakat dari potensi bahaya bencana.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- =================================================================== -->
        <!-- 4. SECTION: RUANG LINGKUP KEGIATAN PEMERINTAH KABUPATEN SINJAI -->
        <!-- =================================================================== -->
        <div v-show="activeFilter === 'all' || activeFilter === 'ruang_lingkup'" id="ruang-lingkup" class="border-t border-slate-200 transition-all duration-300">
          
          <div class="px-8 pt-10 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">04</span>
              <div>
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Ruang Lingkup Kegiatan Pemerintah Kabupaten Sinjai</h2>
                <p class="text-xs sm:text-sm text-slate-500">Kluster Urusan Pemerintahan Wajib, Urusan Pilihan Sektor Unggulan Daerah, dan Urusan Pemerintahan Umum dalam RPJMD & RKPD</p>
              </div>
            </div>
          </div>

          <div class="p-8 md:p-12 space-y-8">
            
            <!-- Kluster 1: Urusan Wajib Pelayanan Dasar (SPM) -->
            <div class="bg-white rounded-3xl p-7 border-2 border-blue-200/80 shadow-md">
              <div class="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
                  <i class="fas fa-heartbeat"></i>
                </div>
                <div>
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">Kluster 1 - Prioritas Mutlak Standar Pelayanan Minimal (SPM)</span>
                  <h3 class="text-xl font-bold text-slate-900">Urusan Pemerintahan Wajib Pelayanan Dasar</h3>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 class="font-bold text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                    <i class="fas fa-graduation-cap text-blue-600"></i> 1. Pendidikan
                  </h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Pengelolaan PAUD, pendidikan dasar (SD & SMP), beasiswa berprestasi/kurang mampu, peningkatan sarana TIK sekolah, dan pembinaan tenaga kependidikan.
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 class="font-bold text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                    <i class="fas fa-hospital text-blue-600"></i> 2. Kesehatan
                  </h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Layanan RSUD Sinjai & RSUD Pratama, 16 Puskesmas di 9 kecamatan, jaminan kesehatan gratis (UHC), penanganan stunting, dan layanan ambulans PSC 119.
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 class="font-bold text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                    <i class="fas fa-road text-blue-600"></i> 3. Pekerjaan Umum & Penataan Ruang
                  </h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Pembangunan & pemeliharaan jalan/jembatan kabupaten, jaringan irigasi pertanian, sistem drainase kota, air minum, dan penataan tata ruang wilayah (RTRW).
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 class="font-bold text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                    <i class="fas fa-home text-blue-600"></i> 4. Perumahan Rakyat & Permukiman
                  </h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Bantuan renovasi Rumah Tidak Layak Huni (RTLH), pencegahan kawasan permukiman kumuh, dan penyediaan PSU (prasarana, sarana, utilitas umum).
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 class="font-bold text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                    <i class="fas fa-shield-alt text-blue-600"></i> 5. Ketenteraman, Ketertiban Umum & Linmas
                  </h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Penegakan Perda oleh Satpol PP, mitigasi dan posko tanggap bencana BPBD, kesiapsiagaan armada pemadam kebakaran, serta perlindungan masyarakat.
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 class="font-bold text-blue-900 text-sm mb-1.5 flex items-center gap-2">
                    <i class="fas fa-hands-helping text-blue-600"></i> 6. Sosial
                  </h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Pemberian bantuan sosial terpadu, perlindungan lansia dan penyandang disabilitas, rehabilitasi sosial, dan tanggap darurat logistik kebencanaan.
                  </p>
                </div>

              </div>
            </div>

            <!-- Kluster 2: Urusan Wajib Non-Pelayanan Dasar (18 Sektor) -->
            <div class="bg-white rounded-3xl p-7 border-2 border-emerald-200/80 shadow-md">
              <div class="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xl shadow-md">
                  <i class="fas fa-cogs"></i>
                </div>
                <div>
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">Kluster 2 - Penunjang Administrasi & Kehidupan Publik</span>
                  <h3 class="text-xl font-bold text-slate-900">Urusan Pemerintahan Wajib Non-Pelayanan Dasar</h3>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-id-card text-emerald-600"></i> Administrasi Kependudukan (Disdukcapil)
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-laptop-code text-emerald-600"></i> Komunikasi, Informatika & SPBE
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-stamp text-emerald-600"></i> Penanaman Modal & Pelayanan Terpadu
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-users-cog text-emerald-600"></i> Koperasi & Usaha Mikro (UMKM)
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-leaf text-emerald-600"></i> Lingkungan Hidup & Kebersihan
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-briefcase text-emerald-600"></i> Tenaga Kerja & Transmigrasi
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-female text-emerald-600"></i> Pemberdayaan Perempuan & Anak
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-apple-alt text-emerald-600"></i> Ketahanan Pangan Daerah
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-map text-emerald-600"></i> Pertanahan Daerah
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-village text-emerald-600"></i> Pemberdayaan Masyarakat & Desa
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-bus text-emerald-600"></i> Perhubungan & Lalu Lintas
                </div>
                <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-medium text-slate-800 flex items-center gap-2">
                  <i class="fas fa-book text-emerald-600"></i> Kearsipan & Perpustakaan Daerah
                </div>
              </div>
            </div>

            <!-- Kluster 3: Urusan Pilihan (Sektor Unggulan Daerah Kabupaten Sinjai) -->
            <div class="bg-white rounded-3xl p-7 border-2 border-amber-200/80 shadow-md">
              <div class="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl shadow-md">
                  <i class="fas fa-fish"></i>
                </div>
                <div>
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Kluster 3 - Penggerak Ekonomi & Potensi Unggulan Sinjai</span>
                  <h3 class="text-xl font-bold text-slate-900">Urusan Pemerintahan Pilihan Daerah</h3>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 font-bold text-sm">
                    <i class="fas fa-ship"></i>
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm mb-1">Kelautan & Perikanan</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Pengelolaan Tempat Pelelangan Ikan (TPI) Lappa, budidaya tambak udang/ikan bandeng, dan pemberdayaan nelayan pesisir & Pulau Sembilan.
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 font-bold text-sm">
                    <i class="fas fa-seedling"></i>
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm mb-1">Pertanian & Perkebunan</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Pengembangan lada Sinjai, kopi arabika/robusta Borong, cengkeh, padi sawah, serta bantuan pupuk dan alsintan modern bagi kelompok tani.
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 font-bold text-sm">
                    <i class="fas fa-hippo"></i>
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm mb-1">Peternakan Terpadu</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Sinjai sebagai sentra sapi potong terkemuka di Sulawesi Selatan, program asuransi sapi peternak, dan pelayanan inseminasi buatan (IB).
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 font-bold text-sm">
                    <i class="fas fa-umbrella-beach"></i>
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm mb-1">Pariwisata & Industri Kreatif</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    Destinasi Hutan Mangrove Tongke-Tongke, Pantai Karampuang, Taman Purbakala Batu Pake Gojeng, Benteng Balangnipa, serta produk kuliner IKM Sinjai.
                  </p>
                </div>

              </div>
            </div>

            <!-- Kluster 4: Pemerintahan Umum & Keterbukaan Informasi Publik -->
            <div class="p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center text-xl shrink-0">
                  <i class="fas fa-bullhorn"></i>
                </div>
                <div>
                  <h4 class="font-bold text-base text-white mb-0.5">Penyelenggaraan Urusan Pemerintahan Umum & Transparansi Publik</h4>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    Pembinaan wawasan kebangsaan, koordinasi Forkopimda Kabupaten Sinjai, pemeliharaan kerukunan masyarakat, serta pelayanan hak akses publik atas informasi secara transparan melalui portal PPID.
                  </p>
                </div>
              </div>
              <NuxtLink
                to="/permohonan"
                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 transition-all shadow-md"
              >
                Permohonan Informasi <i class="fas fa-arrow-right ml-1"></i>
              </NuxtLink>
            </div>

          </div>
        </div>

      </div>

      <!-- State Jika Data Tidak Ditemukan -->
      <div v-else-if="!loading" class="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl p-12 text-center border-2 border-dashed border-blue-200 mt-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-300 to-blue-300 rounded-full mb-8 shadow-lg">
          <i class="fas fa-exclamation-circle text-4xl text-white"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Profil PPID Belum Tersedia</h2>
        <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Data profil PPID sedang disiapkan oleh administrator sistem.
        </p>
        <NuxtLink to="/" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
          <i class="fas fa-home mr-3"></i>
          Kembali ke Beranda
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

useHead({
  title: 'Profil PPID & Pemerintah Kabupaten Sinjai',
  meta: [
    {
      name: 'description',
      content: 'Profil resmi PPID, Visi Misi, Alamat Lengkap Pemerintah Kabupaten Sinjai, Tugas dan Fungsi, serta Ruang Lingkup Kegiatan Urusan Pemerintahan Daerah Kabupaten Sinjai.'
    },
    {
      property: 'og:title',
      content: 'Profil PPID & Pemerintah Kabupaten Sinjai'
    },
    {
      property: 'og:description',
      content: 'Informasi Lengkap Alamat Kantor Bupati Sinjai, Tugas & Fungsi, Ruang Lingkup Kegiatan, dan Pelayanan Informasi Publik PPID Sinjai.'
    }
  ]
})

const breadcrumbItems = [
  { title: 'Beranda', url: '/', icon: 'fas fa-home' },
  { title: 'Profil', url: '#profil', icon: 'fas fa-user-shield' },
  { title: 'PPID & Pemerintah Daerah', url: '', icon: 'fas fa-info-circle' }
]

const filterTabs = [
  { id: 'all', label: 'Semua Informasi', icon: 'fas fa-th-large' },
  { id: 'ppid', label: 'Profil PPID', icon: 'fas fa-info-circle' },
  { id: 'alamat', label: 'Alamat Pemkab Sinjai', icon: 'fas fa-map-marked-alt' },
  { id: 'tupoksi', label: 'Tugas & Fungsi', icon: 'fas fa-balance-scale' },
  { id: 'ruang_lingkup', label: 'Ruang Lingkup Kegiatan', icon: 'fas fa-layer-group' }
]

const activeFilter = ref('all')

const { data, isLoading: queryLoading, isFetching } = useQuery({
  queryKey: ['profil_ppid'],
  queryFn: async () => {
    const response = await api.get('/profil')
    return response.data
  },
  staleTime: 60000,
})

const loading = computed(() => queryLoading.value || (isFetching.value && !data.value))
useGlobalLoader(loading)

const profile = computed(() => data.value?.data || {
  vision: 'Terwujudnya pelayanan informasi yang transparan dan akuntabel untuk memenuhi hak pemohon informasi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.',
  mission: [
    'Meningkatkan pengelolaan dan pelayanan informasi yang berkualitas, benar dan bertanggung jawab.',
    'Membangun dan mengembangkan sistem penyediaan dan layanan informasi.',
    'Meningkatkan dan mengembangkan kompetensi dan kualitas SDM dalam bidang pelayanan informasi.',
    'Mewujudkan keterbukaan informasi pemerintah daerah Kabupaten Sinjai dengan proses cepat, tepat, mudah dan sederhana.'
  ],
  phone: '085156878911',
  email: 'ppidkabsinjai@gmail.com',
  address: 'Jl. Persatuan Raya No. 101 Kec. Sinjai Utara, Kabupaten Sinjai, Sulawesi Selatan 92611',
  maps_url: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1986.9414008857307!2d120.2542478!3d-5.1225809!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbc25decc193715%3A0xd7b2dd45eb907b0a!2sDinas%20Komunikasi%20Informatika%20dan%20Persandian%20Kabupaten%20Sinjai!5e0!3m2!1sid!2sid!4v1770697018224!5m2!1sid!2sid'
})

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<style scoped>
@media print {
  .sticky, button, .border-t.border-white\/15, .profil-ppid-page .container > .mb-5 {
    display: none !important;
  }
  .profil-ppid-page {
    background: #fff !important;
    padding: 0 !important;
  }
  .shadow-xl, .shadow-2xl, .shadow-md, .shadow-sm {
    box-shadow: none !important;
  }
  .border {
    border-color: #e2e8f0 !important;
  }
}
</style>
