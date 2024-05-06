import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import './DeleteProductImage.css';

function DeleteProductImage({ imageId, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        console.log('Deleting product image...');
        try {
            const response = await fetch(`http://localhost:8000/images/${imageId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete product image');
            }
            console.log('Product image deleted successfully!');
            onDelete(imageId);
        } catch (error) {
            console.error('Error deleting product image:', error);
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
                    <p className='delete-check'>Delete?</p>
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

export default DeleteProductImage;