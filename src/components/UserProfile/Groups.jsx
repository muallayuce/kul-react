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
        const updatedGroups = await Promise.all(
          groupsData.map(async (group) => {
            const members = await fetchGroupMembers(group.id);
            const posts = await fetchGroupPosts(group.id);
            const postsWithUsername = await Promise.all(
              posts.map(async (post) => {
                const username = await fetchUsername(post.author_id);
                return { ...post, username };
              })
            );
            return { ...group, members, posts: postsWithUsername };
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

  const fetchGroupMembers = async (groupId) => {
    try {
      const response = await fetch(`${BASE_URL}/groups/${groupId}/members`);
      if (response.ok) {
        const membersData = await response.json();
        return membersData;
      } else {
        throw new Error('Failed to fetch group members');
      }
    } catch (error) {
      console.error(error);
      return [];
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

  const toggleMemberList = (group) => {
    const updatedGroups = groups.map((grp) => {
      if (grp.id === group.id) {
        return { ...grp, showMembers: !grp.showMembers };
      }
      return grp;
    });
    setGroups(updatedGroups);
  };

  return (
    <div className="groups">
      <h2 className="groups-text">GROUPS</h2>
      {groups.map((group, index) => (
        <div key={group.id} className="group">
          <div className='name-photos-container'>
          <h2 className='group-name'>{group.name}</h2>
          <button className='group-members' onClick={() => toggleMemberList(group)}>
          <i class="bi bi-people"></i> ({group.members.length})
          </button>
          {group.showMembers && (
            <ul>
              {group.members.map((member) => (
                <li key={member.id}>{member.username}</li>
              ))}
            </ul>
          )}
          </div>
          <p className='group-description'>Description: {group.description}</p>
          <div className="group-posts">GROUP POSTS
            {group.posts &&
              group.posts.map((post) => (
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
          )}
        </div>
      ))}
    </div>
  );
};

export default Groups;
