import React, { useState, useEffect } from 'react';
import NoImage from "../assets/balamgray.png";
import { Link } from "react-router-dom";
import './UserProducts.css';
import { a_fetch } from './NetworkUtils';

function UserProducts() {
    const [userProducts, setUserProducts] = useState([]);

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const response = await a_fetch(`http://127.0.0.1:8000/products/?user_products=true`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserProducts(data);
                } else {
                    throw new Error('Failed to fetch user products');
                }
            } catch (error) {
                console.error('Error fetching user products:', error);
            }
        };

        fetchUserProducts();
    }, []);

    return (
        <div className="orders-container">
            <h2 className='my-order-title'> <i class="bi bi-shop" style={{ color: "var(--color-2)" }}></i> My Shop</h2>
            <div className='order-info-container'>
                <div className='orderlines-container'>
                    {userProducts.map((product, index) => (
                        <div key={index} className="orderline">
                            <Link to={`/product/${product.id}`} className="product-link">
                                <div className="line-container">
                                    <div className="orderline-image-container">
                                        <img
                                            className="orderline-image"
                                            src={product.images.length > 0 ? `http://127.0.0.1:8000/${product.images[0].file_path}` : NoImage}
                                            alt="Product Image"
                                        />
                                        <div className='orderline-info'>
                                            <div className='orderline-text-container'>
                                                <div className='orderline-labels'>
                                                    <span className='orderline-label'> <i class="bi bi-bag-heart"></i> Product: </span> <br />
                                                    <span className='orderline-label'> <i class="bi bi-box-seam"></i>  In Stock: </span> <br />
                                                    <span className='orderline-label'> <i class="bi bi-cash-coin"></i>  Price: </span> <br />
                                                </div>
                                                <div className='orderline-text'>
                                                    <span>{product.product_name}</span>
                                                    <span>{product.quantity}</span>
                                                    <span>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserProducts;