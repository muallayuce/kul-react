import React, { useState, useEffect } from 'react';
import NoImage from "../assets/balamgray.png";
import { Link } from "react-router-dom";
import './UserProducts.css';
import { a_fetch } from './NetworkUtils';
import ShopSearchBar from "./ShopSearchBar";

function UserProducts() {
    const [userProducts, setUserProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                let url = `http://127.0.0.1:8000/products/?user_products=true`;
                if (searchTerm && searchTerm.length >= 3) {
                    url = `http://127.0.0.1:8000/products/?product_name=${searchTerm}&user_products=true`;
                }

                const response = await a_fetch(url, {
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
    }, [searchTerm]);

    return (
        <div className="myshop-container">
            <ShopSearchBar setSearchTerm={setSearchTerm} />
            <h2 className='myshop-title'> <i className="bi bi-shop" style={{ color: "var(--color-2)" }}></i> My Shop</h2>
            <div className='myproducts-container'>
                {userProducts.map((product, index) => (
                    <div key={index} className="myproduct-line">
                        <Link to={`/product/${product.id}`} className="product-lin">
                            <div className="myproduct-image-text-container">
                                <div className="myproduct-image-container">
                                    <img
                                        className="myproduct-image"
                                        src={product.images.length > 0 ? `http://127.0.0.1:8000/${product.images[0].file_path}` : NoImage}
                                        alt="Product Image"
                                    />
                                </div>
                                <div className='myproduct-info'>
                                    <div className='myproduct-text-container'>
                                        <div className='myproduct-labels'>
                                            <span className='myproduct-label'> <i className="bi bi-bag-heart"></i> Product: </span> <br />
                                            <span className='myproduct-label'> <i className="bi bi-box-seam"></i>  In Stock: </span> <br />
                                            <span className='myproduct-label'> <i className="bi bi-cash-coin"></i>  Price: </span> <br />
                                        </div>
                                        <div className='myproduct-text'>
                                            <span>{product.product_name}</span>
                                            <span>{product.quantity}</span>
                                            <span>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProducts;
