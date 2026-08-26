import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, mergeProps, withCtx, createVNode, withDirectives, toDisplayString, vShow, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-Cu84b-L0.mjs';
import { u as useRouter } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './api-k33KGvo_.mjs';
import 'axios';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const authStore = useAuthStore();
    const sidebarOpen = ref(true);
    const mobileSidebarOpen = ref(false);
    const menuItems = [
      { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "admin.dashboard" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-100 flex" }, _attrs))}><aside class="${ssrRenderClass([sidebarOpen.value ? "w-64" : "w-20", "hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out z-20"])}"><div class="p-4 flex items-center gap-3 border-b border-gray-700"><div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-shield-alt text-white"></i></div><span class="font-bold text-lg truncate" style="${ssrRenderStyle(sidebarOpen.value ? null : { display: "none" })}">PPID Admin</span></div><nav class="flex-1 p-3 space-y-1 overflow-y-auto"><!--[-->`);
      ssrRenderList(menuItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.route,
          to: { name: item.route },
          class: "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all",
          "active-class": "!bg-blue-600 !text-white shadow-lg"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="${ssrRenderClass([item.icon, "w-5 text-center"])}"${_scopeId}></i><span style="${ssrRenderStyle(sidebarOpen.value ? null : { display: "none" })}"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
            } else {
              return [
                createVNode("i", {
                  class: [item.icon, "w-5 text-center"]
                }, null, 2),
                withDirectives(createVNode("span", null, toDisplayString(item.name), 513), [
                  [vShow, sidebarOpen.value]
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="p-3 border-t border-gray-700"><button class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all w-full"><i class="fas fa-sign-out-alt w-5 text-center"></i><span style="${ssrRenderStyle(sidebarOpen.value ? null : { display: "none" })}">Keluar</span></button></div></aside>`);
      if (mobileSidebarOpen.value) {
        _push(`<div class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([mobileSidebarOpen.value ? "translate-x-0" : "-translate-x-full", "fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-300 ease-in-out z-40 lg:hidden flex flex-col"])}"><div class="p-4 flex items-center justify-between border-b border-gray-700"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fas fa-shield-alt text-white"></i></div><span class="font-bold text-lg">PPID Admin</span></div><button class="text-gray-400 hover:text-white"><i class="fas fa-times text-xl"></i></button></div><nav class="flex-1 p-3 space-y-1 overflow-y-auto"><!--[-->`);
      ssrRenderList(menuItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.route,
          to: { name: item.route },
          class: "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all",
          "active-class": "!bg-blue-600 !text-white shadow-lg",
          onClick: ($event) => mobileSidebarOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="${ssrRenderClass([item.icon, "w-5 text-center"])}"${_scopeId}></i><span${_scopeId}>${ssrInterpolate(item.name)}</span>`);
            } else {
              return [
                createVNode("i", {
                  class: [item.icon, "w-5 text-center"]
                }, null, 2),
                createVNode("span", null, toDisplayString(item.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="p-3 border-t border-gray-700"><button class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all w-full"><i class="fas fa-sign-out-alt w-5 text-center"></i><span>Keluar</span></button></div></aside><div class="flex-1 flex flex-col h-screen overflow-hidden"><header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10"><div class="flex items-center gap-4"><button class="hidden lg:block text-gray-500 hover:text-gray-700"><i class="fas fa-bars text-lg"></i></button><button class="lg:hidden text-gray-500 hover:text-gray-700"><i class="fas fa-bars text-lg"></i></button><h1 class="text-lg font-semibold text-gray-800">Admin Panel</h1></div><div class="flex items-center gap-4"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">${ssrInterpolate(((_c = (_b = (_a = unref(authStore).user) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0)) == null ? void 0 : _c.toUpperCase()) || "A")}</div><span class="text-sm font-medium text-gray-700 hidden sm:block">${ssrInterpolate(((_d = unref(authStore).user) == null ? void 0 : _d.name) || "Admin")}</span></div></div></header><main class="flex-1 p-6 overflow-y-auto bg-gray-50">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-D56YKM89.mjs.map
