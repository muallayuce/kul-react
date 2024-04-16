import React, { useState, useEffect } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/users/1') // assuming the user ID is 1
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            {user.bio && <p>{user.bio}</p>}
            {user.image && <img src={user.image} alt="Profile" style={{ maxWidth: '200px' }} />}
        </div>
    );
};

export default UserProfile;
