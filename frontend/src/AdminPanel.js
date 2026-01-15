import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // РџСЂРѕРІРµСЂРєР° Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё
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
      setError('РќРµРІРµСЂРЅС‹Р№ РєР»СЋС‡ РґРѕСЃС‚СѓРїР°');
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders?secret_key=metodika2024');
      if (!response.ok) throw new Error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё Р·Р°РєР°Р·РѕРІ');
      const data = await response.json();
      setOrders(data.sort((a, b) => b.id - a.id)); // РќРѕРІС‹Рµ СЃРІРµСЂС…Сѓ
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Р’ Р±СѓРґСѓС‰РµРј РјРѕР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ endpoint РґР»СЏ РѕР±РЅРѕРІР»РµРЅРёСЏ СЃС‚Р°С‚СѓСЃР°
      // РџРѕРєР° РїСЂРѕСЃС‚Рѕ РѕР±РЅРѕРІР»СЏРµРј Р»РѕРєР°Р»СЊРЅРѕ
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Р—РґРµСЃСЊ РјРѕР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ API call РґР»СЏ СЃРѕС…СЂР°РЅРµРЅРёСЏ СЃС‚Р°С‚СѓСЃР°
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
      pending: 'РћР¶РёРґР°РµС‚',
      preparing: 'Р“РѕС‚РѕРІРёС‚СЃСЏ',
      ready: 'Р“РѕС‚РѕРІ',
      completed: 'Р’С‹РїРѕР»РЅРµРЅ',
      cancelled: 'РћС‚РјРµРЅРµРЅ'
    };
    return texts[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>РђРґРјРёРЅ-РїР°РЅРµР»СЊ</h2>
          <p>Р’РІРµРґРёС‚Рµ СЃРµРєСЂРµС‚РЅС‹Р№ РєР»СЋС‡ РґР»СЏ РґРѕСЃС‚СѓРїР°</p>
          {error && <div className="error-message">{error}</div>}
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="РЎРµРєСЂРµС‚РЅС‹Р№ РєР»СЋС‡"
            className="key-input"
          />
          <button onClick={handleLogin} className="login-btn">
            Р’РѕР№С‚Рё
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Р—Р°РіСЂСѓР·РєР° Р·Р°РєР°Р·РѕРІ...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Р—Р°РєР°Р·С‹ ({orders.length})</h2>
        <div className="header-actions">
          <button onClick={fetchOrders} className="refresh-btn">
            РћР±РЅРѕРІРёС‚СЊ
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_key');
              setIsAuthenticated(false);
            }}
            className="logout-btn"
          >
            Р’С‹Р№С‚Рё
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Р—Р°РєР°Р·РѕРІ РЅРµС‚</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Р—Р°РєР°Р· #{order.id}</span>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="order-meta">
                  <span className="order-time">{formatDate(order.created_at)}</span>
                  <span className="order-total">{order.total} в‚Ѕ</span>
                </div>
              </div>

              <div className="order-customer">
                <strong>{order.customer.name}</strong>
                <span>{order.customer.phone}</span>
              </div>

              <div className="order-items">
                <strong>РЎРѕСЃС‚Р°РІ:</strong>
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span className="item-name">
                      {item.name} {item.size && `(${item.size})`} Г— {item.quantity}
                    </span>
                    <span className="item-price">{item.price * item.quantity} в‚Ѕ</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">РћР¶РёРґР°РµС‚</option>
                  <option value="preparing">Р“РѕС‚РѕРІРёС‚СЃСЏ</option>
                  <option value="ready">Р“РѕС‚РѕРІ</option>
                  <option value="completed">Р’С‹РїРѕР»РЅРµРЅ</option>
                  <option value="cancelled">РћС‚РјРµРЅРµРЅ</option>
                </select>
                
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="details-btn"
                >
                  Р”РµС‚Р°Р»Рё
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ СЃ РґРµС‚Р°Р»СЏРјРё Р·Р°РєР°Р·Р° */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>Г—</button>
            
            <h3>Р—Р°РєР°Р· #{selectedOrder.id}</h3>
            
            <div className="modal-section">
              <h4>РљР»РёРµРЅС‚</h4>
              <p><strong>Р