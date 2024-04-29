import React, { useState } from 'react';
import { Tooltip } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import './PostProduct.css'

function PostProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        product_name: '',
        description: '',
        price: 0,
        quantity: 0,
        published: true,
        seller_id: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            const responseData = await response.json();
            console.log('Product added successfully!');
            navigate(`/product/${responseData.id}`); // Access the product ID created in the response
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="post-product-container">
            <h2 className='post-product-title'>Post a new product</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="product_name">Product name:</label> <br />
                    <input type="text" id="product_name" name="product_name" value={formData.product_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label> <br />
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label> <br />
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label> <br />
                    <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="seller_id">Seller ID:</label> <br />
                    <input type="number" id="seller_id" name="seller_id" value={formData.seller_id} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Images:</label> <br />
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
                </div>
                <Tooltip title='Post' placement="top" arrow>
                    <button className='post-button' type="submit">
                        <i class="bi bi-bag-plus-fill" id='post-new-product'></i>
                    </button>
                </Tooltip>
            </form>
        </div>
    );
}

export default PostProduct;