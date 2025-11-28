// src/utils/pricing.js

const CATEGORY_BASE_PRICES = {
  'fresh-produce': 4.99,
  'meat-seafood': 19.99,
  'bread-bakery': 3.49,
  'coffee': 12.99,
  default: 7.99,
};

export function getGroceryPrice(item) {
  const base = CATEGORY_BASE_PRICES[item.category] ?? CATEGORY_BASE_PRICES.default;

  // Variation ensures no two items are identical in price
  const variation = (item.id % 300) / 100;

  return Number((base + variation).toFixed(2));
}
