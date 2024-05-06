import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import './PostReview.css';
import { UserContext } from '../context/UserContext';

const StarRating = ({ initialRating, onChange }) => {
    const [rating, setRating] = useState(initialRating);

    const handleClick = (value) => {
        setRating(value);
        onChange(value);
    };

    return (
        <div className='review-stars'>
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={index}
                        onClick={() => handleClick(starValue)}
                        style={{ cursor: 'pointer', color: starValue <= rating ? 'var(--color-2)' : '#ded0fd'}}
                    >
                        <FontAwesomeIcon icon={faStar} />
                    </span>
                );
            })}
        </div>
    );
};

function PostReview() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        creator_id: '',
        score: 0,
        comment: ''
    });
    const [token] = useContext(UserContext);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRatingChange = (newRating) => {
        setFormData(prevState => ({
            ...prevState,
            score: newRating
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { creator_id, score, comment } = formData;
            const url = `http://localhost:8000/products/${productId}/reviews?creator_id=${creator_id}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    score,
                    comment
                })
            });
            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('You have already created a review for this product');
                }
                throw new Error('Failed to post review');
            }
            console.log('Review posted successfully!');
            navigate(`/product/${productId}`);
        } catch (error) {
            setError(error.message);
            console.error('Error posting review:', error);
        }
    };

    return (
        <div className="post-review-container">
            <h2 className='post-review-title'>Your review</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message-review">{error}</p>}
                <div className="form-group">
                    <label htmlFor="score">Score:</label> <br />
                    <StarRating initialRating={formData.score} onChange={handleRatingChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Review:</label> <br />
                    <textarea id="comment" name="comment" value={formData.comment} onChange={handleChange} />
                </div>
                <Tooltip title='Submit review' placement="top" arrow id='review-tooltip'>
                    <button className='post-review-button' type="submit">
                        <i className="bi bi-pencil-square" id='post-review'></i>
                    </button>
                </Tooltip>
            </form>
        </div>
    );
}

export default PostReview;