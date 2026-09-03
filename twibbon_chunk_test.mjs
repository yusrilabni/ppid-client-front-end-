import { _ as __nuxt_component_0 } from './nuxt-link-DF-vYNws.mjs';
import { ref, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useAuthStore } from './auth-D3EhnwAe.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import '@tanstack/vue-query';
import 'axios';

const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useAuthStore();
    const loading = ref(true);
    const twibbon = ref(null);
    const frameUrl = ref("");
    const photos = ref([]);
    const texts = ref([]);
    const selectedPhotoIds = ref([]);
    const selectedTextIds = ref([]);
    ref(false);
    const selectedText = computed(() => texts.value.find((t) => selectedTextIds.value.includes(t.id)));
    const selectedPhotos = computed(() => photos.value.filter((p) => selectedPhotoIds.value.includes(p.id)));
    const selectedPhoto = computed(() => selectedPhotos.value[0] || null);
    const currentDegreeDisplay = ref(null);
    ref(null);
    ref(null);
    const isSnappedX = ref(false);
    const isSnappedY = ref(false);
    const isDownloading = ref(false);
    const isDragOver = ref(false);
    const isDragOverCanvas = ref(false);
    const isInteracting = ref(false);
    let isDragging = false;
    isInteracting.value = false;
    const isPickingColorActive = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen pb-12" }, _attrs))} data-v-dfd8cfdb><div class="bg-blue-600 text-white pt-8 pb-16" data-v-dfd8cfdb><div class="container mx-auto px-4 max-w-4xl" data-v-dfd8cfdb>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-blue-200 hover:text-white transition flex items-center gap-2 mb-6",
        onClick: () => {
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-arrow-left" data-v-dfd8cfdb${_scopeId}></i> Kembali ke Beranda `);
          } else {
            return [
              createVNode("i", { class: "fas fa-arrow-left" }),
              createTextVNode(" Kembali ke Beranda ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-3xl font-bold mb-2" data-v-dfd8cfdb>${ssrInterpolate(((_a = twibbon.value) == null ? void 0 : _a.judul) || "Memuat...")}</h1><p class="text-blue-100" data-v-dfd8cfdb>Pasang foto terbaik Anda dan bagikan ke media sosial!</p></div></div><div class="container mx-auto px-4 max-w-4xl -mt-8 pb-24 md:pb-8" data-v-dfd8cfdb><div class="bg-white rounded-2xl shadow-xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start" data-v-dfd8cfdb><div class="w-full md:w-3/5 flex flex-col items-center relative" data-v-dfd8cfdb>`);
      if (loading.value) {
        _push(`<div class="w-full aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center" data-v-dfd8cfdb><i class="fas fa-spinner fa-spin text-3xl text-gray-400" data-v-dfd8cfdb></i></div>`);
      } else {
        _push(`<div class="${ssrRenderClass([{ "ring-4 ring-blue-500 bg-blue-50": isDragOverCanvas.value }, "relative w-full aspect-square mx-auto bg-gray-200 rounded-xl overflow-hidden shadow-inner checkerboard"])}" data-v-dfd8cfdb>`);
        if (isSnappedX.value) {
          _push(`<div class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-blue-500 z-40 pointer-events-none" data-v-dfd8cfdb></div>`);
        } else {
          _push(`<!---->`);
        }
        if (isSnappedY.value) {
          _push(`<div class="absolute left-0 right-0 top-1/2 h-[1px] bg-blue-500 z-40 pointer-events-none" data-v-dfd8cfdb></div>`);
        } else {
          _push(`<!---->`);
        }
        if (currentDegreeDisplay.value !== null) {
          _push(`<div class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-sm font-bold z-50 pointer-events-none" data-v-dfd8cfdb>${ssrInterpolate(currentDegreeDisplay.value)}\xB0 </div>`);
        } else {
          _push(`<!---->`);
        }
        if (isPickingColorActive.value) {
          _push(`<div class="absolute inset-0 z-50 bg-indigo-900/30 cursor-crosshair flex flex-col items-center justify-between p-4 transition" data-v-dfd8cfdb><div class="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-semibold animate-bounce flex items-center gap-1.5" data-v-dfd8cfdb><i class="fas fa-eye-dropper" data-v-dfd8cfdb></i> Sentuh/Klik area gambar untuk mengambil warna </div><button class="bg-white text-gray-700 text-xs px-3 py-1 rounded-full shadow hover:bg-gray-100 font-medium" data-v-dfd8cfdb> Batal </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(photos.value, (photo) => {
          _push(`<div class="${ssrRenderClass([{ "z-10": !selectedPhotoIds.value.includes(photo.id), "z-20 ring-2 ring-blue-400 ring-offset-1": selectedPhotoIds.value.includes(photo.id) }, "absolute"])}" style="${ssrRenderStyle({
            transform: `translate(${photo.x}px, ${photo.y}px) rotate(${photo.rotation}deg)`,
            width: `${photo.width}px`,
            height: `${photo.height}px`,
            cursor: photo.isLocked ? "not-allowed" : unref(isDragging) && selectedPhotoIds.value.includes(photo.id) ? "grabbing" : "grab",
            filter: `blur(${photo.blur}px)`
          })}" data-v-dfd8cfdb><img${ssrRenderAttr("src", photo.dataUrl)} class="w-full h-full object-fill max-w-none pointer-events-none select-none drop-shadow-md" data-v-dfd8cfdb>`);
          if (selectedPhotoIds.value.includes(photo.id) && !photo.isLocked) {
            _push(`<div class="${ssrRenderClass({ "opacity-0": isInteracting.value })}" data-v-dfd8cfdb><div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" data-v-dfd8cfdb></div><div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" data-v-dfd8cfdb></div><div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nesw-resize z-30" data-v-dfd8cfdb></div><div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-blue-600 shadow-md cursor-nwse-resize z-30" data-v-dfd8cfdb></div><div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-blue-600 shadow-md flex items-center justify-center cursor-ew-resize z-30 text-blue-600" data-v-dfd8cfdb><i class="fas fa-sync-alt text-xs pointer-events-none" data-v-dfd8cfdb></i></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(texts.value, (t) => {
          _push(`<div class="${ssrRenderClass([{ "z-[30]": !selectedTextIds.value.includes(t.id), "z-[35] ring-2 ring-indigo-500 ring-offset-1 border border-indigo-400": selectedTextIds.value.includes(t.id) }, "absolute flex flex-col items-center justify-center pointer-events-auto select-none max-w-[90%]"])}" style="${ssrRenderStyle({
            transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px)) rotate(${t.rotation}deg)`,
            left: "50%",
            top: "50%",
            cursor: t.isLocked ? "not-allowed" : unref(isDragging) && selectedTextIds.value.includes(t.id) ? "grabbing" : "grab"
          })}" data-v-dfd8cfdb><textarea style="${ssrRenderStyle({ color: t.color, fontSize: t.fontSize + "px", fontWeight: "bold", textShadow: "1px 1px 3px rgba(0,0,0,0.6)", lineHeight: "1.2" })}" class="bg-transparent border-0 outline-none text-center p-1 m-0 font-sans resize-none overflow-hidden focus:bg-black/20 focus:rounded inline-block max-w-full break-words whitespace-pre-wrap" rows="1" placeholder="Ketik teks..." data-v-dfd8cfdb>${ssrInterpolate(t.text)}</textarea>`);
          if (selectedTextIds.value.includes(t.id) && !t.isLocked) {
            _push(`<div class="${ssrRenderClass({ "opacity-0": isInteracting.value })}" data-v-dfd8cfdb><div class="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white rounded-full border-2 border-indigo-600 shadow cursor-nwse-resize z-30" data-v-dfd8cfdb></div><div class="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white rounded-full border-2 border-indigo-600 shadow cursor-nesw-resize z-30" data-v-dfd8cfdb></div><div class="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white rounded-full border-2 border-indigo-600 shadow cursor-nesw-resize z-30" data-v-dfd8cfdb></div><div class="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white rounded-full border-2 border-indigo-600 shadow cursor-nwse-resize z-30" data-v-dfd8cfdb></div><div class="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-white rounded-full border-2 border-indigo-600 shadow cursor-ns-resize z-30" title="Atur Tinggi Font" data-v-dfd8cfdb></div><div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-white rounded-full border-2 border-indigo-600 shadow cursor-ns-resize z-30" title="Atur Tinggi Font" data-v-dfd8cfdb></div><div class="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-6 bg-white rounded-full border-2 border-indigo-600 shadow cursor-ew-resize z-30" title="Atur Lebar" data-v-dfd8cfdb></div><div class="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-6 bg-white rounded-full border-2 border-indigo-600 shadow cursor-ew-resize z-30" title="Atur Lebar" data-v-dfd8cfdb></div><div class="absolute -bottom-9 left-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full border border-indigo-600 shadow flex items-center justify-center cursor-ew-resize z-30 text-indigo-600" data-v-dfd8cfdb><i class="fas fa-sync-alt text-[10px] pointer-events-none" data-v-dfd8cfdb></i></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (frameUrl.value) {
          _push(`<img crossorigin="anonymous"${ssrRenderAttr("src", frameUrl.value)} class="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none select-none drop-shadow-xl" style="${ssrRenderStyle({ "z-index": "25" })}" data-v-dfd8cfdb>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<canvas class="hidden" data-v-dfd8cfdb></canvas>`);
        if (photos.value.length === 0) {
          _push(`<div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 pointer-events-none" data-v-dfd8cfdb><div class="bg-white/90 px-4 py-2 rounded-lg shadow-sm text-center" data-v-dfd8cfdb><i class="fas fa-image text-gray-400 text-2xl mb-1" data-v-dfd8cfdb></i><p class="text-sm font-medium text-gray-600" data-v-dfd8cfdb>Silakan unggah atau tarik foto kesini (Maks. 10)</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      if (selectedPhotos.value.length > 0 && !isInteracting.value) {
        _push(`<div class="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl px-4 py-2 flex items-center gap-4 z-50 border border-gray-200" data-v-dfd8cfdb><button class="text-red-500 hover:text-red-700" title="Hapus Foto" data-v-dfd8cfdb><i class="fas fa-trash" data-v-dfd8cfdb></i></button><button class="text-blue-500 hover:text-blue-700" title="Tengahkan Foto" data-v-dfd8cfdb><i class="fas fa-crosshairs" data-v-dfd8cfdb></i></button><button class="${ssrRenderClass(selectedPhoto.value.isLocked ? "text-orange-500 hover:text-orange-700" : "text-gray-500 hover:text-gray-700")}"${ssrRenderAttr("title", selectedPhoto.value.isLocked ? "Buka Kunci" : "Kunci")} data-v-dfd8cfdb><i class="${ssrRenderClass(selectedPhoto.value.isLocked ? "fas fa-lock" : "fas fa-lock-open")}" data-v-dfd8cfdb></i></button><div class="flex items-center gap-2" data-v-dfd8cfdb><i class="fas fa-tint text-gray-400 text-xs" data-v-dfd8cfdb></i><input type="range" min="0" max="20" step="0.5"${ssrRenderAttr("value", selectedPhoto.value.blur)} class="w-20" title="Efek Blur" data-v-dfd8cfdb></div></div>`);
      } else if (selectedTextIds.value.length > 0 && selectedText.value) {
        _push(`<div class="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl px-3 py-1.5 flex items-center gap-2 z-50 border border-indigo-200" data-v-dfd8cfdb><span class="text-xs font-semibold text-indigo-600 hidden sm:flex items-center gap-1" data-v-dfd8cfdb><i class="fas fa-font" data-v-dfd8cfdb></i> Teks</span><div class="flex items-center gap-1 border border-gray-200 rounded px-1.5 py-1 bg-gray-50" data-v-dfd8cfdb><input type="color"${ssrRenderAttr("value", selectedText.value.color)} class="w-6 h-6 border-0 rounded cursor-pointer p-0 bg-transparent" title="Pilih Warna Kustom" data-v-dfd8cfdb><div class="flex items-center gap-1 ml-1 border-l border-gray-300 pl-1.5" data-v-dfd8cfdb><!--[-->`);
        ssrRenderList(["#ffffff", "#000000", "#ef4444", "#eab308", "#3b82f6", "#22c55e"], (c) => {
          _push(`<button class="w-4 h-4 rounded-full border border-gray-400 shadow-sm transition hover:scale-110" style="${ssrRenderStyle({ backgroundColor: c })}"${ssrRenderAttr("title", `Warna ${c}`)} data-v-dfd8cfdb></button>`);
        });
        _push(`<!--]--></div><button class="p-1 hover:bg-gray-200 text-indigo-600 rounded ml-1 font-bold" title="Pipet Warna Kanvas" data-v-dfd8cfdb><i class="fas fa-eye-dropper text-xs" data-v-dfd8cfdb></i></button></div><div class="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-1" data-v-dfd8cfdb><span class="text-[10px] text-gray-500 font-semibold hidden sm:inline" data-v-dfd8cfdb>Ukuran:</span><input type="number" min="10" max="200"${ssrRenderAttr("value", selectedText.value.fontSize)} class="w-11 border border-gray-300 rounded text-xs px-1 text-center" title="Ukuran Font" data-v-dfd8cfdb></div><button class="text-red-500 hover:text-red-700 text-xs p-1" title="Hapus Teks" data-v-dfd8cfdb><i class="fas fa-trash" data-v-dfd8cfdb></i></button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (photos.value.length > 0) {
        _push(`<div class="w-full mt-4 text-center" data-v-dfd8cfdb><p class="text-sm text-gray-500" data-v-dfd8cfdb><i class="fas fa-hand-pointer mr-1" data-v-dfd8cfdb></i> Pilih foto untuk menggeser, mengubah ukuran, atau mengatur filter (${ssrInterpolate(photos.value.length)}/10)</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="w-full md:w-2/5 flex flex-col gap-4" data-v-dfd8cfdb><div class="bg-gray-50 p-6 rounded-xl border border-gray-100" data-v-dfd8cfdb><h3 class="font-bold text-gray-800 mb-4" data-v-dfd8cfdb><i class="fas fa-cog mr-2" data-v-dfd8cfdb></i> Pengaturan</h3><label for="upload-photo" class="${ssrRenderClass(["w-full border-2 border-dashed transition font-medium py-3 px-4 rounded-xl text-center flex flex-col items-center justify-center gap-2 mb-3", isDragOver.value ? "border-blue-600 bg-blue-100 text-blue-700" : "bg-white border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600", photos.value.length >= 10 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"])}" data-v-dfd8cfdb><i class="fas fa-upload text-xl" data-v-dfd8cfdb></i><span data-v-dfd8cfdb>${ssrInterpolate(photos.value.length > 0 ? "Tambah Foto Lain" : "Pilih atau Tarik Foto Kesini")}</span>`);
      if (photos.value.length < 10) {
        _push(`<input id="upload-photo" type="file" class="hidden" accept="image/*" data-v-dfd8cfdb>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><button class="w-full border-2 border-indigo-600 bg-white text-indigo-700 font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 mb-4 hover:bg-indigo-50 transition cursor-pointer text-sm" data-v-dfd8cfdb><i class="fas fa-font text-lg" data-v-dfd8cfdb></i><span data-v-dfd8cfdb>Tambah Teks Baru</span></button><button${ssrIncludeBooleanAttr(photos.value.length === 0 || isDownloading.value) ? " disabled" : ""} class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" data-v-dfd8cfdb>`);
      if (isDownloading.value) {
        _push(`<i class="fas fa-spinner fa-spin" data-v-dfd8cfdb></i>`);
      } else {
        _push(`<i class="fas fa-download" data-v-dfd8cfdb></i>`);
      }
      _push(` ${ssrInterpolate(isDownloading.value ? "Memproses..." : "Unduh Hasil (PNG)")}</button></div><div class="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed" data-v-dfd8cfdb><h4 class="font-bold mb-1" data-v-dfd8cfdb><i class="fas fa-info-circle mr-1" data-v-dfd8cfdb></i> Tips Penggunaan:</h4><ul class="list-disc pl-5 space-y-1 text-blue-700/80" data-v-dfd8cfdb><li data-v-dfd8cfdb>Anda dapat menambah hingga <b data-v-dfd8cfdb>5 foto</b> sekaligus.</li><li data-v-dfd8cfdb>Klik foto untuk memunculkan toolbar (Hapus, Kunci, Blur).</li><li data-v-dfd8cfdb>Tarik tombol bulat di sudut foto yang dipilih untuk resize.</li></ul></div></div></div></div>`);
      if (photos.value.length > 0) {
        _push(`<div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden z-50 flex gap-3 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]" data-v-dfd8cfdb><label for="upload-photo-mobile" class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": photos.value.length >= 10, "cursor-pointer": photos.value.length < 10 }, "flex-1 bg-blue-50 border border-blue-200 text-blue-700 font-semibold py-3 px-2 rounded-xl text-center text-sm flex items-center justify-center"])}" data-v-dfd8cfdb><i class="fas fa-plus mr-1" data-v-dfd8cfdb></i> Tambah `);
        if (photos.value.length < 10) {
          _push(`<input id="upload-photo-mobile" type="file" class="hidden" accept="image/*" data-v-dfd8cfdb>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><button${ssrIncludeBooleanAttr(isDownloading.value) ? " disabled" : ""} class="flex-[2] bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm" data-v-dfd8cfdb>`);
        if (isDownloading.value) {
          _push(`<i class="fas fa-spinner fa-spin" data-v-dfd8cfdb></i>`);
        } else {
          _push(`<i class="fas fa-download" data-v-dfd8cfdb></i>`);
        }
        _push(` ${ssrInterpolate(isDownloading.value ? "Tunggu..." : "Unduh Hasil")}</button></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/twibbon/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dfd8cfdb"]]);

export { _slug_ as default };
