import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { _ as _sfc_main$1 } from './PageHeader-CUVqtGHn.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "permohonan-informasi",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const success = ref(false);
    const trackingCode = ref("");
    ref(null);
    const initialFormState = {
      kategori: "Perorangan",
      nik: "",
      nama: "",
      email: "",
      no_hp: "",
      alamat: "",
      rincian_informasi: "",
      tujuan_penggunaan: "",
      cara_memperoleh: "Melihat/Membaca/Mendengarkan/Mencatat",
      cara_mengirim: "Email"
    };
    const form = ref({ ...initialFormState });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "permohonan-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Permohonan Informasi Publik" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-8 max-w-3xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).permohonanPage(),
        class: "mb-6"
      }, null, _parent));
      _push(`<div class="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-100">`);
      if (success.value) {
        _push(`<div class="bg-green-50 text-green-700 p-6 rounded-lg mb-8 text-center border border-green-200"><i class="fas fa-check-circle text-4xl mb-3 text-green-500"></i><h3 class="text-xl font-bold mb-2">Permohonan Berhasil Dikirim!</h3><p class="mb-4">Terima kasih, permohonan Anda telah kami terima.</p><div class="bg-white p-4 rounded-md shadow-inner text-xl font-mono tracking-widest text-gray-800 border"> Kode Registrasi: <strong>${ssrInterpolate(trackingCode.value)}</strong></div><p class="text-sm mt-4 text-green-600">Simpan kode registrasi ini untuk melacak status permohonan Anda.</p><button class="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Ajukan Permohonan Baru</button></div>`);
      } else {
        _push(`<form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-1">Kategori Pemohon <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"><option value="Perorangan"${ssrIncludeBooleanAttr(Array.isArray(form.value.kategori) ? ssrLooseContain(form.value.kategori, "Perorangan") : ssrLooseEqual(form.value.kategori, "Perorangan")) ? " selected" : ""}>Perorangan</option><option value="Lembaga/Organisasi"${ssrIncludeBooleanAttr(Array.isArray(form.value.kategori) ? ssrLooseContain(form.value.kategori, "Lembaga/Organisasi") : ssrLooseEqual(form.value.kategori, "Lembaga/Organisasi")) ? " selected" : ""}>Lembaga / Organisasi</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1">NIK / No. Identitas <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.nik)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan NIK"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.nama)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Sesuai KTP"></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.email)} type="email" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="email@contoh.com"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.value.no_hp)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="08xxxxxxxxxx"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span class="text-red-500">*</span></label><textarea required rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Alamat lengkap sesuai identitas">${ssrInterpolate(form.value.alamat)}</textarea></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Informasi yang Dibutuhkan <span class="text-red-500">*</span></label><textarea required rows="4" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Jelaskan secara rinci informasi yang Anda butuhkan">${ssrInterpolate(form.value.rincian_informasi)}</textarea></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Tujuan Penggunaan Informasi <span class="text-red-500">*</span></label><textarea required rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Jelaskan untuk apa informasi tersebut digunakan">${ssrInterpolate(form.value.tujuan_penggunaan)}</textarea></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-1">Cara Memperoleh Informasi</label><select class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"><option value="Melihat/Membaca/Mendengarkan/Mencatat"${ssrIncludeBooleanAttr(Array.isArray(form.value.cara_memperoleh) ? ssrLooseContain(form.value.cara_memperoleh, "Melihat/Membaca/Mendengarkan/Mencatat") : ssrLooseEqual(form.value.cara_memperoleh, "Melihat/Membaca/Mendengarkan/Mencatat")) ? " selected" : ""}>Melihat / Membaca / Mencatat</option><option value="Mendapatkan Salinan Hardcopy"${ssrIncludeBooleanAttr(Array.isArray(form.value.cara_memperoleh) ? ssrLooseContain(form.value.cara_memperoleh, "Mendapatkan Salinan Hardcopy") : ssrLooseEqual(form.value.cara_memperoleh, "Mendapatkan Salinan Hardcopy")) ? " selected" : ""}>Mendapatkan Salinan Hardcopy</option><option value="Mendapatkan Salinan Softcopy"${ssrIncludeBooleanAttr(Array.isArray(form.value.cara_memperoleh) ? ssrLooseContain(form.value.cara_memperoleh, "Mendapatkan Salinan Softcopy") : ssrLooseEqual(form.value.cara_memperoleh, "Mendapatkan Salinan Softcopy")) ? " selected" : ""}>Mendapatkan Salinan Softcopy</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Cara Mengirim Informasi</label><select class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"><option value="Mengambil Langsung"${ssrIncludeBooleanAttr(Array.isArray(form.value.cara_mengirim) ? ssrLooseContain(form.value.cara_mengirim, "Mengambil Langsung") : ssrLooseEqual(form.value.cara_mengirim, "Mengambil Langsung")) ? " selected" : ""}>Mengambil Langsung</option><option value="Email"${ssrIncludeBooleanAttr(Array.isArray(form.value.cara_mengirim) ? ssrLooseContain(form.value.cara_mengirim, "Email") : ssrLooseEqual(form.value.cara_mengirim, "Email")) ? " selected" : ""}>Email</option><option value="Kurir/Pos"${ssrIncludeBooleanAttr(Array.isArray(form.value.cara_mengirim) ? ssrLooseContain(form.value.cara_mengirim, "Kurir/Pos") : ssrLooseEqual(form.value.cara_mengirim, "Kurir/Pos")) ? " selected" : ""}>Kurir / Pos</option></select></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Upload KTP/Identitas (Maks 2MB) <span class="text-red-500">*</span></label><input type="file" accept="image/*,.pdf" required class="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"></div><div class="pt-4"><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center">`);
        if (loading.value) {
          _push(`<span class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(loading.value ? "Mengirim..." : "Kirim Permohonan")}</button></div></form>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/permohonan-informasi.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=permohonan-informasi-B8intjJY.mjs.map
