import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import headerImg from './assets/header.png'; 

const BASE_URL = 'http://localhost:8000/'

function App() {

  const [posts, setPosts] = useState ([]);
  const [setOpenSignIn, serOpenSignIn] = useState(false);
  const [setOpenSignUp, serOpenSignUp] = useState(false);

  useEffect(() => {
    fetch(BASE_URL + 'posts/all')
      .then(response => {
        const json = response.json()
        console.log(json);
        if (response.ok) {
          return json
        }
        throw response
      }) 
      .then(data => {
        setPosts(data)
      })
      .catch(error => {
        console.log(error);
        alert(error)
      })
    }, [])

  return (
    <div className='app'>
      <div className='app_header'>
        <img className='app_header_image' 
          src={headerImg}
          alt='Kul' />

        <div>
          <button onClick={() => setOpenSignIn(true)}>Login</button>
          <button onClick={() => setOpenSignUp(true)}>Signup</button>
        </div>
      </div>
    
      <div className='app_posts'>
        {
          posts.map(post => (
            <Post
            post={post}
            />
          ))
        }
      </div>
    </div>
  );
}



export default App;