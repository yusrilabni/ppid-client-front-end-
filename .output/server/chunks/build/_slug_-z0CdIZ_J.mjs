import { _ as __nuxt_component_0 } from './nuxt-link-vc3u7b4I.mjs';
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { g as getBreadcrumbs } from './breadcrumbs-CLzVyNhY.mjs';
import { useQuery } from '@tanstack/vue-query';
import { a as api, g as getStorageUrl } from './api-k33KGvo_.mjs';
import { _ as _sfc_main$1 } from './Breadcrumbs-CqGmUqmz.mjs';
import { u as useGlobalLoader } from './useGlobalLoader-DW2Aovuz.mjs';
import { a as useRoute } from './server.mjs';
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
import './loading-DMBVy40S.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const official = ref(null);
    const { isLoading: queryLoading, data: queryData, isError: queryError, isFetching, refetch } = useQuery({
      queryKey: computed(() => ["official_profile", route.params.slug]),
      queryFn: async () => {
        const slug = route.params.slug;
        if (!slug) throw new Error("Slug not found");
        const res = await api.get(`/profil/${slug}`);
        return res.data.official || res.data.data;
      },
      staleTime: 6e4,
      enabled: computed(() => !!route.params.slug)
    });
    const loading = computed(() => queryLoading.value || isFetching.value && !queryData.value);
    const error = computed(() => queryError.value);
    useGlobalLoader(loading);
    watch(queryData, (newData) => {
      if (newData) {
        official.value = newData;
      } else {
        official.value = null;
      }
    }, { immediate: true });
    const breadcrumbData = computed(() => {
      var _a, _b, _c;
      const slug = route.params.slug || "";
      let title = "";
      if (official.value) {
        title = official.value.full_name || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      }
      if (error.value || !official.value) {
        return getBreadcrumbs.officialProfile((_a = official.value) == null ? void 0 : _a.name);
      }
      let middleTitle = "Pejabat Daerah";
      let middleUrl = "/profil/pejabat-daerah";
      let middleIcon = "fas fa-users";
      const orgName = (((_b = official.value.organization) == null ? void 0 : _b.name) || "").toLowerCase();
      const posSlug = (((_c = official.value.position) == null ? void 0 : _c.slug) || "").toLowerCase();
      if (orgName.includes("kecamatan") || orgName.includes("desa ") || orgName === "desa" || orgName.includes("kelurahan")) {
        middleTitle = "Unit Lokal";
        middleUrl = "/profil/unit-lokal";
        middleIcon = "fas fa-map-marked-alt";
      } else if (posSlug === "bupati") {
        middleTitle = "Bupati";
        middleUrl = "/profil/bupati";
        middleIcon = "fas fa-user-tie";
      } else if (posSlug === "wakil-bupati") {
        middleTitle = "Wakil Bupati";
        middleUrl = "/profil/wakil-bupati";
        middleIcon = "fas fa-user-tie";
      } else if (posSlug === "sekretaris-daerah" || posSlug === "sekda") {
        middleTitle = "Sekretaris Daerah";
        middleUrl = "/profil/sekretaris-daerah";
        middleIcon = "fas fa-building";
      }
      return getBreadcrumbs.officialProfile(title, middleTitle, middleUrl, middleIcon);
    });
    const spouseLabel = computed(() => {
      if (!official.value) return "Suami/Istri";
      return official.value.jenis_kelamin === "Perempuan" ? "Nama Suami" : "Nama Istri";
    });
    const jabatanTampilan = computed(() => {
      var _a;
      if (!official.value) return "";
      let jabatan_asli = ((_a = official.value.position) == null ? void 0 : _a.name) || "";
      let jabatan_tampilan = jabatan_asli;
      const status_jabatan = official.value.status_jabatan || "";
      if (jabatan_asli.toLowerCase() === "kepala opd" && official.value.organization) {
        const orgName = official.value.organization.name;
        const orgNameLower = orgName.toLowerCase();
        if (orgNameLower.includes("dinas")) {
          jabatan_tampilan = "Kepala " + orgName;
        } else if (orgNameLower.includes("kecamatan")) {
          const nama_kecamatan = orgName.replace(/Kantor Kecamatan /i, "");
          jabatan_tampilan = "Camat " + nama_kecamatan;
        } else if (orgNameLower.includes("badan")) {
          jabatan_tampilan = "Kepala " + orgName;
        }
      }
      if (status_jabatan !== "Definitif" && status_jabatan) {
        const match = status_jabatan.match(/\((\w+)\)/);
        const prefix = match ? match[1] : "";
        if (prefix) {
          jabatan_tampilan = `${prefix.trim()}. ${jabatan_tampilan}`;
        }
      }
      return jabatan_tampilan;
    });
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen" }, _attrs))}><div class="${ssrRenderClass(["mx-auto px-4 sm:px-6 lg:px-8", error.value || !official.value && !loading.value ? "max-w-4xl" : "max-w-6xl"])}"><div class="mb-4">`);
      _push(ssrRenderComponent(_sfc_main$1, { breadcrumbs: breadcrumbData.value }, null, _parent));
      _push(`</div>`);
      if (!loading.value) {
        _push(`<!--[-->`);
        if (error.value || !official.value) {
          _push(`<div class="bg-white rounded-xl shadow-lg overflow-hidden"><div class="p-12 text-center"><div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"><i class="fas fa-user-slash text-4xl text-gray-400"></i></div><h1 class="text-2xl font-bold text-gray-800 mb-2">Profil Tidak Ditemukan</h1><p class="text-gray-600 mb-6"> Belum ada pejabat aktif untuk posisi ini. </p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profil/pejabat-daerah",
            class: "inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Kembali ke Profil `);
              } else {
                return [
                  createTextVNode(" Kembali ke Profil ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<div class="bg-white rounded-2xl shadow-xl overflow-hidden"><div class="p-8"><div class="flex flex-col items-center gap-8"><div class="w-full flex justify-center">`);
          if (official.value.photo) {
            _push(`<img${ssrRenderAttr("src", unref(getStorageUrl)(official.value.photo))}${ssrRenderAttr("alt", official.value.full_name)} class="w-64 h-80 object-contain max-w-full max-h-[320px] rounded-xl shadow-md bg-gray-50">`);
          } else {
            _push(`<div class="w-64 h-80 bg-gray-200 flex items-center justify-center rounded-xl shadow-inner"><i class="fas fa-user text-gray-400 text-[6rem]"></i></div>`);
          }
          _push(`</div><div class="text-center"><h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">${ssrInterpolate(official.value.full_name)}</h1><p class="text-xl md:text-2xl font-semibold text-gray-600 mb-3">${ssrInterpolate(jabatanTampilan.value)}</p>`);
          if (official.value.organization) {
            _push(`<p class="text-gray-500 italic">${ssrInterpolate(official.value.organization.name)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div><div class="p-8 text-gray-800"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">`);
          if (official.value.birth_place || official.value.birth_date) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg"><div class="flex items-center"><i class="fas fa-birthday-cake text-blue-500 mr-3 text-lg"></i><div><p class="font-medium text-gray-700">Lahir</p><p class="text-gray-600">${ssrInterpolate(official.value.birth_place)}${ssrInterpolate(official.value.birth_place && official.value.birth_date ? ", " : "")}${ssrInterpolate(formatDate(official.value.birth_date))}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.religion) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg"><div class="flex items-center"><i class="fas fa-pray text-blue-500 mr-3 text-lg"></i><div><p class="font-medium text-gray-700">Agama</p><p class="text-gray-600">${ssrInterpolate(official.value.religion)}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.marital_status) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg"><div class="flex items-center"><i class="fas fa-heart text-blue-500 mr-3 text-lg"></i><div><p class="font-medium text-gray-700">Status</p><p class="text-gray-600">${ssrInterpolate(official.value.marital_status)}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.nip) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg"><div class="flex items-center"><i class="fas fa-id-card text-blue-500 mr-3 text-lg"></i><div><p class="font-medium text-gray-700">NIP</p><p class="text-gray-600">${ssrInterpolate(official.value.nip)}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.start_term) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg"><div class="flex items-center"><i class="fas fa-calendar-alt text-blue-500 mr-3 text-lg"></i><div><p class="font-medium text-gray-700">Mulai Jabatan</p><p class="text-gray-600">${ssrInterpolate(formatDate(official.value.start_term))}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.end_term) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg"><div class="flex items-center"><i class="fas fa-calendar-times text-blue-500 mr-3 text-lg"></i><div><p class="font-medium text-gray-700">Akhir Jabatan</p><p class="text-gray-600">${ssrInterpolate(formatDate(official.value.end_term))}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.email) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg"><div class="flex items-center"><i class="fas fa-envelope text-blue-500 mr-3 text-lg"></i><div><p class="font-medium text-gray-700">Email</p><p class="text-gray-600">${ssrInterpolate(official.value.email)}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.home_address) {
            _push(`<div class="bg-gray-50 p-4 rounded-lg lg:col-span-2"><div class="flex items-start"><i class="fas fa-home text-blue-500 mr-3 mt-1 text-lg"></i><div><p class="font-medium text-gray-700">Alamat</p><p class="text-gray-600 whitespace-pre-line">${ssrInterpolate(official.value.home_address)}</p></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (official.value.biography) {
            _push(`<div class="bg-gray-50 rounded-lg p-6 mb-8"><h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-book text-blue-500 mr-3"></i> Biodata </h2><div class="text-gray-600 leading-relaxed whitespace-pre-line">${(_a = official.value.biography) != null ? _a : ""}</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.spouse_name || official.value.children && official.value.children.length > 0) {
            _push(`<div class="mb-10"><h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center"><i class="fas fa-users text-blue-500 mr-3"></i> Keluarga </h2><div class="grid grid-cols-1 gap-6">`);
            if (official.value.spouse_name) {
              _push(`<div class="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all group"><div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"><i class="fas fa-heart text-xl"></i></div><div><h3 class="text-xs font-bold text-gray-400 mb-1">${ssrInterpolate(spouseLabel.value)}</h3><p class="text-xl font-black text-gray-800">${ssrInterpolate(official.value.spouse_name)}</p></div></div>`);
            } else {
              _push(`<!---->`);
            }
            if (official.value.children && official.value.children.length > 0) {
              _push(`<div class="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100"><h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2"><i class="fas fa-child text-blue-400"></i> Daftar Anak (${ssrInterpolate(official.value.children.length)}) </h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
              ssrRenderList(official.value.children, (child, index) => {
                _push(`<div class="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"><div class="flex items-center gap-3"><span class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">${ssrInterpolate(index + 1)}</span><p class="font-bold text-gray-800">${ssrInterpolate(child.name)}</p></div>`);
                if (child.birth_place || child.birth_date) {
                  _push(`<p class="text-[10px] text-gray-400 mt-2 ml-11 font-medium italic"> Lahir: ${ssrInterpolate(child.birth_place || "-")}, ${ssrInterpolate(child.birth_date ? formatDate(child.birth_date) : "-")}</p>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              });
              _push(`<!--]--></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.educations && official.value.educations.length > 0) {
            _push(`<div class="mb-8"><h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-graduation-cap text-blue-500 mr-3"></i> Pendidikan </h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
            ssrRenderList(official.value.educations, (edu) => {
              _push(`<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"><h3 class="font-bold text-gray-800 mb-2">${ssrInterpolate(edu.degree)}</h3>`);
              if (edu.institution) {
                _push(`<p class="text-gray-700 mb-1"><span class="font-medium">Institusi:</span> ${ssrInterpolate(edu.institution)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (edu.start_year || edu.end_year) {
                _push(`<p class="text-gray-700"><span class="font-medium">Tahun:</span> ${ssrInterpolate(edu.start_year || "")} ${ssrInterpolate(edu.start_year && edu.end_year ? "-" : "")} ${ssrInterpolate(edu.end_year || "Sekarang")}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.career_histories && official.value.career_histories.length > 0) {
            _push(`<div class="mb-8"><h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-briefcase text-blue-500 mr-3"></i> Riwayat Karir </h2><div class="space-y-4"><!--[-->`);
            ssrRenderList(official.value.career_histories, (career) => {
              _push(`<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"><h3 class="font-bold text-gray-800 text-lg mb-2">${ssrInterpolate(career.title)}</h3>`);
              if (career.organization_name) {
                _push(`<p class="text-gray-700 mb-1"><span class="font-medium">Organisasi:</span> ${ssrInterpolate(career.organization_name)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (career.start_year || career.end_year) {
                _push(`<p class="text-gray-700 mb-1"><span class="font-medium">Tahun:</span> ${ssrInterpolate(career.start_year || "")} ${ssrInterpolate(career.start_year && career.end_year ? "-" : "")} ${ssrInterpolate(career.end_year || "Sekarang")}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (career.description) {
                _push(`<p class="text-gray-600"><span class="font-medium">Deskripsi:</span> ${ssrInterpolate(career.description)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.awards && official.value.awards.length > 0) {
            _push(`<div class="mb-8"><h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-trophy text-blue-500 mr-3"></i> Penghargaan </h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
            ssrRenderList(official.value.awards, (award) => {
              _push(`<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"><h3 class="font-bold text-gray-800 text-lg mb-2">${ssrInterpolate(award.title)}</h3>`);
              if (award.issuer) {
                _push(`<p class="text-gray-700 mb-1"><span class="font-medium">Pemberi:</span> ${ssrInterpolate(award.issuer)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (award.year) {
                _push(`<p class="text-gray-700 mb-1"><span class="font-medium">Tahun:</span> ${ssrInterpolate(award.year)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (award.description) {
                _push(`<p class="text-gray-600"><span class="font-medium">Deskripsi:</span> ${ssrInterpolate(award.description)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.training_histories && official.value.training_histories.length > 0) {
            _push(`<div class="mb-8"><h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-chalkboard-teacher text-blue-500 mr-3"></i> Diklat </h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
            ssrRenderList(official.value.training_histories, (training) => {
              _push(`<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"><h3 class="font-bold text-gray-800 mb-2">${ssrInterpolate(training.name)}</h3>`);
              if (training.organizer) {
                _push(`<p class="text-gray-700 mb-1"><span class="font-medium">Penyelenggara:</span> ${ssrInterpolate(training.organizer)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (training.year) {
                _push(`<p class="text-gray-700"><span class="font-medium">Tahun:</span> ${ssrInterpolate(training.year)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (official.value.organizational_histories && official.value.organizational_histories.length > 0) {
            _push(`<div><h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-sitemap text-blue-500 mr-3"></i> Organisasi </h2><div class="space-y-4"><!--[-->`);
            ssrRenderList(official.value.organizational_histories, (org) => {
              _push(`<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"><h3 class="font-bold text-gray-800 text-lg mb-2">${ssrInterpolate(org.organization_name)}</h3>`);
              if (org.position) {
                _push(`<p class="text-gray-700 mb-1"><span class="font-medium">Jabatan:</span> ${ssrInterpolate(org.position)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (org.start_year || org.end_year) {
                _push(`<p class="text-gray-700"><span class="font-medium">Tahun:</span> ${ssrInterpolate(org.start_year || "")} ${ssrInterpolate(org.start_year && org.end_year ? "-" : "")} ${ssrInterpolate(org.end_year || "Sekarang")}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profil/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-z0CdIZ_J.mjs.map
