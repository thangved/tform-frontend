const questionTypes = [
	{ value: "text", label: "Văn bản", icon: "mdi-text-short" },
	{
		value: "radio",
		label: "Trắc nghiệm",
		icon: "mdi-radiobox-marked",
		optionIcon: "mdi-radiobox-blank",
	},
	{
		value: "checkbox",
		label: "Hộp kiểm",
		icon: "mdi-checkbox-outline",
		optionIcon: "mdi-checkbox-blank-outline",
	},
	{
		value: "select",
		label: "Menu thả xuống",
		icon: "mdi-arrow-down-drop-circle-outline",
	},
	{
		value: "file",
		label: "Tải tệp lên",
		icon: "mdi-cloud-upload-outline",
	},
];

export default questionTypes;
