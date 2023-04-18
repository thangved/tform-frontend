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

			<v-form ref="form" v-model="valid" @submit.prevent="submit">
				<res-question
					v-for="(question, index) in context.questions"
					v-model="response[index]"
					:question="question"
					:formDetails="context.formDetails"
					:key="question._id"
				></res-question>
				<v-btn
					class="mt-4 pl-6 pr-6"
					variant="flat"
					:color="context.formDetails.color"
					type="submit"
				>
					Gửi
				</v-btn>
				<res-footer></res-footer>
			</v-form>
		</v-container>
	</div>
	<v-progress-linear v-else color="primary" indeterminate></v-progress-linear>

	<div
		v-if="currentUser?._id === context?.formDetails.userId"
		style="
			position: fixed;
			bottom: 0;
			right: 0;
			padding-right: 20px;
			padding-bottom: 20px;
		"
	>
		<v-btn
			icon="mdi-pencil"
			rounded="xl"
			size="x-large"
			@click="$router.push(`/forms/${$route.params.id}`)"
		></v-btn>
	</div>
</template>
<script>
import ResponseService from "@/services/response-form.service";
import ResponseForm from "@/services/response-form.service";
import ResFooter from "@/components/res/ResFooter.vue";
import ResQuestion from "@/components/res/ResQuestion.vue";
import { ref } from "vue";
import toast from "@/utils/toast";
import useUserStore from "@/stores/user";

export default {
	components: { ResFooter, ResQuestion },
	data() {
		const form = ref();
		return {
			context: null,
			response: null,
			valid: true,
			form,
		};
	},
	mounted() {
		ResponseForm.getContext(this.$route.params.id)
			.then((res) => {
				this.context = res;
				const _response = [];
				for (const question of this.context.questions) {
					_response.push({
						questionId: question._id,
						content: "",
						options: [],
					});
				}
				this.response = _response;
			})
			.catch((error) => {
				if (error.status === 401) {
					return this.$router.push(
						`/login?next=${this.$route.fullPath}`
					);
				}

				toast.error(error.message);

				this.$router.push("/");
			});
	},
	methods: {
		async submit() {
			await this.$refs.form.validate();
			if (!this.valid) return;
			const payload = {
				formId: this.context.formDetails._id,
				response: this.response,
			};

			try {
				await ResponseService.create(payload);
				this.$router.push(`${this.$route.path}/success`);
			} catch (error) {
				toast.error(error.message);
			}
		},
	},
	updated() {
		this.$refs.form?.reset();
	},
	computed: {
		currentUser() {
			const userStore = useUserStore();

			return userStore.currentUser;
		},
	},
};
</script>
