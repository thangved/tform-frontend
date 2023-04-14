<template>
	<v-container>
		<v-row>
			<v-col xs="12">
				<h2 class="text-subtitle-1">Biểu mẫu gần đây</h2>
			</v-col>
		</v-row>

		<v-row>
			<v-col
				v-for="form in forms"
				:key="form._id"
				cols="12"
				md="3"
				lg="2"
			>
				<router-link :to="`/forms/${form._id}`">
					<v-card
						variant="flat"
						:style="{
							borderBottom: `10px solid ${form.color}`,
							background: `${form.color}10`,
						}"
						border
					>
						<v-card-title class="text-subtitle-1">{{
							form.title
						}}</v-card-title>

						<v-card-subtitle class="text-subtitle-2">
							Đã cập nhật
							{{
								dayjs(form.updatedAt).format(
									"HH:mm, DD MM, YYYY"
								)
							}}
						</v-card-subtitle>

						<v-card-actions> </v-card-actions>
					</v-card>
				</router-link>
			</v-col>
		</v-row>
	</v-container>

	<div style="position: fixed; bottom: 0; right: 0; padding: 20px">
		<v-btn
			icon="mdi-plus"
			size="x-large"
			rounded="xl"
			variant="flat"
			color="blue"
			:loading="loading"
			@click="handleCreate"
		></v-btn>
	</div>
</template>

<script>
import dayjs from "dayjs";
import FormService from "@/services/form.service";
import useUserStore from "@/stores/user";

export default {
	data() {
		const userStore = useUserStore();
		return {
			forms: [],
			userStore,
			loading: false,
			dayjs,
		};
	},
	methods: {
		async getAllForms() {
			try {
				this.forms = await FormService.getAll();
			} catch (error) {
				console.log(error);
			}
		},
		async handleCreate() {
			this.loading = true;
			try {
				const res = await FormService.create({});

				this.$router.push(`/forms/${res._id}`);
			} catch (error) {
				alert(error);
			} finally {
				this.loading = false;
			}
		},
	},
	mounted() {
		this.getAllForms();
	},
	computed: {
		currentUser() {
			return this.userStore.currentUser;
		},
	},
};
</script>
