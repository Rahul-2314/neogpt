import axios from "axios";

const apiClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}`,
	headers: { "Content-Type": "application/json" },
});

// Auto-attach token
apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// On 401 → wipe storage and redirect to /auth
apiClient.interceptors.response.use(
	(res) => res,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("authToken");
			localStorage.removeItem("user");
			if (
				!window.location.pathname.startsWith("/auth") &&
				!window.location.pathname.startsWith("/home")
			) {
				window.location.href = "/auth";
			}
		}
		return Promise.reject(error);
	},
);

export default apiClient;
