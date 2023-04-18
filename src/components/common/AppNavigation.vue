<template>
	<v-navigation-drawer v-if="currentUser" :model-value="showDrawer">
		<v-list>
			<v-list-item>
				<template v-slot:prepend>
					<v-avatar :image="currentUser.avatar"></v-avatar>
				</template>

				<template v-slot:title>{{ currentUser.fullName }}</template>

				<template v-slot:subtitle>{{ currentUser.email }}</template>
			</v-list-item>
		</v-list>

		<v-divider></v-divider>

		<v-list
			:selected="[$route.fullPath]"
			active-color="blue"
			density="compact"
			nav
		>
			<router-link to="/forms">
				<v-list-item
					prepend-icon="mdi-list-box-outline"
					title="Biểu mẫu của tôi"
					value="/forms"
				></v-list-item>
			</router-link>

			<router-link to="/account">
				<v-list-item
					prepend-icon="mdi-account-circle-outline"
					title="Thông tin tài khoản"
					value="/account"
				></v-list-item>
			</router-link>
		</v-list>

		<template v-slot:append>
			<v-menu location="left">
				<template v-slot:activator="{ props }">
					<div class="pa-2">
						<v-btn
							block
							prepend-icon="mdi-logout"
							variant="flat"
							color="blue"
							v-bind="props"
						>
							Đăng xuất
						</v-btn>
					</div>
				</template>

				<v-card>
					<v-list>
						<v-list-item
							prepend-icon="mdi-logout"
							title="Đăng xuất"
							subtitle="Nhấp ra ngoài để hủy"
							@click="
								() => {
									userStore.logout();
									$router.push('/login');
								}
							"
						>
						</v-list-item>
					</v-list>
				</v-card>
			</v-menu>
		</template>
	</v-navigation-drawer>
</template>

<script>
import { useAppStore } from "@/stores/app";
import useUserStore from "@/stores/user";

export default {
	data() {
		const userStore = useUserStore();
		const appStore = useAppStore();

		return { userStore, appStore };
	},
	computed: {
		currentUser() {
			return this.userStore.currentUser;
		},
		showDrawer() {
			return this.appStore.showDrawer;
		},
	},
};
</script>
