import React, { useState, useContext } from 'react';
import { Tooltip } from "@mui/material";
import './DeleteProductImage.css';

function DeleteProductImage({ imageId, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleProductImageDelete = async (e) => {
        e.preventDefault();
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
                <Tooltip title='Delete image' placement='right' arrow id='delete-productimage-tooltip'>
                    <button className='delete-productimage-button' onClick={() => setConfirmDelete(true)}>
                        <i className="bi bi-trash3-fill" id='productimage-trash-icon'></i>
                    </button>
                </Tooltip>
            ) : (
                <div className='delete-productimage-check-container'>
                    <p className='delete-check'>Delete this image?</p>
                    <div className='delete-productimage-yes-no-container'>
                        <button className='delete-productimage-yes-button' onClick={handleProductImageDelete}>
                            <i className="bi bi-check-circle-fill" id='check-icon'></i>
                        </button>
                        <button className='delete-productimage-no-button' onClick={() => setConfirmDelete(false)}>
                            <i className="bi bi-x-circle-fill" id='x-icon'></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeleteProductImage;