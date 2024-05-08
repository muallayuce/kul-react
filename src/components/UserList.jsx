import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [addedFriendId, setAddedFriendId] = useState(null); // State to store the ID of the added friend
  const [friends, setFriends] = useState([]);
  const userId = localStorage.getItem("user_id");


 const areFriends = (user, friends) => {
  console.log('User ID:', user.id);
  console.log('Friends:', friends);
  
  // Check if the friends array is not empty
  if (friends.length > 0) {
    // Assuming the structure of each friend object is { id: friendId, friendship_id: friendshipId }
    // Check if any friend's ID matches the user's ID
    return friends.some(friend => friend.id === user.id);
  } else {
    // If the friends array is empty, return false
    return false;
  }
};

  
  
  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    const loggedInUserIdFromLocalStorage = localStorage.getItem('user_id');
    console.log('loggedInUserIdFromLocalStorage:', loggedInUserIdFromLocalStorage); // Add this line
    const loggedInUsernameFromLocalStorage = localStorage.getItem('username');
    if (loggedInUserIdFromLocalStorage) {
      setLoggedInUserId(parseInt(loggedInUserIdFromLocalStorage));
      setLoggedInUsername(loggedInUsernameFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      fetch(`http://localhost:8000/friendshiprequests?user_id=${loggedInUserId}`)
        .then(response => response.json())
        .then(data => setFriendRequests(data))
        .catch(error => console.error('Error fetching friend requests:', error));
    }
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}/friends`);
        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }
        const data = await response.json();
        const friendPromises = data.map(async (f) => {
          const friendResponse = await fetch(`http://localhost:8000/users/${f.friend_id}`);
          if (!friendResponse.ok) {
            throw new Error(`Failed to fetch friend ${f.friend_id}`);
          }
          const friendData = await friendResponse.json();
          return { ...friendData, friendship_id: f.id };
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user => {
    return user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !friendRequests.some(request => request.sender_id === user.id);
  });

  const addFriend = async (userId) => {
    try {
      if (!loggedInUserId || !loggedInUsername) {
        throw new Error('User is not logged in');
      }

      const response = await fetch(`http://localhost:8000/friendships?from_user_id=${loggedInUserId}&to_user_id=${userId}&sender_username=${loggedInUsername}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      setAddedFriendId(userId); // Store the ID of the added friend

      // Refresh the friend requests after sending the request
      fetch(`http://localhost:8000/friendshiprequests?user_id=${loggedInUserId}`)
        .then(response => response.json())
        .then(data => setFriendRequests(data))
        .catch(error => console.error('Error fetching friend requests:', error));

      console.log(`Friend request sent to user with ID ${userId}.`);
    } catch (error) {
      console.error('Error sending friend request:', error.message);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/friendships/${requestId}?status=accept`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Refresh the friend requests after accepting the request
      fetch(`http://localhost:8000/friendshiprequests?user_id=${loggedInUserId}`)
        .then(response => response.json())
        .then(data => setFriendRequests(data))
        .catch(error => console.error('Error fetching friend requests:', error));

      console.log(`Friend request with ID ${requestId} accepted.`);
    } catch (error) {
      console.error('Error accepting friend request:', error.message);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/friendships/${requestId}?status=reject`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to reject friend request');
      }

      // Refresh the friend requests after rejecting the request
      fetch(`http://localhost:8000/friendshiprequests?user_id=${loggedInUserId}`)
        .then(response => response.json())
        .then(data => setFriendRequests(data))
        .catch(error => console.error('Error fetching friend requests:', error));

      console.log(`Friend request with ID ${requestId} rejected.`);
    } catch (error) {
      console.error('Error rejecting friend request:', error.message);
    }
  };

  return (
    <>
    <div className="search-container">
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
          className="search-input" 
        />
      </div>
    <div className="user-list-container">
      <div className='friend-request-container'>
      {friendRequests.map(request => (
            <li key={request.id} className="friend-request">
              <h2>Friend Requests</h2>
              <p>{request.sender_username} sent you a friend request.</p>
              <button className="accept-request-button" onClick={() => acceptRequest(request.id)}><i class="bi bi-check2"></i></button>
              <button className="reject-request-button" onClick={() => rejectRequest(request.id)}><i class="bi bi-x-lg"></i></button>
            </li>
          ))}
      </div>
      <div className="user-list-flex-container"> {/* Add a container with flexbox style */}
          {filteredUsers.map(user => (
            <li key={user.id} className="user-card">
                {user.images && user.images.map(image => (
                  <img key={image.id} className="user-image-userlist" src={`http://localhost:8000/users/${user.id}/userimage`} alt="User Image" />
                ))}
                <h3 className="username">{user.username}</h3>
              <p className="email">Email: {user.email}</p>
             {/*  <h4 className="posts-header">Posts:</h4>
              <ul className="posts-list">
                {user.posts.map((post, index) => (
                  <li key={index} className="post">{post.content}</li>
                ))}
              </ul> */}
              {loggedInUserId !== user.id && !areFriends(user, friends) && (
                    <button className="add-friend-button" onClick={() => addFriend(user.id)}>
                    <i className="bi bi-person-add" id='person-add'></i>
                    </button>
              )}
                {addedFriendId === user.id && <p>Friend added!</p>}
            </li>
          ))}
      </div>
    </div>
    </>
  );
};

export default UserList;
