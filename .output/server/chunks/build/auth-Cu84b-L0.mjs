import { f as defineStore } from './server.mjs';
import { ref, computed } from 'vue';
import { a as api } from './api-k33KGvo_.mjs';

const useAuthStore = defineStore("auth", () => {
  const getLocal = (key, defaultVal) => {
    return defaultVal;
  };
  const user = ref(JSON.parse(getLocal("ppid_user", "null")));
  const token = ref(getLocal("ppid_token", null));
  const loading = ref(false);
  const error = ref(null);
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => {
    var _a, _b;
    return ((_a = user.value) == null ? void 0 : _a.role) === "admin" || ((_b = user.value) == null ? void 0 : _b.role) === "superadmin";
  });
  const isSuperAdmin = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.role) === "superadmin";
  });
  const userName = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.name) || "";
  });
  const userRole = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.role) || "guest";
  });
  async function login(credentials) {
    var _a, _b, _c;
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/login", credentials);
      const responseData = response.data;
      if (responseData.success && ((_a = responseData.data) == null ? void 0 : _a.token)) {
        token.value = responseData.data.token;
        user.value = responseData.data.user;
        localStorage.setItem("ppid_token", responseData.data.token);
        localStorage.setItem("ppid_user", JSON.stringify(responseData.data.user));
        return { success: true };
      }
      throw new Error(responseData.message || "Login gagal");
    } catch (err) {
      error.value = ((_c = (_b = err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || err.message || "Login gagal";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }
  async function register(data) {
    var _a, _b, _c;
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/register", data);
      const responseData = response.data;
      if (responseData.success && ((_a = responseData.data) == null ? void 0 : _a.token)) {
        token.value = responseData.data.token;
        user.value = responseData.data.user;
        localStorage.setItem("ppid_token", responseData.data.token);
        localStorage.setItem("ppid_user", JSON.stringify(responseData.data.user));
        return { success: true };
      }
      throw new Error(responseData.message || "Registrasi gagal");
    } catch (err) {
      error.value = ((_c = (_b = err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || err.message || "Registrasi gagal";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }
  async function logout() {
    try {
      await api.post("/logout");
    } catch (e) {
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem("ppid_token");
      localStorage.removeItem("ppid_user");
    }
  }
  async function fetchUser() {
    var _a;
    if (!token.value) return;
    try {
      const response = await api.get("/user");
      user.value = response.data;
      localStorage.setItem("ppid_user", JSON.stringify(response.data));
    } catch (err) {
      if (((_a = err.response) == null ? void 0 : _a.status) === 401) {
        token.value = null;
        user.value = null;
        localStorage.removeItem("ppid_token");
        localStorage.removeItem("ppid_user");
      }
    }
  }
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userName,
    userRole,
    login,
    register,
    logout,
    fetchUser
  };
});

export { useAuthStore as u };
//# sourceMappingURL=auth-Cu84b-L0.mjs.map
