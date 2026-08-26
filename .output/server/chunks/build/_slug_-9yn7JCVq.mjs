import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api, b as getAssetUrl } from './api-CX2AAiTN.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { a as useRoute, u as useRouter } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'axios';
import './loading-DMBVy40S.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const slug = computed(() => route.params.slug);
    const getApiUrl = (path) => {
      return getAssetUrl(path.replace(/^\//, ""));
    };
    const fetchStandarLayanan = async ({ queryKey }) => {
      const [_key, currentSlug] = queryKey;
      const res = await api.get(`/standar-layanan/${currentSlug}`);
      if (res.data.success && res.data.redirect) {
        router.replace(res.data.redirectUrl);
        throw new Error("Redirecting");
      }
      return res.data;
    };
    const { data: response, isLoading } = useQuery({
      queryKey: ["standar-layanan", slug],
      queryFn: fetchStandarLayanan,
      staleTime: 3e4,
      retry: false
    });
    useGlobalLoader(isLoading);
    const data = computed(() => {
      var _a;
      return (_a = response.value) == null ? void 0 : _a.data;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 bg-gray-50 min-h-screen" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      if (!unref(isLoading) && data.value) {
        _push(ssrRenderComponent(_sfc_main$1, {
          breadcrumbs: unref(getBreadcrumbs).standarLayananDetail((_b = (_a = data.value) == null ? void 0 : _a.standarLayanan) == null ? void 0 : _b.title, (_c = data.value) == null ? void 0 : _c.categoryIcon),
          class: "mb-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(isLoading) && data.value) {
        _push(`<div class="bg-white rounded-xl shadow-lg overflow-hidden"><div class="p-6 md:p-8"><h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">${ssrInterpolate((_d = data.value.standarLayanan) == null ? void 0 : _d.title)}</h1><div class="hidden md:block overflow-x-auto rounded-lg border border-gray-200"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gradient-to-r from-blue-600 to-blue-800 text-white"><tr><th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">No.</th><th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Judul Dokumen</th><th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Aktivitas</th><th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Aksi</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(data.value.subLayanans, (file, index) => {
          _push(`<tr class="hover:bg-gray-50 transition duration-150 ease-in-out"><td class="px-6 py-4 text-sm font-medium text-gray-900">${ssrInterpolate(index + 1)}</td><td class="px-6 py-4 whitespace-normal text-sm font-semibold text-gray-900">${ssrInterpolate(file.title)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"><div class="flex flex-col space-y-1"><div class="flex items-center"><i class="fas fa-eye text-purple-500 mr-2 text-xs"></i><span class="text-xs">Lihat: ${ssrInterpolate(file.views_count || 0)}</span></div><div class="flex items-center"><i class="fas fa-download text-blue-500 mr-2 text-xs"></i><span class="text-xs">Unduh: ${ssrInterpolate(file.download_count || 0)}</span></div></div></td><td class="px-6 py-4 whitespace-nowrap text-sm font-medium"><div class="flex flex-wrap gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/standar-layanan/file/${file.slug}`,
            class: "text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded transition duration-150",
            title: "Lihat Detail"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fas fa-eye"${_scopeId}></i>`);
              } else {
                return [
                  createVNode("i", { class: "fas fa-eye" })
                ];
              }
            }),
            _: 2
          }, _parent));
          if (file.file_type === "url") {
            _push(`<a${ssrRenderAttr("href", getApiUrl(`/standar-layanan/url/${file.id}`))} target="_blank" class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded transition duration-150" title="Buka File Eksternal"><i class="fas fa-external-link-alt"></i></a>`);
          } else if (file.file) {
            _push(`<a${ssrRenderAttr("href", getApiUrl(`/standar-layanan/download/${file.id}`))} target="_blank" class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded transition duration-150" title="Download File"><i class="fas fa-download"></i></a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (!data.value.subLayanans || data.value.subLayanans.length === 0) {
          _push(`<tr><td colspan="4" class="px-6 py-12 text-center text-gray-500">Tidak ada dokumen</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><div class="md:hidden space-y-4"><!--[-->`);
        ssrRenderList(data.value.subLayanans, (file, index) => {
          _push(`<div class="bg-gray-50 rounded-lg border border-gray-200 p-4"><h3 class="text-sm font-bold text-gray-900 leading-tight mb-3">${ssrInterpolate(file.title)}</h3><div class="flex items-center justify-between pt-3 border-t border-gray-200"><div class="flex items-center gap-4 text-[10px] text-gray-500"><span class="flex items-center"><i class="far fa-eye mr-1"></i> ${ssrInterpolate(file.views_count || 0)}</span><span class="flex items-center"><i class="far fa-arrow-alt-circle-down mr-1"></i> ${ssrInterpolate(file.download_count || 0)}</span></div><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/standar-layanan/file/${file.slug}`,
            class: "p-2 text-blue-600 bg-white border border-blue-100 rounded-md shadow-sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fas fa-eye text-sm"${_scopeId}></i>`);
              } else {
                return [
                  createVNode("i", { class: "fas fa-eye text-sm" })
                ];
              }
            }),
            _: 2
          }, _parent));
          if (file.file_type === "url") {
            _push(`<a${ssrRenderAttr("href", getApiUrl(`/standar-layanan/url/${file.id}`))} target="_blank" class="p-2 text-green-600 bg-white border border-green-100 rounded-md shadow-sm"><i class="fas fa-external-link-alt text-sm"></i></a>`);
          } else if (file.file) {
            _push(`<a${ssrRenderAttr("href", getApiUrl(`/standar-layanan/download/${file.id}`))} target="_blank" class="p-2 text-green-600 bg-white border border-green-100 rounded-md shadow-sm"><i class="fas fa-download text-sm"></i></a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]-->`);
        if (!data.value.subLayanans || data.value.subLayanans.length === 0) {
          _push(`<div class="text-center py-8 text-gray-500 text-sm"> Tidak ada dokumen ditemukan </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else if (!unref(isLoading) && !data.value) {
        _push(`<div class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100"><div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i></div><h3 class="text-xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h3><p class="text-gray-500">Data standar layanan tidak ditemukan.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/standar-layanan/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-9yn7JCVq.mjs.map
