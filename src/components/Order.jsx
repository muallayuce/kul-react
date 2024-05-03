import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import NoImage from "../assets/balamgray.png";
import './Order.css';

function Orders() {
    const [order, setOrder] = useState(null);
    const [productsDetails, setProductsDetails] = useState({});
    const [token] = useContext(UserContext);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:8000/orders/?order_status=pending`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data);

                    const productsDetails = {};
                    for (const line of data.order_lines) {
                        const productDetails = await getProductDetails(line.product_id);
                        productsDetails[line.product_id] = productDetails;
                    }
                    setProductsDetails(productsDetails);
                } else {
                    throw new Error('Failed to fetch order');
                }
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, [token]);

    const getProductDetails = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8000/products/${productId}`);
            if (response.ok) {
                const productDetails = await response.json();
                return productDetails;
            } else {
                throw new Error('Failed to fetch product details');
            }
        } catch (error) {
            console.error(`Error fetching product details for product ID ${productId}:`, error);
            return null;
        }
    };

    return (
        <div className="orders-container">
            <h2 className='my-order-title'> <i class="bi bi-box2-heart"></i> My Order</h2>
            {order && (
                <div>
                    <div className='order-info-container'>
                        <p className='order-price'>Total: <span className='order-price-info'>${order.total}</span></p>
                        <p className='order-status'>Status: <span className='order-status-info'>{order.order_status}</span></p>
                    </div>
                    <button className='pay-button' onClick={() => console.log('Paying...')}><i class="bi bi-cash"></i>Pay</button>
                    <h3 className='mycart-tile'> <i class="bi bi-cart4"></i> My Cart:</h3>
                    <div className='orderlines-container'>
                        {order.order_lines.map((line, index) => (
                            <div key={index} className="orderline">
                                Product: {line.product_id} | Quantity: {line.quantity} | Price: {line.total}
                                {productsDetails[line.product_id] && (
                                    <div className="order-header">
                                        <div className="product-image-container">
                                            {productsDetails[line.product_id].images.length > 0 ? (
                                                <img
                                                    className="product_image"
                                                    src={`http://127.0.0.1:8000/${productsDetails[line.product_id].images[0].file_path}`}
                                                    alt="Product Image"
                                                />
                                            ) : (
                                                <img
                                                    className="product_image"
                                                    src={NoImage}
                                                    alt="Placeholder Image"
                                                />
                                            )}
                                        </div>
                                        <p className="product-price">Subtotal: ${line.total}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
