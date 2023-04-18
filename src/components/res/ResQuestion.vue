<template>
	<v-card
		border
		variant="flat"
		class="pa-6 mt-4"
		rounded="lg"
		:key="question._id"
		v-auto-animate
	>
		<v-card-text class="text-subtitle-1 pa-0 mb-4">
			<div v-html="question.content" style="display: inline-block"></div>

			<span v-if="question.required" class="ml-2" style="color: red"
				>*</span
			>
		</v-card-text>

		<v-text-field
			placeholder="Câu trả lời của bạn"
			variant="underlined"
			:color="formDetails.color"
			density="compact"
			v-if="question.type === 'text'"
			v-model="localModelValue.content"
			:rules="[
				(v) => {
					if (!v && question.required)
						return 'Vui lòng nhập trường này';
					return true;
				},
			]"
		></v-text-field>

		<div v-if="question.type === 'checkbox'">
			<v-checkbox
				v-for="option in question.options"
				:color="formDetails.color"
				:key="option"
				:label="option"
				:value="option"
				v-model="localModelValue.options"
				hide-details
				:rules="[
					() => {
						if (
							question.required &&
							!localModelValue.options.length
						) {
							return 'Vui lòng chọn một giá trị';
						}

						return true;
					},
				]"
			></v-checkbox>

			<v-messages
				:active="question.required && !localModelValue.options.length"
				messages="Vui lòng chọn một giá trị"
				color="red"
			></v-messages>
		</div>

		<v-radio-group
			v-if="question.type === 'radio'"
			v-model="localModelValue.options[0]"
			:rules="[
				() => {
					if (question.required && !localModelValue.options.length) {
						return 'Vui lòng chọn một giá trị';
					}

					return true;
				},
			]"
		>
			<v-radio
				v-for="option in question.options"
				:color="formDetails.color"
				:key="option"
				:label="option"
				hide-details
				:value="option"
			></v-radio>
		</v-radio-group>

		<v-select
			v-if="question.type === 'select'"
			:items="question.options"
			placeholder="Chọn..."
			variant="outlined"
			density="compact"
			:color="formDetails.color"
			v-model="localModelValue.options[0]"
			:rules="[
				() => {
					if (question.required && !localModelValue.options.length) {
						return 'Vui lòng chọn một giá trị';
					}

					return true;
				},
			]"
		></v-select>

		<div v-if="question.type === 'file'">
			<input
				type="file"
				:accept="question.accepts.join(',')"
				ref="fileInput"
				@change="uploadFile"
				hidden
			/>

			<v-text-field
				:rules="[
					() => {
						if (question.required && !localModelValue.content)
							return 'Vui lòng chọn file để tải lên';

						return true;
					},
				]"
				style="display: none"
			>
			</v-text-field>

			<v-btn
				prepend-icon="mdi-tray-arrow-up"
				variant="tonal"
				border
				@click="$refs.fileInput.click()"
				:color="formDetails.color"
				:loading="loading"
				class="mb-2"
			>
				Tải file lên
			</v-btn>

			<v-messages
				:active="question.required && !localModelValue.content"
				color="red"
				messages="Vui lòng chọn file để tải lên"
			></v-messages>

			<v-divider></v-divider>

			<v-btn
				variant="outlined"
				class="mt-2"
				:color="formDetails.color"
				v-if="localModelValue.content"
				prepend-icon="mdi-file-outline"
			>
				<a :href="localModelValue.content" target="_blank">
					Tập tin đã tải lên
				</a>
				<template v-slot:append>
					<v-icon
						icon="mdi-close"
						@click="localModelValue.content = null"
					></v-icon>
				</template>
			</v-btn>
		</div>
	</v-card>
</template>

<script>
import { ref } from "vue";
import upload from "@/utils/upload";
import toast from "@/utils/toast";

export default {
	props: ["modelValue", "question", "formDetails"],
	emits: ["update:modelValue"],
	computed: {
		localModelValue: {
			get() {
				return this.modelValue;
			},
			set(newValue) {
				console.log(newValue);
				this.$emit("update:modelValue", newValue);
			},
		},
	},
	data() {
		const fileInput = ref();

		return { fileInput, loading: false };
	},
	methods: {
		async uploadFile(event) {
			this.loading = true;
			try {
				const file = event.target.files[0];

				if (!file) return;

				const fileUrl = await upload(file);

				this.localModelValue.content = fileUrl;
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.loading = false;
			}
		},
	},
};
</script>
