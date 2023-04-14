import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/forms",
			name: "home",
			component: HomeView,
		},
		{
			path: "/",
			redirect: "/forms",
		},
		{
			path: "/forms/:id",
			name: "FormView",
			component: () => import("@/views/forms/FormView.vue"),
		},
	],
});

export default router;
