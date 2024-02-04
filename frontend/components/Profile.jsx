import React from "react";

const Profile = ({ principal }) => {
  return (
    <div>
      <h2>User Profile</h2>
      {principal && (
        <div>
          <p>Principal : {principal.toString()}</p>
          {/* Display additional identity information if needed */}
        </div>
      )}
    </div>
  );
};

export default Profile;
