import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api, g as getStorageUrl } from './api-CX2AAiTN.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { u as useAuthStore } from './auth-CdaZwofV.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { a as useRoute } from './server.mjs';
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
    const authStore = useAuthStore();
    const organization = ref(null);
    const informasi = ref(null);
    const { isLoading: queryLoading, data: queryData, isFetching, isError: error } = useQuery({
      queryKey: computed(() => ["opd_detail", route.params.slug]),
      queryFn: async () => {
        const slug = route.params.slug;
        const res = await api.get(`/profil/tentang-opd/${slug}`);
        return res.data;
      },
      staleTime: 6e4,
      enabled: computed(() => !!route.params.slug)
    });
    const loading = computed(() => queryLoading.value || isFetching.value && !queryData.value);
    useGlobalLoader(loading);
    watch(queryData, (newData) => {
      if (newData && newData.organization) {
        organization.value = newData.organization;
        informasi.value = newData.informasi;
      }
    }, { immediate: true });
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const options = { day: "numeric", month: "long", year: "numeric" };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 md:py-12 bg-gray-50 min-h-screen" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="mb-8">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: unref(getBreadcrumbs).opdDetail((_a = organization.value) == null ? void 0 : _a.nama_organisasi)
      }, null, _parent));
      _push(`</div>`);
      if (!loading.value) {
        _push(`<!--[-->`);
        if (unref(error) || !organization.value) {
          _push(`<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50"><i class="fas fa-building h-24 w-24 text-gray-300 mb-4 text-6xl"></i><h1 class="text-3xl font-bold text-gray-800 mb-2">OPD Tidak Ditemukan</h1><p class="text-gray-600 mb-6">Maaf, data OPD yang Anda cari tidak tersedia.</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profil/tentang-opd",
            class: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Kembali ke Daftar OPD `);
              } else {
                return [
                  createTextVNode(" Kembali ke Daftar OPD ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100"><div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 md:p-12 text-white relative overflow-hidden"><div class="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4"><i class="fas fa-building text-[150px]"></i></div><div class="relative z-10 text-center"><span class="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/20">Profil Organisasi Perangkat Daerah</span><h1 class="text-3xl md:text-5xl font-black mb-6 leading-tight">${ssrInterpolate(organization.value.name)}</h1>`);
          if (organization.value.website_url) {
            _push(`<div class="flex flex-col md:flex-row items-center justify-center gap-4 mt-8"><div class="flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20"><i class="fas fa-globe mr-3 text-blue-300"></i><span class="text-sm font-bold tracking-wide">${ssrInterpolate(organization.value.website_url.replace(/^https?:\/\//, ""))}</span></div><a${ssrRenderAttr("href", organization.value.website_url)} target="_blank" class="inline-flex items-center justify-center bg-white text-blue-700 font-black text-xs px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-xl uppercase tracking-widest gap-2"><i class="fas fa-external-link-alt"></i> Kunjungi Website Resmi </a></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="p-8 md:p-16"><div class="mb-12 flex items-center gap-4"><div class="h-10 w-2 bg-blue-600 rounded-full"></div><h2 class="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Struktur Organisasi</h2></div>`);
          if (informasi.value && informasi.value.file) {
            _push(`<div class="relative group"><div class="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"></div><div class="relative bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-gray-100 overflow-hidden"><img${ssrRenderAttr("src", unref(getStorageUrl)(informasi.value.file))}${ssrRenderAttr("alt", `Struktur Organisasi ${organization.value.name}`)} class="w-full h-auto rounded-[1.5rem] shadow-sm group-hover:scale-[1.01] transition-transform duration-700"><div class="mt-8 flex justify-center"><a${ssrRenderAttr("href", unref(getStorageUrl)(informasi.value.file))} target="_blank" class="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-800 transition-colors"><i class="fas fa-search-plus text-lg"></i> Lihat Gambar Ukuran Penuh </a></div></div></div>`);
          } else {
            _push(`<div class="bg-gray-50 rounded-[3rem] p-16 md:p-24 text-center border-2 border-dashed border-gray-200"><div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm"><i class="fas fa-sitemap text-gray-300 text-4xl"></i></div><h3 class="text-2xl font-black text-gray-900 mb-4">Struktur Belum Tersedia</h3><p class="text-gray-500 max-w-sm mx-auto leading-relaxed">Saat ini belum ada gambar struktur organisasi yang diunggah untuk unit kerja ini.</p>`);
            if (unref(authStore).user && unref(authStore).user.unit_id == organization.value.remote_id) {
              _push(`<div class="mt-10"><a${ssrRenderAttr("href", `http://ppidkab.sinjaikab.go.id/profil/tentang-opd/${organization.value.id}/manage`)} target="_blank" class="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100"><i class="fas fa-upload"></i> Unggah Struktur Sekarang </a></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`</div><div class="bg-gray-50/50 p-8 border-t border-gray-100 text-center"><p class="text-gray-400 text-xs font-bold uppercase tracking-widest"><i class="fas fa-info-circle mr-2 text-blue-400"></i> Sumber Data: PPID Kabupaten Sinjai `);
          if (organization.value.updated_at) {
            _push(`<span>- Terakhir Diperbarui: ${ssrInterpolate(formatDate(organization.value.updated_at))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div></div>`);
        }
        _push(`<div class="mt-12 text-center">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profil/tentang-opd",
          class: "inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-arrow-left"${_scopeId}></i> Kembali ke Daftar OPD `);
            } else {
              return [
                createVNode("i", { class: "fas fa-arrow-left" }),
                createTextVNode(" Kembali ke Daftar OPD ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profil/tentang-opd/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CShu-hTk.mjs.map
