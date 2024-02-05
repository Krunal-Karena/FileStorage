import React from "react";
import '../assets/profile.css';

const Profile = ({ principal }) => {
  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {principal && (
        <div>
          <p>
            <strong>Principal Id :</strong> {principal.toString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
