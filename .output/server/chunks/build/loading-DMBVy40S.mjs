import { f as defineStore } from './server.mjs';

const useLoadingStore = defineStore("loading", {
  state: () => ({
    loadingCount: 0
  }),
  getters: {
    isLoading: (state) => state.loadingCount > 0
  },
  actions: {
    startLoading() {
      this.loadingCount++;
    },
    stopLoading() {
      if (this.loadingCount > 0) {
        this.loadingCount--;
      }
    },
    forceStop() {
      this.loadingCount = 0;
    }
  }
});

export { useLoadingStore as u };
//# sourceMappingURL=loading-DMBVy40S.mjs.map
