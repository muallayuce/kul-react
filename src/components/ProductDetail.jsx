import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import Reviews from './Reviews.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faStar, faStarHalfAlt, faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import NoImage from "../assets/balamgray.png";
import DeleteProduct from './DeleteProduct.jsx';
import './DeleteProduct.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Tooltip } from '@mui/material';
import CreateOrderline from './CreateOrderline.jsx';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [openModal, setOpenModal] = useState('description');
  const isSeller = (product) => {
    console.log('Getting user id...', localStorage.getItem("user_id"), product);
    return localStorage.getItem("user_id") == product.user.id;
  };
  const PrevArrow = ({ onClick }) => (
    <button className="slick-arrow prev" onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button className="slick-arrow next" onClick={onClick}>
      <FontAwesomeIcon icon={faArrowRight} />
    </button>
  );

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

  const handleModalChange = (modal) => {
    setOpenModal(modal);
  };

  const renderModalContent = () => {
    switch (openModal) {
      case 'description':
        return (
          <div className='description-container'>
            <p className='description-title'> Description <br /> <span className='description-text'>{product.description}</span></p>
          </div>
        );
      case 'reviews':
        return <Reviews productId={productId} />;
      case 'seller':
        return (
          <div className='seller-container'>
            <p className='seller-title'> Seller <br /> <span className='seller-name'> {product.user.username}</span> </p>
            <Link to='/chat'><button className='seller-button'> <FontAwesomeIcon icon={faCommentsDollar} /></button></Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (

    <div className="product-container">
      <div className='title-buttons-container'>
        <div className='name-price-container'>
          <h2 className='product-d-name'>{product.product_name} </h2>
          <p className='product-d-price'>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        </div>
        <div className='edit-delete-container'>
          {isSeller(product) && <Link to={`/product/${product.id}/edit`}>
            <Tooltip title='Edit product' placement="top" arrow id='edit-product-tooltip'>
              <button className='edit-product-button'>
                <i className="bi bi-pencil-square" id='edit-product-icon'></i>
              </button>
            </Tooltip></Link>}
          {isSeller(product) && <DeleteProduct productId={productId} />}
        </div>
      </div>
      {product.images.length === 1 ? (
        <img
          className="product-d-image"
          src={`http://127.0.0.1:8000/images/${product.images[0].id}`}
          alt="Product Image"
        />
      ) : product.images.length > 1 ? (
        <Slider
          dots={true}
          infinite={true} //Infinite slide
          speed={500} // Slide speed
          slidesToShow={1}
          slidesToScroll={1}
          nextArrow={<NextArrow />}
          prevArrow={<PrevArrow />}
        >
          {product.images.map(image => (
            <div key={image.id}>
              <img
                className="product-d-image"
                src={`http://127.0.0.1:8000/images/${image.id}`}
                alt="Product Image"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <img
          className="product-d-image"
          src={NoImage}
          alt="Placeholder Image"
        />
      )}

      {averageScore !== null ? (
        <div className='product-d-rating'>
          <p> {averageScore.toFixed(1)} {renderStars(averageScore)}</p>
        </div>
      ) : (
        <p className='product-d-rating'>Be the first to write a review!</p>
      )}

      <section className='all-details' id='examples'>
        <menu>
          <li><button onClick={() => handleModalChange('description')}>Description</button></li>
          <li><button onClick={() => handleModalChange('reviews')}>Reviews</button></li>
          <li><button onClick={() => handleModalChange('seller')}>Seller</button></li>
        </menu>
      </section>
      {renderModalContent()}
      <Link to="/marketplace"><button className='close-button'>Close</button></Link>
      <div className='add-cart-button-container'>
        <CreateOrderline productId={productId} />
      </div>
    </div>
  );

}

export default ProductDetail;