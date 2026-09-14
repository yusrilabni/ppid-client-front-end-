<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center p-8 bg-white shadow-xl rounded-2xl max-w-md mx-auto">
      <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="fas fa-exclamation-triangle text-4xl text-blue-600"></i>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Halaman Tidak Ditemukan</h1>
      <p class="text-gray-600 mb-8">Maaf, tautan yang Anda tuju sudah tidak tersedia atau telah dipindahkan.</p>
      <button @click="handleError" class="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold">
        Kembali ke Beranda
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

// Otomatis arahkan 404 ke beranda
if (props.error && props.error.statusCode === 404) {
  clearError({ redirect: '/' })
}

const handleError = () => clearError({ redirect: '/' })
</script>
