import React, { useState } from 'react';
import './UserProfile.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FriendsList = ({ friends }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showFriends, setShowFriends] = useState(true); // Set initial state to true

  const handleClick = (friendId) => {
    setSelectedFriend(selectedFriend === friendId ? null : friendId);
  };

  const handleClose = () => {
    setSelectedFriend(null);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="friends-list">
      <i className="bi bi-umbrella-fill" style={{ color: "purple" }}></i>
      <h2>Friends</h2> {/* Removed onClick from Friends heading */}
      {showFriends && (
        <>
          {friends.map((friend) => (
            <div className="friend" key={friend.id}>
              <div className="friend-info" onClick={() => handleClick(friend.id)}>
                <i className="bi bi-flower3" style={{ color: "purple" }}></i>
                <p>{friend.username}</p>
              </div>
              {selectedFriend === friend.id && (
                <div className="email-modal" onClick={handleModalClick}>
                  <p>{friend.username}'s Email: {friend.email}</p>
                  <button onClick={handleClose}>Close</button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FriendsList;
