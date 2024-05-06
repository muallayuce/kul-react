import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import './EditOrderline.css';
import { UserContext } from '../context/UserContext';

function EditOrderline({ productId, orderlineId, initialQuantity, onUpdateQuantity }) {
    const [quantity, setQuantity] = useState(parseInt(initialQuantity)); //parseInt Changes str to int
    const [token] = useContext(UserContext);
    const [confirmEdit, setConfirmEdit] = useState(false);

    const handleUpdate = async () => {
        console.log('Updating product...');
        try {
            const response = await fetch(`http://localhost:8000/order_lines/${orderlineId}`, {
                method: 'PUT',
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
                throw new Error('Failed to update product');
            }
            console.log('Product updated successfully!');
            onUpdateQuantity(quantity);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            {!confirmEdit ? (
                <Tooltip title='Change quantity' placement='right' arrow id='update-orderline-tooltip'>
                    <button className='update-orderline-button' onClick={() => setConfirmEdit(true)}>
                        <i className="bi bi-plus-slash-minus" id='update-orderline-icon'></i>
                    </button>
                </Tooltip>
            ) : (
                <div className='set-quantity-container'>
                    <input className='quantity-orderline-input'
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
                    <Tooltip title='Update quantity' placement='right' arrow id='update-orderline-tooltip'>
                    <button className='update-basket-button' onClick={() => { handleUpdate(); setConfirmEdit(false); }}>
                    <i class="bi bi-arrow-repeat" id='update-basket-icon'></i> <i className="bi bi-basket-fill" id='update-basket-icon'></i>
                    </button>
                    </Tooltip>
                </div>
            )}
        </div>
    );
}

export default EditOrderline;