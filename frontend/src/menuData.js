export const categories = [
  {
    id: 'coffee-classic',
    name: 'Classic coffee',
    icon: '?',
  },
  {
    id: 'coffee-special',
    name: 'Special coffee',
    icon: '?',
  },
  {
    id: 'tea',
    name: 'Tea',
    icon: '??',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    icon: '??',
  },
];

export const products = [
  {
    id: 'espresso',
    category: 'coffee-classic',
    name: 'Espresso',
    description: 'Strong black coffee',
    price: 150,
    sizes: {
      S: { price: 120, available: true },
      M: { price: 150, available: true },
      L: { price: 180, available: true },
    },
  },
  {
    id: 'americano',
    category: 'coffee-classic',
    name: 'Americano',
    description: 'Espresso with hot water',
    price: 170,
    sizes: {
      M: { price: 170, available: true },
      L: { price: 200, available: true },
    },
  },
  {
    id: 'cappuccino',
    category: 'coffee-special',
    name: 'Cappuccino',
    description: 'Coffee with milk foam',
    price: 220,
    sizes: {
      M: { price: 220, available: true },
      L: { price: 260, available: true },
    },
  },
];

export function getProductsByCategory(categoryId) {
  return products.filter((p) => p.category === categoryId);
}

export function getBasePrice(product) {
  if (product.sizes) {
    const available = Object.values(product.sizes)
      .filter((s) => s.available)
      .map((s) => s.price);
    return Math.min(...available);
  }
  return product.price || 0;
}

export function getProductById(id) {
  return products.find((p) => p.id === id);
}
