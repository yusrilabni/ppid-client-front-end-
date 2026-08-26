import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { g as getStorageUrl, a as api } from './api-k33KGvo_.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { _ as _sfc_main$2 } from './LoadingSkeleton-Cjy-6M0R.mjs';
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

const _sfc_main = {
  __name: "ppid",
  __ssrInlineRender: true,
  setup(__props) {
    const fetchLaporan = async () => {
      var _a;
      const res = await api.get("/laporan");
      return Array.isArray(res.data) ? res.data : ((_a = res.data) == null ? void 0 : _a.data) || [];
    };
    const { data: items, isLoading: loading } = useQuery({
      queryKey: ["laporan-ppid"],
      queryFn: fetchLaporan,
      staleTime: 6e4,
      initialData: []
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 md:py-12 bg-gray-50 min-h-screen" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: unref(getBreadcrumbs).laporanPpid()
      }, null, _parent));
      _push(`<div class="mb-16 text-center mt-8"><h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"><i class="fas fa-file-invoice text-blue-600 mr-2"></i> Laporan Tahunan PPID </h1><p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"> Daftar laporan tahunan pelayanan informasi publik Dinas Komunikasi Informatika dan Persandian Kabupaten Sinjai. </p></div>`);
      if (unref(loading)) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(ssrRenderComponent(_sfc_main$2, {
            key: i,
            class: "h-96 w-full rounded-[2.5rem]"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(items).length > 0) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
          ssrRenderList(unref(items), (item) => {
            _push(`<div class="group flex flex-col rounded-[2.5rem] shadow-md hover:shadow-2xl overflow-hidden bg-white border border-gray-100 transition-all duration-500 hover:-translate-y-2 relative"><div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50 to-white opacity-50"></div><div class="relative h-80 overflow-hidden m-4 rounded-[2rem] shadow-inner bg-gray-50 flex-shrink-0">`);
            if (item.cover) {
              _push(`<img class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"${ssrRenderAttr("src", unref(getStorageUrl)(item.cover))}${ssrRenderAttr("alt", item.title)}>`);
            } else {
              _push(`<div class="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100"><i class="fas fa-file-pdf text-blue-200 text-7xl mb-4"></i><span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Preview Cover</span></div>`);
            }
            _push(`<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg border border-blue-50"> TAHUN ${ssrInterpolate(item.tahun || item.year)}</div></div><div class="flex-1 p-8 pt-2 flex flex-col justify-between"><div class="flex-1 mb-6 flex items-center justify-center"><h3 class="${ssrRenderClass([item.title.length > 50 ? "text-xs" : item.title.length > 25 ? "text-sm" : "text-base", "font-black text-gray-900 text-center leading-snug group-hover:text-blue-600 transition-colors"])}">${ssrInterpolate(item.title)}</h3></div><div class="grid grid-cols-1 gap-3">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/laporan/ppid/preview/${item.encoded_id}`,
              class: "flex items-center justify-center w-full bg-blue-600 text-white font-black text-[10px] py-3.5 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2 shadow-lg shadow-blue-100 hover:shadow-blue-200"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="fas fa-eye text-xs"${_scopeId}></i> Preview Laporan `);
                } else {
                  return [
                    createVNode("i", { class: "fas fa-eye text-xs" }),
                    createTextVNode(" Preview Laporan ")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<a${ssrRenderAttr("href", unref(getStorageUrl)(item.file))} download class="flex items-center justify-center w-full bg-white text-gray-600 border-2 border-gray-100 hover:border-blue-500 hover:text-blue-600 font-black text-[10px] py-3 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2"><i class="fas fa-download text-xs"></i> Download PDF </a></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-dashed border-gray-200"><div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8"><i class="fas fa-folder-open text-gray-200 text-4xl"></i></div><h3 class="text-2xl font-black text-gray-900 mb-3">Belum Ada Laporan</h3><p class="text-gray-500 max-w-sm mx-auto">Daftar laporan tahunan akan segera tersedia di halaman ini. Silakan kembali lagi nanti.</p></div>`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/laporan/ppid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ppid-CG6Xl2Kr.mjs.map
