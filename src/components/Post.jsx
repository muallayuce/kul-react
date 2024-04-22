import React, { useState, useEffect } from "react";
import './Post.css';
import likeImg from '../assets/like.png';
import loveImg from '../assets/heart.png';
import { BASE_URL } from '../App';

function Post({ post, authToken, authTokenType, username }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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
    event?.preventDefault()

    const json_string = JSON.stringify({
      'username': username.value,
      'txt': newComment,
      'post_id': post.id
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


  const createPost = (event) => {
    event?.preventDefault(); // Prevent default form submission behavior
  
    // Create a JSON string with the post data
    const json_string = JSON.stringify({
      'username': username.value,
      'content': newPostContent, // Assuming newPostContent is the content of the new post
    });
  
    // Set up request options for the fetch API
    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken,
        'Content-Type': 'application/json'
      }),
      body: json_string
    };
  
    // Make a POST request to create the post
    fetch(BASE_URL + '/posts', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        // If post creation is successful, you can perform additional actions here
        console.log('Post created successfully:', data);
        // For example, you might want to fetch the updated list of posts
        fetchPosts();
      })
      .catch(error => {
        console.error('Error creating post:', error);
        // Handle error here
      })
      .finally(() => {
        // Reset the new post content after creating the post
        setNewPostContent('');
      });
  };
  
  

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
            <p>
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
