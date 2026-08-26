import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Breadcrumbs-CqGmUqmz.mjs';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { _ as _sfc_main$1 } from './PageHeader-CUVqtGHn.mjs';
import { _ as _sfc_main$3 } from './LoadingSkeleton-Cjy-6M0R.mjs';
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
  __name: "kontak",
  __ssrInlineRender: true,
  setup(__props) {
    const settings = ref({});
    const loading = ref(true);
    const submitting = ref(false);
    const success = ref(false);
    const form = ref({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "kontak-page" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, { title: "Hubungi Kami" }, null, _parent));
      _push(`<div class="container mx-auto px-4 py-12 max-w-6xl">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        breadcrumbs: unref(getBreadcrumbs).kontak(),
        class: "mb-6"
      }, null, _parent));
      _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-12"><div class="space-y-8">`);
      if (loading.value) {
        _push(`<div class="space-y-4">`);
        _push(ssrRenderComponent(_sfc_main$3, { class: "h-32 w-full" }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$3, { class: "h-32 w-full" }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$3, { class: "h-32 w-full" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4"><div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-map-marker-alt"></i></div><div><h3 class="text-xl font-bold text-gray-800 mb-2">Alamat</h3><p class="text-gray-600">${ssrInterpolate(settings.value.address || "Kompleks Kantor Bupati Sinjai, Sulawesi Selatan")}</p></div></div><div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4"><div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-phone"></i></div><div><h3 class="text-xl font-bold text-gray-800 mb-2">Telepon / WhatsApp</h3><p class="text-gray-600">${ssrInterpolate(settings.value.phone || "(0482) 21000")}</p></div></div><div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4"><div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-envelope"></i></div><div><h3 class="text-xl font-bold text-gray-800 mb-2">Email</h3><p class="text-gray-600">${ssrInterpolate(settings.value.email || "ppid@sinjaikab.go.id")}</p></div></div><div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4"><div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-clock"></i></div><div><h3 class="text-xl font-bold text-gray-800 mb-2">Jam Pelayanan</h3><p class="text-gray-600">Senin - Kamis: 08.00 - 16.00 WITA</p><p class="text-gray-600">Jumat: 08.00 - 16.30 WITA</p></div></div><!--]-->`);
      }
      _push(`</div><div class="bg-white p-8 rounded-xl shadow-lg border"><h2 class="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>`);
      if (success.value) {
        _push(`<div class="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200"> Pesan Anda berhasil dikirim. Kami akan segera meresponnya. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input${ssrRenderAttr("value", form.value.name)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input${ssrRenderAttr("value", form.value.email)} type="email" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Subjek</label><input${ssrRenderAttr("value", form.value.subject)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label><textarea required rows="5" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">${ssrInterpolate(form.value.message)}</textarea></div><button type="submit"${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""} class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center">`);
      if (submitting.value) {
        _push(`<span class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` Kirim Pesan </button></form></div></div><div class="mt-12 bg-white rounded-xl shadow-lg p-2 h-96 overflow-hidden"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.344474776114!2d120.2483861!3d-5.2676011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbc3c9a42f63f5f%3A0xc3f345eb651147a5!2sKantor%20Bupati%20Sinjai!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" width="100%" height="100%" style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen="" loading="lazy"></iframe></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kontak.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=kontak-DQNZiGXX.mjs.map
