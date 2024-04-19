import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Marketplace.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Marketplace({ products }) {
  const [averageScores, setAverageScores] = useState({});

  useEffect(() => {
    const fetchAverageScores = async () => {
      for (const product of products) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/products/${product.id}/reviews`);
          const data = await response.json();

          if (data.reviews.length > 0) {
            const scores = data.reviews.map(review => review.score);
            const averageScore = scores.length > 0 ? scores.reduce((total, score) => total + score, 0) / scores.length : 0;

            setAverageScores(prevState => ({
              ...prevState,
              [product.id]: averageScore
            }));
          } else {
            setAverageScores(prevState => ({
              ...prevState,
              [product.id]: null
            }));
          }
        } catch (error) {
          console.error(`Error fetching reviews for product ${product.id}:`, error);
        }
      }
    };
    fetchAverageScores();
  }, [products]);

  // Rating stars
  const renderStars = (score) => {
    const starCount = Math.round(score); // Rounds the score
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < starCount) {
        stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 1 }} />); // Illuminated star with full opacity
      } else {
        stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 0.3 }} />); // Empty star with reduced opacity
      }
    }
    return stars;
  };

  return (
    <div className="marketplace">
      {products.map(product => (
        <div key={product.id} className="product">
          <Link to={`/product/${product.id}`} className="product-link">
            <div className="product_header">
                <p className="product_name">{product.product_name}</p>
                <p className="product_price">${product.price}</p>
                <div className="product_images">
                  {product.images.map(image => (
                    <img
                      key={image.id}
                      className="product_image"
                      src={`http://127.0.0.1:8000/images/${image.id}`}
                      alt="Product Image"
                    />
                  ))}
                </div>
                <div className="product_rating">
                  {averageScores[product.id] !== undefined ? renderStars(averageScores[product.id]) : ''}
                </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Marketplace;

