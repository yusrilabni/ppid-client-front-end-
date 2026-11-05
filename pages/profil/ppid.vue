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
              Pejabat Pengelola Informasi dan Dokumentasi (PPID) Utama serta Informasi Resmi Alamat Lengkap, Tugas Pokok, Fungsi, Ruang Lingkup Kegiatan, dan Landasan Hukum Penyelenggaraan Pemerintah Kabupaten Sinjai, Provinsi Sulawesi Selatan.
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
          
          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink
              to="/regulasi"
              class="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-all"
            >
              <i class="fas fa-book text-emerald-600"></i>
              <span>Regulasi Daerah</span>
            </NuxtLink>
            <button
              @click="handlePrint"
              class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              title="Cetak atau Simpan PDF Halaman Ini"
            >
              <i class="fas fa-print text-blue-600"></i>
              <span>Cetak / PDF</span>
            </button>
          </div>
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
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">03</span>
                <div>
                  <h2 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Tugas dan Fungsi Pemerintah Kabupaten Sinjai</h2>
                  <p class="text-xs sm:text-sm text-slate-500">Landasan Hukum, Kedudukan Tata Kelola, Tugas Pokok, dan 6 Fungsi Utama Pemerintahan Daerah</p>
                </div>
              </div>

              <!-- Tombol Pengarah Langsung ke Regulasi / JDIH -->
              <div class="flex items-center gap-2">
                <NuxtLink
                  to="/regulasi"
                  class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <i class="fas fa-file-contract"></i>
                  <span>Dokumen Regulasi</span>
                </NuxtLink>
                <a
                  href="https://jdih.sinjaikab.go.id"
                  target="_blank"
                  rel="noopener"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all flex items-center gap-1.5"
                >
                  <i class="fas fa-external-link-alt text-emerald-600"></i>
                  <span>JDIH Sinjai</span>
                </a>
              </div>
            </div>
          </div>

          <div class="p-8 md:p-12 space-y-8">
            
            <!-- Dasar Hukum & Kedudukan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Card Landasan Hukum -->
              <div class="p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4 pb-3 border-b border-blue-200">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <i class="fas fa-gavel"></i>
                      </div>
                      <h3 class="text-lg font-bold text-slate-900">Landasan Hukum Penyelenggaraan</h3>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full bg-blue-200/80 text-blue-900 text-[10px] font-black uppercase">Regulasi Resmi</span>
                  </div>

                  <ul class="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                    <li class="flex items-start gap-2.5">
                      <i class="fas fa-check-circle text-blue-600 mt-0.5 shrink-0 text-sm"></i>
                      <div>
                        <strong>Peraturan Daerah Kabupaten Sinjai Nomor 5 Tahun 2016</strong> jo. <strong>Perda No. 25 Tahun 2019</strong> tentang Pembentukan dan Susunan Perangkat Daerah Kabupaten Sinjai.
                        <a href="https://peraturan.bpk.go.id/Details/66662/perda-kab-sinjai-no-5-tahun-2016" target="_blank" rel="noopener" class="text-blue-600 hover:underline block text-[11px] font-bold mt-0.5">
                          Buka Salinan Perda No. 5/2016 (JDIH BPK) <i class="fas fa-external-link-alt text-[9px]"></i>
                        </a>
                      </div>
                    </li>
                    <li class="flex items-start gap-2.5">
                      <i class="fas fa-check-circle text-blue-600 mt-0.5 shrink-0 text-sm"></i>
                      <div>
                        <strong>Peraturan Bupati Sinjai Nomor 7 Tahun 2023</strong> tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi Serta Tata Kerja Sekretariat Daerah Kabupaten Sinjai.
                        <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-blue-600 hover:underline block text-[11px] font-bold mt-0.5">
                          Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[9px]"></i>
                        </a>
                      </div>
                    </li>
                    <li class="flex items-start gap-2.5">
                      <i class="fas fa-check-circle text-blue-600 mt-0.5 shrink-0 text-sm"></i>
                      <div>
                        <strong>Peraturan Bupati Sinjai Nomor 15 Tahun 2020</strong> tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi, Serta Tata Kerja Inspektorat Daerah Kabupaten Sinjai.
                        <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-blue-600 hover:underline block text-[11px] font-bold mt-0.5">
                          Buka Salinan Perbup No. 15/2020 <i class="fas fa-external-link-alt text-[9px]"></i>
                        </a>
                      </div>
                    </li>
                    <li class="flex items-start gap-2.5">
                      <i class="fas fa-check-circle text-blue-600 mt-0.5 shrink-0 text-sm"></i>
                      <div>
                        <strong>Undang-Undang Nomor 23 Tahun 2014</strong> tentang Pemerintahan Daerah (Pasal 65 Tugas Kepala Daerah & Pasal 208 Perangkat Daerah).
                        <a href="https://peraturan.bpk.go.id/Details/38685/uu-no-23-tahun-2014" target="_blank" rel="noopener" class="text-blue-600 hover:underline block text-[11px] font-bold mt-0.5">
                          Buka UU No. 23/2014 <i class="fas fa-external-link-alt text-[9px]"></i>
                        </a>
                      </div>
                    </li>
                    <li class="flex items-start gap-2.5">
                      <i class="fas fa-check-circle text-blue-600 mt-0.5 shrink-0 text-sm"></i>
                      <div>
                        <strong>Undang-Undang Nomor 14 Tahun 2008</strong> tentang Keterbukaan Informasi Publik (UU KIP).
                        <NuxtLink to="/standar-layanan/dasar-hukum" class="text-blue-600 hover:underline block text-[11px] font-bold mt-0.5">
                          Buka Dasar Hukum KIP <i class="fas fa-arrow-right text-[9px]"></i>
                        </NuxtLink>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="mt-4 pt-3 border-t border-blue-200 flex items-center justify-between text-xs">
                  <span class="text-slate-500 font-medium">JDIH & Basis Hukum Resmi</span>
                  <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-blue-700 hover:underline font-bold flex items-center gap-1">
                    Portal JDIH Sinjai <i class="fas fa-external-link-alt text-[10px]"></i>
                  </a>
                </div>
              </div>

              <!-- Card Kedudukan Pemerintahan Daerah -->
              <div class="p-6 rounded-3xl bg-emerald-50/80 border-2 border-emerald-200 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4 pb-3 border-b border-emerald-200">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <i class="fas fa-shield-alt"></i>
                      </div>
                      <h3 class="text-lg font-bold text-slate-900">Kedudukan Pemerintahan Daerah</h3>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-black uppercase">Kedudukan</span>
                  </div>

                  <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                    Pemerintah Kabupaten Sinjai merupakan unsur penyelenggara Pemerintahan Daerah otonom yang dipimpin oleh <strong>Bupati Sinjai</strong> bersama <strong>Wakil Bupati Sinjai</strong>, dibantu oleh Perangkat Daerah (Sekretariat Daerah, Sekretariat DPRD, Inspektorat Daerah, 18 Dinas Daerah, 4 Badan Daerah, RSUD, dan 9 Kecamatan).
                  </p>
                  <div class="p-4 bg-white/95 rounded-2xl border border-emerald-200 text-xs text-slate-700 font-medium space-y-2 shadow-sm">
                    <div class="flex items-center gap-2 text-emerald-800 font-bold">
                      <i class="fas fa-balance-scale"></i>
                      <span>Payung Regulasi Daerah: Perda Sinjai No. 5/2016 jo. UU 23/2014 Ps. 208</span>
                    </div>
                    <p class="text-slate-600 text-[11px] leading-relaxed">
                      Kepala daerah dan DPRD berkedudukan sebagai mitra sejajar yang mempunyai fungsi yang berbeda dalam penyelenggaraan pemerintahan daerah sesuai asas desentralisasi dan tugas pembantuan.
                    </p>
                    <div class="pt-1">
                      <a href="https://peraturan.bpk.go.id/Details/66662/perda-kab-sinjai-no-5-tahun-2016" target="_blank" rel="noopener" class="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 text-[11px]">
                        <span>Buka Perda No. 5/2016 tentang Perangkat Daerah</span>
                        <i class="fas fa-external-link-alt text-[9px]"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between text-xs">
                  <span class="text-slate-500 font-medium">Wilayah: Sulawesi Selatan</span>
                  <NuxtLink to="/profil/pejabat-daerah" class="text-emerald-700 hover:underline font-bold flex items-center gap-1">
                    Profil Pejabat Daerah <i class="fas fa-chevron-right text-[10px]"></i>
                  </NuxtLink>
                </div>
              </div>

            </div>

            <!-- Tugas Pokok Highlight Box with Dedicated Landasan Hukum -->
            <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div class="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-white/10">
                <div class="flex items-center gap-2 text-cyan-300 font-extrabold text-xs tracking-wider uppercase">
                  <i class="fas fa-star text-amber-300"></i> Tugas Pokok Pemerintah Kabupaten Sinjai
                </div>
                <!-- Landasan Hukum Badge & Link -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-[11px] font-bold">
                    <i class="fas fa-balance-scale mr-1"></i> Perbup Sinjai No. 7/2023 & UU 23/2014 Ps. 65
                  </span>
                  <a
                    href="https://peraturan.bpk.go.id/Details/38685/uu-no-23-tahun-2014"
                    target="_blank"
                    rel="noopener"
                    class="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all"
                  >
                    Buka UU No. 23/2014 <i class="fas fa-external-link-alt text-[8px] ml-1"></i>
                  </a>
                  <a
                    href="https://jdih.sinjaikab.go.id"
                    target="_blank"
                    rel="noopener"
                    class="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold transition-all"
                  >
                    JDIH Sinjai <i class="fas fa-external-link-alt text-[8px] ml-1"></i>
                  </a>
                </div>
              </div>

              <h3 class="text-xl sm:text-2xl font-bold mb-4 leading-snug">
                Menyelenggarakan Urusan Pemerintahan Daerah Otonom, Tugas Pembantuan, dan Urusan Pemerintahan Umum
              </h3>
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed max-w-4xl font-light">
                Pemerintah Kabupaten Sinjai mempunyai tugas pokok memimpin, mengatur, dan mengkoordinasikan pelaksanaan urusan pemerintahan konkuren yang diserahkan kepada daerah otonom Kabupaten Sinjai, melaksanakan tugas pembantuan dari Pemerintah Pusat dan Pemerintah Provinsi Sulawesi Selatan, serta melaksanakan urusan pemerintahan umum guna mempercepat perwujudan kesejahteraan umum melalui peningkatan pelayanan, pemberdayaan, dan peran serta masyarakat Sinjai.
              </p>
            </div>

            <!-- 6 Fungsi Utama Pemkab Sinjai with Dedicated Landasan Hukum -->
            <div>
              <div class="text-center mb-8">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
                  <i class="fas fa-certificate"></i> Fungsi Utama
                </div>
                <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-800">6 Fungsi Pokok Pemerintah Kabupaten Sinjai</h3>
                <p class="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-1">Setiap fungsi berpedoman langsung pada Peraturan Daerah dan Peraturan Bupati Kabupaten Sinjai yang berlaku</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- Fungsi 1 -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                        1
                      </div>
                      <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">Perda & Perbup</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mb-2">Perumusan & Penetapan Kebijakan Daerah</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">
                      Menyusun, merumuskan, dan menetapkan Peraturan Daerah (Perda) bersama DPRD serta Peraturan Bupati (Perbup) dan Keputusan Bupati sebagai payung hukum pembangunan dan pelayanan publik di Kabupaten Sinjai.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 space-y-1.5">
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                      <i class="fas fa-balance-scale text-blue-600"></i> Regulasi Daerah Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Kab. Sinjai No. 1 Tahun 2019 (Pembentukan Produk Hukum Daerah) & Permendagri No. 120/2018
                    </div>
                    <div class="flex items-center justify-between pt-1">
                      <span class="text-[10px] text-slate-500">Pasal 65 ayat (2) UU 23/2014</span>
                      <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[11px] font-bold text-blue-600 hover:underline">
                        JDIH Sinjai →
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Fungsi 2 -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                        2
                      </div>
                      <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Perencanaan</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mb-2">Perencanaan & Pelaksanaan Pembangunan Daerah</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">
                      Menyusun dokumen perencanaan jangka panjang (RPJPD), jangka menengah (RPJMD), dan tahunan (RKPD) serta mengeksekusi program pembangunan infrastruktur, ekonomi, dan sosial terpadu.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 space-y-1.5">
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      <i class="fas fa-balance-scale text-emerald-600"></i> Regulasi Daerah Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Sinjai No. 3/2025 (RPJMD 2025–2029) & Perda Sinjai No. 2/2024 (RPJPD 2025–2045)
                    </div>
                    <div class="flex items-center justify-between pt-1">
                      <a href="https://peraturan.bpk.go.id/Details/341258/perda-kab-sinjai-no-3-tahun-2025" target="_blank" rel="noopener" class="text-[10px] text-blue-600 font-bold hover:underline">
                        Perda RPJMD (BPK) →
                      </a>
                      <a href="https://peraturan.bpk.go.id/Details/300435/perda-kab-sinjai-no-2-tahun-2024" target="_blank" rel="noopener" class="text-[10px] text-emerald-600 font-bold hover:underline">
                        Perda RPJPD →
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Fungsi 3 -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold">
                        3
                      </div>
                      <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">Pelayanan Publik</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mb-2">Penyelenggaraan Pelayanan Publik Prima</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">
                      Menyelenggarakan pelayanan administrasi kependudukan, perizinan berusaha melalui Mal Pelayanan Publik (MPP), kesehatan, pendidikan, dan layanan dasar yang mudah, cepat, dan bebas pungli.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 space-y-1.5">
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                      <i class="fas fa-balance-scale text-amber-600"></i> Regulasi Daerah Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Kab. Sinjai No. 3 Tahun 2013 (Pelayanan Publik) & Perbup Sinjai No. 21/2024 (Pelayanan Publik HAM)
                    </div>
                    <div class="flex items-center justify-between pt-1">
                      <a href="https://peraturan.bpk.go.id/Details/66655/perda-kab-sinjai-no-3-tahun-2013" target="_blank" rel="noopener" class="text-[10px] text-blue-600 font-bold hover:underline">
                        Buka Perda No. 3/2013 →
                      </a>
                      <a href="https://peraturan.bpk.go.id/Details/300437/perbup-kab-sinjai-no-21-tahun-2024" target="_blank" rel="noopener" class="text-[10px] text-amber-700 font-bold hover:underline">
                        Perbup 21/2024 →
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Fungsi 4 -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
                        4
                      </div>
                      <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">Pengawasan</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mb-2">Pembinaan, Pengawasan & Pengendalian Intern</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">
                      Melaksanakan fungsi pengawasan internal melalui Inspektorat Daerah terhadap kinerja dan pengelolaan keuangan daerah berbasis akuntabilitas, sistem pengendalian intern (SPIP), serta reformasi birokrasi.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 space-y-1.5">
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-purple-800 uppercase tracking-wide">
                      <i class="fas fa-balance-scale text-purple-600"></i> Regulasi Daerah Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perbup Sinjai No. 15 Tahun 2020 (Tupoksi Inspektorat) & PP No. 60 Tahun 2008 (SPIP)
                    </div>
                    <div class="flex items-center justify-between pt-1">
                      <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-purple-700 font-bold hover:underline">
                        Buka di JDIH Sinjai →
                      </a>
                      <NuxtLink to="/lhkpn" class="text-[10px] text-blue-600 font-bold hover:underline">
                        LHKPN Pejabat →
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <!-- Fungsi 5 -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
                        5
                      </div>
                      <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">Kesejahteraan</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mb-2">Pemberdayaan Masyarakat & Ekonomi Daerah</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">
                      Memberdayakan potensi masyarakat pedesaan dan kelurahan, penguatan UMKM, modernisasi pertanian, peternakan, perikanan kelautan, dan pariwisata guna meningkatkan kesejahteraan warga Sinjai.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 space-y-1.5">
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-rose-800 uppercase tracking-wide">
                      <i class="fas fa-balance-scale text-rose-600"></i> Regulasi Daerah Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Kab. Sinjai No. 1/2021 (BUMDes) & Perda Sinjai No. 9/2016 (Penanaman Modal Daerah)
                    </div>
                    <div class="flex items-center justify-between pt-1">
                      <a href="https://peraturan.bpk.go.id/Details/178593/perda-kab-sinjai-no-1-tahun-2021" target="_blank" rel="noopener" class="text-[10px] text-rose-700 font-bold hover:underline">
                        Perda BUMDes (BPK) →
                      </a>
                      <a href="https://peraturan.bpk.go.id/Details/66666/perda-kab-sinjai-no-9-tahun-2016" target="_blank" rel="noopener" class="text-[10px] text-blue-600 font-bold hover:underline">
                        Perda No. 9/2016 →
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Fungsi 6 -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-xl font-bold">
                        6
                      </div>
                      <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">Ketertiban</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mb-2">Ketenteraman, Ketertiban Umum & Linmas</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">
                      Memelihara ketenteraman dan ketertiban umum masyarakat, penegakan Peraturan Daerah oleh Satpol PP, mitigasi bencana daerah oleh BPBD, serta perlindungan masyarakat dari potensi bahaya bencana.
                    </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 space-y-1.5">
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-cyan-800 uppercase tracking-wide">
                      <i class="fas fa-balance-scale text-cyan-600"></i> Regulasi Daerah Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Kab. Sinjai No. 4/2015 (Ketenteraman & Ketertiban Umum) & PP No. 16 Tahun 2018 (Satpol PP)
                    </div>
                    <div class="flex items-center justify-between pt-1">
                      <a href="https://peraturan.bpk.go.id/Details/66661/perda-kab-sinjai-no-4-tahun-2015" target="_blank" rel="noopener" class="text-[10px] text-cyan-700 font-bold hover:underline">
                        Buka Perda No. 4/2015 →
                      </a>
                      <NuxtLink to="/informasi/setiap-saat" class="text-[10px] text-blue-600 font-bold hover:underline">
                        Info Darurat →
                      </NuxtLink>
                    </div>
                  </div>
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
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">04</span>
                <div>
                  <h2 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Ruang Lingkup Kegiatan Pemerintah Kabupaten Sinjai</h2>
                  <p class="text-xs sm:text-sm text-slate-500">Kluster Urusan Pemerintahan Wajib, Urusan Pilihan Sektor Unggulan Daerah, dan Urusan Pemerintahan Umum dalam RPJMD & RKPD</p>
                </div>
              </div>

              <!-- Landasan Hukum Rujukan Kluster -->
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                  <i class="fas fa-balance-scale mr-1"></i> UU 23/2014 Pasal 11-25
                </span>
                <NuxtLink
                  to="/regulasi"
                  class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-all flex items-center gap-1"
                >
                  <i class="fas fa-file-pdf text-purple-600"></i>
                  <span>Perda RPJMD/RKPD</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="p-8 md:p-12 space-y-8">
            
            <!-- Kluster 1: Urusan Wajib Pelayanan Dasar (SPM) with Landasan Hukum -->
            <div class="bg-white rounded-3xl p-7 border-2 border-blue-200/80 shadow-md">
              <div class="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
                    <i class="fas fa-heartbeat"></i>
                  </div>
                  <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">Kluster 1 - Prioritas Mutlak Standar Pelayanan Minimal (SPM)</span>
                    <h3 class="text-xl font-bold text-slate-900">Urusan Pemerintahan Wajib Pelayanan Dasar</h3>
                  </div>
                </div>

                <!-- Landasan Hukum Rujukan Kluster 1 -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                    <i class="fas fa-gavel mr-1"></i> PP No. 2/2018 & Permendagri No. 59/2021
                  </span>
                  <a
                    href="https://peraturan.bpk.go.id/Details/67634/pp-no-2-tahun-2018"
                    target="_blank"
                    rel="noopener"
                    class="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-all"
                  >
                    Buka PP SPM <i class="fas fa-external-link-alt text-[8px] ml-1"></i>
                  </a>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                <!-- 1. Pendidikan -->
                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <i class="fas fa-graduation-cap text-blue-600"></i> 1. Pendidikan
                      </h4>
                      <span class="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">Dinas Pendidikan</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Pengelolaan PAUD, pendidikan dasar (SD & SMP), beasiswa berprestasi/kurang mampu, sarana TIK sekolah, dan pembinaan tenaga kependidikan.
                    </p>
                  </div>
                  <div class="pt-2.5 border-t border-blue-100/80 space-y-1">
                    <div class="flex items-center gap-1 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                      <i class="fas fa-file-contract text-blue-600"></i> Aturan Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perbup Sinjai No. 51/2016 jo. Permendikbudristek No. 32/2022 (SPM Pendidikan)
                    </div>
                    <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
                      Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 2. Kesehatan -->
                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <i class="fas fa-hospital text-blue-600"></i> 2. Kesehatan
                      </h4>
                      <span class="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">Dinkes & RSUD</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Layanan RSUD Sinjai & Pratama, 16 Puskesmas 9 kecamatan, jaminan kesehatan gratis (UHC), stunting, dan ambulans PSC 119.
                    </p>
                  </div>
                  <div class="pt-2.5 border-t border-blue-100/80 space-y-1">
                    <div class="flex items-center gap-1 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                      <i class="fas fa-file-contract text-blue-600"></i> Aturan Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perbup Sinjai No. 33/2024 (SPM UPT Puskesmas) & Perbup No. 48/2015 (SPM RSUD Sinjai)
                    </div>
                    <a href="https://peraturan.bpk.go.id/Details/300438/perbup-kab-sinjai-no-33-tahun-2024" target="_blank" rel="noopener" class="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
                      Perbup SPM 33/2024 (BPK) <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 3. PU & Penataan Ruang -->
                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <i class="fas fa-road text-blue-600"></i> 3. Pekerjaan Umum & Tata Ruang
                      </h4>
                      <span class="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">Dinas PUPR</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Pembangunan & pemeliharaan jalan/jembatan kabupaten, jaringan irigasi tani, sistem drainase, air minum, dan penataan ruang RTRW.
                    </p>
                  </div>
                  <div class="pt-2.5 border-t border-blue-100/80 space-y-1">
                    <div class="flex items-center gap-1 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                      <i class="fas fa-file-contract text-blue-600"></i> Aturan Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Sinjai No. 28/2012 (RTRW Kab. Sinjai 2012–2032) & Permen PUPR No. 29/2018
                    </div>
                    <a href="https://peraturan.bpk.go.id/Details/66657/perda-kab-sinjai-no-28-tahun-2012" target="_blank" rel="noopener" class="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda RTRW (BPK) <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 4. Perumahan Rakyat & Permukiman -->
                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <i class="fas fa-home text-blue-600"></i> 4. Perumahan & Permukiman
                      </h4>
                      <span class="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">Disperkimtan</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Bantuan bedah rumah RTLH, penanganan kawasan permukiman kumuh, dan prasarana utilitas umum masyarakat Sinjai.
                    </p>
                  </div>
                  <div class="pt-2.5 border-t border-blue-100/80 space-y-1">
                    <div class="flex items-center gap-1 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                      <i class="fas fa-file-contract text-blue-600"></i> Aturan Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Sinjai No. 5/2020 (Pencegahan & Peningkatan Kualitas Permukiman Kumuh)
                    </div>
                    <a href="https://peraturan.bpk.go.id/Details/159828/perda-kab-sinjai-no-5-tahun-2020" target="_blank" rel="noopener" class="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda No. 5/2020 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 5. Ketenteraman & Linmas -->
                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <i class="fas fa-shield-alt text-blue-600"></i> 5. Trantibum & Linmas
                      </h4>
                      <span class="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">Satpol PP & BPBD</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Penegakan Perda oleh Satpol PP, mitigasi tanggap darurat BPBD, armada damkar, dan perlindungan warga dari bahaya bencana.
                    </p>
                  </div>
                  <div class="pt-2.5 border-t border-blue-100/80 space-y-1">
                    <div class="flex items-center gap-1 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                      <i class="fas fa-file-contract text-blue-600"></i> Aturan Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perda Sinjai No. 4/2015 (Ketenteraman & Ketertiban Umum) jo. Permendagri No. 121/2018
                    </div>
                    <a href="https://peraturan.bpk.go.id/Details/66661/perda-kab-sinjai-no-4-tahun-2015" target="_blank" rel="noopener" class="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda No. 4/2015 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 6. Sosial -->
                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <h4 class="font-bold text-blue-900 text-sm flex items-center gap-2">
                        <i class="fas fa-hands-helping text-blue-600"></i> 6. Sosial
                      </h4>
                      <span class="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">Dinas Sosial</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Pemberian bantuan sosial, perlindungan lansia dan penyandang disabilitas, rehabilitasi sosial, dan tanggap logistik bencana.
                    </p>
                  </div>
                  <div class="pt-2.5 border-t border-blue-100/80 space-y-1">
                    <div class="flex items-center gap-1 text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                      <i class="fas fa-file-contract text-blue-600"></i> Aturan Rujukan:
                    </div>
                    <div class="text-[11px] font-semibold text-slate-800 leading-snug">
                      Perbup SPM Bidang Sosial Sinjai jo. Permensos No. 9 Tahun 2018 (Standar Pelayanan Sosial)
                    </div>
                    <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
                      Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <!-- Kluster 2: Urusan Wajib Non-Pelayanan Dasar (Nama Urusan + Nama Dinas Pelaksana + Landasan Hukum) -->
            <div class="bg-white rounded-3xl p-7 border-2 border-emerald-200/80 shadow-md">
              <div class="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xl shadow-md">
                    <i class="fas fa-cogs"></i>
                  </div>
                  <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">Kluster 2 - Urusan Non-Dasar & Nomenklatur Perangkat Daerah</span>
                    <h3 class="text-xl font-bold text-slate-900">Urusan Pemerintahan Wajib Non-Pelayanan Dasar</h3>
                  </div>
                </div>

                <!-- Landasan Hukum Rujukan Kluster 2 -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <i class="fas fa-gavel mr-1"></i> Perda Kab. Sinjai No. 5/2016 jo. No. 25/2019
                  </span>
                  <a
                    href="https://peraturan.bpk.go.id/Details/66662/perda-kab-sinjai-no-5-tahun-2016"
                    target="_blank"
                    rel="noopener"
                    class="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-all"
                  >
                    Perda OPD (BPK) <i class="fas fa-external-link-alt text-[8px] ml-1"></i>
                  </a>
                </div>
              </div>

              <!-- Grid 12 Bidang Urusan Lengkap dengan Nama Dinas Pelaksana Resmi & Aturan Sinjai -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <!-- 1. Kependudukan -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-id-card text-emerald-600"></i>
                      <span>Administrasi Kependudukan</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Disdukcapil Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Penerbitan KTP-el, Kartu Keluarga, Akta Kelahiran/Kematian, dan pemutakhiran data kependudukan.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sinjai No. 5/2016 jo. Permendagri No. 108/2019</p>
                    <a href="https://peraturan.bpk.go.id/Details/66662/perda-kab-sinjai-no-5-tahun-2016" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Dokumen (BPK) <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 2. Kominfo -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-laptop-code text-emerald-600"></i>
                      <span>Komunikasi, Informatika & SPBE</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: DKIP Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pengelolaan PPID Utama, jaringan intra pemerintah, keamanan persandian, dan sistem SPBE.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perbup Sinjai No. 57/2016 (SOTK DKIP) jo. Perpres No. 95/2018</p>
                    <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 3. DPMPTSP -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-stamp text-emerald-600"></i>
                      <span>Penanaman Modal & Pelayanan Terpadu</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: DPMPTSP Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Penyelenggaraan Mal Pelayanan Publik (MPP), perizinan berusaha OSS, dan promosi investasi daerah.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sinjai No. 9/2016 (Penanaman Modal) & Perda No. 2/2019</p>
                    <a href="https://peraturan.bpk.go.id/Details/66666/perda-kab-sinjai-no-9-tahun-2016" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda No. 9/2016 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 4. Koperasi UMKM -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-users-cog text-emerald-600"></i>
                      <span>Koperasi & Usaha Mikro (UMKM)</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Dinkop UKM & Tenaga Kerja
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pembinaan koperasi badan hukum, pendampingan NIB dan sertifikasi halal UMKM lokal Sinjai.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sinjai No. 5/2016 jo. PP No. 7 Tahun 2021 (Koperasi & UMKM)</p>
                    <a href="https://peraturan.bpk.go.id/Details/161837/pp-no-7-tahun-2021" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka PP No. 7/2021 (BPK) <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 5. DLHK -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-leaf text-emerald-600"></i>
                      <span>Lingkungan Hidup & Kebersihan</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Dinas LHK Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pengelolaan sampah kota, AMDAL, pemantauan kualitas air & udara, serta konservasi lingkungan.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sinjai No. 10/2017 (Pengelolaan Sampah) & Perda No. 6/2015</p>
                    <a href="https://peraturan.bpk.go.id/Details/66671/perda-kab-sinjai-no-10-tahun-2017" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda No. 10/2017 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 6. Tenaga Kerja -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-briefcase text-emerald-600"></i>
                      <span>Tenaga Kerja & Transmigrasi</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Dinkop UKM & Tenaga Kerja
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pelatihan kerja berbasis kompetensi BLK, kartu pencari kerja (AK-1), dan hubungan industrial.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perbup Pelatihan Kerja Sinjai jo. UU No. 13 Tahun 2003 (Naker)</p>
                    <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 7. DP3AP2KB -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-female text-emerald-600"></i>
                      <span>Pemberdayaan Perempuan & Perlindungan Anak</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Dinas DP3AP2KB Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pencegahan kekerasan perempuan/anak, Sinjai Kabupaten Layak Anak (KLA), dan pengendalian KB.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perbup PUG & KLA Kab. Sinjai jo. UU No. 35 Tahun 2014</p>
                    <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 8. Ketahanan Pangan -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-apple-alt text-emerald-600"></i>
                      <span>Ketahanan Pangan Daerah</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Dinas Ketahanan Pangan Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pengendalian cadangan beras pemda, stabilitas harga pangan pokok, dan penganekaragaman pangan.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Cadangan Pangan Sinjai jo. Peraturan Bapanas No. 1/2023</p>
                    <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 9. Pertanahan -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-map text-emerald-600"></i>
                      <span>Pertanahan Daerah</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Disperkimtan Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Inventarisasi sertifikasi aset tanah milik Pemkab Sinjai dan fasilitasi pengadaan tanah publik.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perbup Aset Tanah Pemkab Sinjai jo. PP No. 19 Tahun 2021</p>
                    <a href="https://jdih.sinjaikab.go.id" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka di JDIH Sinjai <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 10. DPMD -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-village text-emerald-600"></i>
                      <span>Pemberdayaan Masyarakat & Desa</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: DPMD Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pembinaan tata kelola Dana Desa pada 67 desa di Sinjai, pemilihan kades, dan pembinaan BUMDes.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sinjai No. 1/2021 (BUMDes) & Perbup Sinjai No. 1/2024 (ADD)</p>
                    <a href="https://peraturan.bpk.go.id/Details/178593/perda-kab-sinjai-no-1-tahun-2021" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda BUMDes (BPK) <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 11. Perhubungan -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-bus text-emerald-600"></i>
                      <span>Perhubungan & Lalu Lintas</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Dinas Perhubungan Sinjai
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Pengujian kelaikan kendaraan (KIR), rekayasa lalu lintas perkotaan, dan penerangan jalan umum (PJU).
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perbup Sinjai No. 20/2023 (Tupoksi Dishub) & Perbup No. 13/2013 (KIR)</p>
                    <a href="https://peraturan.bpk.go.id/Details/278550/perbup-kab-sinjai-no-20-tahun-2023" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perbup No. 20/2023 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 12. Perpustakaan & Kearsipan -->
                <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2.5 text-slate-900 font-bold text-sm mb-1">
                      <i class="fas fa-book text-emerald-600"></i>
                      <span>Kearsipan & Perpustakaan Daerah</span>
                    </div>
                    <div class="text-xs text-emerald-800 font-semibold mb-1">
                      Pelaksana: Dinas Perpustakaan & Kearsipan
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mb-3">
                      Layanan perpustakaan umum daerah, pelestarian arsip statis Sinjai, dan gerakan literasi sekolah.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-emerald-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">Aturan Terkait:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perbup Sinjai No. 67/2021 (Tupoksi Dinas Perpustakaan & Kearsipan)</p>
                    <a href="https://peraturan.bpk.go.id/Details/210350/perbup-kab-sinjai-no-67-tahun-2021" target="_blank" rel="noopener" class="text-[10px] text-emerald-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perbup No. 67/2021 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <!-- Kluster 3: Urusan Pilihan (Sektor Unggulan Daerah Kabupaten Sinjai) with Landasan Hukum -->
            <div class="bg-white rounded-3xl p-7 border-2 border-amber-200/80 shadow-md">
              <div class="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl shadow-md">
                    <i class="fas fa-fish"></i>
                  </div>
                  <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Kluster 3 - Penggerak Ekonomi & Potensi Unggulan Sinjai</span>
                    <h3 class="text-xl font-bold text-slate-900">Urusan Pemerintahan Pilihan Daerah</h3>
                  </div>
                </div>

                <!-- Landasan Hukum Rujukan Kluster 3 -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                    <i class="fas fa-gavel mr-1"></i> Perda Sinjai No. 3/2025 (RPJMD) & Perda No. 2/2024 (RPJPD)
                  </span>
                  <a
                    href="https://peraturan.bpk.go.id/Details/341258/perda-kab-sinjai-no-3-tahun-2025"
                    target="_blank"
                    rel="noopener"
                    class="px-2.5 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold transition-all"
                  >
                    Buka Perda RPJMD <i class="fas fa-external-link-alt text-[8px] ml-1"></i>
                  </a>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- 1. Kelautan & Perikanan -->
                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                        <i class="fas fa-ship"></i>
                      </div>
                      <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Dinas Perikanan</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mb-1">Kelautan & Perikanan</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Pengelolaan Tempat Pelelangan Ikan (TPI) Lappa, tambak udang/bandeng, dan nelayan Pulau Sembilan.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-amber-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-amber-800 uppercase block">Aturan Daerah:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perbup Sinjai No. 27/2023 (Tupoksi Perikanan) & Perda No. 3/2023</p>
                    <a href="https://peraturan.bpk.go.id/Details/278557/perbup-kab-sinjai-no-27-tahun-2023" target="_blank" rel="noopener" class="text-[10px] text-amber-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perbup No. 27/2023 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 2. Pertanian & Perkebunan -->
                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                        <i class="fas fa-seedling"></i>
                      </div>
                      <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Dinas TPHP</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mb-1">Pertanian & Perkebunan</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Pengembangan lada Sinjai, kopi arabika/robusta Borong, cengkeh, padi sawah, serta bantuan alsintan kelompok tani.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-amber-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-amber-800 uppercase block">Aturan Daerah:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sinjai No. 10/2015 (Perlindungan LP2B) & Kebijakan Kopi Borong</p>
                    <a href="https://peraturan.bpk.go.id/Details/66667/perda-kab-sinjai-no-10-tahun-2015" target="_blank" rel="noopener" class="text-[10px] text-amber-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda LP2B (BPK) <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 3. Peternakan Terpadu -->
                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                        <i class="fas fa-hippo"></i>
                      </div>
                      <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Disnakkeswan</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mb-1">Peternakan Terpadu</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Sinjai sebagai sentra sapi potong terkemuka Sulawesi Selatan, asuransi sapi peternak, dan inseminasi buatan (IB).
                    </p>
                  </div>
                  <div class="pt-2 border-t border-amber-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-amber-800 uppercase block">Aturan Daerah:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sentra Ternak Sapi Sinjai jo. Perda No. 3/2023 (Retribusi RPH)</p>
                    <a href="https://peraturan.bpk.go.id/Details/268925/perda-kab-sinjai-no-3-tahun-2023" target="_blank" rel="noopener" class="text-[10px] text-amber-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda No. 3/2023 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

                <!-- 4. Pariwisata & Industri Kreatif -->
                <div class="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                        <i class="fas fa-umbrella-beach"></i>
                      </div>
                      <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Disparbud & Disperindag</span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mb-1">Pariwisata & Industri Kreatif</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                      Mangrove Tongke-Tongke, Pantai Karampuang, Batu Pake Gojeng, Benteng Balangnipa, dan produk kuliner IKM Sinjai.
                    </p>
                  </div>
                  <div class="pt-2 border-t border-amber-200/60 space-y-0.5">
                    <span class="text-[10px] font-bold text-amber-800 uppercase block">Aturan Daerah:</span>
                    <p class="text-[11px] font-semibold text-slate-800 leading-snug">Perda Sinjai No. 6/2013 (Usaha Pariwisata) & Perbup No. 18/2015</p>
                    <a href="https://peraturan.bpk.go.id/Details/66658/perda-kab-sinjai-no-6-tahun-2013" target="_blank" rel="noopener" class="text-[10px] text-amber-700 hover:underline font-bold inline-flex items-center gap-1">
                      Buka Perda No. 6/2013 <i class="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <!-- Kluster 4: Pemerintahan Umum & Keterbukaan Informasi Publik with Landasan Hukum -->
            <div class="p-7 rounded-3xl bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
              <div class="flex items-start gap-4">
                <div class="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center text-2xl shrink-0">
                  <i class="fas fa-bullhorn"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      Kluster 4 - Rujukan: UU 14/2008 & PERKI No. 1/2021 jo. UU 23/2014 Ps. 25
                    </span>
                    <span class="text-[10px] font-bold text-slate-400">
                      Didukung Perbup Pedoman PPID Kab. Sinjai
                    </span>
                  </div>
                  <h4 class="font-bold text-base sm:text-lg text-white mb-1">Penyelenggaraan Urusan Pemerintahan Umum & Keterbukaan Informasi Publik</h4>
                  <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    Meliputi pembinaan wawasan kebangsaan, koordinasi Forkopimda Sinjai, pemeliharaan kerukunan sosial masyarakat, serta penjaminan hak konstitusional setiap warga negara untuk memperoleh informasi publik secara transparan, akuntabel, dan bebas hambatan melalui portal resmi PPID Kabupaten Sinjai.
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-3 shrink-0">
                <NuxtLink
                  to="/standar-layanan/dasar-hukum"
                  class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2"
                >
                  <i class="fas fa-balance-scale text-cyan-300"></i>
                  <span>Dasar Hukum KIP</span>
                </NuxtLink>
                <a
                  href="https://peraturan.bpk.go.id/Details/39060/uu-no-14-tahun-2008"
                  target="_blank"
                  rel="noopener"
                  class="px-4 py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs font-bold border border-cyan-500/40 transition-all flex items-center gap-2"
                >
                  <i class="fas fa-gavel"></i>
                  <span>Salinan UU KIP</span>
                </a>
                <NuxtLink
                  to="/permohonan"
                  class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>Permohonan Informasi</span>
                  <i class="fas fa-arrow-right"></i>
                </NuxtLink>
              </div>
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
      content: 'Profil resmi PPID, Visi Misi, Alamat Lengkap Pemerintah Kabupaten Sinjai, Tugas dan Fungsi, Landasan Hukum, serta Ruang Lingkup Kegiatan Urusan Pemerintahan Daerah Kabupaten Sinjai.'
    },
    {
      property: 'og:title',
      content: 'Profil PPID & Pemerintah Kabupaten Sinjai'
    },
    {
      property: 'og:description',
      content: 'Informasi Lengkap Alamat Kantor Bupati Sinjai, Tugas & Fungsi, Ruang Lingkup Kegiatan, Landasan Hukum, dan Pelayanan Informasi Publik PPID Sinjai.'
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
  .border, .border-2 {
    border-color: #cbd5e1 !important;
  }
}
</style>
