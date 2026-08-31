<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAccessibilityStore } from '@/stores/accessibility'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import AccessibilityWidget from '@/components/AccessibilityWidget.vue'
import SurveyModal from '@/components/SurveyModal.vue'

const accStore = useAccessibilityStore()
const authStore = useAuthStore()
</script>

<template>
  <div id="acc-main-wrapper" :class="accStore.wrapperClasses" class="min-h-screen flex flex-col bg-gray-50">
    <ClientOnly>
      <div v-if="authStore.isAdmin && (!authStore.user?.google_id || authStore.user?.email === '-')" 
           class="bg-red-600 text-white px-4 py-3 text-center text-sm md:text-base font-medium flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 shadow-md relative z-50">
        <div class="flex items-center gap-2">
          <i class="fas fa-exclamation-triangle text-red-200 text-lg"></i>
          <span>Peringatan: Akun Anda belum tertaut dengan Email Google!</span>
        </div>
        <NuxtLink to="/profile" class="bg-white text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors whitespace-nowrap shadow-sm">
          Tautkan Sekarang
        </NuxtLink>
      </div>
    </ClientOnly>
    <NavBar />
    <main id="main-content" class="flex-1">
      <transition name="page" mode="out-in">
        <slot />
      </transition>
    </main>
    <FooterSection />
  </div>
  <AccessibilityWidget />
  <SurveyModal />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>



