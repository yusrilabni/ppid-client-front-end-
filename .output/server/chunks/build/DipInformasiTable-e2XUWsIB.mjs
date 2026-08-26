import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "DipInformasiTable",
  __ssrInlineRender: true,
  props: {
    informasiList: {
      type: Array,
      required: true
    },
    unitMap: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    function truncate(str, n) {
      return str.length > n ? str.slice(0, n - 1) + "..." : str;
    }
    function getUnitName(informasi) {
      var _a;
      const unitId = String(informasi.unit_id).trim();
      return ((_a = props.unitMap[unitId]) == null ? void 0 : _a.unit_nama) || "Unit Tidak Terdaftar";
    }
    function getPejabat(informasi) {
      const unitName = getUnitName(informasi);
      return unitName === "Dinas Komunikasi Informatika dan Persandian" ? "PPID Utama" : "PPID Pelaksana";
    }
    function getBentuk(informasi) {
      if (informasi.url || informasi.official_id) return "Soft Copy";
      if (informasi.file) return "Hard Copy";
      return "N/A";
    }
    function getBentukClass(informasi) {
      const bentuk = getBentuk(informasi);
      return bentuk === "Soft Copy" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-gray-50 text-gray-700 border border-gray-100";
    }
    function isBerlaku(status) {
      const s = String(status || "").toUpperCase().trim();
      return ["BERLAKU", "AKTIF"].includes(s);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200" data-v-447f00bf><table class="min-w-full divide-y divide-gray-200" data-v-447f00bf><thead class="bg-gray-50" data-v-447f00bf><tr data-v-447f00bf><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" data-v-447f00bf>No</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" data-v-447f00bf>Judul</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" data-v-447f00bf>Deskripsi</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" data-v-447f00bf>Pejabat Penguasa</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" data-v-447f00bf>Penanggung Jawab</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center" data-v-447f00bf>Waktu</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center" data-v-447f00bf>Jangka</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center" data-v-447f00bf>Bentuk</th><th class="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center" data-v-447f00bf>Aksi</th></tr></thead><tbody class="bg-white divide-y divide-gray-100" data-v-447f00bf>`);
      if (__props.informasiList && __props.informasiList.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(__props.informasiList, (informasi, index) => {
          _push(`<tr class="hover:bg-gray-50/80 transition-colors" data-v-447f00bf><td class="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium" data-v-447f00bf>${ssrInterpolate(index + 1)}</td><td class="px-4 py-4 text-xs font-bold text-gray-900 leading-snug" data-v-447f00bf>${ssrInterpolate(informasi.title)}</td><td class="px-4 py-4 text-xs text-gray-600 max-w-[200px]" data-v-447f00bf>${ssrInterpolate(truncate(informasi.deskripsi || "N/A", 60))}</td><td class="px-4 py-4 whitespace-nowrap text-xs text-gray-700" data-v-447f00bf>${ssrInterpolate(getPejabat(informasi))}</td><td class="px-4 py-4 text-xs text-gray-700 font-medium" data-v-447f00bf>${ssrInterpolate(getUnitName(informasi))}</td><td class="px-4 py-4 whitespace-nowrap text-xs text-gray-600 text-center" data-v-447f00bf>${ssrInterpolate(informasi.tahun)}</td><td class="px-4 py-4 whitespace-nowrap text-xs text-gray-600 text-center" data-v-447f00bf>`);
          if (isBerlaku(informasi.status)) {
            _push(`<span class="text-green-600" data-v-447f00bf>Selama Berlaku</span>`);
          } else if ((informasi.status || "").toUpperCase() === "ARSIP") {
            _push(`<span class="text-amber-600" data-v-447f00bf>Tahun ${ssrInterpolate(informasi.tahun)}</span>`);
          } else {
            _push(`<span data-v-447f00bf>Selama Berlaku</span>`);
          }
          _push(`</td><td class="px-4 py-4 whitespace-nowrap text-xs text-gray-600 text-center" data-v-447f00bf><span class="${ssrRenderClass(["px-2 py-0.5 rounded-full", getBentukClass(informasi)])}" data-v-447f00bf>${ssrInterpolate(getBentuk(informasi))}</span></td><td class="px-4 py-4 whitespace-nowrap text-xs text-center font-medium" data-v-447f00bf>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/informasi/detail/${informasi.slug || informasi.id}`,
            class: "text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Detail `);
              } else {
                return [
                  createTextVNode(" Detail ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<tr data-v-447f00bf><td colspan="9" class="text-center py-10 text-gray-400 italic" data-v-447f00bf>Data tidak tersedia</td></tr>`);
      }
      _push(`</tbody></table></div><div class="md:hidden space-y-4" data-v-447f00bf>`);
      if (__props.informasiList && __props.informasiList.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(__props.informasiList, (informasi, index) => {
          _push(`<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow" data-v-447f00bf><div class="flex justify-between items-start mb-3" data-v-447f00bf><span class="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 uppercase" data-v-447f00bf>${ssrInterpolate(getPejabat(informasi))}</span><span class="text-[10px] text-gray-400 font-bold" data-v-447f00bf>#${ssrInterpolate(index + 1)}</span></div><h5 class="text-sm font-bold text-gray-900 mb-2 leading-tight" data-v-447f00bf>${ssrInterpolate(informasi.title)}</h5><p class="text-xs text-gray-500 line-clamp-2 mb-4" data-v-447f00bf>${ssrInterpolate(informasi.deskripsi || "N/A")}</p><div class="space-y-2 border-t border-gray-50 pt-3" data-v-447f00bf><div class="flex justify-between text-[10px]" data-v-447f00bf><span class="text-gray-400 uppercase font-bold" data-v-447f00bf>Unit</span><span class="text-gray-700 font-medium text-right" data-v-447f00bf>${ssrInterpolate(getUnitName(informasi))}</span></div><div class="flex justify-between text-[10px]" data-v-447f00bf><span class="text-gray-400 uppercase font-bold" data-v-447f00bf>Tahun / Jangka</span><span class="text-gray-700 font-medium" data-v-447f00bf>${ssrInterpolate(informasi.tahun)} / ${ssrInterpolate(isBerlaku(informasi.status) ? "Selama Berlaku" : "Arsip")}</span></div><div class="flex justify-between items-center text-[10px]" data-v-447f00bf><span class="text-gray-400 uppercase font-bold" data-v-447f00bf>Bentuk</span><span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold" data-v-447f00bf>${ssrInterpolate(getBentuk(informasi))}</span></div></div><div class="mt-4" data-v-447f00bf>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/informasi/detail/${informasi.slug || informasi.id}`,
            class: "block w-full bg-blue-600 text-white text-center text-xs font-bold py-2.5 rounded-lg shadow-sm active:bg-blue-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Lihat Detail Informasi `);
              } else {
                return [
                  createTextVNode(" Lihat Detail Informasi ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-300" data-v-447f00bf><p class="text-xs text-gray-500 italic" data-v-447f00bf>Tidak ada data informasi untuk kategori ini.</p></div>`);
      }
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DipInformasiTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DipInformasiTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-447f00bf"]]);

export { DipInformasiTable as D };
//# sourceMappingURL=DipInformasiTable-e2XUWsIB.mjs.map
