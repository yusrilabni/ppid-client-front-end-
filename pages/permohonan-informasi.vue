<template>
  <div class="permohonan-page">
    <PageHeader 
      title=" " 
      icon=""
      :breadcrumbs="getBreadcrumbs.permohonanPage().map(c => ({ label: c.title, to: c.url }))" 
    />
    <div class="container mx-auto py-6 md:py-8 px-4">
      <div class="max-w-6xl mx-auto">
        
        <div class="text-center mb-8 md:mb-10 mt-4 md:mt-6">
            <div class="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 md:mb-6 shadow-lg">
                <img src="/logo/ppid_v2.webp" alt="Logo PPID" class="w-10 h-10 md:w-12 md:h-12">
            </div>
            <h1 class="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3">Permohonan Informasi</h1>
            <p class="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
                Lengkapi formulir di bawah ini untuk membuat permohonan informasi publik.
            </p>
        </div>

        <div v-if="success" class="mb-8 p-4 md:p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-green-100">
                        <i class="fas fa-check-circle text-green-600 text-sm md:text-base"></i>
                    </div>
                </div>
                <div class="ml-3 md:ml-4">
                    <h3 class="text-base md:text-lg font-semibold text-green-800">Permohonan Terkirim!</h3>
                    <p class="text-sm md:text-base text-green-700 mt-1">Terima kasih, permohonan Anda telah kami terima.</p>
                    <div class="bg-white p-4 mt-3 rounded-md shadow-inner text-xl font-mono tracking-widest text-gray-800 border inline-block">
                        Kode Registrasi: <strong>{{ trackingCode }}</strong>
                    </div>
                    <p class="text-sm mt-3 text-green-600">Simpan kode registrasi ini untuk melacak status permohonan Anda.</p>
                    <button @click="resetForm" class="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Ajukan Permohonan Baru</button>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="px-5 py-4 md:px-6 md:py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 class="text-lg md:text-xl font-bold text-white flex items-center">
                    <i class="fas fa-pen-alt mr-3 text-sm md:text-base"></i>
                    Formulir Permohonan
                </h2>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6 md:space-y-8 p-5 md:p-10">
                <!-- Section 1: Data Pemohon -->
                <div class="space-y-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">1</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Data Pemohon</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Nama Lengkap <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-user text-sm"></i>
                                </span>
                                <input v-model="form.nama_pemohon" type="text" required
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Nama lengkap sesuai identitas">
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Pekerjaan
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-briefcase text-sm"></i>
                                </span>
                                <input v-model="form.pekerjaan" type="text"
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Contoh: PNS, Swasta, Pelajar">
                            </div>
                        </div>

                        <div class="space-y-1.5 md:col-span-2">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Alamat Lengkap <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.alamat_pemohon" rows="3" required
                                class="w-full px-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Masukkan alamat lengkap Anda"></textarea>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Nomor Telepon/WA
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-phone text-sm"></i>
                                </span>
                                <input v-model="form.nomor_telepon_pemohon" type="text"
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="08xxxxxxxxxx">
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Alamat Email
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-envelope text-sm"></i>
                                </span>
                                <input v-model="form.email_pemohon" type="email"
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="nama@email.com">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Informasi -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">2</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Rincian Permohonan</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="space-y-5">
                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Informasi yang Dibutuhkan <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.detail_informasi" rows="4" required
                                class="w-full px-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Sebutkan secara detail nama dokumen atau data yang Anda minta"></textarea>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Tujuan Penggunaan <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.tujuan_penggunaan_informasi" rows="3" required
                                class="w-full px-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Contoh: Untuk keperluan penelitian tesis atau data pribadi"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Cara Memperoleh -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">3</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Metode Perolehan</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-blue-50/50 p-4 md:p-5 rounded-xl border border-blue-100">
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-4">Cara Memperoleh Informasi</label>
                            <div class="grid grid-cols-1 gap-3">
                                <label class="flex items-start p-3.5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-all cursor-pointer">
                                    <input type="checkbox" v-model="form.cara_memperoleh_informasi" value="Melihat/Membaca/Mendengarkan" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded">
                                    <div class="ml-3">
                                        <span class="block text-sm font-bold text-gray-800">Melihat/Membaca/Mendengarkan</span>
                                        <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5">Datang langsung ke lokasi PPID.</span>
                                    </div>
                                </label>
                                <label class="flex items-start p-3.5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-all cursor-pointer">
                                    <input type="checkbox" v-model="form.cara_memperoleh_informasi" value="Mendapat Salinan Informasi" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded">
                                    <div class="ml-3">
                                        <span class="block text-sm font-bold text-gray-800">Mendapat Salinan (Copy)</span>
                                        <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5">Mendapatkan file atau berkas fisik.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div v-show="form.cara_memperoleh_informasi.includes('Mendapat Salinan Informasi')" class="bg-indigo-50/50 p-4 md:p-5 rounded-xl border border-indigo-100 transition-all">
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-4">Metode Pengiriman Salinan</label>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <label v-for="metode in ['Mengambil', 'Kurir', 'Pos', 'Faksmail', 'E-Mail']" :key="metode" class="flex items-center p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-400 transition-all cursor-pointer" :class="{'col-span-2 md:col-span-1': metode === 'E-Mail'}">
                                    <input type="checkbox" v-model="form.cara_mendapatkan_salinan" :value="metode" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded">
                                    <span class="ml-2.5 text-xs md:text-sm font-medium text-gray-700">{{ metode }}</span>
                                </label>
                            </div>
                        </div>

                        <div v-show="form.cara_mendapatkan_salinan.includes('Mengambil')" class="bg-blue-50 p-4 md:p-5 rounded-xl border border-blue-100 transition-all">
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-2">Lokasi Pengambilan</label>
                            <CustomSelect v-model="form.tempat_mendapatkan_salinan" :options="units" labelKey="unit_nama" valueKey="unit_id" placeholder="Pilih Dinas/Unit Kerja" />
                        </div>
                    </div>
                </div>

                <!-- Section 4: Privasi -->
                <div class="space-y-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs md:text-sm font-bold">4</div>
                        <h3 class="ml-3 text-lg md:text-xl font-bold text-gray-800">Tingkat Privasi</h3>
                        <div class="ml-4 flex-1 border-t border-gray-200"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label v-for="(desc, status) in {Publik: 'Terlihat oleh umum', Anonim: 'Nama Anda disamarkan', Rahasia: 'Hanya untuk internal'}" :key="status" class="relative flex items-start p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all" :class="{'bg-blue-50/50 border-blue-500': form.privacy_status === status}">
                            <input type="radio" v-model="form.privacy_status" :value="status" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500">
                            <div class="ml-3">
                                <span class="block text-sm font-bold text-gray-800">{{ status }}</span>
                                <span class="block text-[10px] text-gray-500 mt-0.5">{{ desc }}</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Submit -->
                <div class="pt-8 border-t border-gray-100">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-[10px] md:text-xs text-gray-500 text-center md:text-left order-2 md:order-1">
                            <p class="flex items-center justify-center md:justify-start">
                                <i class="fas fa-info-circle mr-2 text-blue-500"></i>
                                Pastikan data sudah benar sebelum dikirim.
                            </p>
                            <p class="mt-1 font-medium"><span class="text-red-500">*</span> Field wajib diisi</p>
                        </div>
                        <button type="submit" 
                            :disabled="loading"
                            class="w-full md:w-auto inline-flex items-center justify-center px-10 py-3.5 text-sm md:text-base font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all order-1 md:order-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            <i class="fas fa-paper-plane mr-3" v-show="!loading"></i>
                            <i class="fas fa-spinner fa-spin mr-3" v-show="loading"></i>
                            <span>{{ loading ? 'Mengirim...' : 'Kirim Permohonan' }}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Informasi Penting & Status Privasi -->
        <div class="mt-8 p-5 md:p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
            <div class="flex flex-col md:flex-row items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto md:mx-0">
                    <i class="fas fa-lightbulb text-xl"></i>
                </div>
                <div class="flex-1 text-center md:text-left">
                    <h4 class="text-lg md:text-xl font-bold text-gray-800">Informasi Penting & Status Privasi</h4>
                    <p class="text-xs md:text-sm text-gray-500 mt-1">Harap baca informasi di bawah ini sebelum mengirimkan permohonan Anda.</p>
                    
                    <div class="mt-6 pt-6 border-t border-blue-200/60">
                        <h5 class="font-bold text-gray-700 mb-4 text-sm md:text-base flex items-center justify-center md:justify-start">
                            <i class="fas fa-user-shield mr-2 text-blue-500"></i> Penjelasan Status Privasi:
                        </h5>
                        <div class="grid grid-cols-1 gap-4 text-left">
                            <div class="p-4 bg-white/60 rounded-xl border border-blue-100">
                                <div class="flex items-start">
                                    <i class="fas fa-globe-asia text-blue-500 mt-1 mr-3 flex-shrink-0"></i>
                                    <div class="text-xs md:text-sm text-gray-600">
                                        <strong class="text-gray-800 block mb-1">Publik:</strong>
                                        <span>Permohonan Anda dapat dilihat oleh semua orang. Memilih status ini membantu pengguna lain yang mungkin mencari informasi yang sama dan mengurangi permohonan berulang.</span>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4 bg-white/60 rounded-xl border border-yellow-100">
                                <div class="flex items-start">
                                    <i class="fas fa-user-secret text-yellow-500 mt-1 mr-3 flex-shrink-0"></i>
                                    <div class="text-xs md:text-sm text-gray-600">
                                        <strong class="text-gray-800 block mb-1">Anonim:</strong>
                                        <span>Permohonan Anda akan tampil di daftar publik, namun nama Anda akan kami samarkan (contoh: J*****) untuk melindungi privasi Anda.</span>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4 bg-white/60 rounded-xl border border-red-100">
                                <div class="flex items-start">
                                    <i class="fas fa-lock text-red-500 mt-1 mr-3 flex-shrink-0"></i>
                                    <div class="text-xs md:text-sm text-gray-600">
                                        <strong class="text-gray-800 block mb-1">Rahasia:</strong>
                                        <span>Permohonan Anda bersifat privat dan tidak akan ditampilkan di daftar publik. Hanya Anda dan admin yang dapat melihat detail permohonan ini.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-blue-200/60">
                         <h5 class="font-bold text-gray-700 mb-4 text-sm md:text-base flex items-center justify-center md:justify-start">
                            <i class="fas fa-clock mr-2 text-blue-500"></i> Proses & Notifikasi:
                         </h5>
                        <ul class="space-y-3 text-left">
                            <li class="flex items-start text-xs md:text-sm text-gray-600">
                                <i class="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                                <span>Permohonan akan diproses dalam waktu maksimal 10 + 7 hari kerja sesuai regulasi yang berlaku.</span>
                            </li>
                            <li class="flex items-start text-xs md:text-sm text-gray-600">
                                <i class="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                                <span>Status permohonan dapat dipantau melalui akun atau notifikasi di website ini.</span>
                            </li>
                            <li class="flex items-start text-xs md:text-sm text-gray-600">
                                <i class="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                                <span>Pastikan data kontak yang Anda isi (email/telepon) valid dan dapat dihubungi.</span>
                            </li>
                        </ul>
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
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PageHeader from '@/components/PageHeader.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import api, { getStorageUrl } from '@/services/api'

const loading = ref(false)
const success = ref(false)
const trackingCode = ref('')
const units = ref([])

const initialFormState = {
  nama_pemohon: '',
  pekerjaan: '',
  alamat_pemohon: '',
  nomor_telepon_pemohon: '',
  email_pemohon: '',
  detail_informasi: '',
  tujuan_penggunaan_informasi: '',
  cara_memperoleh_informasi: [],
  cara_mendapatkan_salinan: [],
  tempat_mendapatkan_salinan: '',
  privacy_status: 'Publik'
}

const form = ref({ ...initialFormState })

onMounted(async () => {
  try {
    const res = await api.get('/units')
    units.value = res.data?.data || res.data || []
  } catch (error) {
    console.error('Error fetching units:', error)
  }
})

const submitForm = async () => {
  loading.value = true
  const formData = new FormData()
  
  Object.keys(form.value).forEach(key => {
    if (Array.isArray(form.value[key])) {
      form.value[key].forEach(item => formData.append(`${key}[]`, item))
    } else {
      formData.append(key, form.value[key])
    }
  })
  
  try {
    const res = await api.post('/permohonan', formData)
    success.value = true
    trackingCode.value = res.data.data?.kode_registrasi || res.data?.tracking_code || res.data?.data?.unique_code || res.data?.unique_code || 'BERHASIL'
  } catch (error) {
    console.error('Error submitting form:', error)
    alert(error.response?.data?.message || 'Terjadi kesalahan saat mengirim formulir.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = { ...initialFormState }
  success.value = false
  trackingCode.value = ''
}
</script>
