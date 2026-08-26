import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { a as api } from './api-CX2AAiTN.mjs';
import { _ as _sfc_main$1 } from './PageHeader-CUVqtGHn.mjs';
import { u as useLoadingStore } from './loading-DMBVy40S.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "search",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const loadingStore = useLoadingStore();
    const query = ref(route.query.q || "");
    const informasiResults = ref([]);
    const standarLayananResults = ref([]);
    const orgResults = ref([]);
    const searched = ref(false);
    const getInformasiUrl = (item) => {
      if (item.content && item.content.startsWith("struktur_organisasi_") && item.organization) {
        return `/profil/tentang-opd/${item.organization.slug}`;
      }
      if (item.title && item.title.startsWith("Profil Pimpinan ") && item.organization) {
        return `/profil/pimpinan/${item.organization.slug}`;
      }
      return `/informasi/detail/${item.slug}`;
    };
    const getCatColor = (category) => {
      switch (category) {
        case "Informasi Berkala":
          return "blue";
        case "Informasi Setiap Saat":
          return "green";
        case "Informasi Serta Merta":
          return "yellow";
        case "Informasi Dikecualikan":
          return "red";
        default:
          return "slate";
      }
    };
    const performSearch = async (searchQuery) => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!(searchQuery == null ? void 0 : searchQuery.trim())) return;
      loadingStore.startLoading();
      searched.value = true;
      try {
        const res = await api.get("/global-search", { params: { q: searchQuery } });
        informasiResults.value = ((_c = (_b = (_a = res.data) == null ? void 0 : _a.data) == null ? void 0 : _b.informasi) == null ? void 0 : _c.data) || [];
        standarLayananResults.value = ((_e = (_d = res.data) == null ? void 0 : _d.data) == null ? void 0 : _e.standarLayanan) || [];
        orgResults.value = ((_g = (_f = res.data) == null ? void 0 : _f.data) == null ? void 0 : _g.organizations) || [];
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        loadingStore.stopLoading();
      }
    };
    watch(() => route.query.q, (newQ) => {
      if (newQ) {
        query.value = newQ;
        performSearch(newQ);
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "search-page bg-slate-50 min-h-screen" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Hasil Pencarian" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-12">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).search(_ctx.searchQuery),
        class: "mb-6"
      }, null, _parent));
      _push(`<div class="flex flex-col lg:flex-row gap-8"><div class="lg:w-2/3 space-y-12">`);
      if (informasiResults.value.length || standarLayananResults.value.length || orgResults.value.length) {
        _push(`<!--[-->`);
        if (informasiResults.value.length > 0) {
          _push(`<section><div class="flex items-center justify-between mb-4"><h2 class="text-xl font-black text-gray-800 flex items-center"><i class="fas fa-bullhorn mr-3 text-blue-500"></i> INFORMASI PUBLIK </h2></div><div class="space-y-6"><!--[-->`);
          ssrRenderList(informasiResults.value, (item, index) => {
            _push(`<div class="relative group">`);
            if (index === 0 && item.search_score > 100) {
              _push(`<!--[--><div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div><div class="absolute -top-3 left-8 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg z-20">Hasil Paling Sesuai</div><!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="${ssrRenderClass([
              "relative bg-white p-6 md:p-8 rounded-[2rem] border hover:border-blue-300 hover:shadow-xl transition-all duration-500 h-full flex flex-col group/card overflow-hidden",
              index === 0 && item.search_score > 100 ? "border-blue-400 shadow-xl" : "border-gray-100 shadow-sm"
            ])}"><div class="${ssrRenderClass(`absolute -right-8 -top-8 text-${getCatColor(item.category)}-50 group-hover/card:scale-110 transition-transform duration-700 opacity-30 pointer-events-none`)}"><i class="fas fa-file-alt fa-9x"></i></div><div class="relative z-10"><div class="flex items-center gap-4 mb-4"><div class="${ssrRenderClass(`w-10 h-10 rounded-2xl bg-${getCatColor(item.category)}-50 flex items-center justify-center text-${getCatColor(item.category)}-600 border border-${getCatColor(item.category)}-100/50 shadow-sm`)}"><i class="fas fa-building text-sm"></i></div><div class="flex flex-col min-w-0"><span class="text-[11px] font-black text-gray-800 uppercase tracking-tight line-clamp-1 leading-tight">${ssrInterpolate(item.organization ? item.organization.singkatan || item.organization.name : item.user ? item.user.opd_name : "Unit Tidak Terdaftar")}</span><span class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Diterbitkan pada ${ssrInterpolate(new Date(item.tanggal_upload || item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }))}</span></div></div>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: getInformasiUrl(item),
              class: "block mb-4"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<h3 class="text-lg md:text-xl font-black text-gray-900 leading-tight group-hover/card:text-blue-600 transition-colors"${_scopeId}>${ssrInterpolate(item.title)}</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "text-lg md:text-xl font-black text-gray-900 leading-tight group-hover/card:text-blue-600 transition-colors" }, toDisplayString(item.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<p class="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-6">${ssrInterpolate(item.deskripsi || item.ringkasan)}</p></div><div class="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between relative z-10"><div class="flex flex-col gap-2"><span class="${ssrRenderClass(`inline-flex items-center w-fit text-[9px] font-black px-3 py-1 rounded-full bg-${getCatColor(item.category)}-50 text-${getCatColor(item.category)}-600 border border-${getCatColor(item.category)}-100 uppercase tracking-[0.1em]`)}">${ssrInterpolate(item.category)}</span><span class="text-[10px] text-gray-400 font-bold flex items-center"><i class="fas fa-eye mr-2 text-blue-500"></i> ${ssrInterpolate(item.views_count || 0)} Dilihat </span></div>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: getInformasiUrl(item),
              class: `px-6 py-3 rounded-2xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-${getCatColor(item.category)}-600 transition-all shadow-lg active:scale-95 group/btn`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span${_scopeId}>Detail</span><i class="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"${_scopeId}></i>`);
                } else {
                  return [
                    createVNode("span", null, "Detail"),
                    createVNode("i", { class: "fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform" })
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></div></div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (standarLayananResults.value.length > 0) {
          _push(`<section class="pt-6"><div class="flex items-center justify-between mb-4"><h2 class="text-xl font-black text-gray-800 flex items-center"><i class="fas fa-file-alt mr-3 text-green-500"></i> STANDAR LAYANAN </h2></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><!--[-->`);
          ssrRenderList(standarLayananResults.value, (item) => {
            _push(`<div class="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-500 group/sl shadow-sm overflow-hidden relative flex flex-col"><div class="absolute -right-4 -top-4 text-green-50 opacity-0 group-hover/sl:opacity-100 transition-opacity duration-500"><i class="fas fa-folder-open fa-6x"></i></div>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/standar-layanan/file/${item.slug}`,
              class: "block relative z-10 h-full flex flex-col"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a, _b;
                if (_push2) {
                  _push2(`<div class="flex items-center text-[10px] font-black text-green-600 uppercase tracking-widest mb-4"${_scopeId}><span class="px-2.5 py-1 bg-green-50 rounded-lg border border-green-100"${_scopeId}>${ssrInterpolate(((_a = item.standar_layanan) == null ? void 0 : _a.title) || "Dokumen")}</span></div><h3 class="text-base font-bold text-gray-900 group-hover/sl:text-green-600 transition-colors mb-6 line-clamp-2 leading-tight flex-1"${_scopeId}>${ssrInterpolate(item.title)}</h3><div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto"${_scopeId}><span class="text-[10px] font-black text-gray-400 uppercase tracking-widest"${_scopeId}>Tahun ${ssrInterpolate(item.tahun_dokumen)}</span><div class="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center group-hover/sl:bg-green-600 transition-all shadow-md"${_scopeId}><i class="fas fa-external-link-alt text-[10px]"${_scopeId}></i></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center text-[10px] font-black text-green-600 uppercase tracking-widest mb-4" }, [
                      createVNode("span", { class: "px-2.5 py-1 bg-green-50 rounded-lg border border-green-100" }, toDisplayString(((_b = item.standar_layanan) == null ? void 0 : _b.title) || "Dokumen"), 1)
                    ]),
                    createVNode("h3", { class: "text-base font-bold text-gray-900 group-hover/sl:text-green-600 transition-colors mb-6 line-clamp-2 leading-tight flex-1" }, toDisplayString(item.title), 1),
                    createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-gray-50 mt-auto" }, [
                      createVNode("span", { class: "text-[10px] font-black text-gray-400 uppercase tracking-widest" }, "Tahun " + toDisplayString(item.tahun_dokumen), 1),
                      createVNode("div", { class: "w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center group-hover/sl:bg-green-600 transition-all shadow-md" }, [
                        createVNode("i", { class: "fas fa-external-link-alt text-[10px]" })
                      ])
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else if (searched.value) {
        _push(`<div class="bg-white py-20 px-6 rounded-[3rem] border-2 border-dashed border-gray-200 text-center shadow-inner"><div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm"><i class="fas fa-search-minus text-gray-300 text-4xl"></i></div><h3 class="text-2xl font-black text-gray-800 mb-3">Tidak ada hasil ditemukan</h3><p class="text-gray-500 max-w-md mx-auto leading-relaxed">Kami tidak dapat menemukan hasil yang cocok dengan kata kunci <span class="font-bold text-blue-600">&quot;${ssrInterpolate(query.value)}&quot;</span>. Silakan coba kata kunci yang lebih umum.</p><div class="mt-10">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Kembali ke Beranda`);
            } else {
              return [
                createTextVNode("Kembali ke Beranda")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="lg:w-1/3 space-y-8"><div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"><form class="relative"><input type="text"${ssrRenderAttr("value", query.value)} placeholder="Cari lagi..." class="w-full bg-blue-50 border border-blue-100 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><i class="fas fa-search text-blue-400 text-sm"></i></div><button type="submit" class="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-600 hover:text-blue-700"><i class="fas fa-arrow-right"></i></button></form></div>`);
      if (orgResults.value.length > 0) {
        _push(`<section><h2 class="text-xl font-black text-gray-800 mb-6 flex items-center uppercase tracking-tight"><i class="fas fa-university mr-3 text-purple-500"></i> Unit / OPD </h2><div class="space-y-4"><!--[-->`);
        ssrRenderList(orgResults.value, (item) => {
          _push(`<div class="bg-white p-4 rounded-2xl border border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all duration-500 group/opd shadow-sm">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/profil/tentang-opd/${item.slug}`,
            class: "flex items-center"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mr-4 group-hover/opd:bg-purple-600 group-hover/opd:text-white transition-all shadow-inner shrink-0"${_scopeId}><i class="fas fa-building text-base"${_scopeId}></i></div><div class="flex flex-col min-w-0"${_scopeId}><span class="text-xs font-black text-gray-700 group-hover/opd:text-purple-600 transition-colors leading-tight line-clamp-2"${_scopeId}>${ssrInterpolate(item.name)}</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mr-4 group-hover/opd:bg-purple-600 group-hover/opd:text-white transition-all shadow-inner shrink-0" }, [
                    createVNode("i", { class: "fas fa-building text-base" })
                  ]),
                  createVNode("div", { class: "flex flex-col min-w-0" }, [
                    createVNode("span", { class: "text-xs font-black text-gray-700 group-hover/opd:text-purple-600 transition-colors leading-tight line-clamp-2" }, toDisplayString(item.name), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group"><div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><i class="fas fa-paper-plane text-[12rem]"></i></div><h3 class="text-2xl font-black mb-4 relative z-10 leading-tight">Belum Menemukan Data?</h3><p class="text-sm text-blue-100/80 mb-8 relative z-10 leading-relaxed font-medium">Anda dapat mengajukan permohonan informasi publik secara resmi jika data yang Anda cari belum tersedia di portal kami.</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/permohonan-informasi",
        class: "block w-full bg-white text-blue-800 text-center text-xs font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 relative z-10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ajukan Permohonan `);
          } else {
            return [
              createTextVNode(" Ajukan Permohonan ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=search-CTLs1QkQ.mjs.map
