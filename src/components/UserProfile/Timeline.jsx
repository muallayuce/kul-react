import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../App';
import './UserProfile.css';
import likeImg from '../../assets/like.png';
import loveImg from '../../assets/heart.png';

const Timeline = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [commentsFetched, setCommentsFetched] = useState(false); // Track whether comments have been fetched

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }
        const data = await response.json();
        console.log("Fetched user posts:", data);
        // Add an empty array for comments for each post
        const postsWithComments = data.map(post => ({ ...post, comments: [] }));
        setUserPosts(postsWithComments);
        setCommentsFetched(false); // Reset commentsFetched when userPosts are updated
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  useEffect(() => {
    const fetchCommentsForUserPosts = async () => {
      try {
        for (const post of userPosts) {
          console.log("Post ID:", post.id);
          console.log("Fetching comments for post ID:", post.id);
          const response = await fetch(`${BASE_URL}/comments/all/${post.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch comments');
          }
          const data = await response.json();
          console.log("Comments for post ID:", post.id, data); // Log the fetched comments
          setUserPosts(prevPosts =>
            prevPosts.map(prevPost =>
              prevPost.id === post.id ? { ...prevPost, comments: data } : prevPost
            )
          );
        }
        setCommentsFetched(true); // Set commentsFetched to true after fetching comments for all posts
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    if (userPosts.length > 0 && !commentsFetched) {
      fetchCommentsForUserPosts();
    }
  }, [userPosts, commentsFetched]);
  
  
  return (
    <div className="timeline">
      <h2>Timeline</h2>
      {userPosts.map((post) => (
        <div className="post" key={post.id} >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.images.map((image) => (
            <img key={image.id} className="post_image" src={`http://localhost:8000/postimages/${image.id}`} alt="Post Image" />
          ))}
          <div className="post_actions">
            <button className="post_reactions">
              <img src={likeImg} className="likeImg" alt="Like" />
            </button>
            <button className="post_reactions">
              <img src={loveImg} className="loveImg" alt="Love" />
            </button>
            <button className="button-comment" onClick={() => handleComment(post.id)}>
              <i className="comment"></i>
              Comment
            </button>
          </div>
          {/* Render comments for the current post */}
          <div className='post_comments'>
            {post.comments && post.comments
              .filter((comment, index, self) => 
                index === self.findIndex(c => c.text === comment.text)
              )
              .map((comment, index) => (
                <p key={index}>
                  <strong>{comment.username}:</strong> {comment.text}
                </p>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
