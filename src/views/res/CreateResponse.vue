<template>
	<div
		v-if="context && response"
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
				<v-card-text class="text-h5" style="line-height: 1.2">
					{{ context.formDetails.title }}
				</v-card-text>

				<v-divider></v-divider>

				<v-card-text class="mt-4">
					<div v-html="context.formDetails.description"></div>
				</v-card-text>
			</v-card>

			<v-card
				border
				variant="flat"
				class="pa-6 mt-4"
				rounded="lg"
				v-for="(question, index) in context.questions"
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
					v-model="response[index].content"
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
						v-model="response[index].options"
					></v-checkbox>
				</div>

				<v-radio-group
					v-if="question.type === 'radio'"
					v-model="response[index].options[0]"
				>
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
					placeholder="Chọn..."
					variant="outlined"
					density="compact"
					:color="context.formDetails.color"
					v-model="response[index].options[0]"
				></v-select>
			</v-card>

			<v-btn
				class="mt-4 pl-6 pr-6"
				variant="flat"
				:color="context.formDetails.color"
				@click="submit"
			>
				Gửi
			</v-btn>
			<res-footer></res-footer>
		</v-container>
	</div>
	<v-progress-linear v-else color="primary" indeterminate></v-progress-linear>
</template>
<script>
import ResponseService from "@/services/response-form.service";
import ResponseForm from "@/services/response-form.service";
import ResFooter from "@/components/res/ResFooter.vue";

export default {
	components: { ResFooter },
	data() {
		return {
			context: null,
			response: null,
		};
	},
	mounted() {
		ResponseForm.getContext(this.$route.params.id)
			.then((res) => {
				this.context = res;
			})
			.catch(() => {
				this.$router.push("/");
			})
			.finally(() => {
				const _response = [];
				for (const question of this.context.questions) {
					_response.push({
						questionId: question._id,
						content: "",
						options: [],
					});
				}
				this.response = _response;
			});
	},
	methods: {
		async submit() {
			const payload = {
				formId: this.context.formDetails._id,
				response: this.response,
			};

			try {
				await ResponseService.create(payload);
				this.$router.push(`${this.$route.path}/success`);
			} catch (error) {
				alert(error);
			}
		},
	},
};
</script>
