import React, { useState, useEffect } from 'react';
import Post from '../Post'; // Import the Post component
import { BASE_URL } from '../../App';
import './UserProfile.css';

const fetchUserPosts = (userId, token, setUserPosts) => {
    fetch(`${BASE_URL}/users/${userId}/posts`, {
    headers: {
      'Authorization': `Bearer ${token}` // Include the JWT token in the Authorization header
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      return response.json();
    })
    .then(data => {
      setUserPosts(data);
    })
    .catch(error => {
      console.error(error);
    });
};

const UserPosts = ({ userId, token }) => { // Pass token as a prop
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (userId && token) { // Check if both userId and token are provided
      fetchUserPosts(userId, token, setUserPosts);
    }
  }, [userId, token]); // Include token in the dependency array

  return (
    <div className="user-posts">
      {userPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserPosts;
