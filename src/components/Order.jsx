import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import NoImage from "../assets/balamgray.png";
import { Link } from "react-router-dom";
import './Order.css';
import DeleteOrderline from './DeleteOrderline';
import EditOrderline from './EditOrderline';

function Orders() {
    const [order, setOrder] = useState(null);
    const [productsDetails, setProductsDetails] = useState({});
    const [token] = useContext(UserContext);
    const [orderLines, setOrderLines] = useState([]);

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

    const updateOrderLineQuantity = (orderlineId, newQuantity) => {
        setOrderLines(prevOrderLines =>
            prevOrderLines.map(orderLine =>
                orderLine.id === orderlineId ? { ...orderLine, quantity: newQuantity } : orderLine
            )
        );
    
        const updatedOrder = { ...order };
        updatedOrder.order_lines = updatedOrder.order_lines.map(line => {
            if (line.id === orderlineId) {
                line.quantity = newQuantity;
                line.total = line.quantity * productsDetails[line.product_id].price;
            }
            return line;
        });
        updatedOrder.total = updatedOrder.order_lines.reduce((total, line) => total + line.total, 0);
        setOrder(updatedOrder);
    };

    const handleDeleteOrderline = (orderlineId) => {
        // Filters and updates the order when an orderline is deleted
        const updatedOrderLines = order.order_lines.filter(line => line.id !== orderlineId);
        const updatedOrder = { ...order, order_lines: updatedOrderLines };
        updatedOrder.total = updatedOrderLines.reduce((total, line) => total + line.total, 0);
        setOrder(updatedOrder);
    };

    return (
        <div className="orders-container">
            <h2 className='my-order-title'> <i class="bi bi-box2-heart" style={{ color: "var(--color-3)" }}></i> My Order</h2>
            {order && (
                <div>
                    <div className='order-info-container'>
                        <p className='order-price'><u>Total:</u>  <span className='order-price-info'>{order.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
                        <p className='order-status'>Status: <span className='order-status-info'>{order.order_status}</span></p>
                    </div>
                    <Link to={'/pay'}>
                    <button className='pay-button' onClick={() => console.log('Paying...')}><i class="bi bi-cash"></i>Pay</button>
                    </Link>
                    <h3 className='mycart-tile'> <i class="bi bi-cart4"></i> My Cart:</h3>
                    <div className='orderlines-container'>
                        {order.order_lines.map((line, index) => (
                            <div key={index} className="orderline">
                                <Link to={`/product/${line.product_id}`} key={index}>
                                    {productsDetails[line.product_id] && (
                                        <div className="line-container">
                                            <div className="orderline-image-container">
                                                {productsDetails[line.product_id].images.length > 0 ? (
                                                    <img
                                                        className="orderline-image"
                                                        src={`http://127.0.0.1:8000/${productsDetails[line.product_id].images[0].file_path}`}
                                                        alt="Product Image"
                                                    />
                                                ) : (
                                                    <img
                                                        className="orderline-image"
                                                        src={NoImage}
                                                        alt="Placeholder Image"
                                                    />
                                                )}
                                            </div>
                                            <div className='orderline-info'>
                                                <div className='orderline-text-container'>
                                                    <div className='orderline-labels'>
                                                        <span className='orderline-label'> <i class="bi bi-bag-heart"></i> Product: </span> <br />
                                                        <span className='orderline-label'> <i class="bi bi-basket"></i>  Quantity: </span> <br />
                                                        <span className='orderline-label'> <i class="bi bi-cash-coin"></i>  Price: </span> <br />
                                                    </div>
                                                    <div className='orderline-text'>
                                                        <span>{productsDetails[line.product_id].product_name}</span>
                                                        <span>{line.quantity}</span>
                                                        <span>{productsDetails[line.product_id].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                                    </div>
                                                </div>
                                                <div className='subtotal-container'>
                                                    <p className="subtotal-label">
                                                        <u>Subtotal:</u> <span className='subtotal-text'> {line.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                                <DeleteOrderline orderlineId={line.id} onDelete={handleDeleteOrderline} />
                                <EditOrderline
                                    orderlineId={line.id}
                                    productId={line.product_id}
                                    initialQuantity={line.quantity}
                                    onUpdateQuantity={(newQuantity) => updateOrderLineQuantity(line.id, newQuantity)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
