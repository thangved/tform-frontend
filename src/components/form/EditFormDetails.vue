<template>
	<v-card
		style="background: #fff"
		rounded="lg"
		border
		:style="{
			borderTop: `10px solid ${formData.color}`,
		}"
		:hover="!editing"
	>
		<div
			@click="
				(event) => {
					event.stopPropagation();
					editing = true;
				}
			"
			class="pa-4"
			v-auto-animate
		>
			<v-textarea
				variant="underlined"
				color="blue"
				placeholder="Tiêu đề biểu mẫu"
				v-if="editing"
				v-model="localForm.title"
				autofocus
			></v-textarea>

			<v-card-text v-else class="text-h5" style="line-height: 1.2">
				{{ localForm.title }}
			</v-card-text>

			<quill-editor
				v-if="editing"
				placeholder="Mô tả biểu mẫu"
				toolbar="minimal"
				v-model:content="localForm.description"
				content-type="html"
			></quill-editor>

			<v-card-text v-else>
				<div v-html="localForm.description || 'Mô tả biểu mẫu'"></div
			></v-card-text>
		</div>
	</v-card>
</template>

<script>
export default {
	props: ["formData"],
	emits: ["update:form"],
	data() {
		return { editing: false, localForm: this.formData };
	},
	methods: {
		async update() {
			if (!this.editing) return;

			delete this.localForm.color;

			this.$emit("update:form", this.localForm);
			this.editing = false;
		},
	},
	mounted() {
		window.addEventListener("click", this.update);
	},
	unmounted() {
		window.removeEventListener("click", this.update);
	},
};
</script>
