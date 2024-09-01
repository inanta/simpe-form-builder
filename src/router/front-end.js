import qs from "qs";
// import { createRouter, createWebHashHistory } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/event/booking/:name",
    name: "App Insert",
    component: () => import("../views/AppInsertFrontEnd.vue")
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("../views/AppInsertFrontEnd.vue")
  }
];

const router = createRouter({
  parseQuery: qs.parse,
  stringifyQuery: qs.stringify,
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes
});

export default router;
