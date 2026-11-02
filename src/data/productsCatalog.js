/**
 * Bumper To Bumper Car Accessories - Product Catalog (compatibility shim)
 *
 * The product data itself lives in src/data/products.json so the edit
 * console can read and save it like every other data file.
 *
 * This module keeps the original export surface (productsCatalog,
 * PRODUCT_CATEGORIES, getProductById, getProductsByCategory, formatPrice)
 * so existing import sites do not need to change.
 *
 * Pricing: a product with a null price displays "Price on Request" and
 * routes the order through the quotation workflow.
 */
import catalogData from './products.json';

export const PRODUCT_CATEGORIES = ['All Products', ...(catalogData.categories || [])];

export const productsCatalog = catalogData.products || [];

export function getProductById(id) {
  return productsCatalog.find(p => p.id === Number(id) || p.slug === String(id));
}

export function getProductsByCategory(category) {
  if (!category || category === 'All Products' || category === 'All') {
    return productsCatalog;
  }
  return productsCatalog.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function formatPrice(price) {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Price on Request';
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
}
