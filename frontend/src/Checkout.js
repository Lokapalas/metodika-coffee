import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';

function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Web',
      },
      body: JSON.stringify({
        items: cartItems,
        total: getTotalPrice(),
        source: 'website',
      }),
    });

    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return <h2>Order sent successfully</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>
      <p>Total: {getTotalPrice()} ?</p>
      <button onClick={handleSubmit}>Confirm order</button>
    </div>
  );
}

export default Checkout;
