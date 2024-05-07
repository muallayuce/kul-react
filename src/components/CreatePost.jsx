import React, { useState, useEffect } from 'react';
import { Tooltip } from "@mui/material";
import { BASE_URL } from '../App';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Backdrop } from '@mui/material';
import './CreatePost.css';

function CreatePost({ authToken, fetchPosts }) {
    const [newPost, setNewPost] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); 
  
    useEffect(() => {
      setError(''); 
    }, [newPost]);
  
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem('username');
  
    const handleImageChange = (e) => {
      setError('');
      const file = e.target.files[0];
      if (file) {
        setImage(file);
      } else {
        setError('Please select an image file.');
      }
    };
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setNewPost('');
      setImage(null);
      setError('');
      setLoading(false);
    };
  
    const createPost = async (e) => {
      e.preventDefault();
      try {
        if (!username || !userId || !newPost) {
          throw new Error('Username, userId, or post content is missing.');
        }
  
        setLoading(true); // Set loading state while post is being created
  
        const queryParams = new URLSearchParams({
          username: username,
          content: newPost,
          user_id: userId
        });
        const url = `${BASE_URL}/posts?${queryParams}`;
  
        const requestOptions = {
          method: 'POST',
          headers: {
            'Authorization': authToken
          }
        };
  
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();
  
        if (!response.ok) {
          throw new Error('Failed to create post');
        }
  
        const postId = responseData.id;
  
        if (image) {
          const imagesFormData = new FormData();
          imagesFormData.append('image', image);
  
          const imagesResponse = await fetch(`${BASE_URL}/posts/${postId}/images`, {
            method: 'POST',
            body: imagesFormData
          });
  
          if (!imagesResponse.ok) {
            throw new Error('Failed to add image for the post');
          }
        }
  
        fetchPosts();
        setNewPost('');
        setImage(null);
        setLoading(false);
        handleClose(); // Close the dialog after post creation
      } catch (error) {
        console.error('Error creating post:', error);
        setError('Failed to create post');
        setLoading(false);
      }
    };
  
    return (
      <>
        <Tooltip className='create-post' title='Create Post' placement="top" arrow>
          <Button onClick={handleOpen}><i className="bi bi-pencil-square" id='create-post-icon'></i></Button>
        </Tooltip>
        <Dialog open={open} onClose={handleClose} BackdropComponent={CustomBackdrop}>
          <DialogTitle id='create-post-text'>Create Post</DialogTitle>
            <textarea className="post-textarea" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
            <input className="image-input" type="file" accept="image/*" onChange={handleImageChange} />
            {loading ? <p>Loading...</p> : null}
            {error && <p className="error-message">{error}</p>}
          <div className='dialog-button'>
            <Button id='dialog-btn' onClick={handleClose}>Cancel</Button>
            <Button id='dialog-btn' onClick={createPost}>Post</Button>
          </div>
        </Dialog>
      </>
    );  
  }
  
  export default CreatePost;

  function CustomBackdrop(props) {
    return <Backdrop {...props} style={{ backgroundColor: 'rgba(114, 79, 195, 0.3)' }} />;
  }
  
  
