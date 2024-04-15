import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Post from './Post';
import Login from './components/Login';
import Signup from './components/SignUp';
import headerImg from './assets/header.png';
import footerImg from './assets/kulw.png';
import balamw from './assets/balamw.png';
import Marketplace from './components/Marketplace';
import Logout from './components/Logout';
import Home from './components/Home';
import { UserContext } from './context/UserContext';


export const BASE_URL = 'http://localhost:8000';

function App() {
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(null); // State to manage which modal is open
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token,] = useContext(UserContext);

  useEffect(() => {
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
  }, []);

  // Function to handle login
  const handleLogin = (email, password) => {
    // Implement your login logic here, e.g., send a request to authenticate the user
    console.log('Logging in with:', email, password);
    // After successful login, you can close the modal
    setOpenModal(null);
    setIsLoggedIn(true);
    console.log('isLoggedIn:', isLoggedIn);
  };

  // Function to handle signup
  const handleSignup = (email, password) => {
    // Implement your signup logic here
    console.log('Signing up with:', email, password);
    // After successful signup, you can close the modal
    setOpenModal(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className='app'>
      <header className='app_header'>
        <img className='app_header_image' src={headerImg} alt='Kul' />
        <nav>
          <Marketplace closeOtherModals={() => setOpenModal(null)} />
          <Logout onLogout={handleLogout} />
          {!token && (
            <button className='register' onClick={() => setOpenModal('login')}>Log In</button>
          )}
          {!token && (
            <button className='register' onClick={() => setOpenModal('signup')}>Sign Up</button>
          )}
        </nav>
      </header>

      <div className='app_users'>
        {/* Conditionally render the modal based on the openModal state */}
        {openModal === 'login' && <Login onLogin={handleLogin} />}
        {openModal === 'signup' && <Signup onSignup={handleSignup} />}
      </div>

      {openModal === null && (
        <Home />
      )}

      <div className='app_posts'>
        {posts.map(post => (
          <Post key={post.id} post={post} />
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
        <p className='copy'>&copy; 2024 KUL-BALAM. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
