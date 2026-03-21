import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import "./App.css";

const PrivateRoute = ({ children }) => {
	const token = localStorage.getItem("authToken");
	return token ? children : <Navigate to="/auth" replace />;
};

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/home" replace />} />
				<Route path="/home" element={<LandingPage />} />
				<Route path="/auth" element={<AuthPage />} />
				<Route path="/authsign" element={<AuthPage mode="signup"/>} />
				<Route
					path="/chat"
					element={
						<PrivateRoute>
							<ChatPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/chat/:threadId"
					element={
						<PrivateRoute>
							<ChatPage />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/home" replace />} />
			</Routes>
		</Router>
	);
}

export default App;
