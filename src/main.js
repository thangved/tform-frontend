import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { createPinia } from "pinia";
import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import "./assets/styles/global.css";
import vuetify from "./plugins/vuetify";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.component(
	"QuillEditor",
	defineAsyncComponent(() =>
		import("@vueup/vue-quill").then((res) => res.QuillEditor)
	)
);
app.use(autoAnimatePlugin);

app.mount("#app");
