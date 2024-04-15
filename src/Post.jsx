import React from "react";
import './Post.css';

function Post({ post }) {
  return (
    <div className="post">
      <div className="post_header">
        <div>
          <p className="post_username">{post.username}</p> {/* Update here */}
          <p className="post_timestamp">{post.timestamp}</p>
        </div>
      </div>
      <p className="post_content">{post.content}</p>
      {post.id && (
        <img className="post_image" src={`http://localhost:8000/images/${post.id}`} alt="Post Image" />
      )}
      <div className="post_actions">
        <button className="post_action">
          <i className="post_action_icon fas fa-thumbs-up"></i>
          Like
        </button>
        <button className="post_action">
          <i className="post_action_icon fas fa-comment"></i>
          Comment
        </button>
      </div>
    </div>
  );
}

export default Post;
