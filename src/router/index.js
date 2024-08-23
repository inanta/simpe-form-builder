import qs from "qs";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "App Builder Index",
    component: () => import("../views/AppBuilderView.vue")
  },
  {
    path: "/app/builder/view",
    name: "App Builder View",
    component: () => import("../views/AppBuilderView.vue")
  },
  {
    path: "/app/builder/build/:name?",
    name: "App Builder",
    component: () => import("../views/AppBuilder.vue")
  },
  {
    path: "/app/view/:name",
    name: "App View",
    component: () => import("../views/AppView.vue")
  }
  // {
  //   path: "/app/insert/:name/:parameter?/:value?",
  //   name: "App Insert",
  //   component: () => import("../views/AppInsert.vue")
  // },
  // {
  //   path: "/app/edit/:name/:id",
  //   name: "App Edit",
  //   component: () => import("../views/AppEdit.vue")
  // }

  ///
  // {
  //   path: "/api/builder/view",
  //   name: "API Builder View",
  //   component: () => import("../views/ApiBuilderView.vue")
  // },
  // {
  //   path: "/api/builder/build/:endpoint(.*)?",
  //   name: "API Builder",
  //   component: () => import("../views/ApiBuilder.vue")
  // },
  // ///

  // {
  //   path: "/report/builder/build/:name?",
  //   name: "Report Builder",
  //   component: () => import("../views/ReportBuilder.vue")
  // },
  // {
  //   path: "/report/builder/view",
  //   name: "Report Builder View",
  //   component: () => import("../views/ReportBuilderView.vue")
  // },
  // {
  //   path: "/report/view/:name",
  //   name: "ReportView",
  //   component: () => import("../views/ReportView.vue")
  // }
];

const router = createRouter({
  parseQuery: qs.parse,
  stringifyQuery: qs.stringify,
  history: createWebHashHistory(),
  routes
});

export default router;
