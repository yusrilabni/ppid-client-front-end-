<template>
  <div class="keberatan-page">
    <div class="container mx-auto py-6 md:py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <Breadcrumbs :breadcrumbs="getBreadcrumbs.keberatanPage()" class="mb-6" />
        
        <div class="text-center mb-6 md:mb-10 mt-4 md:mt-6">
            <div class="inline-flex items-center justify-center w-28 h-28 md:w-40 md:h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 md:mb-6 shadow-xl overflow-hidden border-4 border-white">
                <img src="/logo/ppid.webp" alt="Logo PPID" class="w-24 h-24 md:w-36 md:h-36 object-contain">
            </div>
            <h1 class="text-2xl md:text-4xl font-extrabold text-gray-800 mb-2 md:mb-3 tracking-tight">Pengajuan Keberatan Informasi</h1>
            <p class="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
                Formulir resmi keberatan atas layanan atau tanggapan permohonan informasi publik sesuai UU No. 14 Tahun 2008 & Perki No. 1 Tahun 2021.
            </p>
        </div>

        <!-- Success Panel -->
        <div v-if="success" class="mb-8 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm animate-fade-in">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-green-100">
                        <i class="fas fa-check-circle text-green-600 text-lg md:text-xl"></i>
                    </div>
                </div>
                <div class="ml-4 flex-1">
                    <h3 class="text-lg md:text-xl font-bold text-green-800">Keberatan Berhasil Diajukan!</h3>
                    <p class="text-sm md:text-base text-green-700 mt-1">
                        Pengajuan keberatan Anda telah tercatat secara resmi dalam sistem e-PPID Kabupaten Sinjai.
                    </p>
                    
                    <div class="my-4 p-4 bg-white rounded-xl border border-green-200 shadow-sm inline-block">
                        <span class="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Nomor Registrasi Keberatan</span>
                        <span class="text-xl md:text-2xl font-mono font-extrabold text-blue-700 tracking-wider">#{{ trackingCode }}</span>
                    </div>

                    <div class="bg-emerald-100/70 p-3.5 rounded-xl border border-emerald-200 text-xs md:text-sm text-emerald-900 mb-4">
                        <p class="font-semibold flex items-center mb-1">
                            <i class="fas fa-info-circle mr-2 text-emerald-700"></i> Ketentuan Tanggapan Atasan PPID:
                        </p>
                        <p>
                            Sesuai UU KIP No. 14/2008 Pasal 36 ayat (2), Atasan PPID wajib memberikan tanggapan tertulis atas keberatan paling lambat <strong>30 (tiga puluh) hari kerja</strong> sejak pengajuan ini diterima.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <NuxtLink :to="`/laporan/keberatan/${trackingCode}`" 
                            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all inline-flex items-center">
                            <i class="fas fa-search-location mr-2"></i> Pantau Status Keberatan
                        </NuxtLink>
                        <button @click="resetForm" 
                            class="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 shadow-sm transition-all inline-flex items-center">
                            <i class="fas fa-plus mr-2"></i> Ajukan Keberatan Lain
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="px-5 py-4 md:px-6 md:py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 class="text-lg md:text-xl font-bold text-white flex items-center">
                    <i class="fas fa-balance-scale mr-3 text-sm md:text-base"></i>
                    Formulir Keberatan Informasi Publik
                </h2>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6 md:space-y-8 p-5 md:p-10">
                
                <!-- Section 1: Nomor Registrasi Permohonan Asal -->
                <div class="space-y-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">1</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Permohonan Asal</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <div class="space-y-1.5 md:col-span-2">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Nomor Pendaftaran / Kode Registrasi Permohonan Asal <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-barcode text-sm"></i>
                                </span>
                                <input v-model="form.nomor_pendaftaran_pemohon" 
                                    @keyup.enter="verifyPermohonan"
                                    type="text" required
                                    class="w-full pl-10 pr-28 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-medium uppercase"
                                    placeholder="Contoh: 6RQGA, #6RQGA, atau REG-6RQGA">
                                <button type="button" 
                                    @click="verifyPermohonan"
                                    :disabled="verifyingPermohonan || !form.nomor_pendaftaran_pemohon"
                                    class="absolute inset-y-1.5 right-1.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                                    <i v-if="verifyingPermohonan" class="fas fa-spinner fa-spin mr-1.5"></i>
                                    <i v-else class="fas fa-search mr-1.5"></i>
                                    <span>{{ verifyingPermohonan ? 'Cek...' : 'Cek' }}</span>
                                </button>
                            </div>
                            <p class="text-[11px] md:text-xs text-gray-500">
                                Masukkan 5 karakter kode unik atau kode register permohonan informasi Anda (tekan <strong>Enter</strong> atau klik <strong>Cek</strong>).
                            </p>

                            <!-- Loading State Pemeriksaan -->
                            <div v-if="verifyingPermohonan" class="mt-3 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center text-xs md:text-sm text-blue-800 animate-fade-in">
                                <i class="fas fa-spinner fa-spin text-blue-600 mr-2.5 text-base"></i>
                                <span>Menghubungi server dan memverifikasi data permohonan...</span>
                            </div>

                            <!-- Mini card info jika permohonan terdeteksi -->
                            <div v-else-if="permohonanFound" class="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm animate-fade-in">
                                <div class="flex items-start justify-between">
                                    <div class="space-y-1.5 flex-1 pr-2">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800 border border-green-200">
                                                <i class="fas fa-check-circle mr-1 text-green-600"></i> Permohonan Terverifikasi
                                            </span>
                                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-200 text-blue-800">
                                                Status: {{ permohonanFound.status_permohonan }}
                                            </span>
                                        </div>
                                        <p class="text-xs md:text-sm font-bold text-gray-900">
                                            Pemohon: {{ permohonanFound.nama_pemohon }} 
                                            <span class="font-mono text-blue-600 font-semibold">(#{{ permohonanFound.unique_code }})</span>
                                        </p>
                                        <p class="text-xs text-gray-700 leading-relaxed">
                                            <strong>Informasi yang Diminta:</strong> {{ permohonanFound.detail_informasi }}
                                        </p>
                                        <p v-if="permohonanFound.pekerjaan" class="text-[11px] text-gray-500">
                                            Pekerjaan: {{ permohonanFound.pekerjaan }}
                                        </p>
                                    </div>
                                    <button type="button" @click="clearPermohonanCheck" class="text-gray-400 hover:text-gray-600 text-xs p-1" title="Batalkan / Ganti Kode">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Alert jika permohonan TIDAK ditemukan -->
                            <div v-else-if="permohonanError" class="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs md:text-sm text-amber-900 animate-fade-in flex items-start">
                                <i class="fas fa-exclamation-triangle text-amber-600 text-base mt-0.5 mr-2.5 flex-shrink-0"></i>
                                <div class="flex-1">
                                    <p class="font-bold text-amber-800">{{ permohonanError }}</p>
                                    <p class="text-[11px] text-amber-700 mt-1 leading-relaxed">
                                        Catatan: Anda tetap dapat melanjutkan pengisian formulir keberatan ini jika permohonan sebelumnya diajukan secara langsung (luring/offline) di meja layanan PPID.
                                    </p>
                                </div>
                                <button type="button" @click="permohonanError = ''" class="text-amber-500 hover:text-amber-700 ml-2">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Data Pemohon Keberatan -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">2</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Data Pemohon Keberatan</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Nama Pemohon <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-user text-sm"></i>
                                </span>
                                <input v-model="form.nama_pemohon" type="text" required
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Nama pemohon sesuai KTP / Dokumen">
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Pekerjaan / Profesi
                            </label>
                            <CustomSelect 
                                v-model="selectedPekerjaan" 
                                :options="pekerjaanOptions" 
                                searchable 
                                placeholder="Pilih Pekerjaan..." 
                            />
                            
                            <div v-if="selectedPekerjaan === 'Lainnya'" class="mt-3 relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-briefcase text-sm"></i>
                                </span>
                                <input v-model="customPekerjaan" type="text"
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Ketik pekerjaan Anda...">
                            </div>
                        </div>

                        <div class="space-y-1.5 md:col-span-2">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Alamat Lengkap <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.alamat_pemohon" rows="3" required
                                class="w-full px-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Alamat lengkap pemohon keberatan"></textarea>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Nomor Kontak Telepon / WhatsApp <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-phone text-sm"></i>
                                </span>
                                <input v-model="form.nomor_telepon_pemohon" type="text" required
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="08xxxxxxxxxx (Wajib aktif untuk konfirmasi)">
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Alamat Email <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-envelope text-sm"></i>
                                </span>
                                <input v-model="form.email_pemohon" type="email" required
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="nama@email.com (Untuk pengiriman tanggapan resmi)">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Identitas Kuasa Pemohon (Opsional) -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">3</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Identitas Kuasa Pemohon</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="bg-gray-50/70 p-4 md:p-6 rounded-2xl border border-gray-200">
                        <label class="flex items-center cursor-pointer select-none">
                            <input type="checkbox" v-model="hasKuasa" class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded">
                            <span class="ml-3 text-sm md:text-base font-semibold text-gray-800">
                                Pengajuan keberatan ini dikuasakan kepada pihak lain (Kuasa Hukum / Pendamping)
                            </span>
                        </label>
                        <p class="text-[11px] md:text-xs text-gray-500 ml-7 mt-1">
                            Centang opsi ini apabila permohonan keberatan tidak diajukan secara langsung oleh pemohon utama.
                        </p>

                        <!-- Form Kuasa jika dicentang -->
                        <div v-if="hasKuasa" class="mt-5 pt-5 border-t border-gray-200 space-y-4 animate-fade-in">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1.5">
                                    <label class="block text-xs md:text-sm font-semibold text-gray-700">Nama Kuasa Pemohon</label>
                                    <input v-model="form.nama_kuasa" type="text"
                                        class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        placeholder="Nama lengkap kuasa / pendamping">
                                </div>
                                <div class="space-y-1.5">
                                    <label class="block text-xs md:text-sm font-semibold text-gray-700">Nomor Telepon Kuasa</label>
                                    <input v-model="form.nomor_telepon_kuasa" type="text"
                                        class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        placeholder="08xxxxxxxxxx">
                                </div>
                                <div class="space-y-1.5 md:col-span-2">
                                    <label class="block text-xs md:text-sm font-semibold text-gray-700">Alamat Kuasa Pemohon</label>
                                    <textarea v-model="form.alamat_kuasa" rows="2"
                                        class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        placeholder="Alamat lengkap kantor atau domisili kuasa"></textarea>
                                </div>
                                <div class="space-y-1.5 md:col-span-2">
                                    <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                        Lampiran Surat Kuasa (Format: PDF, JPG, PNG - Maksimal 5MB)
                                    </label>
                                    <input @change="handleFileChange" type="file" accept=".pdf,.jpg,.jpeg,.png"
                                        class="w-full px-3 py-2 text-xs md:text-sm text-gray-700 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 4: Alasan Pengajuan Keberatan (UU No. 14/2008) -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">4</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Alasan Pengajuan Keberatan</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="bg-blue-50/50 p-4 md:p-6 rounded-2xl border border-blue-100">
                        <p class="text-xs md:text-sm font-semibold text-gray-700 mb-3">
                            Pilih salah satu alasan keberatan berdasarkan UU No. 14 Tahun 2008 Pasal 35 ayat (1): <span class="text-red-500">*</span>
                        </p>
                        
                        <div class="space-y-2.5">
                            <label v-for="item in alasanList" :key="item.key" 
                                class="flex items-start p-3.5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
                                :class="{'ring-2 ring-blue-500 border-blue-500 bg-blue-50/30': form.alasan_keberatan === item.key}">
                                <input type="radio" v-model="form.alasan_keberatan" :value="item.key" 
                                    class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500">
                                <div class="ml-3">
                                    <span class="block text-xs md:text-sm font-bold text-gray-800">
                                        <span class="inline-block w-5 text-blue-600 uppercase font-mono font-bold">{{ item.key }}.</span>
                                        {{ item.label }}
                                    </span>
                                    <span class="block text-[11px] text-gray-500 mt-0.5 ml-5">{{ item.desc }}</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Section 5: Kasus Posisi / Alasan Keberatan -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">5</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Kasus Posisi & Penjelasan</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs md:text-sm font-semibold text-gray-700">
                            Kasus Posisi / Uraian Lengkap Alasan Keberatan <span class="text-red-500">*</span>
                        </label>
                        <textarea v-model="form.kasus_posisi" rows="5" required
                            class="w-full px-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="Jelaskan secara kronologis kronologi dan fakta yang menjadi dasar keberatan Anda (misal: permohonan diajukan sejak tanggal X namun belum ada tanggapan melebihi batas waktu 10+7 hari kerja, dsb)."></textarea>
                    </div>
                </div>

                <!-- Section 6: Privasi -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">6</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Tingkat Privasi</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label v-for="(desc, status) in {Publik: 'Terlihat oleh umum di rekapitulasi', Anonim: 'Nama Anda disamarkan otomatis', Rahasia: 'Hanya Atasan PPID & admin'}" :key="status" 
                            class="relative flex items-start p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all" 
                            :class="{'bg-blue-50/50 border-blue-500': form.privacy_status === status}">
                            <input type="radio" v-model="form.privacy_status" :value="status" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500">
                            <div class="ml-3">
                                <span class="block text-sm font-bold text-gray-800">{{ status }}</span>
                                <span class="block text-[10px] text-gray-500 mt-0.5">{{ desc }}</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-8 border-t border-gray-100">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-[10px] md:text-xs text-gray-500 text-center md:text-left order-2 md:order-1">
                            <p class="flex items-center justify-center md:justify-start">
                                <i class="fas fa-info-circle mr-2 text-blue-500"></i>
                                Keberatan yang telah dikirim akan diteruskan langsung ke Atasan PPID Kabupaten Sinjai.
                            </p>
                            <p class="mt-1 font-medium"><span class="text-red-500">*</span> Kolom wajib diisi</p>
                        </div>
                        <button type="submit" 
                            :disabled="loading"
                            class="w-full md:w-auto inline-flex items-center justify-center px-10 py-3.5 text-sm md:text-base font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all order-1 md:order-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            <i class="fas fa-paper-plane mr-3" v-show="!loading"></i>
                            <i class="fas fa-spinner fa-spin mr-3" v-show="loading"></i>
                            <span>{{ loading ? 'Mengirim Keberatan...' : 'Kirim Pengajuan Keberatan' }}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Dasar Hukum & Alur Keberatan Sesuai Regulasi -->
        <div class="mt-8 p-5 md:p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
            <div class="flex flex-col md:flex-row items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto md:mx-0">
                    <i class="fas fa-gavel text-xl"></i>
                </div>
                <div class="flex-1 text-center md:text-left">
                    <h4 class="text-base md:text-lg font-bold text-gray-800 mb-2">Dasar Hukum & Mekanisme Pengajuan Keberatan</h4>
                    <p class="text-xs md:text-sm text-gray-600 leading-relaxed mb-4">
                        Hak mengajukan keberatan diatur secara tegas dalam Pasal 35 & 36 Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik dan Peraturan Komisi Informasi (Perki) No. 1 Tahun 2021 tentang Standar Layanan Informasi Publik.
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div class="p-4 bg-white/80 rounded-xl border border-blue-100">
                            <h5 class="text-xs md:text-sm font-bold text-blue-900 mb-2 flex items-center">
                                <i class="fas fa-hourglass-half mr-2 text-blue-600"></i> Batas Waktu Tanggapan:
                            </h5>
                            <p class="text-xs text-gray-600 leading-relaxed">
                                Atasan PPID wajib memberikan tanggapan tertulis atas keberatan paling lambat <strong>30 (tiga puluh) hari kerja</strong> sejak diterimanya keberatan secara lengkap.
                            </p>
                        </div>

                        <div class="p-4 bg-white/80 rounded-xl border border-blue-100">
                            <h5 class="text-xs md:text-sm font-bold text-blue-900 mb-2 flex items-center">
                                <i class="fas fa-shield-alt mr-2 text-blue-600"></i> Upaya Lanjutan (Sengketa):
                            </h5>
                            <p class="text-xs text-gray-600 leading-relaxed">
                                Apabila pemohon tidak puas atas tanggapan Atasan PPID, pemohon berhak mengajukan permohonan penyelesaian <strong>Sengketa Informasi Publik ke Komisi Informasi</strong> dalam tempo 14 hari kerja.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const success = ref(false)
const trackingCode = ref('')
const verifyingPermohonan = ref(false)
const permohonanFound = ref(null)
const permohonanError = ref('')

const pekerjaanOptions = ref([])
const selectedPekerjaan = ref('')
const customPekerjaan = ref('')
const hasKuasa = ref(false)
const suratKuasaFile = ref(null)

// 7 Alasan Keberatan resmi UU No. 14/2008 Pasal 35 ayat (1)
const alasanList = [
  { key: 'a', label: 'Permohonan Informasi ditolak', desc: 'Badan publik menolak memberikan informasi dengan alasan yang tidak berdasar atau informasi tidak dikecualikan.' },
  { key: 'b', label: 'Informasi berkala tidak disediakan', desc: 'Informasi yang wajib disediakan dan diumumkan secara berkala tidak dapat diakses pemohon.' },
  { key: 'c', label: 'Permintaan Informasi tidak ditanggapi', desc: 'PPID tidak memberikan tanggapan atas permohonan informasi dalam batas waktu 10 + 7 hari kerja.' },
  { key: 'd', label: 'Permintaan Informasi ditanggapi tidak sebagaimana yang diminta', desc: 'Informasi atau dokumen yang diserahkan tidak sesuai dengan rincian permohonan.' },
  { key: 'e', label: 'Permintaan Informasi tidak dipenuhi', desc: 'PPID tidak memenuhi seluruh materi informasi yang diajukan tanpa alasan sah.' },
  { key: 'f', label: 'Biaya yang dikenakan tidak wajar', desc: 'Biaya penggandaan atau pengiriman melampaui ketentuan standar biaya yang telah ditetapkan.' },
  { key: 'g', label: 'Penyampaian Informasi melebihi jangka waktu yang ditentukan', desc: 'Penyerahan dokumen informasi terlambat melewati batas waktu maksimal regulasi.' }
]

const initialFormState = {
  nomor_pendaftaran_pemohon: '',
  nama_pemohon: '',
  pekerjaan: '',
  alamat_pemohon: '',
  nomor_telepon_pemohon: '',
  email_pemohon: '',
  nama_kuasa: '',
  alamat_kuasa: '',
  nomor_telepon_kuasa: '',
  alasan_keberatan: 'c',
  kasus_posisi: '',
  privacy_status: 'Publik'
}

const form = ref({ ...initialFormState })

onMounted(async () => {
  // Ambil daftar pekerjaan
  try {
    const resPekerjaan = await api.get('/pekerjaan')
    pekerjaanOptions.value = [...(resPekerjaan.data?.data || resPekerjaan.data || []), 'Lainnya']
  } catch (e) {
    pekerjaanOptions.value = ['ASN / Pegawai Negeri', 'Karyawan Swasta', 'Pelajar / Mahasiswa', 'Wiraswasta / Pengusaha', 'Lainnya']
  }

  // Pre-fill dari URL query param ?permohonan=XXXX
  const queryPermohonan = route.query.permohonan
  if (queryPermohonan) {
    form.value.nomor_pendaftaran_pemohon = String(queryPermohonan).trim()
    verifyPermohonan()
  }

  // Auto-fill dari data user yang login
  if (authStore.user) {
    form.value.nama_pemohon = authStore.user.name || ''
    form.value.email_pemohon = authStore.user.email || ''
    form.value.nomor_telepon_pemohon = authStore.user.phone || authStore.user.nomor_hp || ''
    selectedPekerjaan.value = authStore.user.nip ? 'ASN / Pegawai Negeri' : ''
  }
})

const cleanInputCode = (val) => {
  if (!val) return ''
  return String(val)
    .trim()
    .toUpperCase()
    .replace(/^[#\s]+/, '')
    .replace(/^REG[-_\s]?/i, '')
    .trim()
}

const clearPermohonanCheck = () => {
  permohonanFound.value = null
  permohonanError.value = ''
  form.value.nomor_pendaftaran_pemohon = ''
}

const verifyPermohonan = async () => {
  const rawInput = form.value.nomor_pendaftaran_pemohon?.trim()
  if (!rawInput) {
    permohonanFound.value = null
    permohonanError.value = 'Silakan ketik nomor pendaftaran atau kode registrasi permohonan terlebih dahulu.'
    return
  }

  const cleanCode = cleanInputCode(rawInput)
  if (!cleanCode) {
    permohonanFound.value = null
    permohonanError.value = 'Format kode registrasi tidak valid.'
    return
  }

  verifyingPermohonan.value = true
  permohonanError.value = ''
  permohonanFound.value = null

  try {
    const res = await api.get(`/permohonan/status/${encodeURIComponent(cleanCode)}`, {
      skipAuthRedirect: true
    })
    if (res.data?.success && res.data?.data) {
      permohonanFound.value = res.data.data
      permohonanError.value = ''
      // Standarisasi nilai di input ke kode unik resmi (contoh: 6RQGA)
      form.value.nomor_pendaftaran_pemohon = res.data.data.unique_code

      // Jika nama pemohon di form masih kosong, auto-fill dari permohonan
      if (!form.value.nama_pemohon && res.data.data.nama_pemohon && !res.data.data.nama_pemohon.includes('*')) {
        form.value.nama_pemohon = res.data.data.nama_pemohon
      }
      if (!selectedPekerjaan.value && res.data.data.pekerjaan) {
        selectedPekerjaan.value = res.data.data.pekerjaan
      }
      if (!form.value.alamat_pemohon && res.data.data.alamat_pemohon && !res.data.data.alamat_pemohon.includes('*')) {
        form.value.alamat_pemohon = res.data.data.alamat_pemohon
      }
    } else {
      permohonanFound.value = null
      permohonanError.value = `Permohonan dengan kode "${rawInput}" tidak ditemukan dalam basis data.`
    }
  } catch (err) {
    console.error('Error verifying permohonan:', err)
    permohonanFound.value = null
    permohonanError.value = `Permohonan dengan kode "${rawInput}" tidak ditemukan dalam sistem online.`
  } finally {
    verifyingPermohonan.value = false
  }
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.')
      e.target.value = ''
      suratKuasaFile.value = null
      return
    }
    suratKuasaFile.value = file
  }
}

const submitForm = async () => {
  if (!form.value.nomor_pendaftaran_pemohon?.trim()) {
    alert('Nomor pendaftaran permohonan asal wajib diisi.')
    return
  }

  loading.value = true
  const formData = new FormData()

  // Set pekerjaan
  form.value.pekerjaan = selectedPekerjaan.value === 'Lainnya' ? customPekerjaan.value : selectedPekerjaan.value

  Object.keys(form.value).forEach(key => {
    formData.append(key, form.value[key] || '')
  })

  if (hasKuasa.value && suratKuasaFile.value) {
    formData.append('surat_kuasa', suratKuasaFile.value)
  }

  try {
    const res = await api.post('/keberatan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    success.value = true
    trackingCode.value = res.data.data?.unique_code || res.data?.unique_code || 'BERHASIL'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Error submitting keberatan:', error)
    const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat mengirim pengajuan keberatan.'
    alert(errorMsg)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = { ...initialFormState }
  selectedPekerjaan.value = ''
  customPekerjaan.value = ''
  hasKuasa.value = false
  suratKuasaFile.value = null
  permohonanFound.value = null
  permohonanError.value = ''

  if (authStore.user) {
    form.value.nama_pemohon = authStore.user.name || ''
    form.value.email_pemohon = authStore.user.email || ''
    form.value.nomor_telepon_pemohon = authStore.user.phone || authStore.user.nomor_hp || ''
    selectedPekerjaan.value = authStore.user.nip ? 'ASN / Pegawai Negeri' : ''
  }

  success.value = false
  trackingCode.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
