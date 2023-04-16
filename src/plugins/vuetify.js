import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "vuetify/styles";
import { vi } from "vuetify/locale";
import { VDataTable } from "vuetify/labs/VDataTable";

const vuetify = createVuetify({
	components: {
		...components,
		VDataTable,
	},
	directives,
	icons: {
		defaultSet: "mdi",
		aliases,
		sets: {
			mdi,
		},
	},
	locale: {
		locale: "vi",
		messages: { vi },
	},
	defaults: {
		VDataTable: {
			fixedHeader: true,
		},
	},
});

export default vuetify;
