<template>
	<v-container style="height: 100%; overflow: auto">
		<v-row>
			<v-col xs="12">
				<h2 class="text-subtitle-1">Biểu mẫu gần đây</h2>
			</v-col>
		</v-row>

		<v-row v-auto-animate>
			<v-col
				v-for="form in forms"
				:key="form._id"
				cols="12"
				md="4"
				lg="3"
			>
				<v-card
					:title="form.title"
					variant="flat"
					:style="{
						borderBottom: `10px solid ${form.color}`,
						background: `${form.color}10`,
					}"
					border
				>
					<router-link :to="`/forms/${form._id}`">
						<v-card-text class="text-subtitle-1">
							<div v-html="form.description?.slice(0, 400)"></div>
						</v-card-text>

						<v-card-subtitle class="text-subtitle-2 pb-2">
							<v-avatar
								:image="logo"
								rounded="0"
								size="small"
							></v-avatar>
							Đã mở
							{{
								dayjs(form.updatedAt).format(
									"HH:mm, DD MM, YYYY"
								)
							}}
						</v-card-subtitle>
					</router-link>

					<template v-slot:append>
						<v-menu
							@click="(event) => event.stopPropagation()"
							location="bottom center"
						>
							<template v-slot:activator="{ props }">
								<v-btn
									variant="flat"
									icon="mdi-dots-vertical"
									v-bind="props"
								></v-btn>
							</template>

							<v-card
								width="300"
								rounded="lg"
								border
								elevation="1"
							>
								<v-list>
									<v-list-item
										prepend-icon="mdi-trash-can-outline"
										@click="deleteForm(form._id)"
									>
										Xóa
									</v-list-item>
								</v-list>
							</v-card>
						</v-menu>
					</template>
				</v-card>
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
import FormService from "@/services/form.service";
import useUserStore from "@/stores/user";
import dayjs from "dayjs";
import logo from "@/assets/images/logo.png";

export default {
	data() {
		const userStore = useUserStore();
		return {
			forms: [],
			userStore,
			loading: false,
			dayjs,
			logo,
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
				alert(error.message);
			} finally {
				this.loading = false;
			}
		},
		async deleteForm(id) {
			this.loading = true;
			try {
				await FormService.deleteById(id);
			} catch (error) {
				alert(error.message);
			} finally {
				this.getAllForms();
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
