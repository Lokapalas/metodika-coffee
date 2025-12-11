import React, { useContext } from 'react';
import { useCart } from './CartContext';
import './Notification.css';

const Notification = () => {
  const { notification } = useCart();

  if (!notification) return null;

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;
