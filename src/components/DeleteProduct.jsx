import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
                <button onClick={() => setConfirmDelete(true)}>Delete Product</button>
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