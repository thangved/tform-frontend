<template>
	<v-container style="height: 100%; overflow: auto" v-auto-animate>
		<v-row>
			<v-col xs="12">
				<v-toolbar color="#fff">
					<v-toolbar-title> Biểu mẫu gần đây </v-toolbar-title>

					<v-toolbar-items>
						<v-btn :icon="layoutIcon" @click="changeLayout"></v-btn>
					</v-toolbar-items>
				</v-toolbar>
			</v-col>
		</v-row>

		<v-list v-if="layout === 'list'">
			<v-list-item v-for="form in forms" :key="form._id">
				<template v-slot:prepend>
					<v-avatar :image="logo" rounded="0" size="small"></v-avatar>
				</template>

				<router-link :to="`/forms/${form._id}`">
					<v-list-item-title>
						{{ extractContent(form.title) }}
					</v-list-item-title>

					<v-list-item-subtitle>
						Đã mở
						{{ dayjs(form.updatedAt).format("HH:mm, DD MM, YYYY") }}
					</v-list-item-subtitle>
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

						<v-card width="300" rounded="lg" border elevation="1">
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
			</v-list-item>
		</v-list>

		<v-row v-else v-auto-animate>
			<v-col
				v-for="form in forms"
				:key="form._id"
				cols="12"
				md="4"
				lg="3"
			>
				<v-card
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
					</router-link>

					<v-card-actions>
						<v-spacer>
							<v-list-item class="flex-1">
								<template v-slot:prepend>
									<v-avatar
										:image="logo"
										rounded="0"
										size="small"
									></v-avatar>
								</template>
								<router-link :to="`/forms/${form._id}`">
									<v-list-item-title>
										{{ extractContent(form.title) }}
									</v-list-item-title>
									<v-list-item-subtitle>
										Đã mở
										{{
											dayjs(form.updatedAt).format(
												"HH:mm, DD MM, YYYY"
											)
										}}
									</v-list-item-subtitle>
								</router-link>
							</v-list-item>
						</v-spacer>
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
					</v-card-actions>
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
import toast from "@/utils/toast";
import extractContent from "@/utils/extractContent";

export default {
	data() {
		const userStore = useUserStore();
		return {
			forms: [],
			userStore,
			loading: false,
			dayjs,
			logo,
			layout: "grid",
			extractContent,
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
				toast.error(error.message);
			} finally {
				this.loading = false;
			}
		},
		async deleteForm(id) {
			this.loading = true;
			try {
				await FormService.deleteById(id);
			} catch (error) {
				toast.error(error.message);
			} finally {
				this.getAllForms();
				this.loading = false;
			}
		},
		changeLayout() {
			const layouts = {
				grid: "list",
				list: "grid",
			};

			this.layout = layouts[this.layout];
		},
	},
	mounted() {
		this.getAllForms();
	},
	computed: {
		currentUser() {
			return this.userStore.currentUser;
		},
		layoutIcon() {
			return this.layout === "grid"
				? "mdi-view-list-outline"
				: "mdi-view-grid-outline";
		},
	},
};
</script>
