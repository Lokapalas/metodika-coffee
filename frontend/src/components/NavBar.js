import React, { useState } from 'react';
import './NavBar.css';
import { useCart } from '../context/CartContext';

function NavBar() {
  const { getTotalItems, toggleCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Р›РѕРіРѕС‚РёРї */}
        <div className="nav-logo">
          <h1>в