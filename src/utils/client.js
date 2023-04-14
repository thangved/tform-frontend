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
		throw error.response?.data.message || error.toString();
	}
);

export default client;
