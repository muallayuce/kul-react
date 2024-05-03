import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../App';
import './UserProfile.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  return (
    <div>
      {userInfo.images && userInfo.images.map((image) => (
        <img key={image.id} className="user_image" src={`http://localhost:8000/users/${userId}/userimage`} alt="User Image" />
      ))}
      <div className="user-info-content">
        <div className="info-item-user">
        <i className="bi bi-person-fill" style={{ color: "#724fc3", fontSize: '30px' }}></i>
          <p className='info-item-username'>{userInfo.username}</p>
        </div>
        <div className="info-item">
          <p><i className="bi bi-envelope-at" style={{fontSize:"20px", color:'#724fc3'}}></i> 
          <span className='user-email'>{userInfo.email}</span></p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
