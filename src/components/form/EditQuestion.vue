<template>
	<v-card
		class="mt-6 pa-4"
		variant="flat"
		rounded="lg"
		border
		:style="{
			background: '#fff',
		}"
		@click="editing = !editing"
	>
		<v-row @click="(event) => event.stopPropagation()">
			<v-col cols="8">
				<v-card-text class="text-body-1">
					<div v-html="question.content"></div>
				</v-card-text>
			</v-col>

			<v-col cols="4">
				<v-select
					label="Loại câu hỏi"
					variant="solo"
					:items="questionTypes"
					item-value="value"
					item-title="label"
					v-if="editing"
				></v-select>
			</v-col>
		</v-row>

		<v-divider></v-divider>

		<v-card-actions></v-card-actions>
	</v-card>
</template>

<script>
import { ref } from "vue";

const questionTypes = [
	{ value: "text", label: "Văn bản" },
	{ value: "radio", label: "Trắc nghiệm" },
	{ value: "checkbox", label: "Hộp kiểm" },
	{ value: "select", label: "Menu thả xuống" },
];

export default {
	props: ["question", "formData"],
	data() {
		const parent = ref();
		return {
			localForm: this.question,
			questionTypes,
			editing: false,
			parent,
		};
	},
};
</script>
