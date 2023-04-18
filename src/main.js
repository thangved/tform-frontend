import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { createPinia } from "pinia";
import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import "./assets/styles/global.css";
import vuetify from "./plugins/vuetify";
import router from "./router";
import VueHtmlToPaper from "./plugins/VueHtmlToPaper";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

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
app.use(VueHtmlToPaper);
app.use(Toast, {
	position: "top-center",
	closeOnClick: true,
});

app.mount("#app");
