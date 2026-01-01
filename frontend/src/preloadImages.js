// Скрипт предзагрузки изображений
export const preloadProductImages = (products) => {
  if (!products || !Array.isArray(products)) return;
  
  const imageUrls = new Set();
  
  // Собираем все URL изображений
  products.forEach(product => {
    if (product.image) {
      imageUrls.add(product.image);
      // Также добавляем альтернативные форматы
      imageUrls.add(product.image.replace('.jpg', '.JPG'));
      imageUrls.add(product.image.replace('.JPG', '.jpg'));
      imageUrls.add(product.image.replace('.jpg', '.png'));
      imageUrls.add(product.image.replace('.png', '.jpg'));
      imageUrls.add(product.image.replace('.PNG', '.jpg'));
    }
  });
  
  // Предзагружаем изображения
  Array.from(imageUrls).forEach(url => {
    const img = new Image();
    img.src = url;
  });
  
  console.log(`Предзагружено ${imageUrls.size} изображений`);
};
