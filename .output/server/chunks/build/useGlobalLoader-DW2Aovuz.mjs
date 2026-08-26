import { ref, watch } from 'vue';
import { u as useLoadingStore } from './loading-DMBVy40S.mjs';

function useGlobalLoader(isLoadingRef) {
  const loadingStore = useLoadingStore();
  const wasLoading = ref(false);
  watch(isLoadingRef, (newVal) => {
    if (newVal && !wasLoading.value) {
      loadingStore.startLoading();
      wasLoading.value = true;
    } else if (!newVal && wasLoading.value) {
      loadingStore.stopLoading();
      wasLoading.value = false;
    }
  }, { immediate: true });
}

export { useGlobalLoader as u };
//# sourceMappingURL=useGlobalLoader-DW2Aovuz.mjs.map
