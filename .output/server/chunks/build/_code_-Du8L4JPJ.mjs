import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { _ as _sfc_main$1 } from './PageHeader-CUVqtGHn.mjs';
import { a as useRoute } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "[[code]]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const code = ref(route.params.code || "");
    const loading = ref(false);
    const searched = ref(false);
    const result = ref(null);
    const getStatusClass = (status) => {
      const s = String(status).toLowerCase();
      if (s.includes("selesai") || s.includes("diterima")) return "bg-green-100 text-green-800 border border-green-200";
      if (s.includes("tolak")) return "bg-red-100 text-red-800 border border-red-200";
      if (s.includes("proses")) return "bg-blue-100 text-blue-800 border border-blue-200";
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tracking-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Lacak Permohonan" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-12 max-w-2xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).trackingPage(),
        class: "mb-6"
      }, null, _parent));
      _push(`<div class="bg-white rounded-xl shadow-lg p-8 border"><h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Cek Status Permohonan Anda</h2><form class="mb-8"><div class="flex flex-col md:flex-row gap-4"><input${ssrRenderAttr("value", code.value)} type="text" placeholder="Masukkan Kode Registrasi" class="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-mono tracking-wider uppercase" required><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center whitespace-nowrap">`);
      if (loading.value) {
        _push(`<span class="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>`);
      } else {
        _push(`<i class="fas fa-search mr-2"></i>`);
      }
      _push(` Lacak </button></div></form>`);
      if (result.value) {
        _push(`<div class="border-t pt-8 mt-4"><div class="flex items-center justify-between mb-6"><h3 class="text-lg font-bold text-gray-800">Detail Permohonan</h3><span class="${ssrRenderClass([getStatusClass(result.value.status), "px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide"])}">${ssrInterpolate(result.value.status)}</span></div><div class="space-y-4 text-sm bg-gray-50 p-6 rounded-lg"><div class="grid grid-cols-3 gap-2"><span class="text-gray-500 font-medium col-span-1">Pemohon</span><span class="font-semibold text-gray-900 col-span-2">: ${ssrInterpolate(result.value.nama)}</span></div><div class="grid grid-cols-3 gap-2"><span class="text-gray-500 font-medium col-span-1">Tanggal Masuk</span><span class="text-gray-900 col-span-2">: ${ssrInterpolate(result.value.created_at)}</span></div><div class="grid grid-cols-3 gap-2"><span class="text-gray-500 font-medium col-span-1">Informasi</span><span class="text-gray-900 col-span-2 truncate"${ssrRenderAttr("title", result.value.rincian_informasi)}>: ${ssrInterpolate(result.value.rincian_informasi)}</span></div>`);
        if (result.value.alasan_penolakan) {
          _push(`<div class="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md"><p class="font-bold mb-1">Catatan/Alasan:</p><p>${ssrInterpolate(result.value.alasan_penolakan)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else if (searched.value && !loading.value) {
        _push(`<div class="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-100"><i class="fas fa-exclamation-circle text-3xl mb-2"></i><p>Permohonan dengan kode <strong>${ssrInterpolate(code.value)}</strong> tidak ditemukan.</p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tracking/[[code]].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_code_-Du8L4JPJ.mjs.map
