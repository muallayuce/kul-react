import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../App';
import './UserProfile.css';
import likeImg from '../../assets/like.png';
import loveImg from '../../assets/heart.png';

const Timeline = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}/posts`,);
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }
        const data = await response.json();
        console.log("f", data)
        setUserPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);
  

  useEffect(() => {
    const fetchComments = async (postId) => {
      try {
        if (!postId) return; // Check if postId is defined
        const response = await fetch(`${BASE_URL}/comments/all/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments((prevComments) => [...prevComments, { postId, data }]);
      } catch (error) {
        console.log(error);
      }
    };
  
    // Fetch comments for each post
    const fetchCommentsForPosts = async () => {
      for (const post of userPosts) {
        console.log("Fetching comments for post ID:", post.id); // Log postId before calling fetchComments
        await fetchComments(post.id); // Pass postId to fetchComments
      }
    };
  
    if (userPosts.length > 0) {
      fetchCommentsForPosts();
    }
  }, [userPosts]);
  
  

  const handleLike = (postId) => {
    // Logic to handle liking a post
    console.log('Liked post with ID:', postId);
  };

  const handleComment = (postId) => {
    console.log('Commenting on post with ID:', postId);
  };

  return (
    <div className="timeline">
      <h2>Timeline</h2>
      {userPosts.map((post) => (
        <div className="post" key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.images.map((image) => (
            <img key={image.id} className="post_image" src={`http://localhost:8000/postimages/${image.id}`} alt="Post Image" />
          ))}
          <div className="post_actions">
            <button className="post_reactions">
              <img src={likeImg} className="likeImg"></img>
            </button>
            <button className="post_reactions">
              <img src={loveImg} className="loveImg"></img>
            </button>
            <button className="button-comment" onClick={() => handleComment(post.id)}>
              <i className="comment"></i>
              Comment
            </button>
          </div>
          {/* Render comments for the current post */}
          <div className='post_comments'>
            {post.comments && post.comments.map((comment, index) => (
               <p key={index}>
                <strong>User {comment.userId}:</strong> {comment.text}
                </p>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;

