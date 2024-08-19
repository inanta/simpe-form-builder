import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "../../../../../router/front-end.js";

import "@mdi/font/css/materialdesignicons.min.css";
import "animate.css";
import "@/assets/builder/builder.css";

if (
  typeof window.$$App !== "undefined" &&
  window.$$App.setInstance !== "undefined"
) {
  window.$$App.setInstance(createApp(App));
  window.$$App.getInstance().use(router).use(createPinia()).mount("#app");
} else {
  createApp(App).use(router).use(createPinia()).mount("#app");
}
