<template>
	<v-dialog max-width="400" persistent :model-value="!currentUser">
		<v-card elevation="0" :border="true">
			<v-card-title> Đăng nhập </v-card-title>
			<v-card-subtitle>Vui lòng đăng nhập để tiếp tục</v-card-subtitle>
			<v-card-text>
				<v-btn
					block
					variant="flat"
					border
					style="text-transform: inherit"
					@click="handleLogin"
					:loading="loading"
				>
					<template v-slot:prepend>
						<img :src="googleIcon" width="25" alt="Google" />
					</template>
					Đăng nhập với tài khoản Google
				</v-btn>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import googleIcon from "@/assets/images/google.png";
import { auth } from "@/firebase";
import AuthService from "@/services/auth.service";
import useUserStore from "@/stores/user";
import Token from "@/utils/token";
import { signInWithPopup } from "@firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

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
					new GoogleAuthProvider()
				);

				const token = firebaseRes.user.accessToken;

				const res = await AuthService.login({ token });
				Token.token = res.token;

				this.userStore.auth();
			} catch (error) {
				alert(error);
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
