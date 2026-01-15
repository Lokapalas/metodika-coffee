import React from 'react';

function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart({
      ...product,
      quantity: 1,
      price: product.price,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>{product.price} ?</p>
        <button onClick={handleAdd}>Add to cart</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ProductModal;
