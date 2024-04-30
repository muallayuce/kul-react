import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "@mui/material";
import './DeleteProduct.css';

function DeleteProduct({ productId }) {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        console.log('Deleting product...');
        try {
            const response = await fetch(`http://localhost:8000/products/${productId}`, {
                method: 'DELETE'
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
                <Tooltip title='Delete' placement="top" arrow id='delete-tooltip'>
                    <button className='delete-button' onClick={() => setConfirmDelete(true)}>
                        <i className="bi bi-trash3-fill" id='trash-icon'></i>
                    </button>
                </Tooltip>
            ) : (
                <div>
                    <p>Are you sure you want to delete this product?</p>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => setConfirmDelete(false)}>No</button>
                </div>
            )}
        </div>
    );
}

export default DeleteProduct;