import axios from "axios";
import Token from "./token";

const client = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
});

client.interceptors.request.use((req) => {
	req.headers.Authorization = `Bearer ${Token.token}`;

	return req;
});

client.interceptors.response.use(
	(res) => {
		return res.data;
	},
	(error) => {
		throw {
			message: error.response?.data.message || error.toString(),
			status: error.response?.status,
		};
	}
);

export default client;
