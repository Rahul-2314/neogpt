import axios from "axios";

const apiClient = axios.create({
	// baseURL: "http://localhost:5000",
	baseURL: "https://neogpt-1.onrender.com",
	headers: {
		"Content-Type": "application/json",
	},
});

export default apiClient;

