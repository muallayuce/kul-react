import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Post from './Post';
import Login from './components/Login';
import Signup from './components/SignUp';
import Marketplace from './components/Marketplace';
import headerImg from './assets/header.png';
import footerImg from './assets/kulw.png';
import balamw from './assets/balamw.png';
import heart from './assets/heart.png';
import Logout from './components/Logout';
import Home from './components/Home';
import { UserContext } from './context/UserContext';

export const BASE_URL = 'http://localhost:8000';

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(null); // Define setOpenModal state
  const [token, setToken] = useContext(UserContext);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchPosts();
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  

  useEffect(() => {
    console.log('Posts:', posts);
  }, [posts]);

  const fetchPosts = () => {
    fetch(BASE_URL + '/posts/all')
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
  };

  // Function to handle login
  const handleLogin = (email, password) => {
    console.log('Logging in with:', email, password);
    fetchPosts(); // Fetch posts after successful login
    setIsLoggedIn(true); // Update isLoggedIn state
    setOpenModal(null); // Close the login modal
  };

  // Function to handle signup
  const handleSignup = (email, password) => {
    // Implement your signup logic here
    console.log('Signing up with:', email, password);
    // After successful signup, you can close the modal
    setOpenModal(null);
  };

// Function to handle logout
const handleLogout = () => {
  localStorage.removeItem('token'); // Remove token from local storage
  setToken(null);
  setIsLoggedIn(false);
  setPosts([]); // Clear posts when logging out
  setOpenModal(null); // Close any open modal when logging out
};


  return (
    <div className='app'>
      <header className='app_header'>
        <img className='app_header_image' src={headerImg} alt='Kul' />
        <nav>
          <Marketplace />
          {isLoggedIn ? (
            <Logout onLogout={handleLogout} />
          ) : (
            <>
              <button className='register' onClick={() => setOpenModal('login')}>Log In</button>
              <button className='register' onClick={() => setOpenModal('signup')}>Sign Up</button>
            </>
          )}
        </nav>
      </header>

      {isLoggedIn ? (
        <div className='app_posts'>
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : openModal === null && (
        <Home />
      )}

      {/* Render login or signup modal based on openModal state */}
      {openModal === 'signup' && <Signup onSignup={handleSignup} />}
      
      {!isLoggedIn && openModal === 'login' && <Login onLogin={handleLogin} />}

      <footer className='footer'>
        <nav>
          <img className='footerImgLeft' src={footerImg} alt="" />
          <a href="/">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
          <img className='footerImgRight' src={balamw} alt="" />
        </nav>
        <p className='copy'>&copy; 2024 KUL-BALAM. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
