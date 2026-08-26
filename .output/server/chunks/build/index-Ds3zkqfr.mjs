import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, computed, watch, nextTick, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as api, g as getStorageUrl } from './api-k33KGvo_.mjs';
import { u as useAuthStore } from './auth-Cu84b-L0.mjs';
import { useQuery } from '@tanstack/vue-query';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
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
import 'axios';
import './loading-DMBVy40S.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const homeData = ref({
      sliders: [],
      latest_informasi: [],
      gallery: [],
      statistics: {}
    });
    const contactMethod = ref("email");
    const isSending = ref(false);
    const formMessage = ref("");
    const formMessageType = ref("success");
    const contactForm = ref({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const fieldErrors = ref({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const rss_items = ref([]);
    const initSwiper = () => {
      nextTick(() => {
        var _a;
        if ((void 0).lucide) {
          (void 0).lucide.createIcons();
        }
        if ((void 0).Swiper) {
          const isMultiple = ((_a = homeData.value.sliders) == null ? void 0 : _a.length) > 1;
          new (void 0).Swiper(".hero-slider", {
            loop: isMultiple,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            autoplay: isMultiple ? {
              delay: 5e3,
              disableOnInteraction: false
            } : false,
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" }
          });
          new (void 0).Swiper(".latest-info-carousel", {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
            loop: true,
            observer: true,
            observeParents: true,
            autoplay: {
              delay: 4e3,
              disableOnInteraction: false
            },
            breakpoints: {
              640: { slidesPerView: 2, slidesPerGroup: 2 },
              1024: { slidesPerView: 4, slidesPerGroup: 4 }
            },
            navigation: { nextEl: ".latest-info-next", prevEl: ".latest-info-prev" },
            pagination: { el: ".latest-info-pagination", clickable: true }
          });
          new (void 0).Swiper(".news-carousel", {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
            loop: true,
            observer: true,
            observeParents: true,
            autoplay: {
              delay: 4500,
              disableOnInteraction: false
            },
            breakpoints: {
              640: { slidesPerView: 2, slidesPerGroup: 2 },
              1024: { slidesPerView: 4, slidesPerGroup: 4 }
            },
            navigation: { nextEl: ".news-button-next", prevEl: ".news-button-prev" },
            pagination: { el: ".swiper-pagination", clickable: true }
          });
        }
      });
    };
    const { isLoading: loading, data: queryData, isFetching, isError, refetch } = useQuery({
      queryKey: ["home_data"],
      queryFn: async () => {
        const res = await api.get("/home");
        return res.data.data;
      }
    });
    const { isLoading: loadingRss, data: rssQueryData } = useQuery({
      queryKey: ["rss_news"],
      queryFn: async () => {
        try {
          const res = await fetch("/api/rss");
          const text = await res.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(text, "text/xml");
          const items = Array.from(xml.querySelectorAll("item")).slice(0, 16);
          return items.map((item) => {
            var _a, _b, _c, _d;
            const title = ((_a = item.querySelector("title")) == null ? void 0 : _a.textContent) || "";
            const link = ((_b = item.querySelector("link")) == null ? void 0 : _b.textContent) || "";
            const pubDate = ((_c = item.querySelector("pubDate")) == null ? void 0 : _c.textContent) || "";
            const description = ((_d = item.querySelector("description")) == null ? void 0 : _d.textContent) || "";
            let image = "";
            const enclosure = item.querySelector("enclosure");
            if (enclosure && enclosure.getAttribute("url")) {
              image = enclosure.getAttribute("url");
            }
            return { title, link, pubDate, description, image };
          });
        } catch (e) {
          console.error("Gagal mengambil RSS via Proxy Internal:", e);
          return [];
        }
      }
    });
    const isPageLoading = computed(() => loading.value || loadingRss.value);
    useGlobalLoader(isPageLoading);
    let swiperInitialized = false;
    watch([queryData, rssQueryData, loading, loadingRss], ([newData, newRssData, newLoading, newRssLoading]) => {
      if (newData) {
        homeData.value = newData;
      }
      if (newRssData) {
        rss_items.value = newRssData;
      }
      if (!newLoading && !newRssLoading && newData && !swiperInitialized) {
        swiperInitialized = true;
        nextTick(() => {
          initSwiper();
        });
      }
    }, { immediate: true });
    const formatDate = (dateString) => {
      if (!dateString) return "Terbaru";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }).format(date);
      } catch (e) {
        return dateString;
      }
    };
    const truncateText = (text, length = 100) => {
      if (!text) return "";
      const doc = new DOMParser().parseFromString(text, "text/html");
      const stripped = doc.body.textContent || "";
      if (stripped.length <= length) return stripped;
      return stripped.substring(0, length).trim() + "...";
    };
    const getCategoryColor = (category, type) => {
      const map = {
        "Informasi Berkala": { border: "border-blue-500", text: "text-blue-50", badge: "bg-blue-50 text-blue-600", bg50: "bg-blue-50", text600: "text-blue-600", border100: "border-blue-100" },
        "Informasi Setiap Saat": { border: "border-green-500", text: "text-green-50", badge: "bg-green-50 text-green-600", bg50: "bg-green-50", text600: "text-green-600", border100: "border-green-100" },
        "Informasi Serta Merta": { border: "border-yellow-500", text: "text-yellow-50", badge: "bg-yellow-50 text-yellow-600", bg50: "bg-yellow-50", text600: "text-yellow-600", border100: "border-yellow-100" },
        "Informasi Dikecualikan": { border: "border-red-500", text: "text-red-50", badge: "bg-red-50 text-red-600", bg50: "bg-red-50", text600: "text-red-600", border100: "border-red-100" }
      };
      const defaultColors = { border: "border-gray-500", text: "text-gray-50", badge: "bg-gray-50 text-gray-600", bg50: "bg-gray-50", text600: "text-gray-600", border100: "border-gray-100" };
      return (map[category] || defaultColors)[type];
    };
    const getCardTheme = (category) => {
      const themes = {
        "Informasi Berkala": { border: "border-blue-500", text50: "text-blue-50", bg50Hover: "group-hover/card:bg-blue-50", text600Hover: "group-hover/card:text-blue-600", btnBgHover: "hover:bg-blue-50", btnTextHover: "hover:text-blue-600", bg600Hover: "hover:bg-blue-600" },
        "Informasi Setiap Saat": { border: "border-green-500", text50: "text-green-50", bg50Hover: "group-hover/card:bg-green-50", text600Hover: "group-hover/card:text-green-600", btnBgHover: "hover:bg-green-50", btnTextHover: "hover:text-green-600", bg600Hover: "hover:bg-green-600" },
        "Informasi Serta Merta": { border: "border-yellow-500", text50: "text-yellow-50", bg50Hover: "group-hover/card:bg-yellow-50", text600Hover: "group-hover/card:text-yellow-600", btnBgHover: "hover:bg-yellow-50", btnTextHover: "hover:text-yellow-600", bg600Hover: "hover:bg-yellow-600" },
        "Informasi Dikecualikan": { border: "border-red-500", text50: "text-red-50", bg50Hover: "group-hover/card:bg-red-50", text600Hover: "group-hover/card:text-red-600", btnBgHover: "hover:bg-red-50", btnTextHover: "hover:text-red-600", bg600Hover: "hover:bg-red-600" }
      };
      return themes[category] || { border: "border-gray-500", text50: "text-gray-50", bg50Hover: "group-hover/card:bg-gray-50", text600Hover: "group-hover/card:text-gray-600", btnBgHover: "hover:bg-gray-50", btnTextHover: "hover:text-gray-600", bg600Hover: "hover:bg-gray-600" };
    };
    const getColorStyles = (color, type) => {
      var _a;
      const map = {
        "blue": { bg500: "bg-blue-500", text600: "text-blue-600", text500: "text-blue-500", from500: "from-blue-500", bgGradient: "bg-gradient-to-br from-blue-500 to-blue-600" },
        "green": { bg500: "bg-green-500", text600: "text-green-600", text500: "text-green-500", from500: "from-green-500", bgGradient: "bg-gradient-to-br from-green-500 to-green-600" },
        "yellow": { bg500: "bg-yellow-500", text600: "text-yellow-600", text500: "text-yellow-500", from500: "from-yellow-500", bgGradient: "bg-gradient-to-br from-yellow-400 to-yellow-500" },
        "red": { bg500: "bg-red-500", text600: "text-red-600", text500: "text-red-500", from500: "from-red-500", bgGradient: "bg-gradient-to-br from-red-500 to-red-600" }
      };
      return ((_a = map[color]) == null ? void 0 : _a[type]) || "";
    };
    const formatNumber = (num) => {
      return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    };
    const getUnitName = (info) => {
      if (info.organization_name) return info.organization_name;
      if (info.unit) return info.unit.nama;
      if (info.user && info.user.opd_name) return info.user.opd_name;
      return "Unit Kerja";
    };
    const getUploaderName = (info) => {
      return info.user ? info.user.name : "Administrator";
    };
    const informasiItems = [
      {
        title: "Informasi Berkala",
        url: "/informasi/berkala",
        icon: "calendar",
        color: "blue",
        points: [
          "Profil badan publik dan unit kerja",
          "Profil pejabat dan tentang OPD",
          "Program dan kegiatan yang diumumkan rutin",
          "Ringkasan laporan kinerja dan keuangan",
          "Informasi layanan publik dan jam pelayanan"
        ]
      },
      {
        title: "Informasi Setiap Saat",
        url: "/informasi/setiap-saat",
        icon: "clock",
        color: "green",
        points: [
          "Dokumen administratif dan arsip resmi",
          "SOP, SK, dan kebijakan internal",
          "Dokumen pendukung pelaksanaan kegiatan",
          "Data dan dokumen yang diberikan jika diminta",
          "Arsip dokumen tahun berjalan dan sebelumnya"
        ]
      },
      {
        title: "Informasi Serta Merta",
        url: "/informasi/serta-merta",
        icon: "zap",
        color: "yellow",
        points: [
          "Informasi bencana alam",
          "Informasi keadaan darurat",
          "Gangguan layanan publik berdampak luas",
          "Ancaman terhadap keselamatan masyarakat",
          "Kebijakan darurat yang harus segera diketahui"
        ]
      },
      {
        title: "Informasi Dikecualikan",
        url: "/informasi/dikecualikan",
        icon: "shield-alert",
        color: "red",
        points: [
          "Informasi yang mengandung data pribadi",
          "Informasi rahasia negara atau jabatan",
          "Dokumen hukum yang masih berjalan",
          "Informasi yang berpotensi merugikan pihak tertentu",
          "Informasi yang ditetapkan melalui uji konsekuensi"
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-page" }, _attrs))}>`);
      if (unref(isError)) {
        _push(`<div class="w-full min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50"><div class="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full"><i data-lucide="alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4"></i><h3 class="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h3><p class="text-gray-500 mb-6">Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi.</p><button class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-flex items-center"><i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i> Coba Lagi </button></div></div>`);
      } else if (!unref(loading)) {
        _push(`<div>`);
        if (homeData.value.sliders && homeData.value.sliders.length > 0) {
          _push(`<div class="swiper hero-slider relative w-full overflow-hidden"><div class="swiper-wrapper"><!--[-->`);
          ssrRenderList(homeData.value.sliders, (slider) => {
            _push(`<div class="swiper-slide relative">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: slider.link || (slider.informasi ? `/informasi/${slider.informasi.slug}` : "#"),
              class: "block w-full h-full"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<img${ssrRenderAttr("src", unref(getStorageUrl)(slider.image) || "/placeholder.jpg")}${ssrRenderAttr("alt", slider.title)} width="1280" height="720" class="w-full h-auto block"${_scopeId}>`);
                  if (slider.show_title || slider.show_description) {
                    _push2(`<div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center overlay-content"${_scopeId}><div class="text-center text-white max-w-4xl mx-auto px-4"${_scopeId}>`);
                    if (slider.show_title) {
                      _push2(`<h2 class="text-2xl md:text-5xl font-bold mb-2 md:mb-4"${_scopeId}>${ssrInterpolate(slider.title)}</h2>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    if (slider.show_description) {
                      _push2(`<p class="text-sm md:text-xl font-light opacity-90"${_scopeId}>${ssrInterpolate(slider.description)}</p>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    if (slider.link) {
                      _push2(`<div class="mt-4 md:mt-6"${_scopeId}><span class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 md:py-3 md:px-6 rounded-full transition-colors text-sm md:text-base shadow-lg"${_scopeId}> Selengkapnya <i data-lucide="arrow-right" class="ml-2 h-4 w-4 inline-block align-middle"${_scopeId}></i></span></div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("img", {
                      src: unref(getStorageUrl)(slider.image) || "/placeholder.jpg",
                      alt: slider.title,
                      width: "1280",
                      height: "720",
                      class: "w-full h-auto block"
                    }, null, 8, ["src", "alt"]),
                    slider.show_title || slider.show_description ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center overlay-content"
                    }, [
                      createVNode("div", { class: "text-center text-white max-w-4xl mx-auto px-4" }, [
                        slider.show_title ? (openBlock(), createBlock("h2", {
                          key: 0,
                          class: "text-2xl md:text-5xl font-bold mb-2 md:mb-4"
                        }, toDisplayString(slider.title), 1)) : createCommentVNode("", true),
                        slider.show_description ? (openBlock(), createBlock("p", {
                          key: 1,
                          class: "text-sm md:text-xl font-light opacity-90"
                        }, toDisplayString(slider.description), 1)) : createCommentVNode("", true),
                        slider.link ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "mt-4 md:mt-6"
                        }, [
                          createVNode("span", { class: "inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 md:py-3 md:px-6 rounded-full transition-colors text-sm md:text-base shadow-lg" }, [
                            createTextVNode(" Selengkapnya "),
                            createVNode("i", {
                              "data-lucide": "arrow-right",
                              class: "ml-2 h-4 w-4 inline-block align-middle"
                            })
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
          if (homeData.value.sliders.length > 1) {
            _push(`<button aria-label="Slider Sebelumnya" class="swiper-button-prev-custom absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full z-20 border-2 border-white/50 shadow-xl transition-all duration-300 group"><i data-lucide="chevron-left" class="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform flex justify-center items-center"></i></button>`);
          } else {
            _push(`<!---->`);
          }
          if (homeData.value.sliders.length > 1) {
            _push(`<button aria-label="Slider Selanjutnya" class="swiper-button-next-custom absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full z-20 border-2 border-white/50 shadow-xl transition-all duration-300 group"><i data-lucide="chevron-right" class="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform flex justify-center items-center"></i></button>`);
          } else {
            _push(`<!---->`);
          }
          if (homeData.value.sliders.length > 1) {
            _push(`<div class="swiper-pagination !absolute !bottom-4 !left-0 !right-0 !z-30"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="py-10 bg-white"><div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-4"><h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Informasi Terbaru</h2><p class="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">Dokumen dan pengumuman publik terkini dari PPID Kabupaten Sinjai.</p></div><div class="relative group"><div class="swiper-pagination latest-info-pagination !relative !top-0 !bottom-auto mb-1 mt-1"></div><div class="swiper-container latest-info-carousel overflow-hidden px-1"><div class="swiper-wrapper items-stretch"><!--[-->`);
        ssrRenderList(homeData.value.latest_informasi, (info) => {
          _push(`<div class="swiper-slide !h-auto p-2 flex"><div class="${ssrRenderClass(["w-full bg-white rounded-3xl border-l-4 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col group/card p-6 hover:-translate-y-2 relative overflow-hidden", getCardTheme(info.category).border])}"><div class="${ssrRenderClass(["absolute -right-6 -top-6 group-hover/card:scale-110 transition-transform duration-700 opacity-50 pointer-events-none", getCardTheme(info.category).text50])}"><i data-lucide="file-text" class="w-32 h-32"></i></div><div class="mb-5 relative z-10"><div class="flex items-center gap-3 mb-2"><div class="${ssrRenderClass(["w-9 h-9 rounded-xl flex items-center justify-center border", getCategoryColor(info.category, "bg50"), getCategoryColor(info.category, "text600"), getCategoryColor(info.category, "border100")])}"><i data-lucide="building-2" class="w-4 h-4"></i></div><div class="flex flex-col min-w-0"><span class="text-[11px] font-extrabold text-gray-800 uppercase tracking-tight line-clamp-1"${ssrRenderAttr("title", getUnitName(info))}>${ssrInterpolate(getUnitName(info))}</span><span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Oleh: ${ssrInterpolate(getUploaderName(info))}</span></div></div></div><h3 class="${ssrRenderClass(["text-gray-900 font-bold text-lg mb-6 line-clamp-2 leading-tight transition-colors relative z-10", getCardTheme(info.category).text600Hover])}"${ssrRenderAttr("title", info.title)}>${ssrInterpolate(info.title)}</h3><div class="mt-auto pt-5 border-t border-gray-50 flex items-end justify-between relative z-10"><div class="flex flex-col gap-2"><div class="flex flex-col gap-1"><span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center"><i data-lucide="calendar" class="w-3 h-3 mr-1.5 text-blue-500"></i> ${ssrInterpolate(formatDate(info.tanggal_upload || info.created_at))}</span><span class="text-[10px] text-gray-500 font-bold flex items-center"><i data-lucide="file-text" class="w-3 h-3 mr-1.5 text-blue-500"></i><span class="truncate max-w-[120px]"${ssrRenderAttr("title", info.jenis_dokumen || "Dokumen Publik")}>${ssrInterpolate(info.jenis_dokumen || "Dokumen Publik")}</span></span></div><span class="${ssrRenderClass(["inline-flex items-center w-fit text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border", getCategoryColor(info.category, "badge"), getCategoryColor(info.category, "border")])}">${ssrInterpolate(info.category)}</span></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/informasi/detail/${info.slug}`,
            class: ["w-11 h-11 rounded-2xl bg-gray-900 text-white flex items-center justify-center transition-all shadow-lg active:scale-90 group/btn", getCardTheme(info.category).bg600Hover]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i data-lucide="arrow-up-right" class="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"${_scopeId}></i>`);
              } else {
                return [
                  createVNode("i", {
                    "data-lucide": "arrow-up-right",
                    class: "w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div></div><button class="latest-info-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"><i data-lucide="chevron-left" class="h-6 w-6 flex items-center justify-center"></i></button><button class="latest-info-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"><i data-lucide="chevron-right" class="h-6 w-6 flex items-center justify-center"></i></button></div></div></section><section class="py-3 md:py-6 bg-gray-50"><div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-4"><h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Berita Terbaru</h2><p class="text-gray-600 max-w-2xl mx-auto text-xs md:text-base mb-0">Dapatkan informasi terkini seputar kegiatan dan pengumuman dari Humas Sinjai.</p></div>`);
        if (rss_items.value.length > 0) {
          _push(`<div class="relative group px-1"><div class="swiper-container news-carousel relative overflow-hidden pt-0"><div class="swiper-pagination !relative !top-0 !bottom-auto mt-[1px] mb-6"></div><div class="swiper-wrapper items-stretch"><!--[-->`);
          ssrRenderList(rss_items.value, (item, idx) => {
            _push(`<div class="swiper-slide !h-auto p-1 flex"><div class="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 m-1 group/news"><div class="aspect-w-16 aspect-h-9 overflow-hidden relative"><img${ssrRenderAttr("src", item.image || "https://via.placeholder.com/400x225.png?text=No+Image")}${ssrRenderAttr("alt", item.title)} class="w-full h-48 object-cover transform group-hover/news:scale-105 transition-transform duration-500"><div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/news:opacity-100 transition-opacity duration-300"></div></div><div class="p-5 flex flex-col flex-grow"><div class="flex items-center text-xs text-gray-500 mb-3"><i data-lucide="calendar" class="h-3.5 w-3.5 mr-1.5 text-blue-500"></i> ${ssrInterpolate(formatDate(item.pubDate))}</div><h3 class="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug hover:text-blue-600 transition-colors">${ssrInterpolate(truncateText(item.title, 60))}</h3><p class="text-xs text-gray-600 line-clamp-3 mb-4 flex-grow">${ssrInterpolate(truncateText(item.description, 100))}</p><div class="mt-auto"><a${ssrRenderAttr("href", item.link)} target="_blank" class="inline-flex items-center justify-center px-4 py-2.5 border border-blue-100 text-sm font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all duration-300 w-full group"> Baca Selengkapnya <i data-lucide="external-link" class="ml-2 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform"></i></a></div></div></div></div>`);
          });
          _push(`<!--]--></div></div><button class="news-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:flex"><i data-lucide="chevron-left" class="h-6 w-6 flex items-center justify-center"></i></button><button class="news-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 z-10 text-gray-700 hover:bg-blue-600 hover:text-white transition-all border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:flex"><i data-lucide="chevron-right" class="h-6 w-6 flex items-center justify-center"></i></button></div>`);
        } else {
          _push(`<div class="text-center py-12"><p class="text-gray-500">Belum ada berita tersedia</p></div>`);
        }
        _push(`</div></section><section id="informasi" class="py-3 md:py-6 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-1"><h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Akses informasi publik sesuai dengan kategori yang ditetapkan</h2><p class="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">Kami menyediakan berbagai informasi publik yang dapat diakses oleh masyarakat secara transparan dan mudah</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 px-1"><!--[-->`);
        ssrRenderList(informasiItems, (item, idx) => {
          _push(`<div class="h-auto"><div class="h-full w-full"><div class="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col group border border-gray-100 overflow-hidden relative"><div class="${ssrRenderClass(["absolute top-0 inset-x-0 h-32 bg-gradient-to-b to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500", getColorStyles(item.color, "from500")])}"></div><div class="${ssrRenderClass(["absolute -right-8 -top-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none", getColorStyles(item.color, "text500")])}"><i${ssrRenderAttr("data-lucide", item.icon)} class="w-40 h-40"></i></div><div class="p-5 flex-grow flex flex-col relative z-10 pb-2"><div class="flex items-center mb-4"><div class="${ssrRenderClass(["w-10 h-10 rounded-2xl flex items-center justify-center mr-3 shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-500", getColorStyles(item.color, "bgGradient")])}"><i${ssrRenderAttr("data-lucide", item.icon)} class="text-white w-5 h-5"></i></div><h3 class="text-base font-extrabold text-gray-800 leading-tight">${ssrInterpolate(item.title)}</h3></div><ul class="space-y-2.5"><!--[-->`);
          ssrRenderList(item.points, (point, pIdx) => {
            _push(`<li class="flex items-start text-[12px] text-gray-600 font-medium group-hover:text-gray-900 transition-colors duration-300"><i data-lucide="check-circle" class="${ssrRenderClass(["mt-0.5 mr-2.5 flex-shrink-0 w-3.5 h-3.5", getColorStyles(item.color, "text600")])}"></i><span class="leading-relaxed">${ssrInterpolate(point)}</span></li>`);
          });
          _push(`<!--]--></ul></div><div class="mt-auto p-5 pt-3 relative z-10 bg-white rounded-b-3xl">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: item.url,
            class: ["w-full py-2.5 px-4 rounded-xl text-white font-bold text-center flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 text-sm", getColorStyles(item.color, "bgGradient")]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Akses Informasi <i data-lucide="arrow-right" class="ml-2 w-4 h-4 inline-block group-hover:translate-x-1.5 transition-transform"${_scopeId}></i>`);
              } else {
                return [
                  createTextVNode(" Akses Informasi "),
                  createVNode("i", {
                    "data-lucide": "arrow-right",
                    class: "ml-2 w-4 h-4 inline-block group-hover:translate-x-1.5 transition-transform"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div></div>`);
        });
        _push(`<!--]--></div><div class="mt-3 md:mt-6 text-center">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(authStore).isAuthenticated ? "/permohonan/create" : "/login?redirect_to=/permohonan/create",
          class: "inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Ajukan Permohonan Informasi `);
            } else {
              return [
                createTextVNode(" Ajukan Permohonan Informasi ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></section><section id="galeri" class="py-3 md:py-6 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-1"><h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Galeri</h2><p class="text-xs md:text-base text-gray-600 max-w-2xl mx-auto">Dokumentasi kegiatan dan momen penting PPID</p></div>`);
        if (homeData.value.gallery && homeData.value.gallery.length > 0) {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"><!--[-->`);
          ssrRenderList(homeData.value.gallery, (item) => {
            _push(`<div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"><div class="aspect-w-16 aspect-h-12 relative">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/galeri/${item.id}`,
              class: "block"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<img${ssrRenderAttr("src", unref(getStorageUrl)(item.image) || "/placeholder.jpg")}${ssrRenderAttr("alt", item.title)} class="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId}><div class="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2"${_scopeId}><i data-lucide="camera" class="h-3 w-3 md:h-4 md:w-4 text-gray-700 flex justify-center items-center"${_scopeId}></i></div>`);
                } else {
                  return [
                    createVNode("img", {
                      src: unref(getStorageUrl)(item.image) || "/placeholder.jpg",
                      alt: item.title,
                      class: "w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2" }, [
                      createVNode("i", {
                        "data-lucide": "camera",
                        class: "h-3 w-3 md:h-4 md:w-4 text-gray-700 flex justify-center items-center"
                      })
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div><div class="p-4"><h3 class="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm md:text-base">${ssrInterpolate(item.title)}</h3>`);
            if (item.category) {
              _push(`<span class="inline-block px-2 py-0.5 text-[10px] md:text-xs bg-blue-100 text-blue-800 rounded-full mb-2">${ssrInterpolate(item.category)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (item.description) {
              _push(`<p class="text-xs md:text-sm text-gray-600 line-clamp-2">${ssrInterpolate(item.description)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-12"><i data-lucide="image" class="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4 flex justify-center"></i><p class="text-gray-500">Belum ada galeri tersedia</p></div>`);
        }
        _push(`<div class="text-center mt-6 md:mt-8">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/galeri",
          class: "inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Lihat Semua Galeri `);
            } else {
              return [
                createTextVNode(" Lihat Semua Galeri ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></section><section class="py-3 md:py-6 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-1"><h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Statistik PPID</h2><p class="text-xs md:text-base text-gray-600 max-w-2xl mx-auto">Data statistik kinerja pelayanan informasi publik</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"><div class="bg-blue-50 p-5 md:p-6 rounded-lg shadow-md text-center"><i data-lucide="info" class="text-blue-600 w-8 h-8 md:w-9 md:h-9 mb-2 md:mb-3 mx-auto flex justify-center items-center"></i><h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">${ssrInterpolate(formatNumber((_a = homeData.value.statistics) == null ? void 0 : _a.total_informasi))}</h3><p class="text-sm md:text-base text-gray-600">Informasi Publik</p></div><div class="bg-green-50 p-5 md:p-6 rounded-lg shadow-md text-center"><i data-lucide="file-text" class="text-green-600 w-8 h-8 md:w-9 md:h-9 mb-2 md:mb-3 mx-auto flex justify-center items-center"></i><h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">${ssrInterpolate(formatNumber((_b = homeData.value.statistics) == null ? void 0 : _b.total_permohonan))}</h3><p class="text-sm md:text-base text-gray-600">Jumlah Permohonan</p></div><div class="bg-purple-50 p-5 md:p-6 rounded-lg shadow-md text-center"><i data-lucide="bar-chart-2" class="text-purple-600 w-8 h-8 md:w-9 md:h-9 mb-2 md:mb-3 mx-auto flex justify-center items-center"></i><h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">${ssrInterpolate(formatNumber((_c = homeData.value.statistics) == null ? void 0 : _c.total_survey))}</h3><p class="text-sm md:text-base text-gray-600">Jumlah Respon Survei</p></div></div><div class="bg-gray-50 rounded-lg p-5 md:p-8"><h3 class="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">Laporan Kinerja</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center"><div class="p-4 md:p-0 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none"><div class="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">${ssrInterpolate(homeData.value.statistics.tingkat_kepuasan || 0)}%</div><p class="text-xs md:text-sm text-gray-600 mb-3">Tingkat Kepuasan Layanan</p><div class="flex items-center justify-center py-2"><div class="flex items-center -space-x-4 overflow-hidden">`);
        if (homeData.value.ticker && homeData.value.ticker.length) {
          _push(`<!--[-->`);
          ssrRenderList(homeData.value.ticker.slice(0, 3), (rating, idx) => {
            _push(`<div class="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden bg-gray-100 flex items-center justify-center" style="${ssrRenderStyle({ zIndex: 30 - idx * 10 })}"><div class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold">${ssrInterpolate(rating.nama_pemohon ? rating.nama_pemohon.charAt(0).toUpperCase() : "?")}</div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="ml-4 text-xs md:text-sm font-bold text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">${ssrInterpolate(homeData.value.ticker ? homeData.value.ticker.length : 0)} Penilaian </div></div></div><div class="p-4 md:p-0 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none"><div class="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">${ssrInterpolate(homeData.value.statistics.rata_rata_respon || 0)} Hari</div><p class="text-xs md:text-sm text-gray-600">Rata-rata Waktu Respon</p></div><div class="p-4 md:p-0 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none"><div class="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">${ssrInterpolate(homeData.value.statistics.tingkat_penyelesaian || 0)}%</div><p class="text-xs md:text-sm text-gray-600">Tingkat Penyelesaian Permohonan</p></div></div>`);
        if (homeData.value.ticker && homeData.value.ticker.length) {
          _push(`<div class="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex items-center"><div class="bg-blue-600 text-white px-4 py-3 font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 z-10 shadow-lg shrink-0"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span> ULASAN PEMOHON </div><div class="flex-1 overflow-hidden relative bg-gray-50/50 py-3"><div class="animate-marquee whitespace-nowrap flex items-center gap-12"><!--[-->`);
          ssrRenderList([...homeData.value.ticker, ...homeData.value.ticker], (rating, idx) => {
            _push(`<div class="inline-flex items-center gap-3 cursor-default group/item hover:bg-white/50 rounded-xl px-2 py-1 transition-all"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-[10px] font-bold border border-yellow-200">${ssrInterpolate(rating.nama_pemohon ? rating.nama_pemohon.charAt(0).toUpperCase() : "?")}</div><span class="font-bold text-gray-800 text-xs">${ssrInterpolate(rating.nama_pemohon || "Unknown")}</span></div><div class="flex text-yellow-400 text-[10px]"><!--[-->`);
            ssrRenderList(rating.rating, (n) => {
              _push(`<i data-lucide="star" class="w-3 h-3 fill-current"></i>`);
            });
            _push(`<!--]--></div><span class="text-gray-400">|</span><span class="text-xs text-gray-600 italic">&quot;${ssrInterpolate(rating.text && rating.text.length > 50 ? rating.text.substring(0, 50) + "..." : rating.text)}&quot;</span></div>`);
          });
          _push(`<!--]--></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></section><section id="kontak" class="py-3 md:py-6 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-1"><h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Kontak Kami</h2><p class="text-xs md:text-base text-gray-600 max-w-2xl mx-auto"> Hubungi kami untuk informasi lebih lanjut atau ajukan permohonan informasi publik </p></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8"><div><h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">Informasi Kontak</h3><div class="space-y-4 md:space-y-6"><div class="flex items-start"><div class="flex-shrink-0"><div class="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg bg-blue-100 text-blue-600"><i data-lucide="map-pin" class="h-5 w-5 md:h-6 md:w-6"></i></div></div><div class="ml-4"><h4 class="text-sm md:text-base font-semibold text-gray-900">Alamat</h4><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(((_e = (_d = homeData.value) == null ? void 0 : _d.contact) == null ? void 0 : _e.alamat) || "Jl. Persatuan Raya No. 101 Kec. Sinjai Utara, Kabupaten Sinjai, Sulawesi Selatan 92611")}</p></div></div><div class="flex items-start"><div class="flex-shrink-0"><div class="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg bg-green-100 text-green-600"><i data-lucide="phone" class="h-5 w-5 md:h-6 md:w-6"></i></div></div><div class="ml-4"><h4 class="text-sm md:text-base font-semibold text-gray-900">Telepon</h4><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(((_g = (_f = homeData.value) == null ? void 0 : _f.contact) == null ? void 0 : _g.telepon) || "0482-21432")}</p></div></div><div class="flex items-start"><div class="flex-shrink-0"><div class="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg bg-purple-100 text-purple-600"><i data-lucide="mail" class="h-5 w-5 md:h-6 md:w-6"></i></div></div><div class="ml-4"><h4 class="text-sm md:text-base font-semibold text-gray-900">Email</h4><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(((_i = (_h = homeData.value) == null ? void 0 : _h.contact) == null ? void 0 : _i.email) || "ppidkabsinjai@gmail.com")}</p></div></div></div><div class="mt-6 md:mt-8 p-5 md:p-6 bg-blue-50 rounded-lg border border-blue-100"><div class="flex items-center justify-between mb-3"><h4 class="text-sm md:text-base font-semibold text-gray-900 flex items-center"><i data-lucide="clock" class="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600"></i> Jam Pelayanan </h4><span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full border border-green-200 flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> GRATIS </span></div><div class="space-y-2 text-xs md:text-sm text-gray-700"><p class="flex justify-between"><span class="font-medium">Senin - Kamis:</span><span class="font-medium text-gray-900">08:00 - 16:00 WITA</span></p><p class="flex justify-between text-red-600 font-medium"><span>Jumat (WFH):</span><span class="bg-red-100 px-2 rounded">08:00 - 16:00 WITA</span></p><p class="flex justify-between text-red-600 font-medium"><span>Sabtu - Minggu:</span><span class="bg-red-100 px-2 rounded">Tutup</span></p></div><div class="mt-4 pt-3 border-t border-blue-200"><p class="text-[10px] md:text-xs text-blue-600 font-medium italic"> *Seluruh layanan informasi publik tidak dipungut biaya apapun. </p></div></div></div><div><div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"><div class="flex border-b border-gray-100 bg-gray-50/50"><button class="${ssrRenderClass([contactMethod.value === "email" ? "bg-white border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:bg-gray-100", "flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2"])}"><i data-lucide="mail" class="w-4 h-4"></i> Kirim via Email </button><button class="${ssrRenderClass([contactMethod.value === "whatsapp" ? "bg-white border-b-2 border-green-600 text-green-600" : "text-gray-500 hover:bg-gray-100", "flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2"])}"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg> Kirim via WhatsApp </button></div><div class="p-5 md:p-8"><h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">${ssrInterpolate(contactMethod.value === "email" ? "Kirim Pesan Email" : "Kirim Pesan WhatsApp")}</h3><form class="space-y-4 md:space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"><div><label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Nama Lengkap <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", contactForm.value.name)} type="text" class="${ssrRenderClass([fieldErrors.value.name ? "border-red-500" : "border-gray-300", "w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-sm"])}" placeholder="Masukkan nama lengkap">`);
        if (fieldErrors.value.name) {
          _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(fieldErrors.value.name)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Email <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", contactForm.value.email)} type="email" class="${ssrRenderClass([fieldErrors.value.email ? "border-red-500" : "border-gray-300", "w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-sm"])}" placeholder="email@contoh.com">`);
        if (fieldErrors.value.email) {
          _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(fieldErrors.value.email)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div><label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Subjek <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", contactForm.value.subject)} type="text" class="${ssrRenderClass([fieldErrors.value.subject ? "border-red-500" : "border-gray-300", "w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 text-sm"])}" placeholder="Subjek pesan">`);
        if (fieldErrors.value.subject) {
          _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(fieldErrors.value.subject)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Pesan <span class="text-red-500">*</span></label><textarea rows="4" class="${ssrRenderClass([fieldErrors.value.message ? "border-red-500" : "border-gray-300", "w-full px-4 py-2.5 md:py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 resize-none text-sm"])}" placeholder="Tulis pesan Anda di sini...">${ssrInterpolate(contactForm.value.message)}</textarea>`);
        if (fieldErrors.value.message) {
          _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(fieldErrors.value.message)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button type="submit"${ssrIncludeBooleanAttr(isSending.value) ? " disabled" : ""} class="${ssrRenderClass([contactMethod.value === "email" ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500", "w-full inline-flex items-center justify-center px-6 py-3 md:py-3.5 border border-transparent text-sm md:text-base font-bold rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 shadow-md"])}"><i${ssrRenderAttr("data-lucide", contactMethod.value === "email" ? "send" : "message-circle")} class="w-5 h-5 mr-2"></i>`);
        if (!isSending.value) {
          _push(`<span>${ssrInterpolate(contactMethod.value === "email" ? "Kirim Pesan Email" : "Kirim Pesan WhatsApp")}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (isSending.value) {
          _push(`<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
        if (formMessage.value) {
          _push(`<div class="${ssrRenderClass([formMessageType.value === "success" ? "text-green-600" : "text-red-600", "text-center text-sm mt-4"])}">${ssrInterpolate(formMessage.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div></div></div></div></div></section></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ds3zkqfr.mjs.map
