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
      <hr/>
      <i className="bi bi-people-fill" style={{ color: "#724fc3", fontSize: '25px' }}></i>
      <h2 className='friends-text'>Friends</h2> {/* Removed onClick from Friends heading */}
      {showFriends && (
        <>
          {friends.map((friend) => (
            <div className="friend" key={friend.id}>
              <div className="friend-info" onClick={() => handleClick(friend.id)}>
                <i className="bi bi-person" style={{color: '#724fc3'}}> </i>
                <p className='friends-names'>{friend.username}</p>
              </div>
              {selectedFriend === friend.id && (
                <div className="email-modal" onClick={handleModalClick}>
                  <p><i class="bi bi-envelope-at" style={{fontSize:"25px"}}></i> {friend.email}</p>
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
