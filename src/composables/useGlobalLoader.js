import { watch, onUnmounted } from 'vue'
import { useLoadingStore } from '@/stores/loading'

export function useGlobalLoader(loadingRef) {
  const loadingStore = useLoadingStore()
  
  watch(loadingRef, (newVal) => {
    if (newVal) {
      loadingStore.startLoading()
    } else {
      loadingStore.stopLoading()
    }
  }, { immediate: true })

  onUnmounted(() => {
    loadingStore.stopLoading()
  })
}
