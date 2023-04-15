import client from "@/utils/client";

class ResponseService {
	static getContext(formId) {
		return client.get("res/context", { params: { formId } });
	}
}

export default ResponseService;
