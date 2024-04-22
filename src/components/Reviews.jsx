import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import './Reviews.css'

function Reviews({ productId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:8000/products/${productId}/reviews`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                } else {
                    throw new Error('Failed to fetch reviews');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchReviews();
    }, [productId]);

    const renderStars = (score) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= score) {
                stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 1 }} />);
            } else {
                stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 0.3 }} />);
            }
        }
        return stars;

    };

    return (
        <div className="reviews-container">
            <h3 className='reviews-title'>Reviews</h3>
            {reviews.map(review => (
                <div key={review.creator_id} className="review-display">
                    <p className='review-username'> {review.creator_username.username}</p>
                    <p className='review-rating'> {renderStars(review.score)}</p>
                    <p className='review-comment'> {review.comment}</p>
                </div>
            ))}
        </div>
    );
}

export default Reviews;