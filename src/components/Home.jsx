import React, { useState, useEffect } from 'react';
import balam from '../assets/balam.png';
import kul from '../assets/kul.png';
import { BASE_URL } from '../App';

const Home = () => {
  const [message, setMessage] = useState('');

  const getWelcomeMessage = async () => {
    try {
      const response = await fetch(BASE_URL + '/');
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  return (
    <div className='welcome-container'>
      <h1 className='welcome' style={{ fontSize: '5em' }}>{message.substring(0, 18)}</h1>
      <span className='welcome2' style={{ fontSize: '7em' }}>{message.substring(18)}</span>
      <div className='images-welcome'>
        <img src={kul} alt="Kul" />
        <img src={balam} alt="Balam" />
      </div>
    </div>
  );
};

export default Home;