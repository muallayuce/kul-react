import React, { useState, useEffect } from 'react';
import Timeline from './Timeline';
import FriendsList from './FriendsList';
import EditProfileModal from './EditProfileModal';
import Groups from './Groups';
import './UserProfile.css';
import UserInfo from './UserInfo';


const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem("user_id");
  const [friends, setFriends] = useState([]);
  console.log("t",friends)

  useEffect(() => {

    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}/friends`);
        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }
        const data = await response.json();
        const friendPromises = data.map(async (f) => {
          const response = await fetch(`http://localhost:8000/users/${f.friend_id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch friend ${f.friend_id}`);
          }
          return response.json();
        });
        const friendsData = await Promise.all(friendPromises);
        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends:', error.message);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedUser) => {
    // Logic to save updated user data
    console.log('Updated user:', updatedUser);
    setIsEditing(false);
    // Assume there's a function to update user data in the parent component
    // updateUser(updatedUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Dummy group data
  const dummyGroupData = [
    { id: 1, name: "Photography", posts: [{ id: 1, content: "Does anyone want to go on a photo shoot?" }, { id: 2, content: "Hi everyone!!" }] },
    { id: 2, name: "Museum", posts: [{ id: 1, content: "Hi everyone!!" }, { id: 2, content: "Does anyone wanna go to a museum?" }] },
    { id: 3, name: "Music", posts: [{ id: 1, content: "Any musiclover?" }, { id: 2, content: "Hi everyone!!" }] },
    { id: 4, name: "Books", posts: [{ id: 1, content: "Hi everyone!!" }, { id: 2, content: "Book suggestion?" }] }
  ];

  return (
    <div className="user-profile">
      <div className="profile-body">
        <div className="left-column">
             { /* <button className='edit-profile' onClick={handleEdit}>Edit Profile</button> */}
              <UserInfo user={user} /> {/* Render UserInfo component here */}
              {friends.length > 0 && <FriendsList friends={friends}/>}
        </div>
        <div className="middle-column">
        <Timeline/>
        </div>
        <div className="right-column">
          <Groups groups={dummyGroupData} />
        </div>
      </div>
      {/* Edit Profile Modal */}
      {isEditing && (
        <EditProfileModal
          user={user}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UserProfile;
