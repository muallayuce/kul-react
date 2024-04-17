import React from "react";
import './Post.css';
import likeImg from '../assets/like.png'
import loveImg from '../assets/heart.png'

function Post({ post }) {
  // Function to format timestamp
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}hrs`;
  }

  return (
    <div className="post">
      <div className="post_header">
        <div>
          <p className="post_username">{post.username}</p>
          <p className="post_timestamp">{formatTimestamp(post.timestamp)}</p> {/* Update here */}
        </div>
      </div>
      <p className="post_content">{post.content}</p>
      {post.id && (
        <img className="post_image" src={`http://localhost:8000/postimages/${post.id}`} alt="Post Image" />
      )}
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
  );
}

export default Post;
