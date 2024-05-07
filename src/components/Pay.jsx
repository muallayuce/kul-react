import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Pay.css';
import Balam from '../assets/balam.png'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Pay = () => {
    const [total, setTotal] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [token] = useContext(UserContext);
    const [activeMethods, setActiveMethods] = useState({}); // Estado para los métodos activos

    useEffect(() => {
        const fetchOrderTotal = async () => {
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
                    setTotal(data.total);
                } else {
                    throw new Error('Failed to fetch order total');
                }
            } catch (error) {
                console.error('Error fetching order total:', error);
            }
        };

        fetchOrderTotal();
    }, [token]);

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
        setActiveMethods(prevState => ({
            ...Object.keys(prevState).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // Desactivar todos los métodos
            [method]: true // Establecer el método actual como activo
        }));
    };

    const navigate = useNavigate();

    const handleTransactionStatus = () => {
        const isSuccess = Math.random() < 0.5;
        navigate(`/pay/${isSuccess ? 'success' : 'fail'}`);
    };

    const renderPaymentForm = () => {
        switch (paymentMethod) {
            case 'card':
                return (
                    <div className="payment-card-form">
                        <label className="payment-card-label" htmlFor="cardNumber">Card Number:</label>
                        <input
                            className="payment-card-input"
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="Enter your card number"
                            maxLength="19" // Max including numbers and dash
                            onChange={(e) => {
                                // Only allows numbers
                                let value = e.target.value.replace(/\D/g, '');
                                // Adds a dash after 4 numbers
                                value = value.replace(/(.{4})/g, '$1-');
                                value = value.replace(/-$/, '');
                                e.target.value = value;
                            }}
                        />
                        <label className="payment-card-label" htmlFor="cardName">Name on Card:</label>
                        <input
                            className="payment-card-input"
                            type="text"
                            id="cardName"
                            name="cardName"
                            placeholder="Enter name on card"
                        />
                        <label className="payment-card-label" htmlFor="cardExpiration">Expiration:</label>
                        <input
                            className="payment-card-input"
                            type="text"
                            inputMode="numeric"
                            id="cardExpiration"
                            name="cardExpiration"
                            placeholder="MM/YY"
                            maxLength="5"
                            title="Please enter a valid expiration date in the format MM/YY"
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // No letters
                                const formattedValue = value
                                    .replace(/^(\d{2})/, '$1/')
                                    .replace(/^(\d{2})\/(\d{2}).*$/, '$1/$2');
                                e.target.value = formattedValue;
                            }}
                        />
                        <label className="payment-card-label" htmlFor="cardCvc">CVC:</label>
                        <input
                            className="payment-card-input"
                            type="password"
                            id="cardCvc"
                            name="cardCvc"
                            placeholder="Enter CVC"
                            maxLength="3"
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // No letters
                                e.target.value = value;
                            }}
                        />
                            <button className='pay-card-button' onClick={handleTransactionStatus}>
                                Pay
                            </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-summary">
                <h2 className="payment-heading">Order Summary</h2>
                <div className='total-container'>
                    <p className="total-label"><u>Total:</u></p>
                    <p className="total-amount">{total ? total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Loading...'}</p>
                    <div className='balam-container'>
                        <img src={Balam} className='balam'></img>
                    </div>
                </div>
            </div>
            <div className="vertical-line"></div>
            <div className="payment-methods">
                <h2 className="payment-heading">Payment Method</h2>
                <div className="payment-options">
                    <div className={`payment-option ${activeMethods['cash'] ? 'active' : ''}`} onClick={() => handlePaymentMethod('cash')}>
                        <i className="bi bi-cash payment-icon"></i>
                        <span className="payment-text">Cash</span>
                    </div>
                    <div className={`payment-option ${activeMethods['chat'] ? 'active' : ''}`} onClick={() => handlePaymentMethod('chat')}>
                        <i className="bi bi-chat-dots payment-icon"></i>
                        <span className="payment-text">Chat with Seller</span>
                    </div>
                    <div className={`payment-option ${activeMethods['card'] ? 'active' : ''}`} onClick={() => handlePaymentMethod('card')}>
                        <i className="bi bi-credit-card payment-icon"></i>
                        <span className="payment-text">Credit Card</span>
                    </div>
                </div>
                {renderPaymentForm()}
            </div>
        </div>
    );
};

export default Pay;
