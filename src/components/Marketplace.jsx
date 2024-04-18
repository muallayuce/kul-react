import React from "react";
import { Link } from "react-router-dom";
import './Marketplace.css';

function Marketplace({ products }) {
  return (
    <div className="marketplace">
      {products.map(product => ( 
        <div key={product.id} className="product">
          <Link to={`/product/${product.id}`} className="product-link">
            <div className="product_header">
              <div>
                <p className="product_name">{product.product_name}</p>
                <p className="product_price">${product.price}</p>
              </div>
            </div>
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
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Marketplace;