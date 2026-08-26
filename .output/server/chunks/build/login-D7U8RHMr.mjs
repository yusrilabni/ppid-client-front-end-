import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderDynamicModel, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-Cu84b-L0.mjs';
import { b as getAssetUrl } from './api-k33KGvo_.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { u as useRouter, a as useRoute } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    useAuthStore();
    const breadcrumbItems = computed(() => getBreadcrumbs.loginPage());
    const form = ref({ email: "", password: "" });
    const showPassword = ref(false);
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 flex flex-col" }, _attrs))}><div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">`);
      _push(ssrRenderComponent(_sfc_main$1, { breadcrumbs: breadcrumbItems.value }, null, _parent));
      _push(`</div><div class="flex-1 flex items-center justify-center px-4 pb-12"><div class="w-full max-w-md"><div class="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 relative"><div class="text-center mb-8"><img${ssrRenderAttr("src", unref(getAssetUrl)("storage/logo/ppid.webp"))} alt="PPID" class="h-20 w-auto mx-auto mb-6"><h1 class="text-2xl font-bold text-gray-800 leading-tight">LOGIN PPID</h1><p class="text-sm text-gray-600 mt-2">Sistem Informasi Pejabat Pengelola Informasi &amp; Dokumentasi</p></div>`);
      if (error.value) {
        _push(`<div class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 shadow-sm"><div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><i class="fas fa-exclamation-circle"></i></div><div class="flex-1"><h4 class="text-sm font-bold text-rose-800 leading-tight">Terjadi Kesalahan</h4><p class="text-xs text-rose-600 mt-1 leading-relaxed">${ssrInterpolate(error.value)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">Email / NIP</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-user"></i></span><input${ssrRenderAttr("value", form.value.email)} type="text" required autofocus class="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan email atau NIP"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-lock"></i></span><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.value.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} required class="w-full py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan kata sandi"><button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i class="${ssrRenderClass([showPassword.value ? "fa-eye-slash" : "fa-eye", "fas"])}"></i></button></div></div><div class="flex items-center"><input type="checkbox" id="remember" class="h-4 w-4 text-blue-600 border-gray-300 rounded"><label for="remember" class="ml-2 block text-sm text-gray-700">Ingat saya</label></div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full text-white py-3.5 rounded-xl font-medium transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #2563eb, #1e40af)" })}">`);
      if (loading.value) {
        _push(`<span class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block align-middle"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(loading.value ? "Memproses..." : "Masuk ke Sistem")}</button></form><div class="mt-6"><div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div><div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span></div></div><button type="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5"><span>Login dengan Google</span></button></div><div class="mt-8 text-center"><p class="text-sm text-gray-600 mb-3">Belum punya akun?</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Buat Akun Baru `);
          } else {
            return [
              createTextVNode(" Buat Akun Baru ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><p class="text-center text-xs text-gray-500 mt-8"> \xA9 2026 PPID - Kabupaten Sinjai </p></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-D7U8RHMr.mjs.map
