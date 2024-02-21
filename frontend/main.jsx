import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { AuthClient } from "@dfinity/auth-client";
import App from "./App";
import "./assets/index.css"
import { createRoot } from 'react-dom/client';

function Main() {
	const [authenticated, setAuthenticated] = useState(false);
	const [principal, setPrincipal] = useState(null);

	const handleAuthentication = async () => {
		const authClient = await AuthClient.create();

		try {
			await authClient.login({
				identityProvider: "https://identity.ic0.app/#authorize",
				onSuccess: async () => {
					const identity = await authClient.getIdentity();
					setPrincipal(identity.getPrincipal());
					setAuthenticated(true);

					// Store authentication state in localStorage
					localStorage.setItem("authenticated", "true");
					localStorage.setItem("principal", identity.getPrincipal().toString());
				},
			});
		} catch (error) {
			console.error("Authentication error:", error);
		}
	};

	useEffect(() => {
		// Check localStorage for previous authentication state
		const storedAuthenticated = localStorage.getItem("authenticated") === "true";
		const storedPrincipal = localStorage.getItem("principal");

		if (storedAuthenticated && storedPrincipal) {
			setAuthenticated(true);
			setPrincipal(storedPrincipal);
		} else {
			setAuthenticated(false);
		}
	}, []);

	return (
		<div>
			{!authenticated ? (
				<div className="authentication-container">
					<h1>Not authenticated. Please Log in/Sign Up.</h1>
					<button className="auth-button" onClick={handleAuthentication}>
						Continue with Internet identity
					</button>
				</div>
			) : (
				<React.StrictMode>
					<App authenticated={authenticated} principal={principal} />
				</React.StrictMode>
			)}
		</div>
	);
}

// Render the Main component to the root element
const root = document.getElementById('root');
const rootElement = createRoot(root);
rootElement.render(<Main />);