import client from "@/utils/client";

class QuestionService {
	static create(payload) {
		return client.post("questions", payload);
	}

	static getAll(formId) {
		return client.get("questions", { params: { formId } });
	}

	static updateById(id, payload) {
		return client.put(`questions/${id}`, payload);
	}

	static deleteById(id) {
		return client.delete(`questions/${id}`);
	}
}

export default QuestionService;
