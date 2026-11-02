/**
 * All editable data file paths.
 * Central registry so hooks and UI reference the same paths.
 */
export const DATA_FILES = {
    business: "src/data/business.json",
    about: "src/data/about.json",
    reviews: "src/data/reviews.json",
    gallery: "src/data/gallery.json",
    forms: "src/data/forms.json",
    faqs: "src/data/faqs.json",
    process: "src/data/process.json",
    productsExterior: "src/data/products/exterior.json",
    productsInterior: "src/data/products/interior.json",
    productsCatalog: "src/data/products.json",
    catalog: "src/data/catalog.json",
};

/**
 * Category route slugs — maps product.category to its URL prefix.
 */
export const CATEGORY_ROUTES = {
    exterior: "/exterior-car-accessories-chennai",
    interior: "/interior-car-accessories-chennai",
};

/**
 * Generate a slug from a name string.
 * @param {string} name
 * @returns {string}
 */
export function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Generate a simple unique ID for new items.
 * @param {string} prefix - e.g. "ext" or "int"
 * @param {number} nextNum - The next sequential number
 * @returns {string} e.g. "ext-07"
 */
export function generateId(prefix, nextNum) {
    return `${prefix}-${String(nextNum).padStart(2, "0")}`;
}
