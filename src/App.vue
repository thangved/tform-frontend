<template>
	<v-app>
		<v-layout>
			<app-header v-if="!$route.path.startsWith('/res')"></app-header>
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
import AppHeader from "@/components/common/AppHeader.vue";
import AppNavigation from "@/components/common/AppNavigation.vue";
import useUserStore from "@/stores/user";

export default {
	components: { AppHeader, AppNavigation },
	data() {
		const userStore = useUserStore();
		return { userStore };
	},
};
</script>
