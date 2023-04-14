import client from "@/utils/client";

class FormService {
	static create(payload) {
		return client.post("forms", payload);
	}

	static getAll() {
		return client.get("forms");
	}

	static getById(id) {
		return client.get(`forms/${id}`);
	}

	static updateById(id, payload) {
		return client.put(`forms/${id}`, payload);
	}

	static deleteById(id) {
		return client.delete(`forms/${id}`);
	}
}

export default FormService;
