<template>
	<div style="height: 100%" class="d-flex flex-column" v-if="formData">
		<v-app-bar elevation="0">
			<template v-slot:prepend>
				<v-btn icon="mdi-chevron-left" @click="$router.back"></v-btn>
			</template>

			<template v-slot:title>
				{{ formData.title }}
			</template>

			<template v-slot:append>
				<v-dialog max-width="550" origin="overlap">
					<template v-slot:activator="{ props }">
						<v-btn
							v-bind="props"
							variant="flat"
							color="blue"
							class="pl-6 pr-6"
						>
							Gửi
						</v-btn>
					</template>

					<v-card
						class="pa-4"
						elevation="0"
						border
						rounded="lg"
						title="Gửi biểu mẫu"
					>
						<v-card-item>
							<h4>Liên kết</h4>
							<v-text-field
								:model-value="shareLink"
								readonly
								variant="underlined"
								color="blue"
								@focus="(event) => event.target.select()"
							></v-text-field>
						</v-card-item>

						<v-card-actions>
							<v-btn
								class="pl-4 pr-4"
								prepend-icon="mdi-open-in-new"
								@click="openLink"
								variant="text"
								color="blue"
								border=""
							>
								Mở liên kết
							</v-btn>

							<v-spacer></v-spacer>

							<v-btn
								class="pl-4 pr-4"
								@click="shareToFb"
								variant="text"
								color="blue"
								border=""
								icon="mdi-facebook"
							>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</template>
		</v-app-bar>
		<v-tabs
			align-tabs="center"
			density="compact"
			:color="formData?.color || 'blue'"
			v-model="tab"
			style="border-bottom: 1px solid #ddd"
		>
			<v-tab value="1">Câu hỏi</v-tab>
			<v-tab value="2">Cài đặt</v-tab>
			<v-tab value="3">Câu trả lời</v-tab>
		</v-tabs>
		<div
			:style="{
				background: `${formData.color}20`,
				flex: 1,
				overflow: 'auto',
				paddingBottom: '200px',
			}"
			ref="parent"
		>
			<v-container fluid style="max-width: 768px">
				<div
					style="position: fixed; right: 0; bottom: 0; z-index: 100"
					class="pa-4"
					v-if="tab == 1"
				>
					<v-card rounded="pill">
						<v-card-actions>
							<v-tooltip
								v-for="questionType in questionTypes"
								:key="questionType.value"
								:text="questionType.label"
								location="top center"
							>
								<template v-slot:activator="{ props }">
									<v-btn
										v-bind="props"
										:icon="questionType.icon"
										@click="
											handleCreateQuestion({
												type: questionType.value,
											})
										"
									></v-btn>
								</template>
							</v-tooltip>
						</v-card-actions>
					</v-card>
				</div>

				<v-window v-model="tab">
					<v-window-item value="1" v-auto-animate>
						<edit-form-details
							:formData="formData"
							@update:form="updateForm"
						></edit-form-details>

						<edit-question
							v-for="question in questions"
							:key="question._id"
							:question="question"
							:formData="formData"
							@update:question="
								(payload) =>
									updateQuestion(question._id, payload)
							"
							@delete:question="
								() => deleteQuestion(question._id)
							"
							@copy:question="copyQuestion"
						></edit-question>
					</v-window-item>

					<v-window-item value="2">
						<v-card
							rounded="lg"
							elevation="0"
							border
							prepend-icon="mdi-palette-outline"
						>
							<template v-slot:title> Giao diện </template>

							<v-card-text>
								<v-color-picker
									swatches-max-height
									hide-canvas
									hide-inputs
									show-swatches
									hide-sliders
									width="100%"
									v-model="formData.color"
									@update:modelValue="
										updateForm({ color: formData.color })
									"
								></v-color-picker>
							</v-card-text>
						</v-card>

						<v-card
							rounded="lg"
							elevation="0"
							border
							prepend-icon="mdi-cog-outline"
							class="mt-4"
						>
							<template v-slot:title> Cài đặt </template>

							<v-card-item>
								<v-dialog width="300">
									<template v-slot:activator="{ props }">
										<v-btn
											prepend-icon="mdi-trash-can-outline"
											color="red"
											variant="outlined"
											v-bind="props"
										>
											Xóa biểu mẫu
										</v-btn>
									</template>

									<v-card rounded="lg">
										<template v-slot:title>
											Xóa biểu mẫu
										</template>

										<v-card-text>
											Bạn có muốn xóa biểu mẫu này?
										</v-card-text>

										<v-card-actions>
											<v-btn
												class="ml-2"
												variant="tonal"
												color="red"
												@click="deleteForm"
											>
												Xóa
											</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
							</v-card-item>
						</v-card>
					</v-window-item>

					<v-window-item value="3">
						<response-view
							:form-data="formData"
							:questions="questions"
						></response-view>
					</v-window-item>
				</v-window>
			</v-container>
		</div>
	</div>

	<v-progress-linear v-else color="primary" indeterminate></v-progress-linear>
</template>

<script>
import EditFormDetails from "@/components/form/EditFormDetails.vue";
import EditQuestion from "@/components/form/EditQuestion.vue";
import questionTypes from "@/mock/question-types";
import FormService from "@/services/form.service";
import QuestionService from "@/services/question.service";
import { ref } from "vue";
import ResponseView from "./ResponseView.vue";
import toast from "@/utils/toast";

export default {
	components: { EditFormDetails, EditQuestion, ResponseView },
	data() {
		const parent = ref();
		return { formData: null, questions: [], tab: 1, questionTypes, parent };
	},
	methods: {
		async fetchFormData() {
			try {
				this.formData = await FormService.getById(
					this.$route.params.id
				);
			} catch (error) {
				this.$router.push("/");
			}
		},

		async updateForm(payload) {
			try {
				await FormService.updateById(this.$route.params.id, payload);
			} catch (error) {
				toast.error(error.message);
			} finally {
				await this.fetchFormData();
			}
		},

		async handleCreateQuestion(payload) {
			try {
				await QuestionService.create({
					...payload,
					formId: this.$route.params.id,
				});
			} catch (error) {
				toast.error(error.message);
			} finally {
				await this.fetchQuestions();
				this.$refs.parent.scrollTop = this.$refs.parent.scrollHeight;
			}
		},

		async fetchQuestions() {
			try {
				this.questions = await QuestionService.getAll(
					this.$route.params.id
				);

				return this.questions;
			} catch (error) {
				toast.error(error.message);
			}
		},

		async updateQuestion(id, payload) {
			try {
				await QuestionService.updateById(id, payload);
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.fetchQuestions();
			}
		},

		async deleteQuestion(id) {
			try {
				await QuestionService.deleteById(id);
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.fetchQuestions();
			}
		},

		async copyQuestion(payload) {
			try {
				await QuestionService.create(payload);
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.fetchQuestions();
			}
		},

		async deleteForm() {
			try {
				await FormService.deleteById(this.$route.params.id);
				this.$router.push("/");
			} catch (error) {
				toast.error(error.message);
			}
		},

		openLink() {
			open(this.shareLink);
		},

		shareToFb() {
			open(
				`https://www.facebook.com/sharer.php?u=${this.shareLink}`,
				"share to fb",
				"width=300,height=300"
			);
		},
	},
	mounted() {
		this.fetchFormData();
		this.fetchQuestions();
	},
	computed: {
		shareLink() {
			return `${location.protocol}//${location.host}/res/${this.formData._id}`;
		},
	},
};
</script>
