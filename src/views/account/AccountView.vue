<template>
	<v-container v-if="currentUser" style="max-width: 500px">
		<v-card class="text-center pa-4" border>
			<v-avatar size="150" :image="currentUser.avatar"></v-avatar>

			<h3 class="text-h5 pt-4 pb-4">{{ currentUser.fullName }}</h3>

			<v-divider></v-divider>

			<p class="pt-2 pb-2">ID: {{ currentUser._id }}</p>

			<v-divider></v-divider>

			<p class="pt-2 pb-2">Email: {{ currentUser.email }}</p>

			<v-divider></v-divider>

			<p class="pt-2 pb-2">
				Tạo vào:
				{{ dayjs(currentUser.createdAt).format("DD/MM/YYYY HH:mm:ss") }}
			</p>

			<v-divider></v-divider>

			<p class="pt-2 pb-2 d-flex align-center justify-center">
				Bạn đang đăng nhập bằng tài khoản
				<a
					style="color: blue; text-decoration: underline"
					href="https://myaccount.google.com"
					target="_blank"
					class="ml-2"
				>
					<img :src="googleText" width="80" />
				</a>
			</p>
		</v-card>
	</v-container>
</template>

<script>
import useUserStore from "@/stores/user";
import dayjs from "dayjs";
import googleText from "@/assets/images/google-text.png";

export default {
	computed: {
		currentUser() {
			const userStore = useUserStore();

			return userStore.currentUser;
		},
	},
	data() {
		return { dayjs, googleText };
	},
};
</script>
