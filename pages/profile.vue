<template>
  <div class="py-12 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
      
      <!-- Breadcrumbs -->
      <Breadcrumbs :breadcrumbs="breadcrumbItems" class="px-4 sm:px-0" />

      <!-- Alerts for Linking Account -->
      <div v-if="linkedStatus === 'success'" class="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-sm mx-4 sm:mx-0">
        <i class="fas fa-check-circle text-emerald-600 mt-0.5"></i>
        <p class="text-sm text-emerald-700">Akun berhasil ditautkan dengan Google! Email profil Anda juga telah diperbarui otomatis. Mulai sekarang Anda bisa Login menggunakan Google.</p>
      </div>
      <div v-if="linkedStatus === 'failed'" class="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 shadow-sm mx-4 sm:mx-0">
        <i class="fas fa-exclamation-circle text-red-600 mt-0.5"></i>
        <p class="text-sm text-red-700">{{ linkedMessage }}</p>
      </div>

      <!-- Banner Tautkan Akun -->
      <div v-if="profileData && !profileData.user?.google_id" class="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <i class="fas fa-link"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-blue-900 mb-1">Kaitkan Akun Google</h3>
            <p class="text-xs text-blue-700 leading-relaxed max-w-2xl">
              Tautkan akun ini dengan Akun Google Anda agar Anda bisa masuk dengan cepat menggunakan Login Google di masa depan.
            </p>
          </div>
        </div>
        <button @click="linkGoogleAccount" class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm">
          Tautkan ke Google
        </button>
      </div>

      <!-- Banner Putuskan Tautan -->
      <div v-if="profileData && profileData.user?.google_id" class="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <i class="fab fa-google"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-red-900 mb-1">Terhubung dengan Google</h3>
            <p class="text-xs text-red-700 leading-relaxed max-w-2xl">
              Akun Anda saat ini terhubung dengan Google. Anda dapat masuk menggunakan tombol Login Google.
            </p>
          </div>
        </div>
        <button @click="showOtpModal = true" class="px-4 py-2 bg-white text-red-600 border border-red-200 text-xs font-semibold rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap shadow-sm">
          Putuskan Tautan
        </button>
      </div>

      <div v-if="!loading && profileData" class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
        <section>
          <header>
            <h2 class="text-lg font-medium text-gray-900">Informasi Profil</h2>
            <p class="mt-1 text-sm text-gray-600">Perbarui informasi profil dan alamat email Anda.</p>
          </header>

          <form @submit.prevent="updateProfile" class="mt-6 space-y-6">
            
            <!-- Profile Photo Section -->
            <div class="col-span-12 flex flex-col items-center text-center">
              <h3 class="text-lg font-medium text-gray-900">Foto Profil</h3>
              
              <div class="mt-2">
                <template v-if="photoPreview">
                  <img :src="photoPreview" alt="Profile Photo" class="rounded-full h-28 w-28 object-cover border border-gray-200">
                </template>
                <template v-else-if="profileData.profile_photo_url && !form.remove_photo">
                  <img :src="getStorageUrl(profileData.profile_photo_url)" alt="Profile Photo" class="rounded-full h-28 w-28 object-cover border border-gray-200">
                </template>
                <template v-else>
                  <div class="h-28 w-28 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-3xl">
                    {{ userInitials }}
                  </div>
                </template>
              </div>

              <input type="file" class="hidden" ref="photoInput" @change="handlePhotoChange" accept="image/*">

              <div class="mt-4 flex gap-2 justify-center">
                <button type="button" @click="$refs.photoInput.click()" 
                  class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                  Pilih Foto Baru
                </button>

                <button type="button" v-if="profileData.is_manual_photo || photoPreview" @click="removePhoto"
                  class="inline-flex items-center px-4 py-2 bg-white border border-red-300 rounded-md font-semibold text-xs text-red-600 uppercase tracking-widest shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                  Hapus Foto
                </button>
              </div>
              
              <p v-if="errors.photo" class="mt-2 text-sm text-red-600">{{ errors.photo[0] }}</p>
            </div>

            <!-- Display API Data -->
            <div class="mt-8 border-t border-gray-200 pt-8">
              <h3 class="text-lg font-medium text-gray-900">Data Kepegawaian / Identitas</h3>
              
              <div class="mt-4">
                <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  
                  <!-- Column 1 -->
                  <div class="space-y-6">
                    <div>
                      <label class="block font-medium text-sm text-gray-700">NIP / NIK</label>
                      <input v-model="form.nip" type="text" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full">
                      <p v-if="errors.nip" class="mt-2 text-sm text-red-600">{{ errors.nip[0] }}</p>
                      <p class="mt-1 text-xs text-gray-500 italic">*Jika ASN, mohon masukkan NIP.</p>
                    </div>

                    <template v-if="profileData.is_asn">
                      <div v-if="profileData.kepegawaian?.pangkat">
                        <label class="block font-medium text-sm text-gray-700">Pangkat</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.pangkat }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.jabatan && profileData.kepegawaian.jabatan !== '-'">
                        <label class="block font-medium text-sm text-gray-700">Jabatan</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.jabatan }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.unit_bagian && profileData.kepegawaian.unit_bagian !== '-' && !profileData.kepegawaian.unit_bagian.includes('Hubungan Masyarakat')">
                        <label class="block font-medium text-sm text-gray-700">Unit Bagian</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.unit_bagian }}</p>
                      </div>
                    </template>
                  </div>

                  <!-- Column 2 -->
                  <div class="space-y-6">
                    <template v-if="profileData.is_asn">
                      <div>
                        <label class="block font-medium text-sm text-gray-700">Nama</label>
                        <p class="mt-1 block w-full text-gray-700 font-semibold">{{ profileData.user?.name }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.unit_kerja">
                        <label class="block font-medium text-sm text-gray-700">Unit Kerja</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.unit_kerja }}</p>
                      </div>

                      <div v-if="profileData.kepegawaian?.nomor_hp && profileData.kepegawaian.nomor_hp !== '-'">
                        <label class="block font-medium text-sm text-gray-700">Nomor HP</label>
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.kepegawaian.nomor_hp }}</p>
                      </div>
                    </template>

                    <div>
                      <label class="block font-medium text-sm text-gray-700">Email</label>
                      <template v-if="profileData.is_asn && profileData.user?.email && profileData.user.email !== '-' && !form.email_can_update">
                        <p class="mt-1 block w-full text-gray-700">{{ profileData.user.email }}</p>
                      </template>
                      <template v-else>
                        <input v-model="form.email" type="email" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" required>
                        <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email[0] }}</p>
                        <p class="mt-2 text-sm text-red-600">Email dapat diperbarui.</p>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Other Editable Information Section -->
            <div class="mt-8 border-t border-gray-200 pt-8">
              <h3 class="text-lg font-medium text-gray-900">Informasi Tambahan</h3>
              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 mt-4">
                
                <div>
                  <label class="block font-medium text-sm text-gray-700">Facebook</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-facebook w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.facebook" type="text" placeholder="https://facebook.com/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.facebook" class="mt-2 text-sm text-red-600">{{ errors.facebook[0] }}</p>
                </div>

                <div>
                  <label class="block font-medium text-sm text-gray-700">Instagram</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-instagram w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.instagram" type="text" placeholder="https://instagram.com/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.instagram" class="mt-2 text-sm text-red-600">{{ errors.instagram[0] }}</p>
                </div>

                <div>
                  <label class="block font-medium text-sm text-gray-700">Tiktok</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-tiktok w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.tiktok" type="text" placeholder="https://tiktok.com/@username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.tiktok" class="mt-2 text-sm text-red-600">{{ errors.tiktok[0] }}</p>
                </div>

                <div>
                  <label class="block font-medium text-sm text-gray-700">LinkedIn</label>
                  <div class="flex items-center mt-1">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10">
                      <i class="fab fa-linkedin w-5 h-5 flex items-center justify-center"></i>
                    </span>
                    <input v-model="form.linkedin" type="text" placeholder="https://linkedin.com/in/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10">
                  </div>
                  <p v-if="errors.linkedin" class="mt-2 text-sm text-red-600">{{ errors.linkedin[0] }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 mt-6">
              <button type="submit" :disabled="saving" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                Simpan Perubahan
              </button>

              <transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition ease-in duration-300"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <p v-if="successMessage" class="text-sm text-gray-600">{{ successMessage }}</p>
              </transition>
            </div>

          </form>
        </section>
      </div>
    </div>

    <!-- OTP Unlink Modal -->
    <div v-if="showOtpModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75 p-4">
      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="px-6 py-6 sm:p-8">
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <i class="fas fa-shield-alt text-red-600 text-xl"></i>
          </div>
          <div class="text-center w-full">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Verifikasi Keamanan</h3>
            
            <div v-if="otpStep === 'request'">
              <p class="text-sm text-gray-500 mb-6">
                Untuk memutuskan tautan Google, kami perlu mengirimkan kode OTP 6-digit ke email Anda <strong>{{ profileData?.user?.email }}</strong> sebagai verifikasi keamanan.
              </p>
              
              <div v-if="otpError" class="mb-4 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg border border-red-100">
                {{ otpError }}
              </div>

              <div class="flex flex-col sm:flex-row gap-3">
                <button type="button" @click="showOtpModal = false" class="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Batal
                </button>
                <button @click="requestOtp" :disabled="isRequestingOtp" class="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center">
                  <i v-if="isRequestingOtp" class="fas fa-spinner fa-spin mr-2"></i>
                  Kirim Kode OTP
                </button>
              </div>
            </div>

            <div v-if="otpStep === 'verify'">
              <p class="text-sm text-gray-500 mb-2">
                Masukkan 6-digit kode OTP yang telah dikirimkan ke email Anda.
              </p>
              
              <div v-if="otpError" class="mb-4 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg border border-red-100">
                {{ otpError }}
              </div>
              <div v-if="otpSuccess" class="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs text-left rounded-lg border border-emerald-100">
                {{ otpSuccess }}
              </div>

              <form @submit.prevent="verifyOtp" class="text-left mt-4">
                <div class="mb-6 flex justify-center">
                  <input v-model="otpCode" type="text" maxlength="6" required placeholder="123456" class="w-32 px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow">
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3">
                  <button type="button" @click="showOtpModal = false; otpStep = 'request'; clearInterval(unlinkTimerInterval)" class="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                    Batal
                  </button>
                  <button type="submit" :disabled="isVerifyingOtp || otpCode.length !== 6" class="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center">
                    <i v-if="isVerifyingOtp" class="fas fa-spinner fa-spin mr-2"></i>
                    Verifikasi & Putuskan
                  </button>
                </div>

                <div class="text-center mt-4 border-t pt-4">
                  <button type="button" 
                          @click="resendUnlinkOtp" 
                          :disabled="unlinkCooldown > 0 || isRequestingOtp"
                          class="text-red-600 hover:text-red-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed">
                    <span v-if="isRequestingOtp" class="animate-spin h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full inline-block mr-1"></span>
                    {{ unlinkCooldown > 0 ? `Kirim Ulang OTP dalam ${unlinkCooldown}s` : 'Kirim Ulang OTP' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- OTP Link Modal -->
    <div v-if="showLinkOtpModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75 p-4">
      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="px-6 py-6 sm:p-8">
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
            <i class="fas fa-shield-alt text-blue-600 text-xl"></i>
          </div>
          <div class="text-center w-full">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Verifikasi Email Anda</h3>
            
            <p class="text-sm text-gray-500 mb-4">
              Kode verifikasi 6-digit telah dikirim ke email <strong>{{ linkEmailTarget }}</strong>. Silakan masukkan kode tersebut di bawah ini untuk menautkan akun.
            </p>
            
            <div v-if="linkOtpError" class="mb-4 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg border border-red-100">
              {{ linkOtpError }}
            </div>

            <form @submit.prevent="verifyLinkOtp" class="text-left mt-4">
              <div class="mb-6 flex justify-center">
                <input v-model="linkOtpCode" type="text" maxlength="6" required placeholder="123456" class="w-32 px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <button type="button" @click="showLinkOtpModal = false; clearInterval(linkTimerInterval)" class="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Batal
                </button>
                <button type="submit" :disabled="isVerifyingLinkOtp || linkOtpCode.length !== 6" class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center">
                  <i v-if="isVerifyingLinkOtp" class="fas fa-spinner fa-spin mr-2"></i>
                  Verifikasi & Tautkan
                </button>
              </div>

              <div class="text-center mt-4 border-t pt-4">
                <p class="text-sm text-gray-600 mb-2">Belum menerima kode OTP?</p>
                <button type="button" 
                        @click="resendLinkOtp" 
                        :disabled="linkCooldown > 0 || isResendingLink"
                        class="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed">
                  <span v-if="isResendingLink" class="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full inline-block mr-1"></span>
                  {{ linkCooldown > 0 ? `Kirim Ulang OTP dalam ${linkCooldown}s` : 'Kirim Ulang OTP' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import api, { getStorageUrl } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import { useQuery, useQueryClient } from '@tanstack/vue-query'

const authStore = useAuthStore()
const queryClient = useQueryClient()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  // Protect profile route
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})

watch(() => authStore.isAuthenticated, (isAuth) => {
  if (!isAuth) {
    router.push('/login')
  }
})

const linkedStatus = computed(() => route.query.linked)
const linkedMessage = computed(() => route.query.msg ? decodeURIComponent(route.query.msg) : 'Gagal menautkan akun.')

const { data: profileData, isLoading: queryLoading, isFetching } = useQuery({
  queryKey: ['user_profile'],
  queryFn: async () => {
    const response = await api.get('/profile')
    return response.data.data
  },
  staleTime: 5 * 60 * 1000 // 5 menit
})

const loading = computed(() => queryLoading.value)
useGlobalLoader(loading)

const breadcrumbItems = computed(() => getBreadcrumbs.profilePage())
const saving = ref(false)
const errors = ref({})
const successMessage = ref('')

const form = ref({
  nip: '',
  name: '',
  email: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  linkedin: '',
  photo: null,
  remove_photo: false,
  email_can_update: false
})

const photoPreview = ref(null)
const photoInput = ref(null)

watch(profileData, (data) => {
  if (data) {
    form.value.nip = data.user?.nip || ''
    form.value.name = data.user?.name || ''
    form.value.email = (!data.user?.email || data.user?.email === '-') ? '' : data.user.email
    form.value.facebook = data.user?.facebook || ''
    form.value.instagram = data.user?.instagram || ''
    form.value.tiktok = data.user?.tiktok || ''
    form.value.linkedin = data.user?.linkedin || ''
    form.value.remove_photo = false
    form.value.email_can_update = !data.is_asn || !data.user?.email || data.user?.email === '-'
  }
}, { immediate: true })

const userInitials = computed(() => {
  const name = form.value.name || profileData.value?.user?.name || 'User'
  const names = name.split(' ')
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const handlePhotoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  form.value.photo = file
  form.value.remove_photo = false
  
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removePhoto = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus foto profil ini?')) return;
  
  photoPreview.value = null
  form.value.photo = null
  form.value.remove_photo = true
  
  const success = await updateProfile()
  if (success) {
    alert('Foto berhasil dihapus dari database!')
  } else {
    alert('Gagal menghapus foto. Periksa peringatan error di form Anda.')
  }
}

const updateProfile = async () => {
  try {
    saving.value = true
    errors.value = {}
    
    const formData = new FormData()
    formData.append('nip', form.value.nip)
    if (form.value.email_can_update) {
      const emailToSend = form.value.email === '-' ? '' : form.value.email;
      formData.append('email', emailToSend)
    }
    formData.append('name', form.value.name)
    formData.append('facebook', form.value.facebook)
    formData.append('instagram', form.value.instagram)
    formData.append('tiktok', form.value.tiktok)
    formData.append('linkedin', form.value.linkedin)
    
    if (form.value.photo) {
      formData.append('photo', form.value.photo)
    }
    
    if (form.value.remove_photo) {
      formData.append('remove_photo', '1')
    }

    const response = await api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      successMessage.value = 'Tersimpan.'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
      
      // Update cache manually
      queryClient.setQueryData(['user_profile'], (old) => {
         if (!old) return old;
         return {
            ...old,
            user: response.data.data.user,
            profile_photo_url: response.data.data.profile_photo_url,
            is_manual_photo: response.data.data.is_manual_photo
         }
      })
      
      // Update auth store user and localStorage
      authStore.user = response.data.data.user
      localStorage.setItem('ppid_user', JSON.stringify(authStore.user))
      
      return true
    }
    return false
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error updating profile:', error)
    }
    return false
  } finally {
    saving.value = false
  }
}
const linkGoogleAccount = () => { 
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id'
  window.location.href = baseUrl + "/api/v1/auth/google/redirect?action=link" 
}
const showOtpModal = ref(false)
const otpStep = ref('request') // 'request' | 'verify'
const isRequestingOtp = ref(false)
const isVerifyingOtp = ref(false)
const otpCode = ref('')
const otpError = ref('')
const otpSuccess = ref('')

const unlinkCooldown = ref(0)
let unlinkTimerInterval = null

const startUnlinkCooldown = () => {
  unlinkCooldown.value = 60
  clearInterval(unlinkTimerInterval)
  unlinkTimerInterval = setInterval(() => {
    if (unlinkCooldown.value > 0) unlinkCooldown.value--
    else clearInterval(unlinkTimerInterval)
  }, 1000)
}

const resendUnlinkOtp = async () => {
  if (unlinkCooldown.value > 0) return
  isRequestingOtp.value = true
  otpError.value = ''
  
  try {
    const response = await api.post('/auth/google/resend-otp', { action: 'unlink' })
    if (response.data.success) {
      otpSuccess.value = response.data.message || 'Kode OTP baru telah dikirim.'
      startUnlinkCooldown()
    }
  } catch (error) {
    otpError.value = error.response?.data?.message || 'Gagal mengirim ulang OTP.'
  } finally {
    isRequestingOtp.value = false
  }
}

const requestOtp = async () => {
  try {
    isRequestingOtp.value = true
    otpError.value = ''
    otpSuccess.value = ''
    
    const response = await api.post('/auth/google/unlink/request-otp')
    if (response.data.success) {
      otpSuccess.value = response.data.message || 'Kode OTP telah dikirim.'
      otpStep.value = 'verify'
      startUnlinkCooldown()
    }
  } catch (error) {
    otpError.value = error.response?.data?.message || 'Gagal mengirim OTP. Pastikan konfigurasi email server valid.'
  } finally {
    isRequestingOtp.value = false
  }
}

const verifyOtp = async () => {
  if (otpCode.value.length !== 6) return
  
  try {
    isVerifyingOtp.value = true
    otpError.value = ''
    
    const response = await api.post('/auth/google/unlink/verify', {
      otp: otpCode.value
    })
    
    if (response.data.success) {
      showOtpModal.value = false
      otpStep.value = 'request'
      otpCode.value = ''
      
      // Logout secara otomatis setelah memutus tautan akun
      await authStore.logout()
      
      // Redirect ke login dengan pesan sukses
      window.location.href = '/login?success=unlinked&msg=' + encodeURIComponent('Tautan akun Google Anda telah berhasil diputuskan. Silakan login kembali menggunakan NIP dan Password Anda.')
    }
  } catch (error) {
    otpError.value = error.response?.data?.message || 'Kode OTP salah atau kadaluarsa.'
  } finally {
    isVerifyingOtp.value = false
  }
}

// Link OTP Logic
const showLinkOtpModal = ref(route.query.linked === 'otp_required')
const linkEmailTarget = ref(route.query.email || '')
const linkOtpCode = ref('')
const linkOtpError = ref('')
const isVerifyingLinkOtp = ref(false)
const isResendingLink = ref(false)

const linkCooldown = ref(0)
let linkTimerInterval = null

const startLinkCooldown = () => {
  linkCooldown.value = 60
  clearInterval(linkTimerInterval)
  linkTimerInterval = setInterval(() => {
    if (linkCooldown.value > 0) linkCooldown.value--
    else clearInterval(linkTimerInterval)
  }, 1000)
}

if (showLinkOtpModal.value) {
  startLinkCooldown()
}

const resendLinkOtp = async () => {
  if (linkCooldown.value > 0) return
  isResendingLink.value = true
  linkOtpError.value = ''
  
  try {
    const response = await api.post('/auth/google/resend-otp', { action: 'link' })
    if (response.data.success) {
      startLinkCooldown()
      alert('Kode OTP baru telah dikirim.')
    }
  } catch (error) {
    linkOtpError.value = error.response?.data?.message || 'Gagal mengirim ulang OTP.'
  } finally {
    isResendingLink.value = false
  }
}

const verifyLinkOtp = async () => {
  if (linkOtpCode.value.length !== 6) return
  
  try {
    isVerifyingLinkOtp.value = true
    linkOtpError.value = ''
    
    const response = await api.post('/auth/google/link/verify-otp', {
      otp: linkOtpCode.value
    })
    
    if (response.data.success) {
      showLinkOtpModal.value = false
      linkOtpCode.value = ''
      
      // Logout secara otomatis setelah menautkan akun
      await authStore.logout()
      
      // Redirect ke login dengan pesan sukses
      window.location.href = '/login?success=linked&msg=' + encodeURIComponent('Email berhasil ditautkan! Karena email Anda sudah tertaut, silakan Login kembali menggunakan tombol "Login dengan Google".')
    }
  } catch (error) {
    linkOtpError.value = error.response?.data?.message || 'Kode OTP salah atau kadaluarsa.'
  } finally {
    isVerifyingLinkOtp.value = false
  }
}
</script>



