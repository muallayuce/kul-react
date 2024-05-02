// EditProfileModal.jsx
import React, { useState } from 'react';
import './UserProfile.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const BASE_URL = 'http://localhost:8000';

const EditProfileModal = ({ user, onSave, onCancel }) => {
  const initialUser = user || { username: '', email: '', password: '' };
  const [editedUser, setEditedUser] = useState(initialUser);
  const userId = localStorage.getItem("user_id");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      onSave(editedUser);
    } catch (error) {
      console.error('Error updating user profile:', error.message);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={editedUser.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={editedUser.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={editedUser.password} onChange={handleChange} />
          </div>
          <div className="button-group">
            <Button type="submit">Save</Button>
            <Button type="button" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
