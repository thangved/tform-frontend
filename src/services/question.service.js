import client from "@/utils/client";

class QuestionService {
	static create(payload) {
		return client.post("questions", payload);
	}

	static getAll(formId) {
		return client.get("questions", { params: { formId } });
	}
}

export default QuestionService;
