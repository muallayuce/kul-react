import React, { useState } from 'react';
import './UserProfile.css';

const EditProfileModal = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onCancel}>&times;</span>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={editedUser.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea id="bio" name="bio" value={editedUser.bio} onChange={handleChange} />
          </div>
          {/* Add more fields for editing profile */}
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
