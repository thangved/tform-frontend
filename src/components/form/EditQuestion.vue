<template>
	<v-card
		class="mt-4 wrapper"
		:border="!editing"
		:style="{
			background: '#fff',
		}"
		:hover="!editing"
		v-auto-animate
	>
		<v-card-text class="text-body-1" v-if="drag">
			<div v-html="localForm.content"></div>
		</v-card-text>

		<div v-else>
			<div class="text-center mt-n1 dragger">
				<v-icon icon="mdi-drag-horizontal"></v-icon>
			</div>
			<v-card-text>
				<v-row
					@click="
						(event) => {
							event.stopPropagation();
							this.editing = true;
						}
					"
					v-auto-animate
				>
					<v-col cols="12" md="8" v-auto-animate>
						<div v-if="editing">
							<quill-editor
								content-type="html"
								v-model:content="localForm.content"
								placeholder="Nội dung câu hỏi"
								toolbar="minimal"
							></quill-editor>
						</div>

						<v-card-text v-else class="text-body-1">
							<div
								style="display: inline-block"
								v-html="question.content || 'Nội dung câu hỏi'"
							></div>
							<span
								class="ml-2"
								style="color: red"
								v-if="localForm.required"
								>*</span
							>
						</v-card-text>

						<v-card-subtitle v-if="!editing">{{
							questionType.label
						}}</v-card-subtitle>
					</v-col>

					<v-col
						v-if="editing"
						cols="12"
						md="4"
						class="d-flex"
						v-auto-animate
					>
						<v-spacer></v-spacer>
						<v-menu
							@click="(event) => event.stopPropagation()"
							location="center center"
						>
							<template v-slot:activator="{ props }">
								<v-btn
									:prepend-icon="questionType.icon"
									append-icon="mdi-menu-down"
									v-bind="props"
									variant="flat"
									border
									rounded="lg"
								>
									{{ questionType.label }}
								</v-btn>
							</template>

							<v-card
								width="300"
								rounded="lg"
								border
								elevation="1"
							>
								<v-list
									density="compact"
									:selected="[localForm.type]"
									@update:selected="
										(selected) =>
											(localForm.type = selected[0])
									"
								>
									<v-list-item
										v-for="questionType in questionTypes"
										:key="questionType.value"
										:prepend-icon="questionType.icon"
										:value="questionType.value"
									>
										<template v-slot:title>{{
											questionType.label
										}}</template>
									</v-list-item>
								</v-list>
							</v-card>
						</v-menu>
					</v-col>

					<v-col cols="12" v-if="showOptions" v-auto-animate>
						<v-divider></v-divider>
						<v-text-field
							:variant="editing ? 'underlined' : 'plain'"
							:color="formData.color"
							placeholder="Nhập tùy chọn"
							v-for="(option, index) in localForm.options"
							:key="index"
							v-model="localForm.options[index]"
							hide-details
							:autofocus="editing"
							:readonly="!editing"
							@focus="(event) => event.target.select()"
							@keyup.enter="addOption"
							class="ml-2 mr-2"
						>
							<template
								v-if="questionType.value === 'select'"
								v-slot:prepend
							>
								<span class="mt-2"> {{ index + 1 }}. </span>
							</template>

							<template v-else v-slot:prepend>
								<span class="mt-2">
									<v-icon
										:icon="questionType.optionIcon"
									></v-icon>
								</span>
							</template>

							<template v-slot:append v-if="editing">
								<v-icon
									class="mt-2"
									icon="mdi-close"
									@click="removeOption(index)"
								></v-icon>
							</template>
						</v-text-field>

						<v-text-field
							v-if="editing"
							variant="plain"
							:color="formData.color"
							placeholder="Thêm tùy chọn"
							hide-details
							@click="addOption"
							style="width: 200px"
							readonly
							class="ml-2 mr-2"
						>
							<template
								v-if="questionType.value === 'select'"
								v-slot:prepend
							>
								<span class="mt-2">
									{{ localForm.options.length + 1 }}.
								</span>
							</template>

							<template v-else v-slot:prepend>
								<span class="mt-2">
									<v-icon
										:icon="questionType.optionIcon"
									></v-icon>
								</span>
							</template>
						</v-text-field>
					</v-col>

					<v-col
						cols="12"
						v-if="localForm.type === 'file' && editing"
					>
						<v-switch
							hide-details
							label="Chỉ cho phép loại file cụ thể"
							:color="formData.color"
							inset
							class="ml-2"
							v-model="localForm.onlyAccept"
						></v-switch>

						<v-row v-if="localForm.onlyAccept" class="mt-2">
							<v-col
								v-for="accept in fileAccepts"
								:key="accept.value"
								cols="6"
								class="pb-0 pt-0"
							>
								<v-checkbox
									hide-details
									:label="accept.name"
									:value="accept.value"
									:color="formData.color"
									v-model="localForm.accepts"
									density="compact"
								></v-checkbox>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-card-text>

			<v-divider v-if="editing"></v-divider>

			<v-card-actions
				v-if="editing"
				@click="
					(event) => {
						event.stopPropagation();
						this.editing = true;
					}
				"
			>
				<v-spacer> </v-spacer>

				<v-btn icon="mdi-content-copy" @click="handleCopy"></v-btn>

				<v-menu location="center center">
					<template v-slot:activator="{ props }">
						<v-btn
							icon="mdi-trash-can-outline"
							v-bind="props"
						></v-btn>
					</template>

					<v-card elevation="1" width="300" border variant="flat">
						<v-list density="compact">
							<v-list-item
								prepend-icon="mdi-trash-can-outline"
								title="Xác nhận xóa"
								subtitle="Nhấn ra ngoài để hủy"
								@click="handleDelete"
							></v-list-item>
						</v-list>
					</v-card>
				</v-menu>

				<v-divider class="ml-4" vertical></v-divider>

				<div class="pl-4 pr-4">
					<v-switch
						flat
						:color="formData.color"
						label="Bắt buộc"
						inline
						inset
						hide-details
						:model-value="localForm.required"
						@update:model-value="(v) => (localForm.required = v)"
					></v-switch>
				</div>
			</v-card-actions>
		</div>
	</v-card>
</template>

<script>
import questionTypes from "@/mock/question-types";
import fileAccepts from "@/mock/file-accepts";

export default {
	props: ["question", "formData", "drag"],
	data() {
		return {
			localForm: { ...this.question },
			questionTypes,
			editing: false,
			deleted: false,
			fileAccepts,
		};
	},
	emits: ["update:question", "delete:question", "copy:question"],
	methods: {
		handleUpdate() {
			if (!this.editing || this.deleted) return;

			this.$emit("update:question", this.localForm);
			this.editing = false;
		},
		addOption() {
			this.localForm.options.push(
				`Tùy chọn ${this.localForm.options.length + 1}`,
			);
		},
		removeOption(index) {
			this.localForm.options = this.localForm.options.filter(
				(e, i) => index !== i,
			);
		},
		handleDelete() {
			this.$emit("delete:question");
			this.deleted = true;
		},
		handleCopy() {
			delete this.localForm._id;
			this.$emit("copy:question", this.localForm);
		},
	},
	mounted() {
		window.addEventListener("click", this.handleUpdate);
	},
	unmounted() {
		window.removeEventListener("click", this.handleUpdate);
	},
	computed: {
		questionType() {
			return questionTypes.find(
				(e) => e.value === (this.localForm.type || "text"),
			);
		},
		showOptions() {
			return ["radio", "checkbox", "select"].includes(
				this.questionType.value,
			);
		},
	},
};
</script>

<style>
.wrapper:hover .dragger {
	visibility: visible;
}

.dragger {
	visibility: hidden;
}
</style>
