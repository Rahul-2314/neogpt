import apiClient from "./apiClient";

export const loginUser = async (username, password) => {
	try {
		const res = await apiClient.post("/user/login", { username, password });
		return res.data.token;
	} catch (err) {
		throw new Error(err.response?.data?.msg || err.message || "Login failed");
	}
};

export const registerUser = async (fullname, username, password) => {
	try {
		const res = await apiClient.post("/user/register", {
			fullname,
			username,
			password,
		});
		return res.data.token;
	} catch (err) {
		throw new Error(
			err.response?.data?.msg || "Registration failed. Please try again.",
		);
	}
};

export const findUser = async (username) => {
	try {
		const res = await apiClient.get("/user/find", { params: { username } });
		return res.data;
	} catch (err) {
		throw new Error(err.response?.data?.msg || "Error finding user");
	}
};

export const getUser = async () => {
	if (!localStorage.getItem("authToken")) throw new Error("No token found.");
	try {
		const res = await apiClient.get("/user/user");
		return res.data;
	} catch (err) {
		throw new Error(err.response?.data?.msg || "Error fetching user data");
	}
};

export const updateUserLanguage = async (language) => {
	if (!localStorage.getItem("authToken")) throw new Error("No token found");
	const res = await apiClient.patch("/user/language", { language });
	return res.data;
};

export const getChatHistory = async () => {
	const res = await apiClient.get("/chat/history");
	return res.data;
};

export const getChatByThreadId = async (threadId) => {
	const res = await apiClient.get(`/chat/${threadId}`);
	return res.data;
};
