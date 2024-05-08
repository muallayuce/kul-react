import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../App';
import './UserProfile.css';
import likeImg from '../../assets/like.png';
import loveImg from '../../assets/heart.png';

const Timeline = ({ post, authToken, authTokenType }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({}); // State to store comment inputs

  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");

  const fetchCommentsForPost = async (postId) => {
    try {
      const response = await fetch(`${BASE_URL}/comments/all/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments for post');
      }
      const data = await response.json();
      console.log("Comments for post ID:", postId, data);
      setUserPosts(prevPosts =>
        prevPosts.map(prevPost =>
          prevPost.id === postId ? { ...prevPost, comments: data } : prevPost
        )
      );
    } catch (error) {
      console.error('Error fetching comments for post:', error);
    }
  };

  useEffect(() => {
    // Fetch user data from local storage
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    console.log("User ID:", userId);
    console.log("Username:", username);
  
    const fetchUserPosts = async () => {
      try {
        // Fetch user posts
        const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }
        const data = await response.json();
        console.log("Fetched user posts:", data);
        const postsWithComments = data.map(post => ({ ...post, comments: [] }));
        setUserPosts(postsWithComments);
  
        // Fetch comments for each post
        for (const post of data) {
          fetchCommentsForPost(post.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserPosts();
  }, []);

  
  const handleDelete = (postId, event) => {
    event?.preventDefault();
  
    const requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken
      })
    }
  
    fetch(BASE_URL + `/posts/${postId}`, requestOptions)
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
  

  const postComment = async (postId, event) => {
    event.preventDefault();
    const commentText = commentInputs[postId] || ""; // Get comment text from state
    try {
      const json_string = JSON.stringify({
        'username': username,
        'txt': commentText,
        'post_id': postId,
        'user_id': userId,
      });

      const requestOptions = {
        method: 'POST',
        headers: new Headers({
          'Authorization': authTokenType + ' ' + authToken,
          'Content-Type': 'application/json'
        }),
        body: json_string
      };

      const response = await fetch(`${BASE_URL}/comments`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      fetchCommentsForPost(postId);
      setCommentInputs({ ...commentInputs, [postId]: "" }); // Clear the input field after posting comment
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Function to update comment input state
  const handleCommentInputChange = (postId, event) => {
    setCommentInputs({ ...commentInputs, [postId]: event.target.value });
  };

  return (
    <div className="timeline">
      <h2>Timeline</h2>
      {userPosts.map((post) => (
        <div className="post" key={post.id}>
          <button className='delete_post_timeline' onClick={(event) => handleDelete(post.id, event)}><i className="bi bi-trash3-fill" id='trash-timeline-icon'></i></button>
          <h3>{post.title}</h3>
          <p className='post_content'>{post.content}</p>
          {post.images.map((image) => (
            <img key={image.id} className="post_image" src={`http://127.0.0.1:8000/postimages/${post.id}`} alt="Post Image" />
          ))}
          <div className='post_comments'>
            {post.comments && post.comments
              .filter((comment, index, self) =>
                index === self.findIndex(c => c.text === comment.text)
              )
              .map((comment, index) => (
                <p key={index}>
                  <span className="comment-username">{comment.username}:</span> <span className="comment-text">{comment.text}</span>
                </p>
              ))}
          </div>
          <div className="post_actions">
            <button className="post_reactions">
              <img src={likeImg} className="likeImg" alt="Like" />
            </button>
            <button className="post_reactions">
              <img src={loveImg} className="loveImg" alt="Love" />
            </button>
          
          <form className="post_commentbox">
            <input className="post_input"
              type="text"
              placeholder="Add a comment"
              value={commentInputs[post.id] || ""} // Bind input value to state
              onChange={(event) => handleCommentInputChange(post.id, event)} // Update state on input change
            />
            <button
              className="post_button"
              type="submit"
              disabled={!commentInputs[post.id]}
              onClick={(event) => postComment(post.id, event)}>
              Post
            </button>
          </form>
        </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
