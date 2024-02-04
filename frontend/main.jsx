import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { AuthClient } from "@dfinity/auth-client";
import App from "./App";
import "./assets/index.css"


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
      // If not authenticated
      setAuthenticated(false);
    }
  }, []);
  
  return (
    <div>
      {!authenticated ? (
        <div className="authentication-container">
          <p>Not authenticated. Please Log in/Sign Up.</p>
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
ReactDOM.render(<Main />, document.getElementById("root"));
