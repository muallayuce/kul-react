import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './EditReview.css';

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

function EditReview() {
const { productId, reviewId } = useParams();;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    score: 0,
    comment: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:8000/reviews/${reviewId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }
        const reviewData = await response.json();
        setFormData({
          score: reviewData.score,
          comment: reviewData.comment
        });
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };

    fetchReview();
  }, [reviewId]);

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
      const { score, comment } = formData;
      const url = `http://localhost:8000/reviews/${reviewId}?score=${score}&comment=${comment}`;
      const response = await fetch(url, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error('Failed to edit review');
      }
      console.log('Review edited successfully!');
      navigate(`/product/${productId}`);
    } catch (error) {
      setError(error.message);
      console.error('Error editing review:', error);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      console.log('Review deleted successfully!');
      navigate(`/product/${productId}`);
    } catch (error) {
      setError(error.message);
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="edit-review-container">
      <h2 className='edit-review-title'>Edit your review</h2>
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
        <div className='delete-edit-buttons-container'>
        <Tooltip title='Update review' placement="left" arrow id='edit-review-tooltip'>
          <button className='edit-review-button' type="submit">
            <i className="bi bi-pencil-square" id='edit-review-icon'></i>
          </button>
        </Tooltip>
        {!confirmDelete ? (
        <Tooltip title='Delete review' placement="left" arrow id='delete-review-tooltip'>
        <button className='delete-review-button' onClick={() => setConfirmDelete(true)}>
          <i className="bi bi-trash3-fill" id='delete-review-icon'></i>
        </button>
      </Tooltip>
       ) : (
        <div className='delete-check-container'>
            <p className='delete-check'>Are you sure you want to delete this review?</p>
            <div className='yes-no-container'>
            <button className='yes-button' onClick={handleDelete}>
            <i className="bi bi-check-circle-fill" id='check-icon'></i>
            </button>
            <button className='no-button' onClick={() => setConfirmDelete(false)}>
                <i className="bi bi-x-circle-fill" id='x-icon'></i>
                </button>
            </div>
        </div>
    )}
      </div>
      </form>
    </div>
  );
}

export default EditReview;