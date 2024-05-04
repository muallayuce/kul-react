import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import './EditOrderline.css';
import { UserContext } from '../context/UserContext';

function EditOrderline({ productId, orderlineId, initialQuantity }) {
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
            window.location.reload(); //Refresh the page
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            {!confirmEdit ? (
                <Tooltip title='Change quantity' placement='top' arrow id='update-orderline-tooltip'>
                    <button className='update-orderline-button' onClick={() => setConfirmEdit(true)}>
                        <i className="bi bi-plus-slash-minus" id='update-orderline-icon'></i>
                    </button>
                </Tooltip>
            ) : (
                <div className='set-quantity-container'>
                    <input className='quantity-orderline-input'
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(e.target.value)}
                    />

                    <button className='yes-button' onClick={handleUpdate}>
                        <i className="bi bi-check-circle-fill" id='check-icon'></i>
                    </button>
                </div>

            )}
        </div>
    );
}

export default EditOrderline;