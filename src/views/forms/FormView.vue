<template>
	<div style="height: 100%" class="d-flex flex-column" v-if="formData">
		<v-app-bar density="compact" elevation="0">
			<template v-slot:prepend>
				<v-btn icon="mdi-chevron-left"></v-btn>
			</template>

			<template v-slot:title>
				{{ formData.title }}
			</template>
		</v-app-bar>
		<v-tabs
			align-tabs="center"
			density="compact"
			:color="formData?.color || 'blue'"
			v-model="tab"
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
			}"
		>
			<v-container fluid style="max-width: 768px">
				<v-window v-model="tab">
					<v-window-item value="1">
						<div
							style="position: fixed; right: 0; bottom: 0"
							class="pa-2"
						>
							<v-card rounded="pill">
								<v-card-actions>
									<v-btn
										icon="mdi-plus-circle-outline"
									></v-btn>

									<v-btn icon="mdi-radiobox-marked"></v-btn>

									<v-btn
										icon="mdi-checkbox-marked-outline"
									></v-btn>
								</v-card-actions>
							</v-card>
						</div>

						<div ref="parent">
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
						</div>
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

							<v-card-text>
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
							</v-card-text>
						</v-card>
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
import FormService from "@/services/form.service";
import QuestionService from "@/services/question.service";
import autoAnimate from "@formkit/auto-animate";
import { ref } from "vue";

export default {
	components: { EditFormDetails, EditQuestion },
	data() {
		const parent = ref();
		return { formData: null, questions: [], parent, tab: 1 };
	},
	methods: {
		async fetchFormData() {
			try {
				this.formData = await FormService.getById(
					this.$route.params.id
				);
			} catch (error) {
				alert(error);
			}
		},

		async updateForm(payload) {
			try {
				await FormService.updateById(this.$route.params.id, payload);
			} catch (error) {
				alert(error);
			} finally {
				await this.fetchFormData();
			}
		},

		async handleCreateQuestion() {
			try {
				await QuestionService.create({ formId: this.$route.params.id });
			} catch (error) {
				alert(error);
			} finally {
				this.fetchQuestions();
			}
		},

		async fetchQuestions() {
			try {
				this.questions = await QuestionService.getAll(
					this.$route.params.id
				);
			} catch (error) {
				alert(error);
			}
		},

		async updateQuestion(id, payload) {
			try {
				await QuestionService.updateById(id, payload);
			} catch (error) {
				alert(error);
			} finally {
				this.fetchQuestions();
			}
		},

		async deleteQuestion(id) {
			try {
				await QuestionService.deleteById(id);
			} catch (error) {
				alert(error);
			} finally {
				this.fetchQuestions();
			}
		},

		async copyQuestion(payload) {
			try {
				await QuestionService.create(payload);
			} catch (error) {
				alert(error);
			} finally {
				this.fetchQuestions();
			}
		},

		async deleteForm() {
			try {
				await FormService.deleteById(this.$route.params.id);
				this.$router.push("/");
			} catch (error) {
				alert(error);
			}
		},
	},
	mounted() {
		Promise.all([this.fetchFormData(), this.fetchQuestions()]).then(() => {
			autoAnimate(this.$refs.parent);
		});
	},
};
</script>
