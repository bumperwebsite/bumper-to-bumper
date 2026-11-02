/**
 * Price formatting shared by product cards, cart, checkout and detail pages.
 * A null/undefined/invalid price means the product has no configured price
 * and routes through the "Price on Request" quotation workflow.
 */
export function formatPrice(price) {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Price on Request';
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
}
