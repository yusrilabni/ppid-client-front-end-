<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Breadcrumbs at the top -->
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <Breadcrumbs :breadcrumbs="breadcrumbItems" />
    </div>

    <!-- Centered Form -->
    <div class="flex-1 flex items-center justify-center px-4 pb-12">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 relative">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <img :src="getAssetUrl('storage/logo/ppid.webp')" alt="PPID" class="h-16 w-auto mx-auto mb-4" />
          <h1 class="text-2xl font-bold text-gray-800 leading-tight">DAFTAR AKUN</h1>
          <p class="text-sm text-gray-600 mt-2">Sistem Informasi Pejabat Pengelola Informasi & Dokumentasi</p>
        </div>
        
        <!-- Error Alert -->
        <div v-if="error" class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 shadow-sm">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-rose-800 leading-tight">Terjadi Kesalahan</h4>
            <p class="text-xs text-rose-600 mt-1 leading-relaxed">{{ error }}</p>
          </div>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-id-card"></i>
              </span>
              <input v-model="form.name" type="text" required class="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan nama">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-envelope"></i>
              </span>
              <input v-model="form.email" type="email" required class="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan email aktif">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Kata Sandi</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-lock"></i>
              </span>
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="w-full py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Minimal 8 karakter">
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Sandi</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-check-circle"></i>
              </span>
              <input v-model="form.password_confirmation" :type="showConfirm ? 'text' : 'password'" required class="w-full py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Ulangi kata sandi">
              <button type="button" @click="showConfirm = !showConfirm" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i class="fas" :class="showConfirm ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <button type="submit" :disabled="loading" class="w-full text-white py-3.5 mt-2 rounded-xl font-medium transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed" style="background: linear-gradient(135deg, #2563eb, #1e40af);">
            <span v-if="loading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block align-middle"></span>
            {{ loading ? 'Mendaftarkan...' : 'Buat Akun' }}
          </button>
          
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Atau daftar dengan</span>
            </div>
          </div>

          <button @click="handleGoogleRegister" type="button" :disabled="loading" class="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5" />
            <span>Daftar dengan Google</span>
          </button>
        </div>
        
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 mb-3">Sudah punya akun?</p>
          <NuxtLink to="/login" class="block w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors">
            Masuk ke Sistem
          </NuxtLink>
        </div>
        
      </div>
      
      <p class="text-center text-xs text-gray-500 mt-8">
        &copy; 2026 PPID - Kabupaten Sinjai
      </p>
    </div>
    </div>

    <!-- OTP Verification Modal -->
    <div v-if="showOtpModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-envelope-open-text text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Verifikasi Email Anda</h3>
          <p class="text-sm text-gray-500 mt-2">
            Kami telah mengirimkan 6 digit kode OTP ke email Google Anda.
          </p>
          <p class="text-sm font-semibold text-gray-700 mt-1">{{ otpEmail }}</p>
        </div>

        <!-- Error Alert -->
        <div v-if="otpError" class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2">
          <i class="fas fa-exclamation-circle text-rose-600 mt-0.5"></i>
          <p class="text-xs text-rose-600">{{ otpError }}</p>
        </div>

        <form @submit.prevent="handleVerifyOtp" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Kode OTP</label>
            <input v-model="otpCode" type="text" maxlength="6" required
                   class="w-full text-center text-2xl tracking-[0.5em] py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none font-mono"
                   placeholder="------">
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeOtpModal" class="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="loadingOtp" class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center">
              <span v-if="loadingOtp" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Verifikasi
            </button>
          </div>

          <div class="text-center mt-4 border-t pt-4">
            <p class="text-sm text-gray-600 mb-2">Belum menerima kode OTP?</p>
            <button type="button" 
                    @click="handleResendOtp" 
                    :disabled="cooldownTimer > 0 || loadingResend"
                    class="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed">
              <span v-if="loadingResend" class="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full inline-block mr-1"></span>
              {{ cooldownTimer > 0 ? `Kirim Ulang OTP dalam ${cooldownTimer}s` : 'Kirim Ulang OTP' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'
import api, { getAssetUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const breadcrumbItems = computed(() => getBreadcrumbs.registerPage())

const form = ref({ name: '', email: '', password: '', password_confirmation: '' })
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')

// OTP State
const showOtpModal = ref(false)
const otpEmail = ref('')
const otpCode = ref('')
const otpError = ref('')
const loadingOtp = ref(false)

const loadingResend = ref(false)
const cooldownTimer = ref(60)
let timerInterval = null

const startCooldown = () => {
  cooldownTimer.value = 60
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (cooldownTimer.value > 0) {
      cooldownTimer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

onMounted(() => {
  if (route.query.otp_required === 'true' && route.query.email) {
    showOtpModal.value = true
    otpEmail.value = decodeURIComponent(route.query.email)
    startCooldown() // Start cooldown when modal opens
    // Clean up URL
    router.replace('/register')
  } else if (route.query.error === 'already_registered') {
    error.value = 'Email Anda sudah terdaftar di sistem. Silakan login ke akun Anda.'
  } else if (route.query.error === 'not_registered') {
    error.value = 'Email Anda belum terdaftar di sistem. Silakan buat akun terlebih dahulu.'
  } else if (route.query.error === 'auth_failed') {
    error.value = 'Gagal mendaftar dengan Google. Silakan coba lagi.'
  }
})

const handleGoogleRegister = () => {
  loading.value = true
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id'
  window.location.href = `${apiUrl}/api/v1/auth/google/redirect?action=register`
}

const handleRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Kata sandi dan konfirmasi tidak cocok!'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await authStore.register(form.value)
    if (!res.success) throw new Error(res.message)
    const pending = localStorage.getItem('pending_download_twibbon');
      if (pending) {
        localStorage.removeItem('pending_download_twibbon');
        router.push('/twibbon/' + pending + '?auto_download=1');
      } else {
        router.push('/');
      }
  } catch (err) {
    error.value = err.message || 'Registrasi gagal. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const closeOtpModal = () => {
  showOtpModal.value = false
  otpCode.value = ''
  otpError.value = ''
  clearInterval(timerInterval)
}

const handleResendOtp = async () => {
  if (cooldownTimer.value > 0) return
  
  loadingResend.value = true
  otpError.value = ''
  
  try {
    const response = await api.post('/auth/google/resend-otp', {
      action: 'register',
      email: otpEmail.value
    })
    
    if (response.data.success) {
      startCooldown()
      // Optional: show a success toast here if you have a toast system
    } else {
      throw new Error(response.data.message || 'Gagal mengirim ulang OTP.')
    }
  } catch (err) {
    otpError.value = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengirim ulang OTP.'
  } finally {
    loadingResend.value = false
  }
}

const handleVerifyOtp = async () => {
  if (otpCode.value.length < 6) {
    otpError.value = 'Kode OTP harus 6 digit'
    return
  }

  loadingOtp.value = true
  otpError.value = ''
  
  try {
    const response = await api.post('/auth/google/register/verify-otp', {
      email: otpEmail.value,
      otp: otpCode.value
    })

    if (response.data.success && response.data.token) {
      localStorage.setItem('ppid_token', response.data.token)
      localStorage.setItem('ppid_user', JSON.stringify(response.data.user))
      authStore.token = response.data.token
      authStore.user = response.data.user
      
      closeOtpModal()
      const pending = localStorage.getItem('pending_download_twibbon');
      if (pending) {
        localStorage.removeItem('pending_download_twibbon');
        router.push('/twibbon/' + pending + '?auto_download=1');
      } else {
        router.push('/');
      }
    } else {
      throw new Error(response.data.message || 'Verifikasi gagal.')
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan saat memverifikasi OTP.'
    otpError.value = errorMsg
  } finally {
    loadingOtp.value = false
  }
}
</script>

