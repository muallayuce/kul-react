import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './UserList.css'; // Import CSS file for styling

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null); // Add state for logged-in user ID

  useEffect(() => {
    // Fetch the list of users
    fetch('http://localhost:8000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Simulate getting the logged-in user ID (replace with actual implementation)
    const loggedInUserIdFromLocalStorage = localStorage.getItem('user_id');
    if (loggedInUserIdFromLocalStorage) {
      setLoggedInUserId(parseInt(loggedInUserIdFromLocalStorage));
    }
  }, []);

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the list of users based on the search query
  const filteredUsers = users.filter(user => {
    return user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Function to handle adding a user as a friend
  const addFriend = async (userId) => {
    try {
      if (!loggedInUserId) {
        throw new Error('User is not logged in');
      }
      
      // Make an API request to add the user as a friend
      const response = await fetch(`http://localhost:8000/friendships?from_user_id=${loggedInUserId}&to_user_id=${userId}`, {
        method: 'POST',
        // Add any required headers or body parameters here
      });
  
      if (!response.ok) {
        throw new Error('Failed to add friend');
      }
  
      // Optionally, update the UI to reflect the successful addition of the user as a friend
      console.log(`User with ID ${userId} added as a friend.`);
    } catch (error) {
      console.error('Error adding friend:', error.message);
      // Optionally, display an error message to the user
    }
  };
  
  return (
    <div className="user-list-container">
      <h1>User List</h1>
      {/* Search bar */}
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
            {/* Add Friend Button */}
            <button className="add-friend-button" onClick={() => addFriend(user.id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
