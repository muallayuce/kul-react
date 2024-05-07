import React, { useState, useContext } from 'react';
import './UserProfile.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { UserContext } from '../../context/UserContext';

const FriendsList = ({ friends, onUnfriend }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showFriends, setShowFriends] = useState(true); // Set initial state to true


  console.log("Friends:", friends);

  const handleClick = (friendId) => {
    setSelectedFriend(selectedFriend === friendId ? null : friendId);
  };

  const handleClose = () => {
    setSelectedFriend(null);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleUnfriendClick = (friendship_id) => {
    console.log("friendship_id:", friendship_id);
    
    if (window.confirm('Are you sure you want to unfriend this user?')) {
      // Pass the token directly instead of authTokenType and authToken
      onUnfriend(friendship_id);
    }
  };

  return (
    <div className="friends-list">
      <hr />
      <i className="bi bi-people-fill" style={{ color: "#724fc3", fontSize: '25px' }}></i>
      <h2 className='friends-text'>Friends</h2>
      {showFriends && (
        <>
          {friends.map((friend) => (
            <div className="friend" key={friend.id}>
              <div className="friend-info" onClick={() => handleClick(friend.id)}>
                <i className="bi bi-person" style={{ color: '#724fc3' }}> </i>
                <p className='friends-names'>{friend.username}</p>
              </div>
              {selectedFriend === friend.id && (
                <div className="email-modal" onClick={handleModalClick}>
                  <p><i className="bi bi-envelope-at" style={{ fontSize: "25px" }}></i> {friend.email}</p>
                  <button onClick={handleClose}>Close</button>
                </div>
              )}
              <button className='unfriend' onClick={() => handleUnfriendClick(friend.friendship_id)}><i className="bi bi-person-dash"></i></button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FriendsList;
