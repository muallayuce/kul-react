import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../App';
import './UserProfile.css';
import likeImg from '../../assets/like.png';
import loveImg from '../../assets/heart.png'


const Timeline = () => {
  const [userPosts, setUserPosts] = useState([]);
  const userId = localStorage.getItem("user_id")
  console.log("a",userId)

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

  const handleLike = (postId) => {
    // Logic to handle liking a post
    console.log('Liked post with ID:', postId);
  };

  const handleComment = (postId) => {
    // Logic to handle commenting on a post
    console.log('Commented on post with ID:', postId);
  };

  return (
    <div className="timeline">
      <h2>Timeline</h2>
      {userPosts.map((post) => (
        <div className="post" key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.images.map((image) => (
              <img className="post_image" src={`http://localhost:8000/postimages/${image.id}`} alt="Post Image" />
          ))}
          <div className="post_actions">
        <button className="post_reactions">
          <img src={likeImg} className="likeImg"></img>
        </button>
        <button className="post_reactions">
          <img src={loveImg} className="loveImg"></img>
        </button>
        <button className="button-comment">
          <i className="comment"></i>
          Comment
        </button>
      </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;



