import axios, { isAxiosError } from "axios";
import { useAuthStore } from '../store/auth';

const apiClient = axios.create({
	baseURL: String(import.meta.env["VITE_API_BASE_URL"]),
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) config.headers.Authorization = `${token}`;
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error: unknown) => {
		if (isAxiosError(error)) {
			console.error(`API error ${error.name}: ${error.message}`);
			if (error.response?.status === 401 || error.response?.data.errorMessage === 'Authorization header not provided') {
				const { clearToken } = useAuthStore.getState();
				clearToken();
				window.location.href = '/login';
			}
			return Promise.reject(error);
		}
		return;
	}
);

export default apiClient;