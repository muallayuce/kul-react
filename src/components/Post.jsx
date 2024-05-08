import React, { useState, useEffect } from "react";
import './Post.css';
import likeImg from '../assets/like.png';
import loveImg from '../assets/heart.png';
import { BASE_URL } from '../App';

function Post({ post, authToken, authTokenType, onDelete}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    setComments(post.comments)
  }, [])

  const handleDelete = (event) => {
    event?.preventDefault();

    // Check if the post belongs to the logged-in user before deletion
    if (post.user_id !== parseInt(userId)) {
      alert('You can only delete your own posts.');
      return;
    }

    // If the user confirms the deletion
    if (window.confirm("Are you sure you want to delete this post?")) {
      const requestOptions = {
        method: 'DELETE',
        headers: new Headers({
          'Authorization': authTokenType + ' ' + authToken
        })
      }

      fetch(BASE_URL + `/posts/${post.id}`, requestOptions)
        .then(response => {
          if(response.ok) {
            window.location.reload()
          }
          throw response
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}hrs`;
  }

  const fetchComments = async () => {
    try{
      const response = await fetch(`http://127.0.0.1:8000/comments/all/${post.id}`)
      if (response.ok) {
        const data= await response.json()
        console.log("data",data)
        setComments(data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const postComment = (event) => {
    event?.preventDefault()

    const json_string = JSON.stringify({
      'username': username,
      'txt': newComment,
      'post_id': post.id,
      'user_id': userId, // Include userId in the JSON string
    })

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken,
        'Content-Type': 'application/json'
      }),
      body: json_string
    }

    fetch(BASE_URL + '/comments', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        fetchComments()
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setNewComment('')
      })
  }

  return (
    <div className="post">
      <div className="post_header">
        <div>
          <p className="post_username">{post.username}</p>
          <p className="post_timestamp">{formatTimestamp(post.timestamp)}</p>
        </div>
        {post.user_id === parseInt(userId) && ( // Display delete button only if the post belongs to the logged-in user
          <div className="delete-button-container">
            <button className="delete_post" onClick={handleDelete}><i className="bi bi-trash3-fill" id='trash-post-icon'></i></button>
          </div>
        )}
      </div>
      <p className="post_content">{post.content}</p>
      {post.id && (
      <div>
        {console.log("Image URL:", `http://localhost:8000/postimages/${post.id}`)}
      <img className="post_image" src={`http://127.0.0.1:8000/postimages/${post.id}`} alt="Post Image" />
        </div>
      )}
      <div className='post_comments'>
        {comments &&
          comments.map((comment) => (
            <p key={comment.id}>
              <span className="comment-username" >{comment.username}:</span><span className="comment-text">{comment.text}</span> 
            </p>
          ))
        }
      </div>
      {confirmDelete && (
        <p>Are you sure you want to delete this post?</p>
      )}
      <div className="post-actions-container">
        <button className="post_reactions">
          <img src={likeImg} alt="Like" className="likeImg" />
        </button>
        <button className="post_reactions">
          <img src={loveImg} alt="Love" className="loveImg" />
        </button>
      

      {authToken && (
        <div className="form-container">
        <form className="post_commentbox">
          <input className="post_input"
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="post_button"
            type="submit"
            disabled={!newComment}
            onClick={postComment}>
              Send
            </button>
        </form>
        </div>
      )}
    </div>
    </div>
  )
}

export default Post;
