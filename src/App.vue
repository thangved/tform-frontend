<template>
	<v-app>
		<v-layout>
			<app-header
				v-if="$route.path === '/forms' || $route.path === '/account'"
			></app-header>

			<app-navigation
				v-if="!$route.path.startsWith('/res')"
			></app-navigation>

			<v-main style="height: 100vh; overflow: hidden">
				<router-view></router-view>
			</v-main>
		</v-layout>
	</v-app>
</template>

<script>
import useUserStore from "@/stores/user";
import { defineAsyncComponent } from "vue";

const AppHeader = defineAsyncComponent(() =>
	import("@/components/common/AppHeader.vue"),
);
const AppNavigation = defineAsyncComponent(() =>
	import("@/components/common/AppNavigation.vue"),
);

export default {
	components: { AppHeader, AppNavigation },
	data() {
		const userStore = useUserStore();
		return { userStore };
	},
};
</script>
