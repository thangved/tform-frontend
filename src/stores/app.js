import { defineStore } from "pinia";

const useAppStore = defineStore("app", {
	state() {
		return {
			_showDrawer: false,
		};
	},
	getters: {
		showDrawer(state) {
			return state._showDrawer;
		},
	},
	actions: {
		toggleDrawer() {
			this._showDrawer = !this._showDrawer;
		},
	},
});

export { useAppStore };
