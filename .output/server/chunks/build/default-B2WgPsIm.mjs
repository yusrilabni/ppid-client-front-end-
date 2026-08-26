import { resolveComponent, unref, withCtx, createVNode, resolveDynamicComponent, Transition, openBlock, createBlock, ref, computed, mergeProps, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderClass, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { f as defineStore, u as useRouter, a as useRoute } from './server.mjs';
import { u as useAuthStore } from './auth-CdaZwofV.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { u as useLoadingStore } from './loading-DMBVy40S.mjs';
import { g as getStorageUrl } from './api-CX2AAiTN.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'axios';

const useAccessibilityStore = defineStore("accessibility", () => {
  const isOpen = ref(false);
  const fontLevel = ref(localStorage.getItem("acc_font_level") || "normal");
  const contrast = ref(localStorage.getItem("acc_contrast") || "default");
  const links = ref(localStorage.getItem("acc_links") === "true");
  const headings = ref(localStorage.getItem("acc_headings") === "true");
  const focus = ref(localStorage.getItem("acc_focus") || "default");
  const keyboard = ref(localStorage.getItem("acc_keyboard") === "true");
  const textSpacing = ref(localStorage.getItem("acc_text_spacing") === "true");
  const hideImages = ref(localStorage.getItem("acc_hide_images") === "true");
  const dyslexic = ref(localStorage.getItem("acc_dyslexic") || "default");
  const lineHeight = ref(localStorage.getItem("acc_line_height") === "true");
  const alignment = ref(localStorage.getItem("acc_alignment") || "default");
  const saturation = ref(localStorage.getItem("acc_saturation") || "default");
  const fontMap = { "kecil": 12, "normal": 16, "sedang": 20, "besar": 24 };
  const fontSize = computed(() => fontMap[fontLevel.value] || 16);
  const wrapperClasses = computed(() => ({
    "acc-contrast-light": contrast.value === "light",
    "acc-contrast-invert": contrast.value === "invert",
    "acc-contrast-dark": contrast.value === "dark",
    "acc-sat-low": saturation.value === "low",
    "acc-sat-high": saturation.value === "high",
    "acc-sat-mono": saturation.value === "mono",
    "acc-highlight-links": links.value,
    "acc-highlight-headings": headings.value,
    "acc-text-spacing": textSpacing.value,
    "acc-hide-images": hideImages.value,
    "acc-dyslexic-open": dyslexic.value === "open",
    "acc-dyslexic-lexend": dyslexic.value === "lexend",
    "acc-line-height": lineHeight.value,
    "acc-align-left": alignment.value === "left",
    "acc-align-center": alignment.value === "center",
    "acc-align-right": alignment.value === "right"
  }));
  function setFontLevel(level) {
    fontLevel.value = level;
    localStorage.setItem("acc_font_level", level);
    (void 0).documentElement.style.fontSize = (fontMap[level] || 16) + "px";
  }
  function update(key, val) {
    const refMap = { links, headings, keyboard, textSpacing, hideImages, lineHeight };
    if (refMap[key]) {
      refMap[key].value = val;
      localStorage.setItem("acc_" + key.replace(/([A-Z])/g, "_$1").toLowerCase(), val);
    }
  }
  function cycleContrast() {
    const modes = ["default", "light", "invert", "dark"];
    contrast.value = modes[(modes.indexOf(contrast.value) + 1) % modes.length];
    localStorage.setItem("acc_contrast", contrast.value);
  }
  function cycleFocus() {
    const modes = ["default", "cursor", "mask", "guide"];
    focus.value = modes[(modes.indexOf(focus.value) + 1) % modes.length];
    localStorage.setItem("acc_focus", focus.value);
  }
  function cycleDyslexic() {
    const modes = ["default", "open", "lexend"];
    dyslexic.value = modes[(modes.indexOf(dyslexic.value) + 1) % modes.length];
    localStorage.setItem("acc_dyslexic", dyslexic.value);
  }
  function cycleAlignment() {
    const modes = ["default", "left", "center", "right"];
    alignment.value = modes[(modes.indexOf(alignment.value) + 1) % modes.length];
    localStorage.setItem("acc_alignment", alignment.value);
  }
  function cycleSaturation() {
    const modes = ["default", "low", "high", "mono"];
    saturation.value = modes[(modes.indexOf(saturation.value) + 1) % modes.length];
    localStorage.setItem("acc_saturation", saturation.value);
  }
  function cycleFont() {
    const levels = ["kecil", "normal", "sedang", "besar"];
    setFontLevel(levels[(levels.indexOf(fontLevel.value) + 1) % levels.length]);
  }
  function toggleMenu() {
    isOpen.value = !isOpen.value;
  }
  function resetAll() {
    setFontLevel("normal");
    contrast.value = "default";
    localStorage.setItem("acc_contrast", "default");
    links.value = false;
    localStorage.setItem("acc_links", "false");
    headings.value = false;
    localStorage.setItem("acc_headings", "false");
    focus.value = "default";
    localStorage.setItem("acc_focus", "default");
    keyboard.value = false;
    localStorage.setItem("acc_keyboard", "false");
    textSpacing.value = false;
    localStorage.setItem("acc_text_spacing", "false");
    hideImages.value = false;
    localStorage.setItem("acc_hide_images", "false");
    dyslexic.value = "default";
    localStorage.setItem("acc_dyslexic", "default");
    lineHeight.value = false;
    localStorage.setItem("acc_line_height", "false");
    alignment.value = "default";
    localStorage.setItem("acc_alignment", "default");
    saturation.value = "default";
    localStorage.setItem("acc_saturation", "default");
  }
  return {
    isOpen,
    fontLevel,
    contrast,
    links,
    headings,
    focus,
    keyboard,
    textSpacing,
    hideImages,
    dyslexic,
    lineHeight,
    alignment,
    saturation,
    fontSize,
    wrapperClasses,
    setFontLevel,
    update,
    cycleContrast,
    cycleFocus,
    cycleDyslexic,
    cycleAlignment,
    cycleSaturation,
    cycleFont,
    toggleMenu,
    resetAll
  };
});
const _imports_0$1 = publicAssetsURL("/logo/ppid.webp");
const _sfc_main$4 = {
  __name: "NavBar",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    useLoadingStore();
    const open = ref(false);
    const searchOpen = ref(false);
    const activeSubMenu = ref(null);
    ref(null);
    const searchQuery = ref("");
    const wordLimit = (str, limit = 3) => {
      if (!str) return "";
      const words = str.split(" ");
      return words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "");
    };
    const displayableName = computed(() => {
      var _a;
      if (!((_a = authStore.user) == null ? void 0 : _a.name)) return "";
      const words = authStore.user.name.split(" ").slice(0, 3);
      let name = words.join(" ");
      return name.replace(/[^\p{L}\p{N}\s]+$/gu, "");
    });
    const userInitials = computed(() => {
      var _a;
      if (!((_a = authStore.user) == null ? void 0 : _a.name)) return "U";
      const words = authStore.user.name.split(" ");
      let limit = words.length === 4 ? 3 : words.length;
      if (limit > 3) limit = 3;
      return words.slice(0, limit).map((w) => w.charAt(0).toUpperCase()).join("");
    });
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const menus = [
      {
        title: "Profil",
        url: "#profil",
        icon: "user",
        children: [
          { title: "Bupati", url: "/profil/bupati", icon: "user-tie" },
          { title: "Wakil Bupati", url: "/profil/wakil-bupati", icon: "user-tie" },
          { title: "Sekretaris Daerah", url: "/profil/sekretaris-daerah", icon: "building" },
          { title: "Pejabat Daerah", url: "/profil/pejabat-daerah", icon: "user-tie" },
          { title: "Unit Lokal", url: "/profil/unit-lokal", icon: "map-marked-alt" },
          { title: "PPID", url: "/profil/ppid", icon: "info-circle" },
          { title: "Tentang OPD", url: "/profil/tentang-opd", icon: "building" }
        ]
      },
      {
        title: "Jenis Informasi",
        url: "#informasi",
        icon: "folder",
        children: [
          { title: "Informasi Berkala", url: "/informasi/berkala", icon: "calendar-alt" },
          { title: "Informasi Tersedia Setiap Saat", url: "/informasi/setiap-saat", icon: "clock" },
          { title: "Informasi Serta Merta", url: "/informasi/serta-merta", icon: "exclamation-triangle" },
          { title: "Informasi Dikecualikan", url: "/informasi/dikecualikan", icon: "ban" }
        ]
      },
      {
        title: "DIP",
        url: "#",
        icon: "book",
        children: [
          { title: `DIP ${currentYear}`, url: `/dip/${currentYear}`, icon: "file-alt" },
          { title: `DIP ${currentYear - 1}`, url: `/dip/${currentYear - 1}`, icon: "file-alt" },
          { title: `DIP ${currentYear - 2}`, url: `/dip/${currentYear - 2}`, icon: "file-alt" },
          { title: "DIP Unit", url: "/dipunit", icon: "university" }
        ]
      },
      {
        title: "Standar Layanan",
        url: "#layanan",
        icon: "clipboard-list",
        children: [
          { title: "Dasar Hukum", url: "/standar-layanan/dasar-hukum", icon: "gavel" },
          { title: "Tugas, Wewenang & Tanggung Jawab", url: "/standar-layanan/tugas-wewenang", icon: "handshake" },
          { title: "SOP", url: "/standar-layanan/sop", icon: "file-alt" },
          { title: "Maklumat Pelayanan", url: "/standar-layanan/maklumat", icon: "bullhorn" },
          { title: "Mekanisme & Biaya", url: "/standar-layanan/mekanisme-biaya", icon: "money-bill-wave" }
        ]
      },
      {
        title: "Transparansi",
        url: "#",
        icon: "chart-bar",
        children: [
          { title: "Permohonan Informasi", url: "/laporan/permohonan", icon: "file-signature" },
          { title: "Survei", url: "/laporan/survei", icon: "poll" },
          { title: "Laporan PPID", url: "/laporan/ppid", icon: "chart-line" },
          { title: "Informasi Pemkab", url: "/transparansi/informasi-pemkab", icon: "file-pdf" }
        ]
      },
      { title: "LHKPN", url: "/lhkpn", icon: "file-invoice-dollar", children: [] },
      { title: "PBJ", url: "/pbj", icon: "shopping-cart", children: [] },
      { title: "Login", url: "/login", icon: "sign-in-alt", children: [] }
    ];
    const isActive = (url) => route.path === url || route.path.startsWith(url + "/");
    const hasActiveChild = (children) => children.some((child) => isActive(child.url));
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "bg-white shadow-lg sticky top-0 z-[999] border-b border-blue-100",
        style: { "background": "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }
      }, _attrs))}><div class="w-full"><div class="flex justify-between h-16 items-center"><div class="flex items-center flex-shrink-0 pl-4 xl:pl-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex-shrink-0 flex items-center group relative"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="transform origin-left transition-transform duration-300 group-hover:scale-105"${_scopeId}><img class="w-auto h-10 md:h-12 lg:h-14"${ssrRenderAttr("src", _imports_0$1)} alt="PPID" width="160" height="40"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "transform origin-left transition-transform duration-300 group-hover:scale-105" }, [
                createVNode("img", {
                  class: "w-auto h-10 md:h-12 lg:h-14",
                  src: _imports_0$1,
                  alt: "PPID",
                  width: "160",
                  height: "40"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hidden xl:flex flex-1 justify-center mx-4 min-w-0"><div class="${ssrRenderClass([searchOpen.value ? "w-full max-w-2xl shadow-inner bg-white border-blue-200" : "w-auto max-w-full", "relative bg-blue-50/50 rounded-2xl border border-blue-100 transition-all duration-500 ease-in-out h-12 flex items-center px-2"])}"><div class="${ssrRenderClass([searchOpen.value ? "opacity-0 pointer-events-none scale-95 -translate-y-2" : "opacity-100 scale-100 translate-y-0", "flex items-center space-x-1 whitespace-nowrap w-full justify-center transition-all duration-500 ease-in-out"])}"><!--[-->`);
      ssrRenderList(menus, (menu, index) => {
        _push(`<!--[-->`);
        if (!(menu.title === "DIP" && (!menu.children || menu.children.length === 0)) && menu.title !== "Login") {
          _push(`<!--[-->`);
          if (!menu.children || menu.children.length === 0) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: menu.url,
              class: ["flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300", isActive(menu.url) ? "bg-white text-blue-600 shadow-sm" : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="${ssrRenderClass(["fas", "fa-" + (menu.icon || "circle"), "mr-2", isActive(menu.url) ? "text-blue-600" : "text-blue-500"])}"${_scopeId}></i> ${ssrInterpolate(menu.title)}`);
                } else {
                  return [
                    createVNode("i", {
                      class: ["fas", "fa-" + (menu.icon || "circle"), "mr-2", isActive(menu.url) ? "text-blue-600" : "text-blue-500"]
                    }, null, 2),
                    createTextVNode(" " + toDisplayString(menu.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<div class="relative flex-shrink-0"><button class="${ssrRenderClass([hasActiveChild(menu.children) || activeSubMenu.value === index ? "bg-white text-blue-600 shadow-sm" : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm", "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"])}"><i class="${ssrRenderClass(["fas", "fa-" + (menu.icon || "folder"), "mr-2", hasActiveChild(menu.children) ? "text-blue-600" : "text-blue-500"])}"></i> ${ssrInterpolate(wordLimit(menu.title))} <i class="${ssrRenderClass([{ "rotate-180": activeSubMenu.value === index }, "fas fa-chevron-down h-3 w-3 ml-2 transition-transform duration-300 flex-shrink-0"])}"></i></button><div class="absolute z-[999] mt-2 w-72 rounded-lg shadow-xl bg-white border border-blue-100 min-w-max" style="${ssrRenderStyle(activeSubMenu.value === index ? null : { display: "none" })}"><div class="py-1"><!--[-->`);
            ssrRenderList(menu.children, (child, childIndex) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: childIndex,
                to: child.url,
                onClick: ($event) => activeSubMenu.value = null,
                class: ["flex items-center px-4 py-3 text-sm transition-all duration-200 whitespace-nowrap", isActive(child.url) ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"]
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<i class="${ssrRenderClass(["fas", "fa-" + (child.icon || "angle-right"), "mr-3", "text-xs", isActive(child.url) ? "text-blue-600" : "text-blue-400"])}"${_scopeId}></i> ${ssrInterpolate(child.title)}`);
                  } else {
                    return [
                      createVNode("i", {
                        class: ["fas", "fa-" + (child.icon || "angle-right"), "mr-3", "text-xs", isActive(child.url) ? "text-blue-600" : "text-blue-400"]
                      }, null, 2),
                      createTextVNode(" " + toDisplayString(child.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div></div></div>`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--><button aria-label="Buka Pencarian" class="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 w-9 h-9 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 ml-2 flex-shrink-0"><i class="fas fa-search text-base"></i></button></div><div class="${ssrRenderClass([searchOpen.value ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none", "absolute inset-0 flex items-center px-2 transition-all duration-500 ease-in-out"])}"><form class="w-full flex items-center"><div class="relative w-full"><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Cari informasi, dokumen, atau OPD..." class="w-full bg-transparent border-none py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-0 transition-all"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i class="fas fa-search text-blue-500 text-lg"></i></div><button type="button" aria-label="Tutup Pencarian" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"><i class="fas fa-times-circle text-lg"></i></button></div></form></div></div></div><div class="flex items-center flex-shrink-0 pr-4 xl:pr-6 space-x-2">`);
      if (!unref(authStore).isAuthenticated) {
        _push(`<div class="hidden xl:block">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-sign-in-alt mr-2"${_scopeId}></i> Login `);
            } else {
              return [
                createVNode("i", { class: "fas fa-sign-in-alt mr-2" }),
                createTextVNode(" Login ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="hidden xl:relative xl:flex items-center"><button aria-label="Menu Pengguna" class="flex items-center space-x-2 bg-blue-50 rounded-full p-1 pr-3 hover:bg-blue-100 transition-colors focus:outline-none">`);
        if ((_a = unref(authStore).user) == null ? void 0 : _a.profile_photo_path) {
          _push(`<img class="h-8 w-8 rounded-full object-cover"${ssrRenderAttr("src", unref(getStorageUrl)(unref(authStore).user.profile_photo_path))}${ssrRenderAttr("alt", unref(authStore).user.name)} width="32" height="32">`);
        } else {
          _push(`<div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">${ssrInterpolate(userInitials.value)}</div>`);
        }
        _push(`<div class="flex flex-col items-start"><span class="text-gray-700 text-sm font-medium">${ssrInterpolate(displayableName.value)}</span><span class="text-gray-500 text-xs">${ssrInterpolate(unref(authStore).isAdmin ? (_b = unref(authStore).user) == null ? void 0 : _b.nip : (_c = unref(authStore).user) == null ? void 0 : _c.email)}</span></div><i class="fas fa-chevron-down text-xs text-gray-500"></i></button><div class="absolute top-full right-0 mt-2 w-60 rounded-md shadow-lg bg-white z-[999]" style="${ssrRenderStyle(activeSubMenu.value === "user" ? null : { display: "none" })}"><div class="py-1"><div class="px-4 py-2 border-b border-gray-100"><p class="text-sm font-medium text-gray-900">${ssrInterpolate((_d = unref(authStore).user) == null ? void 0 : _d.name)}</p><p class="text-xs text-gray-500">${ssrInterpolate(unref(authStore).isAdmin ? (_e = unref(authStore).user) == null ? void 0 : _e.nip : (_f = unref(authStore).user) == null ? void 0 : _f.email)}</p></div>`);
        if (((_g = unref(authStore).user) == null ? void 0 : _g.role) === "superadmin") {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/admin/dashboard",
            class: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="fas fa-tachometer-alt w-5 mr-3 text-gray-400"${_scopeId}></i> Admin Dashboard `);
              } else {
                return [
                  createVNode("i", { class: "fas fa-tachometer-alt w-5 mr-3 text-gray-400" }),
                  createTextVNode(" Admin Dashboard ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          class: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fas fa-user-circle w-5 mr-3 text-gray-400"${_scopeId}></i> Profile `);
            } else {
              return [
                createVNode("i", { class: "fas fa-user-circle w-5 mr-3 text-gray-400" }),
                createTextVNode(" Profile ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="border-t border-gray-100"></div><button class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"><i class="fas fa-sign-out-alt w-5 mr-3 text-red-400"></i> Logout </button></div></div></div>`);
      }
      _push(`<div class="xl:hidden"><button aria-label="Toggle Mobile Menu" class="text-gray-700 hover:text-blue-600 focus:outline-none"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">`);
      if (!open.value) {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`);
      } else {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`);
      }
      _push(`</svg></button></div></div></div></div><div class="xl:hidden" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"><div class="px-4 pt-2 pb-3"><form class="relative"><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Cari informasi..." class="w-full bg-blue-50 border border-blue-100 rounded-xl py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"><div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><i class="fas fa-search text-blue-400 text-sm"></i></div><button type="submit" aria-label="Mulai Pencarian" class="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-700"><i class="fas fa-arrow-right"></i></button></form></div><div class="pt-2 pb-3 space-y-1 sm:px-3"><!--[-->`);
      ssrRenderList(menus, (menu, index) => {
        _push(`<!--[-->`);
        if (!(menu.title === "Login" && unref(authStore).isAuthenticated) && !(menu.title === "DIP" && (!menu.children || menu.children.length === 0))) {
          _push(`<!--[-->`);
          if (!menu.children || menu.children.length === 0) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: menu.url,
              onClick: ($event) => open.value = false,
              class: ["flex items-center py-2 px-3 text-base font-medium rounded-md", isActive(menu.url) ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="${ssrRenderClass(["fas", "fa-" + (menu.icon || "circle"), "w-6", "mr-2", isActive(menu.url) ? "text-blue-600" : "text-blue-500"])}"${_scopeId}></i><span${_scopeId}>${ssrInterpolate(wordLimit(menu.title))}</span>`);
                } else {
                  return [
                    createVNode("i", {
                      class: ["fas", "fa-" + (menu.icon || "circle"), "w-6", "mr-2", isActive(menu.url) ? "text-blue-600" : "text-blue-500"]
                    }, null, 2),
                    createVNode("span", null, toDisplayString(wordLimit(menu.title)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<div><button class="${ssrRenderClass([hasActiveChild(menu.children) ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50", "w-full flex justify-between items-center py-2 px-3 text-base font-medium rounded-md"])}"><span class="flex items-center"><i class="${ssrRenderClass(["fas", "fa-" + (menu.icon || "folder"), "w-6", "mr-2", hasActiveChild(menu.children) ? "text-blue-600" : "text-blue-500"])}"></i> ${ssrInterpolate(menu.title)}</span><i class="${ssrRenderClass([{ "rotate-180": activeSubMenu.value === index }, "fas fa-chevron-down h-3 w-3 ml-2 transition-transform duration-300"])}"></i></button><div class="pl-4" style="${ssrRenderStyle(activeSubMenu.value === index ? null : { display: "none" })}"><!--[-->`);
            ssrRenderList(menu.children, (child, childIndex) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: childIndex,
                to: child.url,
                onClick: ($event) => open.value = false,
                class: ["flex items-center py-2 px-3 text-base font-medium rounded-md", isActive(child.url) ? "text-blue-700 bg-blue-50/50 font-bold" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"]
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<i class="${ssrRenderClass(["fas", "fa-" + (child.icon || "angle-right"), "w-6", "mr-2", isActive(child.url) ? "text-blue-600" : "text-blue-400"])}"${_scopeId}></i><span${_scopeId}>${ssrInterpolate(child.title)}</span>`);
                  } else {
                    return [
                      createVNode("i", {
                        class: ["fas", "fa-" + (child.icon || "angle-right"), "w-6", "mr-2", isActive(child.url) ? "text-blue-600" : "text-blue-400"]
                      }, null, 2),
                      createVNode("span", null, toDisplayString(child.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div></div>`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div>`);
      if (unref(authStore).isAuthenticated) {
        _push(`<div class="pt-4 pb-3 border-t border-gray-200"><div class="flex items-center px-4"><div class="flex-shrink-0">`);
        if ((_h = unref(authStore).user) == null ? void 0 : _h.profile_photo_path) {
          _push(`<img class="h-10 w-10 rounded-full object-cover"${ssrRenderAttr("src", unref(getStorageUrl)(unref(authStore).user.profile_photo_path))}${ssrRenderAttr("alt", unref(authStore).user.name)} width="40" height="40">`);
        } else {
          _push(`<div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">${ssrInterpolate(userInitials.value)}</div>`);
        }
        _push(`</div><div class="ml-3"><div class="text-base font-medium text-gray-800">${ssrInterpolate(displayableName.value || ((_i = unref(authStore).user) == null ? void 0 : _i.name))}</div><div class="text-sm font-medium text-gray-500">${ssrInterpolate(unref(authStore).isAdmin ? (_j = unref(authStore).user) == null ? void 0 : _j.nip : (_k = unref(authStore).user) == null ? void 0 : _k.email)}</div></div></div><div class="mt-3 space-y-1">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          onClick: ($event) => open.value = false,
          class: "block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Profile `);
            } else {
              return [
                createTextVNode(" Profile ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(authStore).isAdmin) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/admin/dashboard",
            onClick: ($event) => open.value = false,
            class: "block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Admin Dashboard `);
              } else {
                return [
                  createTextVNode(" Admin Dashboard ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"> Logout </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></nav>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NavBar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _imports_0 = publicAssetsURL("/logo/favicon_io/android-chrome-512x512.png");
const _imports_1 = publicAssetsURL("/logo/lapor.png");
const _sfc_main$3 = {
  __name: "FooterSection",
  __ssrInlineRender: true,
  setup(__props) {
    const currentYear = computed(() => (/* @__PURE__ */ new Date()).getFullYear());
    const socialMedia = ref({
      instagram: "",
      facebook: "",
      twitter: "",
      tiktok: "",
      youtube: "",
      website: ""
    });
    const contactInfo = ref({
      email: "ppid@sinjaikab.go.id",
      phone: "(0482) 21111",
      address: "Jl. Persatuan Raya No. 1, Sinjai Utara, Kab. Sinjai, Sulawesi Selatan 92611"
    });
    const navLinks = [
      { url: "/profil-ppid", title: "Profil PPID" },
      { url: "/galeri", title: "Galeri" },
      { url: "/permohonan", title: "Permohonan Informasi" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-gray-900 text-white py-12" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 md:grid-cols-4 gap-8"><div class="flex flex-col items-center text-center md:items-start md:text-left"><div class="-mt-8 mb-[-35px]"><img${ssrRenderAttr("src", _imports_0)} alt="Logo PPID" width="160" height="160" class="h-[160px] w-auto"></div><p class="text-gray-400 text-sm mb-4"> Pejabat Pengelola Informasi dan Dokumentasi </p><div class="flex flex-wrap justify-center md:justify-start gap-3">`);
      if (socialMedia.value.instagram) {
        _push(`<a${ssrRenderAttr("href", socialMedia.value.instagram)} target="_blank" aria-label="Instagram" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] transition-all duration-300" title="Instagram"><i class="fab fa-instagram"></i></a>`);
      } else {
        _push(`<!---->`);
      }
      if (socialMedia.value.facebook) {
        _push(`<a${ssrRenderAttr("href", socialMedia.value.facebook)} target="_blank" aria-label="Facebook" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all duration-300" title="Facebook"><i class="fab fa-facebook-f"></i></a>`);
      } else {
        _push(`<!---->`);
      }
      if (socialMedia.value.twitter) {
        _push(`<a${ssrRenderAttr("href", socialMedia.value.twitter)} target="_blank" aria-label="Twitter" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-all duration-300" title="Twitter"><i class="fab fa-twitter"></i></a>`);
      } else {
        _push(`<!---->`);
      }
      if (socialMedia.value.tiktok) {
        _push(`<a${ssrRenderAttr("href", socialMedia.value.tiktok)} target="_blank" aria-label="TikTok" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition-all duration-300" title="TikTok"><i class="fab fa-tiktok"></i></a>`);
      } else {
        _push(`<!---->`);
      }
      if (socialMedia.value.youtube) {
        _push(`<a${ssrRenderAttr("href", socialMedia.value.youtube)} target="_blank" aria-label="YouTube" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300" title="YouTube"><i class="fab fa-youtube"></i></a>`);
      } else {
        _push(`<!---->`);
      }
      if (socialMedia.value.website) {
        _push(`<a${ssrRenderAttr("href", socialMedia.value.website)} target="_blank" aria-label="Website" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300" title="Website Pemda"><i class="fas fa-globe"></i></a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div id="footer-nav-section"><h4 class="font-semibold mb-4">Navigasi</h4><ul class="space-y-2 text-sm text-gray-400"><!--[-->`);
      ssrRenderList(navLinks, (link, index) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.url,
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li class="pt-2 mt-2 border-t border-gray-800"></li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/kebijakan-privasi",
        class: "hover:text-white flex items-center group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-purple-500/10 p-1.5 rounded mr-2 group-hover:bg-purple-500 transition-colors"${_scopeId}><i class="fas fa-user-shield text-purple-500 group-hover:text-white text-[10px]"${_scopeId}></i></div> Kebijakan Privasi `);
          } else {
            return [
              createVNode("div", { class: "bg-purple-500/10 p-1.5 rounded mr-2 group-hover:bg-purple-500 transition-colors" }, [
                createVNode("i", { class: "fas fa-user-shield text-purple-500 group-hover:text-white text-[10px]" })
              ]),
              createTextVNode(" Kebijakan Privasi ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/rss",
        class: "hover:text-white flex items-center group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-orange-500/10 p-1.5 rounded mr-2 group-hover:bg-orange-500 transition-colors"${_scopeId}><i class="fas fa-rss text-orange-500 group-hover:text-white text-[10px]"${_scopeId}></i></div> RSS Feed `);
          } else {
            return [
              createVNode("div", { class: "bg-orange-500/10 p-1.5 rounded mr-2 group-hover:bg-orange-500 transition-colors" }, [
                createVNode("i", { class: "fas fa-rss text-orange-500 group-hover:text-white text-[10px]" })
              ]),
              createTextVNode(" RSS Feed ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/widget",
        class: "hover:text-white flex items-center group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-blue-500/10 p-1.5 rounded mr-2 group-hover:bg-blue-500 transition-colors"${_scopeId}><i class="fas fa-plug text-blue-500 group-hover:text-white text-[10px]"${_scopeId}></i></div> Widget Informasi `);
          } else {
            return [
              createVNode("div", { class: "bg-blue-500/10 p-1.5 rounded mr-2 group-hover:bg-blue-500 transition-colors" }, [
                createVNode("i", { class: "fas fa-plug text-blue-500 group-hover:text-white text-[10px]" })
              ]),
              createTextVNode(" Widget Informasi ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h4 class="font-semibold mb-4">Kontak</h4><ul class="space-y-2 text-sm text-gray-400"><li>Email: ${ssrInterpolate(contactInfo.value.email)}</li><li>Telepon: ${ssrInterpolate(contactInfo.value.phone)}</li><li>Alamat: ${ssrInterpolate(contactInfo.value.address)}</li></ul></div><div class="md:col-span-1 text-center"><h4 class="font-semibold mb-4">Pengaduan</h4><a href="https://www.lapor.go.id/" target="_blank" class="group px-[21px] py-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg flex flex-col items-center space-y-4 border border-gray-700 w-full hover:border-gray-500 transition duration-300 block"><img${ssrRenderAttr("src", _imports_1)} alt="Lapor.go.id" width="120" height="40" class="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"><p class="text-sm font-semibold text-gray-200 leading-relaxed whitespace-nowrap uppercase italic"><span class="text-yellow-400 font-bold">Sampaikan Laporan</span> &amp; Aspirasi Anda </p></a></div></div><div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400"><p>\xA9 ${ssrInterpolate(currentYear.value)} PPID Kabupaten Sinjai \u2013 Dikelola oleh Dinas Komunikasi, Informatika dan Persandian Kabupaten Sinjai.</p></div></div></footer>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FooterSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "AccessibilityWidget",
  __ssrInlineRender: true,
  setup(__props) {
    const accStore = useAccessibilityStore();
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed bottom-6 left-6 z-[99999] flex flex-col items-start gap-4" }, _attrs))}><button aria-label="Toggle Suara Widget" class="${ssrRenderClass([unref(accStore).masterSound ? "bg-green-500 text-white" : "bg-red-500 text-white", "w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"])}"${ssrRenderAttr("title", unref(accStore).masterSound ? "Matikan Suara" : "Nyalakan Suara")}><i class="${ssrRenderClass([unref(accStore).masterSound ? "fa-volume-up" : "fa-volume-mute", "fas"])}"></i></button>`);
      if (isOpen.value) {
        _push(`<div class="bg-white rounded-2xl shadow-2xl w-80 max-h-[70vh] flex flex-col overflow-hidden border border-gray-100"><div class="bg-blue-600 px-4 py-3 flex items-center justify-between text-white"><div class="flex items-center gap-2 font-semibold"><i class="fas fa-universal-access text-lg"></i><span>Menu Aksesibilitas</span></div><button aria-label="Tutup Widget" class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"><i class="fas fa-times"></i></button></div><div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300"><div class="grid grid-cols-2 gap-2"><button class="${ssrRenderClass([unref(accStore).clickToRead ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 text-gray-600", "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-xs text-center font-medium"])}"><i class="fas fa-hand-pointer text-lg"></i><span>Klik untuk Baca</span>`);
        if (unref(accStore).clickToRead) {
          _push(`<i class="fas fa-check-circle absolute top-2 right-2 text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([unref(accStore).hoverToRead ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 text-gray-600", "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-xs text-center font-medium relative"])}"><i class="fas fa-mouse-pointer text-lg"></i><span>Arahkan Baca</span>`);
        if (unref(accStore).hoverToRead) {
          _push(`<i class="fas fa-check-circle absolute top-2 right-2 text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button></div><div class="space-y-2"><button class="${ssrRenderClass([unref(accStore).contrast !== "default" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"])}"><div class="${ssrRenderClass([unref(accStore).contrast !== "default" ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-adjust w-5 text-center"></i><span class="text-sm font-medium">Kontras</span></div><span class="${ssrRenderClass([unref(accStore).contrast !== "default" ? "text-blue-600" : "text-gray-500", "text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase"])}">${ssrInterpolate(unref(accStore).contrast)}</span></button><button class="${ssrRenderClass([unref(accStore).textSize !== "normal" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"])}"><div class="${ssrRenderClass([unref(accStore).textSize !== "normal" ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-text-height w-5 text-center"></i><span class="text-sm font-medium">Ukuran Teks</span></div><span class="${ssrRenderClass([unref(accStore).textSize !== "normal" ? "text-blue-600" : "text-gray-500", "text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase"])}">${ssrInterpolate(unref(accStore).textSize)}</span></button><button class="${ssrRenderClass([unref(accStore).highlightLinks ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"])}"><div class="${ssrRenderClass([unref(accStore).highlightLinks ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-link w-5 text-center"></i><span class="text-sm font-medium">Sorot Tautan</span></div>`);
        if (unref(accStore).highlightLinks) {
          _push(`<i class="fas fa-check text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([unref(accStore).textSpacing ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"])}"><div class="${ssrRenderClass([unref(accStore).textSpacing ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-arrows-alt-h w-5 text-center"></i><span class="text-sm font-medium">Jarak Teks</span></div>`);
        if (unref(accStore).textSpacing) {
          _push(`<i class="fas fa-check text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([unref(accStore).hideImages ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"])}"><div class="${ssrRenderClass([unref(accStore).hideImages ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-image w-5 text-center"></i><span class="text-sm font-medium">Sembunyikan Gambar</span></div>`);
        if (unref(accStore).hideImages) {
          _push(`<i class="fas fa-check text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([unref(accStore).dyslexicFont !== "default" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"])}"><div class="${ssrRenderClass([unref(accStore).dyslexicFont !== "default" ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-font w-5 text-center"></i><span class="text-sm font-medium">Ramah Disleksia</span></div><span class="${ssrRenderClass([unref(accStore).dyslexicFont !== "default" ? "text-blue-600" : "text-gray-500", "text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase"])}">${ssrInterpolate(unref(accStore).dyslexicFont)}</span></button><button class="${ssrRenderClass([unref(accStore).focusMode !== "default" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"])}"><div class="${ssrRenderClass([unref(accStore).focusMode !== "default" ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-crosshairs w-5 text-center"></i><span class="text-sm font-medium">Mode Fokus</span></div><span class="${ssrRenderClass([unref(accStore).focusMode !== "default" ? "text-blue-600" : "text-gray-500", "text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase"])}">${ssrInterpolate(unref(accStore).focusMode)}</span></button><button class="${ssrRenderClass([unref(accStore).keyboardNavigation ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"])}"><div class="${ssrRenderClass([unref(accStore).keyboardNavigation ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-keyboard w-5 text-center"></i><span class="text-sm font-medium">Navigasi Keyboard</span></div>`);
        if (unref(accStore).keyboardNavigation) {
          _push(`<i class="fas fa-check text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([unref(accStore).textAlign !== "default" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"])}"><div class="${ssrRenderClass([unref(accStore).textAlign !== "default" ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-align-left w-5 text-center"></i><span class="text-sm font-medium">Perataan Teks</span></div><span class="${ssrRenderClass([unref(accStore).textAlign !== "default" ? "text-blue-600" : "text-gray-500", "text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase"])}">${ssrInterpolate(unref(accStore).textAlign)}</span></button><button class="${ssrRenderClass([unref(accStore).saturation !== "default" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"])}"><div class="${ssrRenderClass([unref(accStore).saturation !== "default" ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-palette w-5 text-center"></i><span class="text-sm font-medium">Saturasi</span></div><span class="${ssrRenderClass([unref(accStore).saturation !== "default" ? "text-blue-600" : "text-gray-500", "text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-gray-100 uppercase"])}">${ssrInterpolate(unref(accStore).saturation)}</span></button><button class="${ssrRenderClass([unref(accStore).highlightHeadings ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"])}"><div class="${ssrRenderClass([unref(accStore).highlightHeadings ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-heading w-5 text-center"></i><span class="text-sm font-medium">Sorot Judul</span></div>`);
        if (unref(accStore).highlightHeadings) {
          _push(`<i class="fas fa-check text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([unref(accStore).lineHeight ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300", "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all relative"])}"><div class="${ssrRenderClass([unref(accStore).lineHeight ? "text-blue-700" : "text-gray-700", "flex items-center gap-3"])}"><i class="fas fa-ruler-vertical w-5 text-center"></i><span class="text-sm font-medium">Tinggi Baris</span></div>`);
        if (unref(accStore).lineHeight) {
          _push(`<i class="fas fa-check text-blue-500"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button></div></div><div class="p-3 border-t border-gray-100 bg-gray-50"><button class="w-full py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"><i class="fas fa-undo"></i> Atur Ulang Semua </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button aria-label="Buka Widget Aksesibilitas" class="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 ring-4 ring-white focus:outline-none"><i class="fas fa-universal-access text-2xl group-hover:rotate-12 transition-transform"></i></button></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AccessibilityWidget.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "SurveyModal",
  __ssrInlineRender: true,
  setup(__props) {
    const isVisible = ref(false);
    const closeModal = () => {
      isVisible.value = false;
      sessionStorage.setItem("surveyModalDismissed", "true");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (isVisible.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed bottom-6 right-6 z-[99999] w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 flex flex-col" }, _attrs))}><div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between text-white relative overflow-hidden"><div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div><div class="flex items-center gap-3 relative z-10"><div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><i class="fas fa-poll text-xl"></i></div><div><h3 class="font-bold text-lg leading-tight">Survei Kepuasan</h3><p class="text-xs text-blue-100">Bantu kami menjadi lebih baik</p></div></div><button class="relative z-10 text-white/70 hover:text-white p-1 transition-colors"><i class="fas fa-times text-lg"></i></button></div><div class="p-5"><p class="text-sm text-gray-600 mb-5 leading-relaxed"> Bagaimana pendapat Anda tentang layanan informasi publik kami? Luangkan waktu 1 menit untuk mengisi survei kepuasan masyarakat. </p><div class="flex items-center gap-3"><button class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-transparent"> Nanti Saja </button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: { name: "survei" },
          onClick: closeModal,
          class: "flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl text-center shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Isi Sekarang `);
            } else {
              return [
                createTextVNode(" Isi Sekarang ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SurveyModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const accStore = useAccessibilityStore();
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = resolveComponent("router-view");
      _push(`<!--[--><div id="acc-main-wrapper" class="${ssrRenderClass([unref(accStore).wrapperClasses, "min-h-screen flex flex-col bg-gray-50"])}">`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(`<main id="main-content" class="flex-1">`);
      _push(ssrRenderComponent(_component_router_view, null, {
        default: withCtx(({ Component }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(Component), null, null), _parent2, _scopeId);
          } else {
            return [
              createVNode(Transition, {
                name: "page",
                mode: "out-in"
              }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(resolveDynamicComponent(Component)))
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-B2WgPsIm.mjs.map
