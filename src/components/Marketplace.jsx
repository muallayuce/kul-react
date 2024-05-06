import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Marketplace.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import NoImage from "../assets/balamgray.png"

function Marketplace({ products }) {
  const [averageScores, setAverageScores] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchAverageScores = async () => {
      for (const product of products) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/products/${product.id}/reviews`);
          const data = await response.json();

          if (data.length > 0) {
            const scores = data.map(review => review.score);
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
    const fullStarsCount = Math.floor(score);
    const hasHalfStar = score % 1 !== 0;
    const stars = [];
    if (score === 0 || score === null) {
      return stars;
    }
    for (let i = 0; i < 5; i++) {
      if (i < fullStarsCount) {
        stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 1 }} />);
      } else if (i === fullStarsCount && hasHalfStar) {
        stars.push(<FontAwesomeIcon icon={faStarHalfAlt} key={i} style={{ opacity: 1 }} />);
      } else {
        stars.push(<FontAwesomeIcon icon={faStar} key={i} style={{ opacity: 0.3 }} />);
      }
    }
    return stars;
  };

  return (
    <div className="market">
      <div className="search-bar-container">
        <SearchBar setSearchResults={setSearchResults} />
      </div>
      <div className="marketplace">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div key={product.id} className="product">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product_header">
                  <p className="product_name">{product.product_name}</p>
                  <p className="product_price">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                  <div className="product_images">
                    {product.images.length > 0 ? (
                      product.images.map(image => (
                        <img
                          key={image.id}
                          className="product_image"
                          src={`http://127.0.0.1:8000/images/${image.id}`}
                          alt="Product Image"
                        />
                      ))
                    ) : (
                      <img
                        className="product_image"
                        src={NoImage}
                        alt="Placeholder Image"
                      />
                    )}
                  </div>
                  <div className="product_rating">
                    {averageScores[product.id] !== undefined ? renderStars(averageScores[product.id]) : ''}
                  </div>
                  {averageScores[product.id] === null && (
                    <div className="product_rating">Be the first to write a review!</div>
                  )}
                </div>
              </Link>
            </div>
          ))
        ) : (
          products.map((product) => (
            <div key={product.id} className="product">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product_header">
                  <p className="product_name">{product.product_name}</p>
                  <p className="product_price">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                  <div className="product_images">
                    {product.images.length > 0 ? (
                      <img
                        key={product.images[0].id}
                        className="product_image"
                        src={`http://127.0.0.1:8000/images/${product.images[0].id}`}
                        alt="Product Image"
                      />
                    ) : (
                      <img
                        className="product_image"
                        src={NoImage}
                        alt="Placeholder Image"
                      />
                    )}
                  </div>
                  <div className="product_rating">
                    {averageScores[product.id] !== undefined ? renderStars(averageScores[product.id]) : ''}
                  </div>
                  {averageScores[product.id] === null && (
                    <div className="product_rating">Be the first to write a review!</div>
                  )}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Marketplace;
