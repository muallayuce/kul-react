import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Orders() {
  const [order, setOrder] = useState(null);
  const [token] = useContext(UserContext);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:8000/orders/?order_status=pending`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          throw new Error('Failed to fetch order');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [token]);

  return (
    <div>
      <h2>Your Order</h2>
      {order && (
        <div>
          <p>Order ID: {order.id}</p>
          <p>Status: {order.order_status}</p>
          <p>Total: ${order.total}</p>
          <h3>Order Lines:</h3>
          <ul>
            {order.order_lines.map((line, index) => (
              <li key={index}>
                Product: {line.product_name} | Quantity: {line.quantity} | Price: ${line.price}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => console.log('Paying...')}>Pay</button>
    </div>
  );
}

export default Orders;
