import React from 'react';
import './UserProfile.css';

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <div className="info-item">
        <h2>Username:</h2>
        <p>{user.username}</p>
      </div>
      <div className="info-item">
        <h2>Email:</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserInfo;
