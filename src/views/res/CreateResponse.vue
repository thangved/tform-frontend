<template>
	<div
		v-if="context"
		:style="{
			background: `${context.formDetails.color}20`,
			height: '100%',
			overflow: 'auto',
		}"
	>
		<v-container style="max-width: 768px">
			<v-card
				border
				class="pa-4"
				rounded="lg"
				variant="flat"
				:style="{
					borderTop: `10px solid ${context.formDetails.color}`,
				}"
			>
				<v-card-title class="text-h5">
					{{ context.formDetails.title }}
				</v-card-title>

				<v-divider></v-divider>

				<v-card-subtitle class="mt-4">
					<div v-html="context.formDetails.description"></div>
				</v-card-subtitle>
			</v-card>

			<v-card
				border
				variant="flat"
				class="pa-6 mt-4"
				rounded="lg"
				v-for="question in context.questions"
				:key="question._id"
			>
				<v-card-text class="text-subtitle-1 pa-0 mb-4">
					<div
						v-html="question.content"
						style="display: inline-block"
					></div>

					<span
						v-if="question.required"
						class="ml-2"
						style="color: red"
						>*</span
					>
				</v-card-text>

				<v-text-field
					placeholder="Câu trả lời của bạn"
					variant="underlined"
					:color="context.formDetails.color"
					density="compact"
					v-if="question.type === 'text'"
				></v-text-field>

				<div v-if="question.type === 'checkbox'">
					<v-checkbox
						v-for="option in question.options"
						:color="context.formDetails.color"
						:key="option"
						:label="option"
						hide-details
						:name="question._id"
						:value="option"
					></v-checkbox>
				</div>

				<v-radio-group v-if="question.type === 'radio'">
					<v-radio
						v-for="option in question.options"
						:color="context.formDetails.color"
						:key="option"
						:label="option"
						hide-details
						:value="option"
					></v-radio>
				</v-radio-group>

				<v-select
					v-if="question.type === 'select'"
					:items="question.options"
					placeholder="Chọn"
					variant="outlined"
					density="compact"
				></v-select>
			</v-card>

			<v-btn
				class="mt-4 pl-6 pr-6"
				variant="flat"
				:color="context.formDetails.color"
				>Gửi</v-btn
			>

			<v-footer class="mt-4 text-center" color="#ffffff00">
				<div class="text-subtitle-2">
					<span>
						Nội dung này không phải do tForms tạo ra hay xác nhận.
					</span>

					<router-link to="#" style="text-decoration: underline">
						Báo cáo lạm dụng
					</router-link>
					-
					<router-link to="#" style="text-decoration: underline">
						Điều khoản sử dụng
					</router-link>
					-
					<router-link to="#" style="text-decoration: underline">
						Chính sách quyền riêng tư
					</router-link>
				</div>
			</v-footer>
		</v-container>
	</div>
	<v-progress-linear v-else color="primary" indeterminate></v-progress-linear>
</template>
<script>
import ResponseForm from "@/services/response-form.service";

export default {
	data() {
		return {
			context: null,
		};
	},
	mounted() {
		ResponseForm.getContext(this.$route.params.id).then((res) => {
			this.context = res;
		});
	},
};
</script>
