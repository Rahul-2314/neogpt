import axios from "axios";

const apiClient = axios.create({
	// baseURL: "http://localhost:5000",
	baseURL: "https://neogpt-3jcf.onrender.com",
	headers: {
		"Content-Type": "application/json",
	},
});

export default apiClient;
