import React, { useState, useEffect } from 'react';
import './Marketplace.css';

const Marketplace = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    // Add event listener to close the "Coming soon..." text when any other button is clicked
    const handleClickOutside = (event) => {
      if (!event.target.closest('.marketplace-button')) {
        setShowComingSoon(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setShowComingSoon(true);
  };

  return (
    <div className="marketplace">
      <button className="marketplace-button" onClick={handleClick}>Marketplace</button>
      {showComingSoon && <p className="coming-soon">New features coming!</p>}
    </div>
  );
};

export default Marketplace;
