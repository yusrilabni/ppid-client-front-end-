import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "CustomSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: "Pilih opsi..."
    },
    shouldShowSearch: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const open = ref(false);
    const search = ref("");
    const rootEl = ref(null);
    const selectedLabel = computed(() => {
      const selected = props.options.find((item) => String(item.value) === String(props.modelValue));
      return selected ? selected.label : null;
    });
    const filteredData = computed(() => {
      const term = search.value.toLowerCase().trim();
      if (!term) return props.options;
      return props.options.filter(
        (item) => item.label && item.label.toLowerCase().includes(term)
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative custom-select-root", { "custom-select-open z-50": open.value, "z-10": !open.value }],
        ref_key: "rootEl",
        ref: rootEl
      }, _attrs))} data-v-3901bd76><button type="button" class="relative w-full bg-white border-2 border-gray-100 rounded-2xl shadow-sm pl-5 pr-12 py-4 text-left cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-base transition-all duration-300 group" data-v-3901bd76><span class="flex items-center" data-v-3901bd76><span class="${ssrRenderClass([selectedLabel.value ? "text-gray-900 font-bold" : "text-gray-400 font-medium", "block truncate transition-colors duration-300"])}" data-v-3901bd76>${ssrInterpolate(selectedLabel.value || __props.placeholder)}</span></span><span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none" data-v-3901bd76><div class="p-1 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300" data-v-3901bd76><svg class="${ssrRenderClass([open.value ? "rotate-180" : "", "h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-transform duration-300"])}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" data-v-3901bd76><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" data-v-3901bd76></path></svg></div></span></button>`);
      if (open.value) {
        _push(`<div class="absolute mt-1 w-full rounded-2xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] z-[9999] border border-gray-100 overflow-hidden ring-1 ring-black/5" data-v-3901bd76>`);
        if (__props.shouldShowSearch) {
          _push(`<div class="p-3 bg-gray-50/50 border-b border-gray-100" data-v-3901bd76><div class="relative" data-v-3901bd76><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" data-v-3901bd76><i class="fas fa-search text-blue-500 text-xs" data-v-3901bd76></i></div><input type="text"${ssrRenderAttr("value", search.value)} placeholder="Cari opsi..." class="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-0 transition-all bg-white" data-v-3901bd76></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<ul class="max-h-72 py-2 text-base overflow-auto focus:outline-none sm:text-sm custom-scrollbar" tabindex="-1" data-v-3901bd76><!--[-->`);
        ssrRenderList(filteredData.value, (item) => {
          _push(`<li class="${ssrRenderClass([__props.modelValue == item.value ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-blue-600 hover:text-white", "mx-2 my-0.5 rounded-xl text-gray-700 cursor-pointer select-none relative py-3 pl-4 pr-10 transition-all duration-200 group/item"])}" data-v-3901bd76><span class="block truncate" data-v-3901bd76>${ssrInterpolate(item.label)}</span>`);
          if (__props.modelValue == item.value) {
            _push(`<span class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 group-hover/item:text-white" data-v-3901bd76><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" data-v-3901bd76><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-3901bd76></path></svg></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]-->`);
        if (filteredData.value.length === 0) {
          _push(`<li class="px-4 py-8 text-sm text-gray-400 text-center italic flex flex-col items-center" data-v-3901bd76><div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3" data-v-3901bd76><i class="fas fa-search-minus text-gray-300 text-xl" data-v-3901bd76></i></div> Data tidak ditemukan. </li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CustomSelect = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3901bd76"]]);

export { CustomSelect as C };
//# sourceMappingURL=CustomSelect-YbAR9Oty.mjs.map
