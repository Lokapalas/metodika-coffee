import React, { useState, useEffect } from 'react';
import './ProductImage.css';

const ProductImage = ({ src, alt, className, category }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Иконки по категориям (резервные)
  const getCategoryIcon = () => {
    if (category) {
      const cat = category.toLowerCase();
      if (cat.includes('кофе')) return '☕️';
      if (cat.includes('чай')) return '🍵';
      if (cat.includes('шоколад') || cat.includes('какао')) return '🍫';
      if (cat.includes('коктейль') || cat.includes('смузи') || cat.includes('лимонад')) return '🥤';
      if (cat.includes('завтрак') || cat.includes('каша') || cat.includes('сырники') || cat.includes('вафли')) return '🥞';
      if (cat.includes('десерт') || cat.includes('торт') || cat.includes('круассан') || cat.includes('макарун')) return '🍰';
      if (cat.includes('еда') || cat.includes('пицца') || cat.includes('сэндвич') || cat.includes('роллы') || cat.includes('суп')) return '🍕';
    }
    return '☕️';
  };

  // Цвет фона по категориям
  const getBackgroundColor = () => {
    if (category) {
      const cat = category.toLowerCase();
      if (cat.includes('кофе')) return 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)';
      if (cat.includes('чай')) return 'linear-gradient(135deg, #7B9E60 0%, #9BC88D 100%)';
      if (cat.includes('шоколад') || cat.includes('какао')) return 'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)';
      if (cat.includes('коктейль') || cat.includes('смузи') || cat.includes('лимонад')) return 'linear-gradient(135deg, #0288D1 0%, #4FC3F7 100%)';
      if (cat.includes('завтрак')) return 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)';
      if (cat.includes('десерт')) return 'linear-gradient(135deg, #D81B60 0%, #F48FB1 100%)';
      if (cat.includes('еда')) return 'linear-gradient(135deg, #43A047 0%, #81C784 100%)';
    }
    return 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)';
  };

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Проверяем наличие изображения
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setHasError(false);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
  }, [src]);

  if (isLoading) {
    return (
      <div className={`${className} image-loading`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (hasError || !imageSrc) {
    return (
      <div 
        className={`${className} image-placeholder`}
        style={{ background: getBackgroundColor() }}
      >
        <div className="placeholder-icon">{getCategoryIcon()}</div>
        <div className="placeholder-text">{category || 'Товар'}</div>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt || 'Изображение товара'}
      className={`${className} product-image-real`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};

export default ProductImage;
