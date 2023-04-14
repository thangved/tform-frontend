import AuthService from "@/services/auth.service";
import Token from "@/utils/token";
import { defineStore } from "pinia";

const useUserStore = defineStore("user", {
	state() {
		return {
			_currentUser: null,
			checked: false,
		};
	},
	getters: {
		currentUser(state) {
			return state._currentUser;
		},
	},
	actions: {
		auth() {
			AuthService.auth()
				.then((res) => {
					this.$state._currentUser = res;
				})
				.finally(() => {
					this.$state.checked = true;
				});
		},
		logout() {
			this.$state._currentUser = null;
			Token.token = "";
		},
	},
});

export default useUserStore;
