import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import './DeleteOrderline.css';
import { UserContext } from '../context/UserContext';

function DeleteOrderline({ orderlineId, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [token] = useContext(UserContext);

    const handleDelete = async () => {
        console.log('Deleting orderline...');
        try {
            const response = await fetch(`http://localhost:8000/order_lines/${orderlineId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete orderline');
            }
            console.log('Orderline deleted successfully!');
            onDelete(orderlineId);
        } catch (error) {
            console.error('Error deleting orderline:', error);
        }
    };

    return (
        <div>
            {!confirmDelete ? (
                <Tooltip title='Delete' placement='top' arrow id='delete-orderline-tooltip'>
                    <button className='delete-orderline-button' onClick={() => setConfirmDelete(true)}>
                        <i className="bi bi-trash3-fill" id='orderline-trash-icon'></i>
                    </button>
                </Tooltip>
            ) : (
                <div className='delete-check-container'>
                    <p className='delete-check'>Delete this product from order?</p>
                    <div className='yes-no-container'>
                        <button className='yes-button' onClick={handleDelete}>
                            <i className="bi bi-check-circle-fill" id='check-icon'></i>
                        </button>
                        <button className='no-button' onClick={() => setConfirmDelete(false)}>
                            <i className="bi bi-x-circle-fill" id='x-icon'></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeleteOrderline;
