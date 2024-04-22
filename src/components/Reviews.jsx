import React, { useState, useEffect } from 'react';
import './Reviews.css'

function Reviews({ productId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:8000/products/${productId}/reviews`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data); // No es necesario acceder a data.reviews
                } else {
                    throw new Error('Failed to fetch reviews');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchReviews();
    }, [productId]);

    return (
        <div className="reviews-container">
            <h3 className='reviews-title'>Reviews</h3>
            {reviews.map(review => (
                <div key={review.creator_id} className="review-display">
                    <p className='revirew-username'><strong>User:</strong> {review.creator_username.username}</p>
                    <p><strong className='review-rating'>Rating:</strong> {review.score}</p>
                    <p><strong className='review-comment'>Comment:</strong> {review.comment}</p>
                </div>
            ))}
        </div>
    );
}

export default Reviews;