import React, { useState, useEffect } from "react";
import './Post.css';
import likeImg from '../assets/like.png';
import loveImg from '../assets/heart.png';

function Post({ post, username, userId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}hrs`;
  }

  const fetchComments = () => {
    fetch(`http://127.0.0.1:8000/comments/all/${post.id}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to fetch comments');
      })
      .then(data => {
        setComments(data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const postComment = (event) => {
    event.preventDefault();
    console.log('Submitting comment:', newComment);
  
    // Assuming you have an API endpoint to post comments
    fetch('http://127.0.0.1:8000/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        txt: newComment,
        post_id: post.id
      })
    })
    .then(response => {
      if (response.ok) {
        // If the comment is successfully posted, update the comments state
        fetchComments();
        setNewComment(''); // Clear the input field
      } else {
        throw new Error('Failed to post comment');
      }
    })
    .catch(error => {
      console.error('Error posting comment:', error);
    });
  }
  

  return (
    <div className="post">
      <div className="post_header">
        <div>
          <p className="post_username">{post.username}</p>
          <p className="post_timestamp">{formatTimestamp(post.timestamp)}</p>
        </div>
      </div>
      <p className="post_content">{post.content}</p>
      {post.id && (
        <img className="post_image" src={`http://localhost:8000/postimages/${post.id}`} alt="Post Image" />
      )}
      <div className="post_actions">
        <button className="post_reactions">
          <img src={likeImg} alt="Like" className="likeImg" />
        </button>
        <button className="post_reactions">
          <img src={loveImg} alt="Love" className="loveImg" />
        </button>
      </div>
      <div className='post_comments'>
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username}:</strong> {comment.text}
          </p>
        ))}
      </div>
      <form className="post_commentbox" onSubmit={postComment}>
        <input
          className="post_input"
          type="text"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="post_button"
          type="submit"
          disabled={!newComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;
