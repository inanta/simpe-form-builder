import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "../../../../../router/index.js";

import "@mdi/font/css/materialdesignicons.min.css";
import "animate.css";
import "@/assets/builder/builder.css";

const app = createApp(App);
app.use(router).use(createPinia()).mount("#app");

// window.$$App.setInstance(createApp(App));
// window.$$App.getInstance().use(router).use(createPinia()).mount("#app");
