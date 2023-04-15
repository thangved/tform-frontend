import AuthService from "@/services/auth.service";
import Token from "@/utils/token";
import { defineStore } from "pinia";

const useUserStore = defineStore("user", {
	state() {
		return {
			_currentUser: null,
		};
	},
	getters: {
		currentUser(state) {
			return state._currentUser;
		},
	},
	actions: {
		async auth() {
			return AuthService.auth().then((res) => {
				this.$state._currentUser = res;
			});
		},
		logout() {
			this.$state._currentUser = null;
			Token.token = "";
		},
	},
});

export default useUserStore;
