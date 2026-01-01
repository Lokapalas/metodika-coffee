import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Проверка аутентификации
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey === 'metodika2024') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = () => {
    if (secretKey === 'metodika2024') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_key', secretKey);
      fetchOrders();
    } else {
      setError('Неверный ключ доступа');
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders?secret_key=metodika2024');
      if (!response.ok) throw new Error('Ошибка загрузки заказов');
      const data = await response.json();
      setOrders(data.sort((a, b) => b.id - a.id)); // Новые сверху
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // В будущем можно добавить endpoint для обновления статуса
      // Пока просто обновляем локально
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Здесь можно добавить API call для сохранения статуса
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      preparing: '#2196F3',
      ready: '#4CAF50',
      completed: '#9E9E9E',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Ожидает',
      preparing: 'Готовится',
      ready: 'Готов',
      completed: 'Выполнен',
      cancelled: 'Отменен'
    };
    return texts[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>Админ-панель</h2>
          <p>Введите секретный ключ для доступа</p>
          {error && <div className="error-message">{error}</div>}
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Секретный ключ"
            className="key-input"
          />
          <button onClick={handleLogin} className="login-btn">
            Войти
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Загрузка заказов...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Заказы ({orders.length})</h2>
        <div className="header-actions">
          <button onClick={fetchOrders} className="refresh-btn">
            Обновить
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_key');
              setIsAuthenticated(false);
            }}
            className="logout-btn"
          >
            Выйти
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Заказов нет</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Заказ #{order.id}</span>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="order-meta">
                  <span className="order-time">{formatDate(order.created_at)}</span>
                  <span className="order-total">{order.total} ₽</span>
                </div>
              </div>

              <div className="order-customer">
                <strong>{order.customer.name}</strong>
                <span>{order.customer.phone}</span>
              </div>

              <div className="order-items">
                <strong>Состав:</strong>
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span className="item-name">
                      {item.name} {item.size && `(${item.size})`} × {item.quantity}
                    </span>
                    <span className="item-price">{item.price * item.quantity} ₽</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Ожидает</option>
                  <option value="preparing">Готовится</option>
                  <option value="ready">Готов</option>
                  <option value="completed">Выполнен</option>
                  <option value="cancelled">Отменен</option>
                </select>
                
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="details-btn"
                >
                  Детали
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно с деталями заказа */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
            
            <h3>Заказ #{selectedOrder.id}</h3>
            
            <div className="modal-section">
              <h4>Клиент</h4>
              <p><strong>Имя:</strong> {selectedOrder.customer.name}</p>
              <p><strong>Телефон:</strong> {selectedOrder.customer.phone}</p>
            </div>

            <div className="modal-section">
              <h4>Детали заказа</h4>
              <p><strong>Время:</strong> {formatDate(selectedOrder.created_at)}</p>
              <p><strong>Статус:</strong> {getStatusText(selectedOrder.status)}</p>
              <p><strong>Итого:</strong> {selectedOrder.total} ₽</p>
            </div>

            <div className="modal-section">
              <h4>Товары</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="modal-item">
                  <div className="modal-item-header">
                    <span>{item.name} {item.size && `(${item.size})`}</span>
                    <span>{item.price * item.quantity} ₽</span>
                  </div>
                  <div className="modal-item-details">
                    <span>Кол-во: {item.quantity}</span>
                    {item.addons && Object.keys(item.addons).length > 0 && (
                      <div className="modal-addons">
                        <strong>Дополнения:</strong>
                        {JSON.stringify(item.addons, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
