<template>
	<v-card border variant="flat" rounded="lg">
		<template v-slot:append>
			<v-tooltip text="Tải lại">
				<template v-slot:activator="{ props }">
					<v-btn
						v-bind="props"
						icon="mdi-reload"
						variant="flat"
						@click="fetchResponses"
						:loading="loading"
					></v-btn>
				</template>
			</v-tooltip>

			<v-tooltip text="Xem bảng dữ liệu">
				<template v-slot:activator="{ props }">
					<v-btn
						v-bind="props"
						icon="mdi-table"
						variant="flat"
						@click="modal = true"
					></v-btn>
				</template>
			</v-tooltip>

			<v-menu width="300">
				<template v-slot:activator="{ props }">
					<v-btn
						variant="flat"
						icon="mdi-dots-vertical"
						v-bind="props"
					></v-btn>
				</template>

				<v-card elevation="1">
					<v-list density="compact">
						<v-list-item
							prepend-icon="mdi-tray-arrow-down"
							@click="exportCsvFile"
						>
							Tải câu trả lời xuống (.csv)
						</v-list-item>

						<v-divider></v-divider>

						<v-dialog max-width="300">
							<template v-slot:activator="{ props }">
								<v-list-item
									prepend-icon="mdi-trash-can-outline"
									v-bind="props"
								>
									Xóa tất cả câu trả lời
								</v-list-item>
							</template>

							<v-card>
								<v-card-item> Xóa câu trả lời </v-card-item>

								<v-card-text>
									Bạn có chắc chắn muốn xóa tất cả câu trả lời
									trong biểu mẫu không? Không thể hoàn tác tác
									vụ này.
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										color="blue"
										@click="deleteAllResponse"
										>Xóa</v-btn
									>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-list>
				</v-card>
			</v-menu>
		</template>
		<template v-slot:title>{{ responses.length }} câu trả lời</template>

		<v-tabs
			density="compact"
			:color="formData.color"
			align-tabs="center"
			v-model="tab"
		>
			<v-tab value="1">Bảng tóm tắt</v-tab>
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
				density="compact"
				style="flex: 1"
			></v-pagination>

			<v-btn
				icon="mdi-printer-outline"
				@click="$htmlToPaper('_print_page')"
			></v-btn>

			<v-dialog width="300">
				<template v-slot:activator="{ props }">
					<v-btn icon="mdi-trash-can-outline" v-bind="props"></v-btn
				></template>

				<v-card>
					<v-card-title> Xóa phản hồi </v-card-title>

					<v-card-text>
						Bạn có chắc chắn muốn xóa câu trả lời này không? Không
						thể hoàn tác tác vụ này.
					</v-card-text>

					<v-card-actions>
						<v-spacer> </v-spacer>

						<v-btn
							@click="
								deleteResponseById(
									responses[responsePos - 1].responseDetails
										._id,
								)
							"
							color="blue"
							>Xóa</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-card-actions>
	</v-card>

	<v-window v-model="tab" v-if="responses.length">
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

					<div
						v-else-if="question.type === 'file'"
						class="mr-n1 ml-n1"
					>
						<v-btn
							variant="outlined"
							v-for="res in responses"
							:key="res.content"
							class="ma-1"
							prepend-icon="mdi-file-outline"
						>
							<a :href="res.content" target="_blank"> Tập tin </a>
						</v-btn>
					</div>

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

		<v-window-item value="2">
			<div id="_print_page" hidden>
				<div style="padding: 10px">
					<h1>{{ formData.title }}</h1>
					<div v-html="formData.description"></div>
				</div>

				<div
					v-for="{ question, content, options } in responses[
						responsePos - 1
					].responses"
					:key="question._id"
					style="border-top: 1px solid #ddd; padding: 10px"
				>
					<h4 v-html="question.content"></h4>

					<p v-if="question.type === 'text'">{{ content }}</p>

					<a
						:href="content"
						target="_blank"
						v-else-if="question.type === 'file'"
						>{{ content }}</a
					>

					<p v-else>
						{{ options.join(", ") }}
					</p>
				</div>
			</div>
			<v-card
				class="mt-4 pa-2"
				:style="{
					borderTop: `10px solid ${formData.color}`,
				}"
				rounded="lg"
				v-auto-animate
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

				<v-card-actions
					v-if="responses[responsePos - 1].responseDetails.user"
				>
					<v-list-item class="w-100">
						<template v-slot:prepend>
							<v-avatar
								:image="
									responses[responsePos - 1].responseDetails
										.user.avatar
								"
							></v-avatar>
						</template>

						<v-list-item-title>{{
							responses[responsePos - 1].responseDetails.user
								.fullName
						}}</v-list-item-title>

						<v-list-item-subtitle>{{
							responses[responsePos - 1].responseDetails.user
								.email
						}}</v-list-item-subtitle>
					</v-list-item>
				</v-card-actions>
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

					<a :href="content" target="_blank">
						<v-btn
							v-if="question.type === 'file'"
							variant="outlined"
							prepend-icon="mdi-file-outline"
						>
							Xem tập tin
						</v-btn>
					</a>

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

		<v-dialog :model-value="modal" fullscreen>
			<v-card>
				<template v-slot:append>
					<v-btn
						icon="mdi-close"
						variant="flat"
						@click="modal = false"
					></v-btn>
				</template>
				<v-card-item>
					<v-data-table
						:headers="tableHead"
						:items="tableItems"
					></v-data-table>
				</v-card-item>
			</v-card>
		</v-dialog>
	</v-window>
</template>

<script>
import "@/plugins/chart";
import ResponseService from "@/services/response-form.service";
import extractContent from "@/utils/extractContent";
import csvDownload from "json-to-csv-export";
import { Bar, Pie } from "vue-chartjs";
import toast from "@/utils/toast";
import dayjs from "dayjs";

export default {
	components: { Bar, Pie },
	data() {
		return {
			responses: [],
			tab: 1,
			responsePos: 1,
			modal: false,
			loading: false,
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
						if (responseQuestion.question?._id === question?._id) {
							responses.push(responseQuestion);
							break;
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
								(e) => hashedValues[e],
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
		tableHead() {
			return [
				{ title: "Thời gian", key: "time" },
				...this.summary.map((e) => ({
					title: extractContent(e.question.content),
					key: e.question._id,
				})),
			];
		},
		tableItems() {
			const result = [];

			for (const resp of this.responses) {
				const obj = {
					time: dayjs(resp.responseDetails.createdAt).format(
						"DD/MM/YYYY HH:mm:ss",
					),
				};

				for (const res of resp.responses) {
					if (
						res.question.type === "text" ||
						res.question.type === "file"
					) {
						obj[res.question._id] = res.content;
					} else {
						obj[res.question._id] = res.options.join(", ");
					}
				}

				result.push(obj);
			}

			return result;
		},
	},
	mounted() {
		this.fetchResponses();
	},
	methods: {
		async fetchResponses() {
			try {
				this.loading = true;
				const res = await ResponseService.getAll(this.$route.params.id);

				if (
					res.length === this.responsePos - 1 &&
					this.responsePos !== 1
				) {
					this.responsePos--;
				}

				this.responses = res;
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.loading = false;
			}
		},
		async deleteResponseById(id) {
			try {
				await ResponseService.deleteById(id);
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.fetchResponses();
			}
		},
		async deleteAllResponse() {
			try {
				await ResponseService.deleteAll(this.formData._id);
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.fetchResponses();
			}
		},
		exportCsvFile() {
			csvDownload({
				data: this.tableItems,
				headers: this.tableHead.map((e) => e.title),
			});
		},
	},
};
</script>
