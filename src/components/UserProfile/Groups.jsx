import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const BASE_URL = 'http://localhost:8000';

const Groups = () => {
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(BASE_URL + '/groups/all');
      if (response.ok) {
        const groupsData = await response.json();
        console.log('Groups:', groupsData);
        setGroups(groupsData);
        // Fetch group posts for each group
        const updatedGroups = await Promise.all(
          groupsData.map(async (group) => {
            const posts = await fetchGroupPosts(group.id);
            const postsWithUsername = await Promise.all(
              posts.map(async (post) => {
                const username = await fetchUsername(post.author_id);
                return { ...post, username };
              })
            );
            return { ...group, posts: postsWithUsername };
          })
        );
        setGroups(updatedGroups);
      } else {
        throw new Error('Failed to fetch groups');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch groups');
    }
  };

  const fetchGroupPosts = async (groupId) => {
    try {
      const response = await fetch(`${BASE_URL}/group_posts/all?group_id=${groupId}`);
      if (response.ok) {
        const postData = await response.json();
        return postData;
      } else {
        throw new Error('Failed to fetch group posts');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchUsername = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        return userData.username;
      } else {
        throw new Error('Failed to fetch username');
      }
    } catch (error) {
      console.error(error);
      return 'Unknown User';
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []); // Run this effect only once, when the component mounts

  return (
    <div className="groups">
      <h2 className='groups-text'>GROUPS</h2>
      {groups.map((group, index) => (
        <div key={group.id} className="group">
          <h2>{group.name}</h2>
          <p>Description: {group.description}</p> {/* Display description */}
          <div className="group-posts">
            {group.posts && group.posts.map(post => ( // Check if group.posts exists
              <div key={post.id} className="group-post">
                <span className="post-author">{post.username}:</span>
                <span className="post-content">{post.content}</span>
              </div>
            ))}
          </div>
          {index !== groups.length - 1 && (
            <div className="separator-container">
              <div className="group-separator">★ ★ ★</div>
            </div>
          )} {/* Separator */}
        </div>
      ))}
    </div>
  );
};

export default Groups;
