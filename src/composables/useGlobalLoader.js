import { watch, onUnmounted } from 'vue'
import { useLoadingStore } from '@/stores/loading'

export function useGlobalLoader(loadingRef) {
  const loadingStore = useLoadingStore()
  let isActive = false
  
  watch(loadingRef, (newVal) => {
    if (newVal && !isActive) {
      loadingStore.startLoading()
      isActive = true
    } else if (!newVal && isActive) {
      loadingStore.stopLoading()
      isActive = false
    }
  }, { immediate: true })

  onUnmounted(() => {
    if (isActive) {
      loadingStore.stopLoading()
      isActive = false
    }
  })
}
