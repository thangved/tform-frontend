<template>
	<div
		style="height: 100%; overflow: auto"
		v-if="context"
		:style="{
			background: `${context.formDetails.color}20`,
		}"
	>
		<v-container style="max-width: 768px">
			<v-card
				variant="flat"
				rounded="lg"
				:style="{
					borderTop: `10px solid ${context.formDetails.color}`,
				}"
			>
				<v-card-text class="text-h5" style="line-height: 1.2">
					{{ context.formDetails.title }}
				</v-card-text>

				<v-card-text>
					Câu trả lời của bạn đã được ghi lại.
				</v-card-text>

				<v-card-item>
					<router-link
						class="text-subtitle-2 d-block mb-2"
						style="color: blue; text-decoration: underline"
						:to="`/res/${$route.params.id}`"
					>
						Gửi ý kiến phản hồi khác
					</router-link>
				</v-card-item>
			</v-card>

			<res-footer></res-footer>
		</v-container>
	</div>
	<v-progress-linear v-else color="primary" indeterminate></v-progress-linear>
</template>

<script>
import ResponseService from "@/services/response-form.service";
import ResFooter from "@/components/res/ResFooter.vue";

export default {
	components: { ResFooter },
	data() {
		return {
			context: null,
		};
	},
	mounted() {
		ResponseService.getContext(this.$route.params.id)
			.catch((error) => {
				if (error.status === 401) {
					return this.$router.push(
						`/login?next=${this.$route.fullPath}`,
					);
				}

				this.$router.push("/");
			})
			.then((res) => {
				this.context = res;
			});
	},
};
</script>
