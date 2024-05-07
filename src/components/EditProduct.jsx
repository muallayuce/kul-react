import React, { useState, useEffect } from 'react';
import { Tooltip } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NoImage from "../assets/balamgray.png";
import DeleteProductImage from './DeleteProductImage';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        product_name: '',
        description: '',
        price: 0,
        quantity: 0,
        images: [],
        toUpload: [],
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
                        id: id,
                        toUpload: []
                    });
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            };

            fetchProductData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prevState => ({
                ...prevState,
                toUpload: [...prevState.toUpload, ...files]
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
            if (!id) {
                console.error('No product ID found');
                return;
            }
            const { product_name, description, price, quantity } = formData;

            const updateUrl = `http://localhost:8000/products/${id}?product_name=${product_name}&description=${description}&price=${price}&quantity=${quantity}`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (!updateResponse.ok) {
                throw new Error('Failed to update product data');
            }

            // Upload image if available
            for (const image of formData.toUpload) {
                const imagesFormData = new FormData();
                imagesFormData.append('image', image);
                const imagesResponse = await fetch(`http://localhost:8000/products/${id}/images`, {
                    method: 'POST',
                    body: imagesFormData
                });
                if (!imagesResponse.ok) {
                    throw new Error('Failed to upload image');
                }
            }

            console.log('Product updated successfully!');
            navigate(`/product/${id}`);
        } catch (error) {
            console.error('Error updating product:', error);
        }
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

    const updateImageSlider = (deletedImageId) => {
        setFormData(prevState => ({
            ...prevState,
            images: prevState.images.filter(image => image.id !== deletedImageId)
        }));
    };

    return (
        <div className="edit-product-container">
            <h2 className='edit-product-title'>Edit your product</h2>
            <form>
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
                {formData.images && formData.images.length === 1 ? (
                    <div className='single-productimg-container'>
                    <img
                        className="product-edit-image"
                        src={`http://127.0.0.1:8000/images/${formData.images[0].id}`}
                        alt="Product Image"
                    /> 
                    <DeleteProductImage imageId={formData.images[0].id} onDelete={updateImageSlider}/>
                    </div>
                ) : formData.images && formData.images.length > 1 ? (
                    <Slider
                        dots={true}
                        infinite={true} //Infinite slide
                        speed={500} // Slide speed
                        slidesToShow={1}
                        slidesToScroll={1}
                        nextArrow={<NextArrow />}
                        prevArrow={<PrevArrow />}
                    >
                        {formData.images.map(image => (
                            <div key={image.id}>
                                <img
                                    className="product-edit-image"
                                    src={`http://127.0.0.1:8000/images/${image.id}`}
                                    alt="Product Image"
                                />
                                 <DeleteProductImage imageId={image.id} onDelete={updateImageSlider}/>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <img
                        className="product-edit-image"
                        src={NoImage}
                        alt="Placeholder Image"
                    />
                )}

                <div className="form-group">
                    <label htmlFor="image">Image:</label> <br />
                    <input type="file" id="image" name="image" accept="image/*" multiple onChange={handleChange} />
                </div>
                <Tooltip title='Update' placement="top" arrow id='update-tooltip'>
                    <button className='update-button' onClick={handleSubmit}>
                        <i className="bi bi-bag-check-fill" id='post-update'></i>
                    </button>
                </Tooltip>
            </form>
        </div>
    );
}

export default EditProduct;
