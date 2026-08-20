<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute top-1/2 -left-24 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <div class="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/50">
        <div class="text-center">
          <div class="mx-auto h-20 w-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <i class="fas fa-user-plus text-4xl text-white"></i>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Buat Akun</h2>
          <p class="mt-2 text-sm text-gray-500 font-medium">
            Daftar untuk mengakses fitur penuh PPID
          </p>
        </div>
        
        <div v-if="error" class="mt-6 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl border border-red-100 flex items-start">
          <i class="fas fa-exclamation-circle text-red-500 mt-0.5 mr-3"></i>
          <p class="text-sm text-red-700 font-medium">{{ error }}</p>
        </div>
        
        <form class="mt-8 space-y-5" @submit.prevent="handleRegister">
          
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-user text-gray-400"></i>
              </div>
              <input v-model="form.name" id="name" type="text" required class="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow sm:text-sm bg-white/50 focus:bg-white" placeholder="Budi Santoso">
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input v-model="form.email" id="email" type="email" required class="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow sm:text-sm bg-white/50 focus:bg-white" placeholder="budi@email.com">
            </div>
          </div>
            
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input v-model="form.password" id="password" type="password" required class="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow sm:text-sm bg-white/50 focus:bg-white" placeholder="Min. 8 karakter">
            </div>
          </div>
          
          <div>
            <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-shield-alt text-gray-400"></i>
              </div>
              <input v-model="form.password_confirmation" id="password_confirmation" type="password" required class="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow sm:text-sm bg-white/50 focus:bg-white" placeholder="Ulangi password">
            </div>
          </div>

          <div class="pt-2">
            <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
              <span v-if="loading" class="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang' }}
            </button>
          </div>
        </form>
        
        <div class="mt-8 text-center text-sm text-gray-600">
          Sudah punya akun? 
          <router-link to="/login" class="font-bold text-indigo-600 hover:text-purple-600 transition-colors">Masuk di sini</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Password dan konfirmasi tidak cocok!'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await authStore.register(form.value)
    if (!res.success) {
        throw new Error(res.message)
    }
    router.push('/admin')
  } catch (err) {
    error.value = err.message || 'Registrasi gagal. Coba email lain.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>
