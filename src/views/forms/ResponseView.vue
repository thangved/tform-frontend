<template>
	<v-card border variant="flat" rounded="lg">
		<v-card-title class="text-h5 pa-4"
			>{{ responses.length }} câu trả lời</v-card-title
		>

		<v-tabs
			density="compact"
			:color="formData.color"
			align-tabs="center"
			v-model="tab"
		>
			<v-tab value="1">Bản tóm tắt</v-tab>
			<v-tab value="2">Cá nhân</v-tab>
		</v-tabs>

		<v-card-actions
			v-if="tab === '2' && responses.length"
			style="border-top: 1px solid #ddd"
		>
			<v-pagination
				:length="responses.length"
				rounded="pill"
				:color="formData.color"
				v-model="responsePos"
			></v-pagination>

			<v-spacer> </v-spacer>

			<v-btn
				icon="mdi-trash-can-outline"
				@click="
					deleteResponseById(
						responses[responsePos - 1].responseDetails._id
					)
				"
			></v-btn>
		</v-card-actions>
	</v-card>

	<v-window v-model="tab">
		<v-window-item value="1">
			<v-card
				v-for="{ question, responses, chartData } in summary"
				border
				variant="flat"
				rounded="lg"
				class="mt-4"
				:key="question._id"
			>
				<v-card-text>
					<div v-html="question.content"></div>
				</v-card-text>

				<v-card-subtitle class="pb-2">
					{{ responses.length }} Câu trả lời
				</v-card-subtitle>

				<v-card-item v-if="responses.length">
					<bar
						:data="chartData"
						:options="{
							responsive: true,
							plugins: {
								legend: false,
							},
							scales: {
								y: {
									ticks: {
										precision: 0,
									},
								},
							},
						}"
						v-if="question.type === 'text'"
					></bar>

					<v-container v-else style="width: 300px">
						<pie
							:data="chartData"
							:options="{
								responsive: true,
								plugins: {
									colors: {
										forceOverride: true,
									},
								},
							}"
						></pie>
					</v-container>
				</v-card-item>
			</v-card>
		</v-window-item>

		<v-window-item v-if="responses.length" value="2">
			<v-card
				class="mt-4 pa-2"
				:style="{
					borderTop: `10px solid ${formData.color}`,
				}"
				rounded="lg"
			>
				<v-card-subtitle>
					Bạn không thể chỉnh sửa câu trả lời
				</v-card-subtitle>

				<v-card-title class="text-h5">{{
					formData.title
				}}</v-card-title>

				<v-card-text class="text-subtitle-1">
					<div v-html="formData.description"></div>
				</v-card-text>
			</v-card>

			<v-card
				class="mt-4 pa-2"
				rounded="lg"
				v-for="{ question, content, options } in responses[
					responsePos - 1
				].responses"
				:key="question._id"
			>
				<v-card-text class="text-subtitle-1">
					<div v-html="question.content"></div>
				</v-card-text>

				<v-card-item>
					<div
						v-if="question.type === 'text'"
						style="border-bottom: 1px dotted #ddd"
					>
						{{ content }}
					</div>

					<v-select
						v-if="question.type === 'select'"
						:model-value="options[0] || 'Chọn'"
						disabled
						variant="outlined"
					></v-select>

					<v-radio-group
						:model-value="options[0]"
						v-if="question.type === 'radio'"
						disabled
					>
						<v-radio
							v-for="option in question.options"
							:key="option"
							:value="option"
							:label="option"
						></v-radio>
					</v-radio-group>

					<div v-if="question.type === 'checkbox'">
						<v-checkbox
							v-for="option in question.options"
							:model-value="options"
							disabled
							:key="option"
							:value="option"
							:label="option"
							hide-details
						></v-checkbox>
					</div>
				</v-card-item>
			</v-card>
		</v-window-item>
	</v-window>
</template>

<script>
import ResponseService from "@/services/response-form.service";
import "@/plugins/chart";
import { Bar, Pie } from "vue-chartjs";

export default {
	components: { Bar, Pie },
	data() {
		return {
			responses: [],
			tab: 1,
			responsePos: 1,
		};
	},
	props: ["formData", "questions"],
	computed: {
		summary() {
			const result = [];

			for (const question of this.questions) {
				const responses = [];

				for (const response of this.responses) {
					for (const responseQuestion of response.responses) {
						if (responseQuestion.question._id === question._id) {
							responses.push(responseQuestion);
							continue;
						}
					}
				}

				const hashedValues = {};

				for (const res of responses) {
					let options = [];

					if (question.type === "text") {
						options = [res.content];
					} else {
						options = res.options;
					}

					for (const option of options) {
						if (!hashedValues[options]) {
							hashedValues[option] = 0;
						}
						hashedValues[option]++;
					}
				}

				const chartData = {
					labels: Object.keys(hashedValues),
					datasets: [
						{
							data: Object.keys(hashedValues).map(
								(e) => hashedValues[e]
							),
						},
					],
				};

				result.push({ question, responses, chartData });
			}

			return result;
		},
		selectedQuestion() {
			return (
				this.questions.find((e) => e._id === this.questionId) ||
				this.questions[0]
			);
		},
	},
	mounted() {
		this.fetchResponses();
	},
	methods: {
		async fetchResponses() {
			this.responses = await ResponseService.getAll(
				this.$route.params.id
			);
		},
		async deleteResponseById(id) {
			try {
				await ResponseService.deleteById(id);
			} catch (error) {
				alert(error);
			} finally {
				if (this.responsePos === this.responses.length - 1) {
					this.responsePos--;
				}
				this.fetchResponses();
			}
		},
	},
};
</script>
