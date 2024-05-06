import React, { useState, useEffect } from 'react';
import { Tooltip } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';
import Slider from "react-slick"; // Importa el componente Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NoImage from "../assets/balamgray.png";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        product_name: '',
        description: '',
        price: 0,
        quantity: 0,
        image: null
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
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prevState => ({
                ...prevState,
                [name]: files[0]
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
            const { product_name, description, price, quantity, image } = formData;

            // Update product data
            const productUpdateData = {
                product_name,
                description,
                price,
                quantity
            };
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
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                const imageUrl = `http://localhost:8000/products/${id}/images`;
                const imageResponse = await fetch(imageUrl, {
                    method: 'POST',
                    body: formData
                });
                if (!imageResponse.ok) {
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
                    <input type="number" id="price" name="price" min="0" value={formData.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label> <br />
                    <input type="number" id="quantity" name="quantity" min="0" value={formData.quantity} onChange={handleChange} />
                </div>
                {formData.images && formData.images.length === 1 ? (
                    <img
                        className="product-d-image"
                        src={`http://127.0.0.1:8000/images/${formData.images[0].id}`}
                        alt="Product Image"
                    />
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

                <div className="form-group">
                    <label htmlFor="image">Image:</label> <br />
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
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
