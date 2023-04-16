<template>
	<v-app-bar density="compact" elevation="0" border>
		<template v-slot:prepend>
			<v-app-bar-nav-icon
				@click.stop="appStore.toggleDrawer"
			></v-app-bar-nav-icon>
		</template>
		<template v-slot:title>
			<router-link to="/">
				<v-avatar :image="logo" rounded="0"></v-avatar>
			</router-link>
		</template>
	</v-app-bar>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore();
import logo from "@/assets/images/logo.png";
</script>
