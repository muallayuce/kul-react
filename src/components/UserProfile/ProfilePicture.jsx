import React, { useState } from 'react';
import './UserProfile.css';

const ProfilePicture = ({ profilePicture }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPicture, setNewPicture] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewPicture('');
  };

  const handleSave = () => {
    // Logic to save new profile picture (e.g., send to server)
    console.log('New profile picture:', newPicture);
    setIsEditing(false);
    setNewPicture('');
  };

  return (
    <div className="profile-picture">
      {isEditing ? (
        <div>
          <input
            type="file"
            accept="userimages/*"
            onChange={(e) => setNewPicture(e.target.files[0])}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <img src={profilePicture} alt="Profile" />
          <button className="change-picture" onClick={handleEditClick}>
            Change Picture
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
