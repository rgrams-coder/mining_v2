import React from 'react';

function Profile() {
  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-content">
        <p>This is your user profile page. Here you can view and update your account information.</p>
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john.doe@example.com</p>
            <p><strong>Member Since:</strong> January 2023</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn btn-primary">Edit Profile</button>
          <button className="btn btn-secondary">Change Password</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;