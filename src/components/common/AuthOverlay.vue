<template>
	<v-dialog max-width="400" persistent :model-value="true">
		<v-card elevation="0" :border="true" rounded="xl" class="pa-4">
			<v-card-title> Đăng nhập </v-card-title>
			<v-card-subtitle>Vui lòng đăng nhập để tiếp tục</v-card-subtitle>
			<v-card-actions>
				<v-btn
					block
					variant="flat"
					rounded="xl"
					size="large"
					border
					style="text-transform: inherit"
					@click="handleLogin"
					:loading="loading"
				>
					<template v-slot:prepend>
						<img :src="googleIcon" width="25" alt="Google" />
					</template>
					Đăng nhập với Google
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import googleIcon from "@/assets/images/google.png";
import { auth } from "@/firebase";
import AuthService from "@/services/auth.service";
import useUserStore from "@/stores/user";
import Token from "@/utils/token";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import toast from "@/utils/toast";

export default {
	data() {
		const userStore = useUserStore();
		return { googleIcon, loading: false, userStore };
	},
	methods: {
		async handleLogin() {
			try {
				this.loading = true;
				const firebaseRes = await signInWithPopup(
					auth,
					new GoogleAuthProvider(),
				);

				const token = firebaseRes.user.accessToken;

				const res = await AuthService.login({ token });
				Token.token = res.token;

				this.userStore.auth();
				this.$router.push(this.$route.query.next || "/");
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.loading = false;
			}
		},
	},
	computed: {
		currentUser() {
			return this.userStore.currentUser;
		},
	},
};
</script>
