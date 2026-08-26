import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './LoadingSkeleton-Cjy-6M0R.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const stats = ref({});
    const activities = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-page p-6" }, _attrs))}><h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>`);
      if (loading.value) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: i,
            class: "h-32 w-full rounded-lg"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"><h3 class="text-gray-500 text-sm font-medium uppercase">Total Informasi</h3><p class="text-3xl font-bold text-gray-800 mt-2">${ssrInterpolate(stats.value.informasi || 0)}</p></div><div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500"><h3 class="text-gray-500 text-sm font-medium uppercase">Permohonan Baru</h3><p class="text-3xl font-bold text-gray-800 mt-2">${ssrInterpolate(stats.value.permohonan_baru || 0)}</p></div><div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500"><h3 class="text-gray-500 text-sm font-medium uppercase">Pengunjung Bulan Ini</h3><p class="text-3xl font-bold text-gray-800 mt-2">${ssrInterpolate(stats.value.pengunjung || 0)}</p></div><div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500"><h3 class="text-gray-500 text-sm font-medium uppercase">Total OPD</h3><p class="text-3xl font-bold text-gray-800 mt-2">${ssrInterpolate(stats.value.opd || 0)}</p></div></div>`);
      }
      _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-lg font-bold text-gray-800 mb-4">Aktivitas Terbaru</h2><div class="space-y-4"><!--[-->`);
      ssrRenderList(activities.value, (activity, index) => {
        _push(`<div class="flex items-start pb-4 border-b last:border-0 last:pb-0"><div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0"><i class="fas fa-bell"></i></div><div><p class="text-gray-800 font-medium">${ssrInterpolate(activity.message)}</p><p class="text-sm text-gray-500">${ssrInterpolate(activity.time)}</p></div></div>`);
      });
      _push(`<!--]-->`);
      if (!activities.value.length) {
        _push(`<div class="text-center text-gray-500 py-4"> Tidak ada aktivitas terbaru. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DNBPBz13.mjs.map
