import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "@mui/material";
import './DeleteProduct.css';
import { UserContext } from '../context/UserContext';

function DeleteProduct({ productId }) {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [token] = useContext(UserContext);

    const handleDelete = async () => {
        console.log('Deleting product...');
        try {
            const response = await fetch(`http://localhost:8000/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            console.log('Product deleted successfully!');
            navigate('/marketplace');
            window.location.reload(); //Refresh the page so that it does not show the deleted product 
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div>
            {!confirmDelete ? (
                <Tooltip title='Delete' placement='bottom' arrow id='delete-tooltip'>
                    <button className='delete-button' onClick={() => setConfirmDelete(true)}>
                        <i className="bi bi-trash3-fill" id='trash-icon'></i>
                    </button>
                </Tooltip>
            ) : (
                <div className='delete-check-container'>
                    <p className='delete-check'>Are you sure you want to delete this product?</p>
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

export default DeleteProduct;