import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import Login from './Login/Login';
import headerImg from './assets/header.png';
import footerImg from './assets/kulw.png';
import balamw from './assets/balamw.png';

const BASE_URL = 'http://localhost:8000/';

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  useEffect(() => {
    fetch(BASE_URL + 'posts/all')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch posts');
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error(error);
        alert('Failed to fetch posts');
      });
  }, []);

  // Function to handle login
  const handleLogin = (email, password) => {
    // Implement your login logic here, e.g., send a request to authenticate the user
    console.log('Logging in with:', email, password);
    // After successful login, you can close the login modal or perform other actions
    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <header className='app_header'>
        <img className='app_header_image'
          src={headerImg}
          alt='Kul' />

        <nav>
          <button className='register' onClick={() => setOpenSignIn(true)}>Login</button>
          <button className='register' onClick={() => setOpenSignUp(true)}>Signup</button>
        </nav>
      </header>

      {/* Conditionally render the Login component */}
      {openSignIn && <Login onLogin={handleLogin} />}

      <div className='app_posts'>
        {posts.map(post => (
          <Post
            key={post.id} // Don't forget to add a unique key prop when rendering a list
            post={post}
          />
        ))}
      </div>

      <footer className='footer'>
        <nav>
          <img className='footerImgLeft' src={footerImg} alt="" />
          <a href="/">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
          <img className='footerImgRight' src={balamw} alt="" />
        </nav>
      </footer>
    </div>
  );
}

export default App;
