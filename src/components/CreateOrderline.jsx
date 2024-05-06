import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import './CreateOrderline.css';
import { UserContext } from '../context/UserContext';

function CreateOrderline({ productId }) {
    const [quantity, setQuantity] = useState(1); // quantity 1 by default
    const [token] = useContext(UserContext);
    const [confirmQuantity, setConfirmQuantity] = useState(false);

    const handleCreateOrderline = async () => {
        console.log('Adding to cart...');
        try {
            const response = await fetch(`http://localhost:8000/order_lines/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            console.log('Product added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div>
            {!confirmQuantity ? (
                <div className='add-cart-button-container'>
                    <Tooltip title='Add to cart' placement="top" arrow id="add-cart-tooltip" >
                        <button className="add-cart-button">
                            <i class="bi bi-cart-plus" id='add-cart-icon' onClick={() => setConfirmQuantity(true)}></i>
                        </button>
                    </Tooltip>
                </div>
            ) : (
                <div className='confirm-cart-items-container'>
                    <input className='quantity-cart-input'
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                            let newValue = e.target.value;
                            // Only allows empty string and integer >= 1
                            if (newValue === '' || (parseInt(newValue) >= 1 && !isNaN(newValue))) {
                                setQuantity(newValue === '' ? '' : parseInt(newValue));
                            }
                        }}
                    />
                    <div className=''>
                    <Tooltip title='Add to cart' placement='top' arrow id='add-cart-tooltip'>
                        <button className="confirm-cart-button" onClick={() => { handleCreateOrderline(); setConfirmQuantity(false); }}>
                            <i class="bi bi-plus-circle" id='confirm-cart-icon'/>
                        </button>
                    </Tooltip>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateOrderline;