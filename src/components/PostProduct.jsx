import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import './PostProduct.css';
import { UserContext } from '../context/UserContext';

function PostProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        product_name: '',
        description: '',
        price: 0,
        quantity: 0,
        published: true,
        images: [],
    });
    const [token] = useContext(UserContext);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prevState => ({
                ...prevState,
                images: [...prevState.images, ...files]
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // First, send the product data in JSON
            const productData = {
                product_name: formData.product_name,
                description: formData.description,
                price: formData.price,
                quantity: formData.quantity,
                published: formData.published,
            };

            const response = await fetch('http://localhost:8000/products/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            const responseData = await response.json();
            console.log('Product added successfully!', responseData);

            //Once the product has been added and fetches the product ID and sends the image
            const productId = responseData.id;
            for (const image of formData.images) {
                const imagesFormData = new FormData();
                imagesFormData.append('image', image);

                const imagesResponse = await fetch(`http://localhost:8000/products/${productId}/images`, {
                    method: 'POST',
                    body: imagesFormData
                });

                if (!imagesResponse.ok) {
                    throw new Error('Failed to add image for the product');
                }
            }

            navigate(`/product/${productId}`);
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
                    <input type="number" id="price" name="price" min="0" value={formData.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label> <br />
                    <input type="number" id="quantity" name="quantity" min="0" value={formData.quantity} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label> <br />
                    <input type="file" id="image" name="image" accept="image/*" multiple onChange={handleChange} />
                </div>
                <Tooltip title='Post' placement="top" arrow id='post-tooltip'>
                    <button className='post-button' type="submit">
                        <i className="bi bi-bag-plus-fill" id='post-new-product'></i>
                    </button>
                </Tooltip>
            </form>
        </div>
    );
}

export default PostProduct;