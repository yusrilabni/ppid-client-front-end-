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
    <NavBar />
    <main id="main-content" class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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
