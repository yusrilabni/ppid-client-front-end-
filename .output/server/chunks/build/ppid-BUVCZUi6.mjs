import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { useQuery } from '@tanstack/vue-query';
import { a as api } from './api-k33KGvo_.mjs';
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
  __name: "ppid",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbItems = [
      { title: "Beranda", url: "/", icon: "fas fa-home" },
      { title: "Profil PPID", url: "", icon: "fas fa-info-circle" }
    ];
    const { data, isLoading: queryLoading, isFetching, error } = useQuery({
      queryKey: ["profil_ppid"],
      queryFn: async () => {
        const response = await api.get("/profil");
        return response.data;
      },
      staleTime: 6e4
    });
    const loading = computed(() => queryLoading.value || isFetching.value && !data.value);
    useGlobalLoader(loading);
    const profile = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a.data;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profil-ppid-page min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8" }, _attrs))}><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"><div class="mb-4">`);
      _push(ssrRenderComponent(_sfc_main$1, { breadcrumbs: breadcrumbItems }, null, _parent));
      _push(`</div>`);
      if (!loading.value && profile.value) {
        _push(`<div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"><div class="relative bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-700 text-white p-8 md:p-12 overflow-hidden"><div class="absolute inset-0 opacity-10 pointer-events-none"><div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div><div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full translate-x-1/2 translate-y-1/2"></div></div><div class="relative z-10"><h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">Profil PPID</h1><p class="text-lg md:text-xl lg:text-2xl font-light opacity-90 max-w-2xl"> Pejabat Pengelola Informasi dan Dokumentasi </p></div></div><div class="p-8 md:p-12"><div class="flex items-center mb-6"><div class="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg"><i class="fas fa-eye text-2xl text-white"></i></div><div><h2 class="text-3xl font-bold text-gray-800">Visi</h2><div class="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mt-2"></div></div></div><div class="md:ml-18"><p class="text-gray-700 leading-relaxed text-lg bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">${ssrInterpolate(profile.value.vision)}</p></div></div>`);
        if (profile.value.mission && profile.value.mission.length > 0) {
          _push(`<div class="p-8 md:p-12 border-t border-gray-100"><div class="flex items-center mb-6"><div class="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg"><i class="fas fa-bullseye text-2xl text-white"></i></div><div><h2 class="text-3xl font-bold text-gray-800">Misi</h2><div class="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mt-2"></div></div></div><div class="md:ml-18"><ul class="space-y-4"><!--[-->`);
          ssrRenderList(profile.value.mission, (mission, index) => {
            _push(`<li class="flex items-start p-4 bg-green-50 rounded-xl border-l-4 border-green-500 shadow-sm transition-transform hover:-translate-y-1"><div class="flex-shrink-0 mr-4"><div class="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md"><span class="text-white font-bold text-sm">${ssrInterpolate(index + 1)}</span></div></div><span class="text-gray-700 text-lg pt-1">${ssrInterpolate(mission)}</span></li>`);
          });
          _push(`<!--]--></ul></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="p-8 md:p-12 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50"><div class="text-center mb-10"><div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4"><i class="fas fa-sitemap text-2xl text-white"></i></div><h2 class="text-3xl font-bold text-gray-800 mb-3">Struktur Organisasi PPID</h2><p class="text-gray-600 max-w-2xl mx-auto">Diagram organisasi Pejabat Pengelola Informasi dan Dokumentasi</p></div>`);
        if (profile.value.structure_image) {
          _push(`<div class="flex justify-center"><div class="relative group max-w-4xl w-full"><div class="absolute -inset-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div><img${ssrRenderAttr("src", profile.value.structure_image)} alt="Struktur Organisasi PPID" class="relative w-full h-auto rounded-xl shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:scale-[1.02]"></div></div>`);
        } else {
          _push(`<div class="max-w-4xl mx-auto"><div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 text-center py-12"><i class="fas fa-project-diagram text-4xl text-blue-400 mb-4"></i><h3 class="text-2xl font-bold text-gray-700 mb-2">Struktur Organisasi</h3><p class="text-gray-500">Gambar struktur organisasi belum diunggah.</p></div></div>`);
        }
        _push(`</div><div class="p-8 md:p-12 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50"><div class="text-center mb-10"><div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4"><i class="fas fa-address-book text-2xl text-white"></i></div><h2 class="text-3xl font-bold text-gray-800 mb-3">Hubungi Kami</h2><p class="text-gray-600">Terhubung dengan PPID untuk informasi lebih lanjut</p></div><div class="flex flex-col lg:flex-row gap-8"><div class="lg:w-1/2 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 flex flex-col"><h3 class="text-2xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center"><i class="fas fa-info-circle text-blue-500 mr-3"></i> Detail Kontak </h3><div class="space-y-6 flex-grow"><div class="flex items-start"><div class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white flex items-center justify-center flex-shrink-0 mr-4 shadow-md"><i class="fas fa-map-marker-alt"></i></div><div><h4 class="font-semibold text-gray-800 mb-1">Alamat</h4><p class="text-gray-600 leading-relaxed">${ssrInterpolate(profile.value.address)}</p></div></div><div class="flex items-start"><div class="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 text-white flex items-center justify-center flex-shrink-0 mr-4 shadow-md"><i class="fas fa-phone"></i></div><div><h4 class="font-semibold text-gray-800 mb-1">Telepon</h4><p class="text-gray-600 font-medium">${ssrInterpolate(profile.value.phone)}</p></div></div><div class="flex items-start"><div class="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white flex items-center justify-center flex-shrink-0 mr-4 shadow-md"><i class="fas fa-envelope"></i></div><div><h4 class="font-semibold text-gray-800 mb-1">Email</h4><a${ssrRenderAttr("href", `mailto:${profile.value.email}`)} class="text-blue-600 hover:text-blue-800 font-medium transition-colors">${ssrInterpolate(profile.value.email)}</a></div></div></div></div><div class="lg:w-1/2 flex flex-col"><div class="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 flex-grow flex flex-col"><h3 class="text-2xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center"><i class="fas fa-map-marked-alt text-amber-500 mr-3"></i> Lokasi </h3>`);
        if (profile.value.maps_url) {
          _push(`<div class="flex-grow relative overflow-hidden rounded-xl border border-gray-200 min-h-[300px]"><iframe${ssrRenderAttr("src", profile.value.maps_url)} class="absolute top-0 left-0 w-full h-full" style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div></div>`);
      } else {
        _push(`<div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-12 text-center border-2 border-dashed border-blue-200 mt-8"><div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-300 to-blue-300 rounded-full mb-8 shadow-lg"><i class="fas fa-exclamation-circle text-4xl text-white"></i></div><h2 class="text-3xl font-bold text-gray-800 mb-4">Profil PPID Tidak Ditemukan</h2><p class="text-gray-600 text-lg mb-8 max-w-md mx-auto"> Tidak ada profil PPID aktif yang dapat ditampilkan saat ini. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-home mr-3"${_scopeId}></i> Kembali ke Beranda `);
            } else {
              return [
                createVNode("i", { class: "fas fa-home mr-3" }),
                createTextVNode(" Kembali ke Beranda ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profil/ppid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ppid-BUVCZUi6.mjs.map
