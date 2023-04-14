import client from "@/utils/client";

class AuthService {
	static login(payload) {
		return client.post("auth", payload);
	}

	static auth() {
		return client.get("auth");
	}
}

export default AuthService;
