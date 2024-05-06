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
  const { userId } = useParams();

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
    <div className="user-list-container">
      <h1>User List</h1>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
          className="search-input" 
        />
      </div>
      <ul className="user-list">
        {friendRequests.map(request => (
          <li key={request.id} className="friend-request">
            <p>{request.sender_username} sent you a friend request.</p>
            <button className="accept-request-button" onClick={() => acceptRequest(request.id)}>Accept</button>
            <button className="reject-request-button" onClick={() => rejectRequest(request.id)}>Reject</button>
          </li>
        ))}
        {filteredUsers.map(user => (
          <li key={user.id} className="user-card">
            <Link to={`/profile/${user.id}`} className="user-link">
              {user.images && user.images.map(image => (
                <img key={image.id} className="user-image" src={`http://localhost:8000/users/${user.id}/userimage`} alt="User Image" />
              ))}
              <h3 className="username">{user.username}</h3>
            </Link>
            <p className="email">Email: {user.email}</p>
            <h4 className="posts-header">Posts:</h4>
            <ul className="posts-list">
              {user.posts.map((post, index) => (
                <li key={index} className="post">{post.content}</li>
              ))}
            </ul>
            <hr className="divider" />
            {loggedInUserId !== user.id && (
              <>
                {!friendRequests.some(request => request.sender_id === user.id) && ( // Check if there's no friend request pending
                  <button className="add-friend-button" onClick={() => addFriend(user.id)}>Add Friend</button>
                )}
                {addedFriendId === user.id && <p>Friend added!</p>} {/* Display "Friend added!" only for the added friend */}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
