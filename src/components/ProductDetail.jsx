import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import Reviews from './Reviews.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [averageScore, setAverageScore] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productResponse = await fetch(`http://localhost:8000/products/${productId}`);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProduct(productData);
        } else {
          throw new Error('Failed to fetch product details');
        }

        // Fetch average score
        const scoreResponse = await fetch(`http://localhost:8000/products/${productId}/reviews`);
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json();
          const scores = scoreData.map(review => review.score);
          const averageScore = scores.length > 0 ? scores.reduce((total, score) => total + score, 0) / scores.length : 0;
          setAverageScore(averageScore);
        } else {
          throw new Error('Failed to fetch average score');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  // Rating stars
  const renderStars = (score) => {
    const fullStarsCount = Math.floor(score); // Full starts
    const hasHalfStar = score % 1 !== 0; // Half star
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStarsCount) {
        stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 1 }} />);
      } else if (i === fullStarsCount && hasHalfStar) {
        stars.push(<FontAwesomeIcon icon={faStarHalfAlt} key={i} style={{ opacity: 1, fill: 'gold' }} />);
      } else {
        stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 0.3 }} />);
      }
    }
    return stars;
  };


  return (
    <div className="product-container">
      <h2 className='product-d-name'>{product.product_name}</h2>
      <p className='product-d-price'>${product.price}</p>
      {product.images && product.images.map(image => (
        <img
          key={image.id}
          src={`http://localhost:8000/images/${image.id}`}
          alt="Product"
          className='product-d-image'
        />
      ))}
      {averageScore !== null && (
        <div className='product-d-rating'>
          <p> {averageScore.toFixed(1)} {renderStars(averageScore)}</p>
        </div>
      )}
      <p className='product-d-description'>Description: {product.description}</p>
      <Reviews productId={productId} />
      <Link to="/marketplace"><button className='close-button'>Close</button></Link>
    </div>
  );
}

export default ProductDetail;
