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
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import UserProfile from './components/UserProfile/UserProfile';
import Chat from './components/Chat';
import ContactUs from './components/Footer/ContactUs';
import TermsOfService from './components/Footer/TermsOfService';
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
import PostProduct from './components/PostProduct';
import EditProduct from './components/EditProduct';
import PostReview from './components/PostReview';
import Groups from './components/UserProfile/Groups';
import EditReview from './components/EditReview';
import CreatePost from './components/CreatePost';
import Order from './components/Order';
import Pay from './components/Pay';
import UserList from './components/UserList';
import UserProducts from './components/UserProducts';
import Transactions from './components/Transaction';


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
  const [footerScreen, setFooterScreen] = useState(null);

  // useEffect to check if user is logged in and fetch posts and products
  useEffect(() => {
    if (token !== null && token !== 'null') {
      setIsLoggedIn(true);
      fetchPosts(); // Fetch posts when user is logged in
      fetchProducts();
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
        const response = await fetch(BASE_URL + '/products/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
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
    setFooterScreen(null);
  };

  // Function to handle signup
  const handleSignup = (email, password) => {
    // Implement your signup logic here
    console.log('Signing up with:', email, password);
    // After successful signup, you can close the modal
    setOpenModal(null);
    setFooterScreen(null);
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

  const handlePrivacy = () => {
    setFooterScreen('privacy')
  }

  const handleTerms = () => {
    setFooterScreen('terms')
  }

  const handleContactUs = () => {
    setFooterScreen('contactus')
  }


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
                  <Link to='/chat'> <i className="bi bi-chat-fill" id='chat_button'></i></Link>
                  <Link to='/profile'><button className='profile_button' onClick={handleProfile}>Profile</button></Link>
                  <Link to="/"> <button className="logout_button" onClick={handleLogout}>Log Out </button></Link>
                </div>
              </>
            ) : (
              <>
                <div className='app_header_right'>
                  <Link to="/login"><button className='register'>Log In</button></Link>
                  <Link to="/signup"><button className='register'>Sign Up</button></Link>
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
              isLoggedIn && posts.length >= 0 ? (
                <>
                  <CreatePost authToken={token} fetchPosts={fetchPosts} />
                  <div className='app_posts'>
                    <div className='sidebar'>
                      <Link to="/groups"><i className="bi bi-person-video2" title='Groups'></i></Link>
                      <Link to="/users"><i className="bi bi-person-fill-add" id='all_users' title='All Users'></i></Link>

                    </div>
                    <div className='post_container'>
                      {posts.map(post => (
                        <Post key={post.id} post={post} authToken={token} userId={userId} />
                      ))}
                    </div>
                  </div>
                </>
              ) : null
            }

          />
          <Route path='/login' element={isLoggedIn ? <Navigate to="/posts" /> : <Login onLogin={handleLogin} />} />
          <Route path='/signup' element={<Signup onSignup={handleSignup} />} />
          <Route path="/marketplace" element={<Marketplace products={products} />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path='/new/product' element={< PostProduct />} />
          <Route path='/product/:id/edit' element={<EditProduct />} />
          <Route path="/profile/" element={<UserProfile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/terms' element={<TermsOfService />}></Route>
          <Route path='/privacy' element={<PrivacyPolicy />}></Route>
          <Route path='/product/:productId/review' element={<PostReview />} />
          <Route path='/product/:productId/review/:reviewId/edit' element={<EditReview />} />
          <Route path='/mycart' element={<Order/>}></Route>
          <Route path='/groups' element={<Groups/>}></Route>
          <Route path="/pay" element={<Pay />} />
          <Route path= '/users' element={<UserList />}></Route>
          <Route path= '/myshop' element={<UserProducts />}></Route>
          <Route path='/pay/:result' element={<Transactions />} />
        </Routes>

        {/* Render login or signup modal based on openModal state */}
        {openModal === 'signup' && <Signup onSignup={handleSignup} />}

        {!isLoggedIn && openModal === 'login' && <Login onLogin={handleLogin} />}

        <footer className='footer'>
          <nav>
            <img className='footerImgLeft' src={footerImg} alt="" />
            <Link to="/privacy" onClick={() => setFooterScreen('privacy')}>Privacy Policy</Link>
            <Link to="/terms" onClick={() => setFooterScreen('terms')}>Terms of Service</Link>
            <Link to="/contactus" onClick={() => setFooterScreen('contactus')}>Contact Us</Link>
            <img className='footerImgRight' src={balamw} alt="" />
          </nav>
          <p className='copy'>&copy; 2024 KUL-BALAM. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );

}

export default App;
