import React, { useState, useEffect } from 'react';
import './ProductImage.css';

const ProductImage = ({ src, alt, className, category }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Р