import React from "react";
import './Marketplace.css';

function Marketplace({ products }) { 
  return (
    <div className="marketplace">
      {products.map(product => ( // Change 'product.id' to 'products.map(product => ...'
        <div key={product.id} className="product">
          <div className="product_header">
            <div>
              <p className="product_name">{product.product_name}</p>
              <p className="product_price">{product.price}</p>
            </div>
          </div>
          <p className="product_description">{product.description}</p>
          {/* {product.id && (
            <img className="product_image" src={`http://localhost:8000/images/${product.id}`} alt="Product Image" /> 
          )} */}
        </div>
      ))}
    </div>
  );
}

export default Marketplace;
