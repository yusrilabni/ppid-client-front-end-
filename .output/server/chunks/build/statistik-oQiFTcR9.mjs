import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { _ as _sfc_main$1 } from './PageHeader-CUVqtGHn.mjs';
import { _ as _sfc_main$3 } from './LoadingSkeleton-Cjy-6M0R.mjs';
import './nuxt-link-vc3u7b4I.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "statistik",
  __ssrInlineRender: true,
  setup(__props) {
    const stats = ref({});
    const loading = ref(true);
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "statistik-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Statistik Layanan Informasi" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-12 max-w-6xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).statistik(),
        class: "mb-6"
      }, null, _parent));
      if (loading.value) {
        _push(`<div class="space-y-8">`);
        _push(ssrRenderComponent(_sfc_main$3, { class: "h-32 w-full rounded-xl" }, null, _parent));
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8">`);
        _push(ssrRenderComponent(_sfc_main$3, { class: "h-64 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$3, { class: "h-64 w-full rounded-xl" }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="space-y-12"><div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 flex items-center justify-between"><div><p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Permohonan</p><h3 class="text-3xl font-bold text-gray-900 mt-1">${ssrInterpolate(stats.value.total || 0)}</h3></div><div class="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl"><i class="fas fa-file-alt"></i></div></div><div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 flex items-center justify-between"><div><p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Disetujui</p><h3 class="text-3xl font-bold text-gray-900 mt-1">${ssrInterpolate(stats.value.disetujui || 0)}</h3></div><div class="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl"><i class="fas fa-check"></i></div></div><div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 flex items-center justify-between"><div><p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Diproses</p><h3 class="text-3xl font-bold text-gray-900 mt-1">${ssrInterpolate(stats.value.diproses || 0)}</h3></div><div class="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-xl"><i class="fas fa-spinner"></i></div></div><div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 flex items-center justify-between"><div><p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Ditolak</p><h3 class="text-3xl font-bold text-gray-900 mt-1">${ssrInterpolate(stats.value.ditolak || 0)}</h3></div><div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xl"><i class="fas fa-times"></i></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="bg-white p-6 rounded-xl shadow-md border"><h3 class="text-lg font-bold text-gray-800 mb-4">Statistik per Bulan (${ssrInterpolate(unref(currentYear))})</h3><div class="h-64 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed border-gray-200"><p class="text-gray-400 font-medium"><i class="fas fa-chart-bar mr-2"></i> Grafik Batang</p></div></div><div class="bg-white p-6 rounded-xl shadow-md border"><h3 class="text-lg font-bold text-gray-800 mb-4">Statistik per Kategori</h3><div class="h-64 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed border-gray-200"><p class="text-gray-400 font-medium"><i class="fas fa-chart-pie mr-2"></i> Grafik Pie</p></div></div></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/statistik.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=statistik-oQiFTcR9.mjs.map
