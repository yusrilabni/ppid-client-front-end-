import { watch, onUnmounted, computed, isRef } from 'vue'
import { useLoadingStore } from '@/stores/loading'

export function useGlobalLoader(loadingRef, emptyCheckRef = null) {
  const loadingStore = useLoadingStore()
  let isActive = false
  
  const shouldLoad = computed(() => {
    if (emptyCheckRef && isRef(emptyCheckRef)) {
      return loadingRef.value || emptyCheckRef.value;
    }
    return loadingRef.value;
  })
  
  watch(shouldLoad, (newVal) => {
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
