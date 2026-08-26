import { ref, watch, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = {
  __name: "CustomDate",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "Pilih tanggal..."
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOpen = ref(false);
    const calendarRef = ref(null);
    const currentDate = /* @__PURE__ */ new Date();
    const currentMonth = ref(currentDate.getMonth());
    const currentYear = ref(currentDate.getFullYear());
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        const d = new Date(newVal);
        if (!isNaN(d.getTime())) {
          currentMonth.value = d.getMonth();
          currentYear.value = d.getFullYear();
        }
      }
    }, { immediate: true });
    const formattedDate = computed(() => {
      if (!props.modelValue) return "";
      const d = new Date(props.modelValue);
      if (isNaN(d.getTime())) return "";
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    });
    const daysInMonth = computed(() => {
      return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    });
    const emptyDays = computed(() => {
      const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
      return firstDay;
    });
    const isSelected = (day) => {
      if (!props.modelValue) return false;
      const [y, m, d] = props.modelValue.split("-");
      return parseInt(y) === currentYear.value && parseInt(m) === currentMonth.value + 1 && parseInt(d) === day;
    };
    const isToday = (day) => {
      const today = /* @__PURE__ */ new Date();
      return today.getDate() === day && today.getMonth() === currentMonth.value && today.getFullYear() === currentYear.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative w-full", isOpen.value ? "z-[100]" : "z-10"],
        ref_key: "calendarRef",
        ref: calendarRef
      }, _attrs))}><div class="${ssrRenderClass([isOpen.value ? "bg-white shadow-sm ring-2 ring-blue-500/20" : "hover:bg-gray-50/50", "w-full flex items-center justify-between pl-4 pr-10 py-2.5 text-xs bg-transparent focus:outline-none font-bold text-gray-600 rounded-2xl transition-all cursor-pointer border-none"])}"><span class="${ssrRenderClass(__props.modelValue ? "text-gray-700" : "text-gray-400")}">${ssrInterpolate(formattedDate.value || __props.placeholder)}</span></div><i class="${ssrRenderClass([{ "text-blue-500": isOpen.value }, "far fa-calendar-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300"])}"></i>`);
      if (isOpen.value) {
        _push(`<div class="absolute z-[100] mt-2 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 w-[280px] right-0 md:left-0"><div class="flex items-center justify-between mb-4"><button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"><i class="fas fa-chevron-left text-xs"></i></button><div class="font-bold text-sm text-gray-800">${ssrInterpolate(monthNames[currentMonth.value])} ${ssrInterpolate(currentYear.value)}</div><button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"><i class="fas fa-chevron-right text-xs"></i></button></div><div class="grid grid-cols-7 gap-1 mb-2"><!--[-->`);
        ssrRenderList(["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], (day) => {
          _push(`<div class="text-center text-[10px] font-bold text-gray-400">${ssrInterpolate(day)}</div>`);
        });
        _push(`<!--]--></div><div class="grid grid-cols-7 gap-1"><!--[-->`);
        ssrRenderList(emptyDays.value, (empty) => {
          _push(`<div class="w-8 h-8"></div>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(daysInMonth.value, (day) => {
          _push(`<button class="${ssrRenderClass([[
            isSelected(day) ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:text-white" : "text-gray-700",
            isToday(day) && !isSelected(day) ? "border border-blue-500 text-blue-600" : ""
          ], "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all hover:bg-blue-50 hover:text-blue-600"])}">${ssrInterpolate(day)}</button>`);
        });
        _push(`<!--]--></div><div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center"><button class="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"> Reset </button><button class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"> Tutup </button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomDate.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CustomDate-uaTKdXDJ.mjs.map
