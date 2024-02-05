import React from "react";
import Profile from "./components/Profile";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import './assets/app.css'

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
      <FileList user={principal}></FileList>
      <button className="logout-button" onClick={handleLogout} >Logout</button>
    </div>
  );
};

export default App;
