import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './UserList.css'; // Import CSS file for styling

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the list of users based on the search query
  const filteredUsers = users.filter(user => {
    return user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
