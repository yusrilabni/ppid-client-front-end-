<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const activeSurvey = ref(null)

onMounted(async () => {
  // Check session storage to see if we already showed or dismissed it
  if (!sessionStorage.getItem('surveyModalDismissed')) {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.apiBase}/surveys`)
      
      if (response && response.data && response.data.length > 0) {
        activeSurvey.value = response.data[0]
        
        setTimeout(() => {
          isVisible.value = true
          
          // Auto close after 8 seconds if still open
          setTimeout(() => {
            if (isVisible.value) {
              closeModal()
            }
          }, 8000)
        }, 1000)
      }
    } catch (e) {
      console.error('Failed to fetch survey for modal:', e)
    }
  }
})

const closeModal = () => {
  isVisible.value = false
  sessionStorage.setItem('surveyModalDismissed', 'true')
}
</script>

<template>
  <transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-10 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-10 scale-95"
  >
    <div v-if="isVisible && activeSurvey" class="fixed bottom-6 right-6 z-[99999] w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between text-white relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div class="flex items-center gap-3 relative z-10">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <i class="fas fa-poll text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg leading-tight line-clamp-1" :title="activeSurvey.title">{{ activeSurvey.title }}</h3>
            <p class="text-xs text-blue-100">Bantu kami menjadi lebih baik</p>
          </div>
        </div>
        <button @click="closeModal" class="relative z-10 text-white/70 hover:text-white p-1 transition-colors">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-5">
        <p class="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-3" :title="activeSurvey.description || 'Luangkan waktu sejenak untuk mengisi survei ini.'">
          {{ activeSurvey.description || 'Bagaimana pendapat Anda tentang layanan kami? Luangkan waktu 1 menit untuk mengisi survei ini.' }}
        </p>
        <div class="flex items-center gap-3">
          <button @click="closeModal" class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-transparent">
            Nanti Saja
          </button>
          <NuxtLink :to="`/survei/${activeSurvey.slug}`" @click="closeModal" class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl text-center shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
            Isi Sekarang
          </NuxtLink>
        </div>
      </div>
    </div>
  </transition>
</template>

