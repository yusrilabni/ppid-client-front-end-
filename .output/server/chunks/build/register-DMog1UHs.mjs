import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderDynamicModel, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-CdaZwofV.mjs';
import { b as getAssetUrl } from './api-CX2AAiTN.mjs';
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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    useAuthStore();
    const breadcrumbItems = computed(() => getBreadcrumbs.registerPage());
    const form = ref({ name: "", email: "", password: "", password_confirmation: "" });
    const showPassword = ref(false);
    const showConfirm = ref(false);
    const loading = ref(false);
    const error = ref("");
    const showOtpModal = ref(false);
    const otpEmail = ref("");
    const otpCode = ref("");
    const otpError = ref("");
    const loadingOtp = ref(false);
    const loadingResend = ref(false);
    const cooldownTimer = ref(60);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 flex flex-col" }, _attrs))}><div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">`);
      _push(ssrRenderComponent(_sfc_main$1, { breadcrumbs: breadcrumbItems.value }, null, _parent));
      _push(`</div><div class="flex-1 flex items-center justify-center px-4 pb-12"><div class="w-full max-w-md"><div class="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 relative"><div class="text-center mb-8"><img${ssrRenderAttr("src", unref(getAssetUrl)("storage/logo/ppid.webp"))} alt="PPID" class="h-16 w-auto mx-auto mb-4"><h1 class="text-2xl font-bold text-gray-800 leading-tight">DAFTAR AKUN</h1><p class="text-sm text-gray-600 mt-2">Sistem Informasi Pejabat Pengelola Informasi &amp; Dokumentasi</p></div>`);
      if (error.value) {
        _push(`<div class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 shadow-sm"><div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><i class="fas fa-exclamation-circle"></i></div><div class="flex-1"><h4 class="text-sm font-bold text-rose-800 leading-tight">Terjadi Kesalahan</h4><p class="text-xs text-rose-600 mt-1 leading-relaxed">${ssrInterpolate(error.value)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-5"><div><label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-id-card"></i></span><input${ssrRenderAttr("value", form.value.name)} type="text" required class="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan nama"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-envelope"></i></span><input${ssrRenderAttr("value", form.value.email)} type="email" required class="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Masukkan email aktif"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1.5">Kata Sandi</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-lock"></i></span><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.value.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} required class="w-full py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Minimal 8 karakter"><button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i class="${ssrRenderClass([showPassword.value ? "fa-eye-slash" : "fa-eye", "fas"])}"></i></button></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Sandi</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-check-circle"></i></span><input${ssrRenderDynamicModel(showConfirm.value ? "text" : "password", form.value.password_confirmation, null)}${ssrRenderAttr("type", showConfirm.value ? "text" : "password")} required class="w-full py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none" placeholder="Ulangi kata sandi"><button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i class="${ssrRenderClass([showConfirm.value ? "fa-eye-slash" : "fa-eye", "fas"])}"></i></button></div></div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full text-white py-3.5 mt-2 rounded-xl font-medium transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #2563eb, #1e40af)" })}">`);
      if (loading.value) {
        _push(`<span class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block align-middle"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(loading.value ? "Mendaftarkan..." : "Buat Akun")}</button></form><div class="mt-6"><div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div><div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">Atau daftar dengan</span></div></div><button type="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5"><span>Daftar dengan Google</span></button></div><div class="mt-8 text-center"><p class="text-sm text-gray-600 mb-3">Sudah punya akun?</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "block w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Masuk ke Sistem `);
          } else {
            return [
              createTextVNode(" Masuk ke Sistem ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><p class="text-center text-xs text-gray-500 mt-8"> \xA9 2026 PPID - Kabupaten Sinjai </p></div></div>`);
      if (showOtpModal.value) {
        _push(`<div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"><div class="text-center mb-6"><div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-envelope-open-text text-2xl"></i></div><h3 class="text-xl font-bold text-gray-900">Verifikasi Email Anda</h3><p class="text-sm text-gray-500 mt-2"> Kami telah mengirimkan 6 digit kode OTP ke email Google Anda. </p><p class="text-sm font-semibold text-gray-700 mt-1">${ssrInterpolate(otpEmail.value)}</p></div>`);
        if (otpError.value) {
          _push(`<div class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2"><i class="fas fa-exclamation-circle text-rose-600 mt-0.5"></i><p class="text-xs text-rose-600">${ssrInterpolate(otpError.value)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1.5">Kode OTP</label><input${ssrRenderAttr("value", otpCode.value)} type="text" maxlength="6" required class="w-full text-center text-2xl tracking-[0.5em] py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all outline-none font-mono" placeholder="------"></div><div class="flex gap-3 pt-2"><button type="button" class="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(loadingOtp.value) ? " disabled" : ""} class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center">`);
        if (loadingOtp.value) {
          _push(`<span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Verifikasi </button></div><div class="text-center mt-4 border-t pt-4"><p class="text-sm text-gray-600 mb-2">Belum menerima kode OTP?</p><button type="button"${ssrIncludeBooleanAttr(cooldownTimer.value > 0 || loadingResend.value) ? " disabled" : ""} class="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed">`);
        if (loadingResend.value) {
          _push(`<span class="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full inline-block mr-1"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(cooldownTimer.value > 0 ? `Kirim Ulang OTP dalam ${cooldownTimer.value}s` : "Kirim Ulang OTP")}</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-DMog1UHs.mjs.map
