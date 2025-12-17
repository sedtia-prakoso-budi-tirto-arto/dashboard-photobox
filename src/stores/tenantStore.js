import { defineStore } from "pinia";

export const useTenantStore = defineStore("tenant", {
  state: () => ({
    activeTenant: JSON.parse(localStorage.getItem("activeTenant")) || null,
  }),

  getters: {
    apiBase: (state) => state.activeTenant?.serverUrl || "",
    mqttId: (state) => state.activeTenant?.mqttId || "",
    macAddress: (state) => state.activeTenant?.macAddress || "",
  },

  actions: {
    setTenant(tenant) {
      this.activeTenant = tenant;
      localStorage.setItem("activeTenant", JSON.stringify(tenant));
    },

    clearTenant() {
      this.activeTenant = null;
      localStorage.removeItem("activeTenant");
    },
  },
});
