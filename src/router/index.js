import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import useUserStore from "@/stores/user";

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
			name: "forms",
			redirect: "/forms",
		},
		{
			path: "/forms/:id",
			name: "form view",
			component: () => import("@/views/forms/FormView.vue"),
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/views/auth/LoginView.vue"),
		},
		{
			path: "/res/:id",
			name: "create response",
			component: () => import("@/views/res/CreateResponse.vue"),
		},
		{
			path: "/res/:id/success",
			name: "create response success",
			component: () => import("@/views/res/CreateResponseSuccess.vue"),
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: "/",
		},
	],
});

router.beforeEach(async (to) => {
	try {
		const userStore = useUserStore();

		await userStore.auth();

		if (to.path === "/login") return "/";
	} catch (error) {
		if (to.path !== "/login" && !to.path.startsWith("/res"))
			return `/login?next=${to.fullPath}`;
	}
});

export default router;
