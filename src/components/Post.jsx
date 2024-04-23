import React, { useState, useEffect } from "react";
import './Post.css';
import likeImg from '../assets/like.png';
import loveImg from '../assets/heart.png';
import { BASE_URL } from '../App';

function Post({ post, authToken, authTokenType}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const userId = localStorage.getItem("user_id");
  const username= localStorage.getItem('username');

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    setComments(post.comments)
  }, [])

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
        {comments &&
          comments.map((comment) => (
            <p key={comment.id}>
              <strong>{comment.username}:</strong> {comment.text}
            </p>
          ))
        }
      </div>

      {authToken && (
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
      )}
    </div>
  )
}

export default Post;
