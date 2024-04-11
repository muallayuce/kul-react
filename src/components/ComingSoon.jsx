import React from 'react';
import heart from '../assets/heart.png';

const ComingSoon = () => {
  return (
    <div className='coming_soon'>
      <img src={heart} alt='Coming Soon' />
      <h2>Coming Soon...</h2>
      <p>We're working on something exciting! Stay tuned for updates.</p>
    </div>
  );
};

export default ComingSoon;
