import React, { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import Profile from "./components/Profile"; // Import the UserProfile component
import FileUpload from "./components/FileUpload";

const App = ({ authenticated, principal }) => {

  const handleLogout = () => {
    // Clear authentication state from localStorage
    localStorage.setItem("authenticated", "false");
    localStorage.setItem("principal", null); 
    
    window.location.reload();
  };

  return (
    <div>
      <Profile principal={principal} />
      <FileUpload user={principal}></FileUpload>
      <br />
      <br />
      <br />
      <button className="auth-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
