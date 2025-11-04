import axios from "axios";

const apiClient = axios.create({
	// baseURL: "http://localhost:5000",
	// baseURL: "https://neogpt-1.onrender.com",
	baseURL: "https://neogpt-backend.vercel.app",
	headers: {
		"Content-Type": "application/json",
	},
});

export default apiClient;


