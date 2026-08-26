import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api } from './api-CX2AAiTN.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
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
import 'axios';
import './loading-DMBVy40S.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { data: yearsResponse, isLoading } = useQuery({
      queryKey: ["pbj-years"],
      queryFn: async () => {
        const res = await api.get("/pbj/years");
        return res.data;
      }
    });
    useGlobalLoader(isLoading);
    const years = computed(() => {
      var _a;
      return ((_a = yearsResponse.value) == null ? void 0 : _a.data) || [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto my-8 px-4 md:px-0" }, _attrs))}><div class="max-w-7xl mx-auto"><div class="mb-6">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: unref(getBreadcrumbs).pbj()
      }, null, _parent));
      _push(`</div><div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6"><h2 class="text-2xl font-bold text-gray-800 mb-6">Kuesioner Pengadaan Barang dan Jasa (PBJ)</h2>`);
      if (unref(isLoading)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl h-40 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (years.value.length > 0) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(years.value, (year) => {
          _push(`<div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 transform hover:-translate-y-1 transition-all duration-300"><div class="flex flex-col h-full"><div class="flex-1"><div class="p-3 rounded-lg bg-blue-500/10 inline-block"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><h3 class="text-xl font-bold text-gray-900 mt-4">Kuesioner Tahun ${ssrInterpolate(year)}</h3><p class="text-gray-600 mt-2">Kumpulan pertanyaan untuk evaluasi PBJ tahun ${ssrInterpolate(year)}.</p></div><div class="mt-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/pbj/${year}`,
            class: "inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Lihat Detail <i class="fas fa-arrow-right ml-2"${_scopeId}></i>`);
              } else {
                return [
                  createTextVNode(" Lihat Detail "),
                  createVNode("i", { class: "fas fa-arrow-right ml-2" })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="md:col-span-2 lg:col-span-3 text-center py-12"><svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><h3 class="mt-4 text-lg font-medium text-gray-900">Belum Ada Kuesioner</h3><p class="mt-2 text-gray-500">Saat ini belum ada kuesioner PBJ yang tersedia.</p></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pbj/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DwvTCyto.mjs.map
