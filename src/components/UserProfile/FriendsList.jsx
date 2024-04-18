import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const FriendsList = ({ friends }) => {
console.log("e1", friends)
  return (
    <div className="friends-list">
      <h2>Friends</h2>
      {friends.map((friend)=> (
        <div style={{
          color:"black",
          display: "flex",
          gap: "3rem"
        }} 
        className="friend" key={friend.id}>
          <p>{friend.username}</p>
          <p>{friend.email}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
