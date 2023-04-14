<template>
	<v-container
		fluid
		v-if="formData"
		:style="{
			background: `${formData.color}20`,
			minHeight: '100%',
		}"
	>
		<v-row></v-row>
		<v-row style="min-height: 100%">
			<v-col cols="12" sm="12" md="3"></v-col>
			<v-col cols="12" sm="12" md="6">
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
					></edit-question>

					<v-btn
						rounded="lg"
						prependIcon="mdi-plus-circle-outline"
						class="mt-2"
						variant="tonal"
						:color="formData.color"
						@click="handleCreateQuestion"
					>
						Thêm câu hỏi
					</v-btn>
				</div>
			</v-col>
			<v-col cols="12" sm="12" md="3" minHeight="100%">
				<v-card rounded="lg" elevation="0" border minHeight="100%">
					<v-card-title class="text-subtitle-1">
						Cài đặt biểu mẫu
					</v-card-title>

					<v-card-subtitle>Màu</v-card-subtitle>
					<v-color-picker
						hide-canvas
						hide-inputs
						show-swatches
						hide-sliders
						width="100%"
						elevation="0"
						v-model="formData.color"
						@update:modelValue="
							updateForm({ color: formData.color })
						"
					></v-color-picker>
				</v-card>
			</v-col>
		</v-row>
	</v-container>

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
		return { formData: null, questions: [], parent };
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
	},
	mounted() {
		Promise.all([this.fetchFormData(), this.fetchQuestions()]).then(() => {
			autoAnimate(this.$refs.parent);
		});
	},
};
</script>
