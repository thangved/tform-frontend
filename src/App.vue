<template>
	<v-app>
		<v-layout>
			<app-header></app-header>
			<app-navigation></app-navigation>
			<v-main>
				<router-view></router-view>
			</v-main>
		</v-layout>
	</v-app>
	<auth-overlay></auth-overlay>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AuthOverlay from "@/components/common/AuthOverlay.vue";
import useUserStore from "@/stores/user";
import AppNavigation from "@/components/common/AppNavigation.vue";

export default {
	components: { AuthOverlay, AppHeader, AppNavigation },
	data() {
		const userStore = useUserStore();
		return { userStore };
	},
	mounted() {
		this.userStore.auth();
	},
};
</script>
