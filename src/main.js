import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import * as VueQuill from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/global.css";
import "./plugins/chart";
import vuetify from "./plugins/vuetify";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.component("QuillEditor", VueQuill.QuillEditor);
app.use(autoAnimatePlugin);

app.mount("#app");
