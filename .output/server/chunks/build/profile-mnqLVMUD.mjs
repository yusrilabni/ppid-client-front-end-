import { computed, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as api, g as getStorageUrl } from './api-k33KGvo_.mjs';
import { u as useAuthStore } from './auth-Cu84b-L0.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQueryClient, useQuery } from '@tanstack/vue-query';
import { a as useRoute } from './server.mjs';
import 'axios';
import './nuxt-link-vc3u7b4I.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './loading-DMBVy40S.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const _sfc_main = {
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useQueryClient();
    const route = useRoute();
    const linkedStatus = computed(() => route.query.linked);
    const linkedMessage = computed(() => route.query.msg ? decodeURIComponent(route.query.msg) : "Gagal menautkan akun.");
    const { data: profileData, isLoading: queryLoading, isFetching } = useQuery({
      queryKey: ["user_profile"],
      queryFn: async () => {
        const response = await api.get("/profile");
        return response.data.data;
      },
      staleTime: 5 * 60 * 1e3
      // 5 menit
    });
    const loading = computed(() => queryLoading.value);
    useGlobalLoader(loading);
    const breadcrumbItems = computed(() => getBreadcrumbs.profilePage());
    const saving = ref(false);
    const errors = ref({});
    const successMessage = ref("");
    const form = ref({
      nip: "",
      name: "",
      email: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      linkedin: "",
      photo: null,
      email_can_update: false
    });
    const photoPreview = ref(null);
    ref(null);
    watch(profileData, (data) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      if (data) {
        form.value.nip = ((_a = data.user) == null ? void 0 : _a.nip) || "";
        form.value.name = ((_b = data.user) == null ? void 0 : _b.name) || "";
        form.value.email = ((_c = data.user) == null ? void 0 : _c.email) || "";
        form.value.facebook = ((_d = data.user) == null ? void 0 : _d.facebook) || "";
        form.value.instagram = ((_e = data.user) == null ? void 0 : _e.instagram) || "";
        form.value.tiktok = ((_f = data.user) == null ? void 0 : _f.tiktok) || "";
        form.value.linkedin = ((_g = data.user) == null ? void 0 : _g.linkedin) || "";
        form.value.email_can_update = !data.is_asn || !((_h = data.user) == null ? void 0 : _h.email) || ((_i = data.user) == null ? void 0 : _i.email) === "-";
      }
    }, { immediate: true });
    const userInitials = computed(() => {
      var _a, _b;
      const name = form.value.name || ((_b = (_a = profileData.value) == null ? void 0 : _a.user) == null ? void 0 : _b.name) || "User";
      const names = name.split(" ");
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    });
    const showOtpModal = ref(false);
    const otpStep = ref("request");
    const isRequestingOtp = ref(false);
    const isVerifyingOtp = ref(false);
    const otpCode = ref("");
    const otpError = ref("");
    const otpSuccess = ref("");
    const unlinkCooldown = ref(0);
    const showLinkOtpModal = ref(route.query.linked === "otp_required");
    const linkEmailTarget = ref(route.query.email || "");
    const linkOtpCode = ref("");
    const linkOtpError = ref("");
    const isVerifyingLinkOtp = ref(false);
    const isResendingLink = ref(false);
    const linkCooldown = ref(0);
    let linkTimerInterval = null;
    const startLinkCooldown = () => {
      linkCooldown.value = 60;
      clearInterval(linkTimerInterval);
      linkTimerInterval = setInterval();
    };
    if (showLinkOtpModal.value) {
      startLinkCooldown();
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 bg-gray-50 min-h-screen" }, _attrs))}><div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        breadcrumbs: breadcrumbItems.value,
        class: "px-4 sm:px-0"
      }, null, _parent));
      if (linkedStatus.value === "success") {
        _push(`<div class="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-sm mx-4 sm:mx-0"><i class="fas fa-check-circle text-emerald-600 mt-0.5"></i><p class="text-sm text-emerald-700">Akun berhasil ditautkan dengan Google! Email profil Anda juga telah diperbarui otomatis. Mulai sekarang Anda bisa Login menggunakan Google.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (linkedStatus.value === "failed") {
        _push(`<div class="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 shadow-sm mx-4 sm:mx-0"><i class="fas fa-exclamation-circle text-red-600 mt-0.5"></i><p class="text-sm text-red-700">${ssrInterpolate(linkedMessage.value)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(profileData) && !((_a = unref(profileData).user) == null ? void 0 : _a.google_id)) {
        _push(`<div class="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"><div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><i class="fas fa-link"></i></div><div><h3 class="text-sm font-bold text-blue-900 mb-1">Kaitkan Akun Google</h3><p class="text-xs text-blue-700 leading-relaxed max-w-2xl"> Tautkan akun ini dengan Akun Google Anda agar Anda bisa masuk dengan cepat menggunakan Login Google di masa depan. </p></div></div><button class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"> Tautkan ke Google </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(profileData) && ((_b = unref(profileData).user) == null ? void 0 : _b.google_id)) {
        _push(`<div class="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"><div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600"><i class="fab fa-google"></i></div><div><h3 class="text-sm font-bold text-red-900 mb-1">Terhubung dengan Google</h3><p class="text-xs text-red-700 leading-relaxed max-w-2xl"> Akun Anda saat ini terhubung dengan Google. Anda dapat masuk menggunakan tombol Login Google. </p></div></div><button class="px-4 py-2 bg-white text-red-600 border border-red-200 text-xs font-semibold rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap shadow-sm"> Putuskan Tautan </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!loading.value && unref(profileData)) {
        _push(`<div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg"><section><header><h2 class="text-lg font-medium text-gray-900">Informasi Profil</h2><p class="mt-1 text-sm text-gray-600">Perbarui informasi profil dan alamat email Anda.</p></header><form class="mt-6 space-y-6"><div class="col-span-12 flex flex-col items-center text-center"><h3 class="text-lg font-medium text-gray-900">Foto Profil</h3><div class="mt-2">`);
        if (photoPreview.value) {
          _push(`<img${ssrRenderAttr("src", photoPreview.value)} alt="Profile Photo" class="rounded-full h-28 w-28 object-cover border border-gray-200">`);
        } else if (unref(profileData).profile_photo_url) {
          _push(`<img${ssrRenderAttr("src", unref(getStorageUrl)(unref(profileData).profile_photo_url))} alt="Profile Photo" class="rounded-full h-28 w-28 object-cover border border-gray-200">`);
        } else {
          _push(`<div class="h-28 w-28 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-3xl">${ssrInterpolate(userInitials.value)}</div>`);
        }
        _push(`</div><input type="file" class="hidden" accept="image/*"><button type="button" class="mt-4 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"> Pilih Foto Baru </button>`);
        if (errors.value.photo) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(errors.value.photo[0])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-8 border-t border-gray-200 pt-8"><h3 class="text-lg font-medium text-gray-900">Data Kepegawaian / Identitas</h3><div class="mt-4"><div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"><div class="space-y-6"><div><label class="block font-medium text-sm text-gray-700">NIP / NIK</label><input${ssrRenderAttr("value", form.value.nip)} type="text" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full">`);
        if (errors.value.nip) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(errors.value.nip[0])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="mt-1 text-xs text-gray-500 italic">*Jika ASN, mohon masukkan NIP.</p></div>`);
        if (unref(profileData).is_asn) {
          _push(`<!--[-->`);
          if ((_c = unref(profileData).kepegawaian) == null ? void 0 : _c.pangkat) {
            _push(`<div><label class="block font-medium text-sm text-gray-700">Pangkat</label><p class="mt-1 block w-full text-gray-700">${ssrInterpolate(unref(profileData).kepegawaian.pangkat)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (((_d = unref(profileData).kepegawaian) == null ? void 0 : _d.jabatan) && unref(profileData).kepegawaian.jabatan !== "-") {
            _push(`<div><label class="block font-medium text-sm text-gray-700">Jabatan</label><p class="mt-1 block w-full text-gray-700">${ssrInterpolate(unref(profileData).kepegawaian.jabatan)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (((_e = unref(profileData).kepegawaian) == null ? void 0 : _e.unit_bagian) && unref(profileData).kepegawaian.unit_bagian !== "-" && !unref(profileData).kepegawaian.unit_bagian.includes("Hubungan Masyarakat")) {
            _push(`<div><label class="block font-medium text-sm text-gray-700">Unit Bagian</label><p class="mt-1 block w-full text-gray-700">${ssrInterpolate(unref(profileData).kepegawaian.unit_bagian)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6">`);
        if (unref(profileData).is_asn) {
          _push(`<!--[--><div><label class="block font-medium text-sm text-gray-700">Nama</label><p class="mt-1 block w-full text-gray-700 font-semibold">${ssrInterpolate((_f = unref(profileData).user) == null ? void 0 : _f.name)}</p></div>`);
          if ((_g = unref(profileData).kepegawaian) == null ? void 0 : _g.unit_kerja) {
            _push(`<div><label class="block font-medium text-sm text-gray-700">Unit Kerja</label><p class="mt-1 block w-full text-gray-700">${ssrInterpolate(unref(profileData).kepegawaian.unit_kerja)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (((_h = unref(profileData).kepegawaian) == null ? void 0 : _h.nomor_hp) && unref(profileData).kepegawaian.nomor_hp !== "-") {
            _push(`<div><label class="block font-medium text-sm text-gray-700">Nomor HP</label><p class="mt-1 block w-full text-gray-700">${ssrInterpolate(unref(profileData).kepegawaian.nomor_hp)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label class="block font-medium text-sm text-gray-700">Email</label>`);
        if (unref(profileData).is_asn && ((_i = unref(profileData).user) == null ? void 0 : _i.email) && unref(profileData).user.email !== "-" && !form.value.email_can_update) {
          _push(`<p class="mt-1 block w-full text-gray-700">${ssrInterpolate(unref(profileData).user.email)}</p>`);
        } else {
          _push(`<!--[--><input${ssrRenderAttr("value", form.value.email)} type="email" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" required>`);
          if (errors.value.email) {
            _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(errors.value.email[0])}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="mt-2 text-sm text-red-600">Email dapat diperbarui.</p><!--]-->`);
        }
        _push(`</div></div></div></div></div><div class="mt-8 border-t border-gray-200 pt-8"><h3 class="text-lg font-medium text-gray-900">Informasi Tambahan</h3><div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 mt-4"><div><label class="block font-medium text-sm text-gray-700">Facebook</label><div class="flex items-center mt-1"><span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10"><i class="fab fa-facebook w-5 h-5 flex items-center justify-center"></i></span><input${ssrRenderAttr("value", form.value.facebook)} type="text" placeholder="https://facebook.com/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10"></div>`);
        if (errors.value.facebook) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(errors.value.facebook[0])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block font-medium text-sm text-gray-700">Instagram</label><div class="flex items-center mt-1"><span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10"><i class="fab fa-instagram w-5 h-5 flex items-center justify-center"></i></span><input${ssrRenderAttr("value", form.value.instagram)} type="text" placeholder="https://instagram.com/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10"></div>`);
        if (errors.value.instagram) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(errors.value.instagram[0])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block font-medium text-sm text-gray-700">Tiktok</label><div class="flex items-center mt-1"><span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10"><i class="fab fa-tiktok w-5 h-5 flex items-center justify-center"></i></span><input${ssrRenderAttr("value", form.value.tiktok)} type="text" placeholder="https://tiktok.com/@username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10"></div>`);
        if (errors.value.tiktok) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(errors.value.tiktok[0])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block font-medium text-sm text-gray-700">LinkedIn</label><div class="flex items-center mt-1"><span class="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md h-10"><i class="fab fa-linkedin w-5 h-5 flex items-center justify-center"></i></span><input${ssrRenderAttr("value", form.value.linkedin)} type="text" placeholder="https://linkedin.com/in/username" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-none rounded-r-md block w-full h-10"></div>`);
        if (errors.value.linkedin) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(errors.value.linkedin[0])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="flex items-center gap-4 mt-6"><button type="submit"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50">`);
        if (saving.value) {
          _push(`<i class="fas fa-spinner fa-spin mr-2"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Simpan Perubahan </button>`);
        if (successMessage.value) {
          _push(`<p class="text-sm text-gray-600">${ssrInterpolate(successMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></form></section></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (showOtpModal.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75 p-4"><div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"><div class="px-6 py-6 sm:p-8"><div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4"><i class="fas fa-shield-alt text-red-600 text-xl"></i></div><div class="text-center w-full"><h3 class="text-xl font-bold text-gray-900 mb-2">Verifikasi Keamanan</h3>`);
        if (otpStep.value === "request") {
          _push(`<div><p class="text-sm text-gray-500 mb-6"> Untuk memutuskan tautan Google, kami perlu mengirimkan kode OTP 6-digit ke email Anda <strong>${ssrInterpolate((_k = (_j = unref(profileData)) == null ? void 0 : _j.user) == null ? void 0 : _k.email)}</strong> sebagai verifikasi keamanan. </p>`);
          if (otpError.value) {
            _push(`<div class="mb-4 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg border border-red-100">${ssrInterpolate(otpError.value)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex flex-col sm:flex-row gap-3"><button type="button" class="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"> Batal </button><button${ssrIncludeBooleanAttr(isRequestingOtp.value) ? " disabled" : ""} class="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center">`);
          if (isRequestingOtp.value) {
            _push(`<i class="fas fa-spinner fa-spin mr-2"></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(` Kirim Kode OTP </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (otpStep.value === "verify") {
          _push(`<div><p class="text-sm text-gray-500 mb-2"> Masukkan 6-digit kode OTP yang telah dikirimkan ke email Anda. </p>`);
          if (otpError.value) {
            _push(`<div class="mb-4 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg border border-red-100">${ssrInterpolate(otpError.value)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (otpSuccess.value) {
            _push(`<div class="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs text-left rounded-lg border border-emerald-100">${ssrInterpolate(otpSuccess.value)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<form class="text-left mt-4"><div class="mb-6 flex justify-center"><input${ssrRenderAttr("value", otpCode.value)} type="text" maxlength="6" required placeholder="123456" class="w-32 px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"></div><div class="flex flex-col sm:flex-row gap-3"><button type="button" class="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(isVerifyingOtp.value || otpCode.value.length !== 6) ? " disabled" : ""} class="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center">`);
          if (isVerifyingOtp.value) {
            _push(`<i class="fas fa-spinner fa-spin mr-2"></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(` Verifikasi &amp; Putuskan </button></div><div class="text-center mt-4 border-t pt-4"><button type="button"${ssrIncludeBooleanAttr(unlinkCooldown.value > 0 || isRequestingOtp.value) ? " disabled" : ""} class="text-red-600 hover:text-red-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed">`);
          if (isRequestingOtp.value) {
            _push(`<span class="animate-spin h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full inline-block mr-1"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(unlinkCooldown.value > 0 ? `Kirim Ulang OTP dalam ${unlinkCooldown.value}s` : "Kirim Ulang OTP")}</button></div></form></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showLinkOtpModal.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75 p-4"><div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"><div class="px-6 py-6 sm:p-8"><div class="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4"><i class="fas fa-shield-alt text-blue-600 text-xl"></i></div><div class="text-center w-full"><h3 class="text-xl font-bold text-gray-900 mb-2">Verifikasi Email Anda</h3><p class="text-sm text-gray-500 mb-4"> Kode verifikasi 6-digit telah dikirim ke email <strong>${ssrInterpolate(linkEmailTarget.value)}</strong>. Silakan masukkan kode tersebut di bawah ini untuk menautkan akun. </p>`);
        if (linkOtpError.value) {
          _push(`<div class="mb-4 p-3 bg-red-50 text-red-700 text-xs text-left rounded-lg border border-red-100">${ssrInterpolate(linkOtpError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="text-left mt-4"><div class="mb-6 flex justify-center"><input${ssrRenderAttr("value", linkOtpCode.value)} type="text" maxlength="6" required placeholder="123456" class="w-32 px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"></div><div class="flex flex-col sm:flex-row gap-3"><button type="button" class="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(isVerifyingLinkOtp.value || linkOtpCode.value.length !== 6) ? " disabled" : ""} class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center">`);
        if (isVerifyingLinkOtp.value) {
          _push(`<i class="fas fa-spinner fa-spin mr-2"></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Verifikasi &amp; Tautkan </button></div><div class="text-center mt-4 border-t pt-4"><p class="text-sm text-gray-600 mb-2">Belum menerima kode OTP?</p><button type="button"${ssrIncludeBooleanAttr(linkCooldown.value > 0 || isResendingLink.value) ? " disabled" : ""} class="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed">`);
        if (isResendingLink.value) {
          _push(`<span class="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full inline-block mr-1"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(linkCooldown.value > 0 ? `Kirim Ulang OTP dalam ${linkCooldown.value}s` : "Kirim Ulang OTP")}</button></div></form></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-mnqLVMUD.mjs.map
