import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import Tenant from "../components/Tenant.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/tenants",
    name: "Tenant",
    component: Tenant,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
