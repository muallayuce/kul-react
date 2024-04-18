// ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css'

function ProductDetail() {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null); 

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/products/${productId}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
        } else {
          throw new Error('Failed to fetch product details');
        }
      } catch (error) {
        console.error(error);
        // Podrías añadir una lógica aquí para manejar el error, como mostrar un mensaje al usuario
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

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
      <p className='product-d-description'>Description: {product.description}</p>
      <Link to="/marketplace"><button className='close-button'>Close</button></Link>
    </div>
  );
}

export default ProductDetail;
