<template>
	<v-app-bar border density="compact" elevation="0">
		<template v-slot:prepend>
			<v-app-bar-nav-icon
				@click.stop="appStore.toggleDrawer"
			></v-app-bar-nav-icon>
		</template>
		<template v-slot:title> tForms </template>
	</v-app-bar>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore();
</script>
