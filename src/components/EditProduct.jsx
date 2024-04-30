import React, { useState, useEffect } from 'react';
import { Tooltip } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

function EditProduct() {
    const { id } = useParams(); // Obtener el ID del producto de los parámetros de la URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        product_name: '',
        description: '',
        price: 0,
        quantity: 0
    });

    useEffect(() => {
        if (id) {
            const fetchProductData = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/products/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch product data');
                    }
                    const productData = await response.json();
                    setFormData({
                        ...productData,
                        id: id
                    });
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            };
    
            fetchProductData();
        }
    }, [id]);
    

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
            if (!id) {
                console.error('No product ID found');
                return;
            }
            const { product_name, description, price, quantity } = formData;
            const url = `http://localhost:8000/products/${id}?product_name=${product_name}&description=${description}&price=${price}&quantity=${quantity}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            console.log('Product updated successfully!');
            navigate(`/product/${id}`);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    

    return (
        <div className="edit-product-container">
            <h2 className='edit-product-title'>Edit your product</h2>
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
                <Tooltip title='Update' placement="top" arrow id='update-tooltip'>
                    <button className='update-button' type="submit">
                    <i className="bi bi-bag-check-fill" id='post-update'></i>
                    </button>
                </Tooltip>
            </form>
        </div>
    );
}

export default EditProduct;