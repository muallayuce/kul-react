import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Post from './components/Post';
import Login from './components/Login';
import Signup from './components/SignUp';
import Marketplace from './components/Marketplace';
import headerImg from './assets/header.png';
import footerImg from './assets/kulw.png';
import balamw from './assets/balamw.png';
import balam from './assets/balam.png'
import Logout from './components/Logout';
import Home from './components/Home';
import { UserContext } from './context/UserContext';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import UserProfile from './components/UserProfile/UserProfile';

// Define your base URL
export const BASE_URL = 'http://localhost:8000';

// Define your App component
function App() {
  // Define state variables
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]); // Initialize products as an empty array
  const [token, setToken, userId] = useContext(UserContext);
  const [openModal, setOpenModal] = useState(null); // State to manage which modal is open
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false); // State to manage whether to display UserProfile component

  // useEffect to check if user is logged in and fetch posts and products
  useEffect(() => {
    if (token !== null && token !== 'null') {
      setIsLoggedIn(true);
      fetchPosts(); // Fetch posts when user is logged in
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      const response = await fetch(BASE_URL + '/posts/all');
      if (response.ok) {
        const postData = await response.json();
        console.log('Posts:', postData);
        setPosts(postData); // Set posts state
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch posts');
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(BASE_URL + '/products/');
      if (response.ok) {
        const productsData = await response.json();
        console.log('Products:', productsData);
        setProducts(productsData); // Set products state
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch products');
    }
  };

  // Function to handle login
  const handleLogin = async (email, password) => {
    console.log('Logging in with:', email, password);
    await fetchPosts(); // Fetch posts after login
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
    setProducts([]); // Clear products when logging out
    setOpenModal(null); // Close any open modal when logging out
    setCurrentScreen(null);
    setShowUserProfile(null);
  };

  // Function to handle displaying user profile
  const handleProfile = () => {
    setShowUserProfile(true);
    setCurrentScreen('profile'); // Set currentScreen state to 'profile'
  };


  return (
    <Router>
      <div className='app'>
        <div className='app_header_container'>
          <header className='app_header'>
            <div className='app_header_left'>
              <Link to="/posts"> <button className='header_button' onClick={fetchPosts}>
                <img className='app_header_image' src={headerImg} />
              </button>
              </Link>
            </div>

            {isLoggedIn ? (
              <>
                <div className='app_header_center'>
                  <Link to="/marketplace"> <button className='balam_button' onClick={fetchProducts}>
                    <img className='balam_header' src={balam} alt="Balam" />
                  </button>
                  </Link>
                </div>

                <div className='app_header_right'>
                  <Link to='profile'><button className='profile_button' onClick={handleProfile}>Profile</button></Link>
                  <Link to="/"> <button className="logout_button" onClick={handleLogout}>Log Out </button></Link>
                </div>
              </>
            ) : (
              <>
                <div className='app_header_right'>
                  <button className='register' onClick={() => setOpenModal('login')}>Log In</button>
                  <button className='register' onClick={() => setOpenModal('signup')}>Sign Up</button>
                </div>
              </>
            )}
          </header>
        </div>

        <Routes>
          <Route path='/' element={isLoggedIn ? (
            <div className='home_app_posts'>
              {posts.map(post => (
                <Post key={post.id} post={post} authToken={token} userId={userId} />
              ))}
            </div>
          ) : openModal === null && <Home />} />

          <Route
            path="/posts"
            element={
              isLoggedIn && posts.length > 0 ? (
                <div className='app_posts'>
                  {posts.map(post => (
                    <Post key={post.id} post={post} authToken={token} userId={userId} />
                  ))}
                </div>
              ) : null
            }
          />
          <Route path="/marketplace" element={<Marketplace products={products} />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/profile" element={<UserProfile/>} />
        </Routes>

        {/* Render login or signup modal based on openModal state */}
        {openModal === 'signup' && <Signup onSignup={handleSignup} />}

        {!isLoggedIn && openModal === 'login' && <Login onLogin={handleLogin} />}

        <footer className='footer'>
          <nav>
            <img className='footerImgLeft' src={footerImg} alt="" />
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
            <img className='footerImgRight' src={balamw} alt="" />
          </nav>
          <p className='copy'>&copy; 2024 KUL-BALAM. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );

}

export default App;
