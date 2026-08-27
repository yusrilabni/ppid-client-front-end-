import { watch, onUnmounted, ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'

export function useGlobalLoader(isLoadingRef) {
  const loadingStore = useLoadingStore()
  const wasLoading = ref(false)

  watch(isLoadingRef, (newVal) => {
    if (typeof window === 'undefined') return // Prevent Pinia state leak on SSR

    if (newVal && !wasLoading.value) {
      loadingStore.startLoading()
      wasLoading.value = true
    } else if (!newVal && wasLoading.value) {
      loadingStore.stopLoading()
      wasLoading.value = false
    }
  }, { immediate: true })

  onUnmounted(() => {
    if (typeof window === 'undefined') return

    if (wasLoading.value) {
      loadingStore.stopLoading()
      wasLoading.value = false
    }
  })
}
