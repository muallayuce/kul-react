import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import './EditProduct.css';
import { UserContext } from '../context/UserContext';

function EditOrderline({ productId, orderlineId, onUpdate }) {
    const [quantity, setQuantity] = useState(0); // Inicializa la cantidad con 0
    const [token] = useContext(UserContext);

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
                    product_id: productId, // El mismo ID del producto actual
                    quantity: quantity // Nueva cantidad
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            console.log('Product updated successfully!');

        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <Tooltip title='Update' placement='bottom' arrow id='update-tooltip'>
                <button className='update-button' onClick={handleUpdate}>
                    <i className="bi bi-pencil-fill" id='pencil-icon'></i>
                </button>
            </Tooltip>
        </div>
    );
}

export default EditOrderline;