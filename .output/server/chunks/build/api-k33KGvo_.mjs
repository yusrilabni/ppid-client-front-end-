import axios from 'axios';

const API_BASE_URL = "https://ppidkab.sinjaikab.go.id";
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  // Use direct API URL since Vercel proxy is blocked by firewall
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: false
  // Using token-based auth, not cookie-based
});
api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    var _a;
    if (((_a = error.response) == null ? void 0 : _a.status) === 401 && false) ;
    return Promise.reject(error);
  }
);
const getStorageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/storage/${path}`;
};
const getAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
};

export { api as a, getAssetUrl as b, getStorageUrl as g };
//# sourceMappingURL=api-k33KGvo_.mjs.map
