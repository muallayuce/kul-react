import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField
} from '@mui/material';
import './UserProfile.css';

const BASE_URL = 'http://localhost:8000';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem("username");
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    creator_id: userId ? parseInt(userId) : 0,
    created_at: new Date().toISOString()
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    // Filter groups based on search query
    const filtered = groups.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [groups, searchQuery]);

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroupData({ ...newGroupData, [name]: value });
  };

  const handleCreateGroup = async () => {
    if (!newGroupData.name || !newGroupData.description) {
      alert('Please provide both group name and description.');
      return;
    }
  
    try {
      const queryParams = new URLSearchParams({
        user_id: userId,
        username: username
      });
  
      const response = await fetch(`${BASE_URL}/groups/?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newGroupData.name,
          description: newGroupData.description,
          creator_id: parseInt(userId) || 0,
          created_at: new Date().toISOString()
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create group');
      }
  
      const newGroup = await response.json();
  
      // Fetch the username of the creator
      const creatorUsername = await fetchUsername(newGroup.creator_id);
  
      // Create a new member object for the creator
      const creatorMember = {
        id: newGroup.creator_id,
        username: creatorUsername
      };
  
      // Add the creator as a member of the group
      const updatedGroup = {
        ...newGroup,
        members: [creatorMember],
        creatorUsername
      };
  
      setGroups([...groups, updatedGroup]);
      setNewGroupData({
        name: '',
        description: '',
        creator_id: parseInt(userId) || 0,
        created_at: new Date().toISOString()
      });
      handleClose();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const queryParams = new URLSearchParams({
        group_id: groupId,
        user_id: userId,
        username: username
      });

      const response = await fetch(`${BASE_URL}/groups/${groupId}/join_group?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(userId)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to join group');
      }

      // Optionally, you can update the UI to reflect the user joining the group
      fetchGroups();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to join group');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent) {
      alert('Please provide post content.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/group_posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newPostContent,
          group_id: selectedGroup.id,
          author_id: parseInt(userId),
          created_at: new Date().toISOString()
        })
      });
      if (response.ok) {
        fetchGroups();
        setNewPostContent('');
        handleCloseCreatePost();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create post');
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${BASE_URL}/groups/all`);
      if (response.ok) {
        const groupsData = await response.json();
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
            const creatorUsername = await fetchUsername(group.creator_id);
            return { ...group, members, posts: postsWithUsername, creatorUsername };
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

  const isMember = (group) => {
    console.log('Group:', group); // Log the group object
    console.log('User ID:', userId); // Log the user ID
    // Check if the user is a member of the group
    const isUserMember = group.members.some(member => member.id === parseInt(userId) || member.username === username);
    console.log('Is User Member:', isUserMember); // Log the result
    return isUserMember;
  };  
  
  const handleDeleteGroupPost = async (post) => {
    try {
      // Check if the post belongs to the logged-in user before deletion
      if (post.author_id !== parseInt(userId)) {
        alert('You can only delete your own posts.');
        return;
      }
  
      console.log('Post:', post); // Add this console log
  
      // Ensure that post.id and post.group_id are not undefined
      console.log('Post ID:', post.id); // Add this console log
      console.log('Group ID:', post.group_id); // Add this console log
      console.log('User ID:', userId); // Add this console log
  
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const response = await fetch(`${BASE_URL}/group_posts/${post.id}?group_id=${post.group_id}&user_id=${userId}`, requestOptions);
      
      if (response.ok) {
        // Remove the deleted post from the UI
        const updatedGroups = groups.map(group => {
          if (group.id === selectedGroup.id) {
            const updatedPosts = group.posts.filter(p => p.id !== post.id);
            return { ...group, posts: updatedPosts };
          }
          return group;
        });
        setGroups(updatedGroups);
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete post');
    }
  };
  
  

  const toggleMemberList = (group) => {
    const updatedGroups = groups.map((grp) => {
      if (grp.id === group.id) {
        return { ...grp, showMembers: !grp.showMembers };
      }
      return grp;
    });
    setGroups(updatedGroups);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseCreatePost = () => {
    setOpenCreatePost(false);
  };

  const handleOpenCreatePost = (group) => {
    setSelectedGroup(group);
    setOpenCreatePost(true);
  };

  return (
    <>
    <div className='group-search'>
      <TextField
        type="text"
        placeholder="Search groups..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
    <div className="groups">
      <Button id='group-create-btn' variant="outlined" onClick={handleOpen}>
        Create Group
      </Button>
      <Dialog open={open} onClose={handleClose} className="modal-container">
        <DialogTitle className="modal-title">Create Group</DialogTitle>
        <TextField
          id="name"
          name="name"
          label="Group Name"
          type="text"
          value={newGroupData.name}
          onChange={handleInputChange}
          className="modal-input"
        />
        <TextField
          margin="dense"
          id="description"
          name="description"
          label="Group Description"
          type="text"
          value={newGroupData.description}
          onChange={handleInputChange}
          className="modal-input"
        />
        <DialogActions className="modal-actions">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateGroup} variant="contained" color="primary">Create</Button>
        </DialogActions>
      </Dialog>
      <h2 className="groups-text">GROUPS</h2>
      {filteredGroups.map((group, index) => (
        <div key={group.id} className="group">
          <div className='name-photos-container'>
            <h2 className='group-name'>{group.name}</h2>
            <button className='group-members' onClick={() => toggleMemberList(group)}>
              <i className="bi bi-people"></i> ({group.members.length})
            </button>
            {group.showMembers && (
              <ul>
                {group.members.map((member) => (
                  <li key={member.id}>{member.username}</li>
                ))}
              </ul>
            )}
          </div>
          <div className='grp-crt'>
            <p className='grp-user'>Created by: {group.creatorUsername}</p>
            <p>Created at: {new Date(group.created_at).toLocaleDateString()}</p>
          </div>
          <p className='group-description'>Description: {group.description}</p>
          <div className="group-add-post">
            <Button onClick={() => handleOpenCreatePost(group)}><i className="bi bi-pencil-square" id="create-group-post"></i></Button>
            {!isMember(group) && (
              <Button onClick={() => handleJoinGroup(group.id)}><i className="bi bi-person-add" id='person-join'></i></Button>
            )}
          </div>
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
      <Dialog open={openCreatePost} onClose={handleCloseCreatePost} className="modal-container">
        <DialogTitle className="modal-title">Create Post</DialogTitle>
        <TextField
          id="postContent"
          name="postContent"
          label="Post Content"
          type="text"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="modal-input"
        />
        <DialogActions className="modal-actions">
          <Button onClick={handleCloseCreatePost}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" color="primary">Post</Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
};

export default Groups;
