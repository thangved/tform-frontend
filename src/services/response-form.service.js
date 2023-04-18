import client from "@/utils/client";

class ResponseService {
	static getContext(formId) {
		return client.get("res/context", { params: { formId } });
	}

	static create(payload) {
		return client.post("res", payload);
	}

	static getAll(formId) {
		return client.get("res", { params: { formId } });
	}

	static deleteById(id) {
		return client.delete(`res/${id}`);
	}

	static deleteAll(formId) {
		return client.delete("forms", {
			params: { formId },
		});
	}
}

export default ResponseService;
