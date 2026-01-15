export function getProductImage(name, image) {
  if (image) {
    return `/images/products/${image}`;
  }

  const safeName = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return `/images/products/${safeName}.jpg`;
}

export function getCategoryIcon(categoryId) {
  switch (categoryId) {
    case 'coffee-classic':
      return '?';
    case 'coffee-special':
      return '?';
    case 'tea':
      return '??';
    case 'desserts':
      return '??';
    default:
      return '?';
  }
}
