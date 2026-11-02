/**
 * Shop catalogue data helpers — src/data/products.json
 * ({ categories: string[], products: Product[] }).
 *
 * Pure functions, no React. `useShopProducts` wraps the draft-mutating
 * ones with `updateEditData` so hasChanges / save / discard keep working
 * exactly like the other edit-console hooks. The UI pass imports the
 * factories and validators from here directly.
 */
import { slugify } from "../constants.js";

/** Field keys of one product, in file order. */
export const SHOP_PRODUCT_FIELD_KEYS = [
    "id",
    "slug",
    "name",
    "category",
    "price",
    "inStock",
    "stockStatus",
    "badge",
    "image",
    "galleryImage",
    "shortDescription",
    "description",
    "specifications",
];

export function createBlankSpecification() {
    return { label: "", value: "" };
}

/**
 * A new product with every field the storefront reads. Price starts as
 * null so the card shows "Price on Request" until the owner sets one.
 */
export function createBlankProduct({ id = 1, categories = [] } = {}) {
    return {
        id,
        slug: "new-product",
        name: "New product",
        category: Array.isArray(categories) && categories.length ? categories[0] : "",
        price: null,
        inStock: true,
        stockStatus: "In Stock",
        badge: "",
        image: "",
        galleryImage: "",
        shortDescription: "",
        description: "",
        specifications: [],
    };
}

/** Next numeric id — mirrors the GalleryEditor pattern. */
export function nextShopProductId(products) {
    const ids = (Array.isArray(products) ? products : [])
        .map((p) => Number(p?.id))
        .filter(Number.isFinite);
    return ids.length ? Math.max(...ids) + 1 : 1;
}

/** Slug that does not collide with any other product (ignores one index). */
export function uniqueShopSlug(products, baseSlug, ignoreIndex = -1) {
    const taken = new Set();
    (Array.isArray(products) ? products : []).forEach((p, i) => {
        if (i !== ignoreIndex && p?.slug) taken.add(String(p.slug));
    });
    const base = slugify(String(baseSlug || "new-product")) || "new-product";
    if (!taken.has(base)) return base;
    let n = 2;
    while (taken.has(`${base}-${n}`)) n += 1;
    return `${base}-${n}`;
}

/**
 * Accepts null, numbers, and the raw strings a price field can hold
 * ("" , "Price on Request", "₹1,500"). Returns a non-negative number
 * or null. Never NaN, never negative.
 */
export function normalizePrice(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") {
        const t = value.trim().toLowerCase();
        if (t === "" || t === "null" || t === "price on request") return null;
        const n = Number(t.replace(/[₹,\s]/g, ""));
        return Number.isFinite(n) && n >= 0 ? n : null;
    }
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : null;
}

/** How many products reference a category name. */
export function categoryUsage(products, name) {
    if (!name) return 0;
    return (Array.isArray(products) ? products : []).filter((p) => p?.category === name).length;
}

/**
 * Rename a category everywhere: the categories list plus every product
 * that references it. Mutates the draft in place (call inside
 * updateEditData). Returns true when anything changed.
 */
export function renameShopCategory(draft, oldName, newName) {
    const next = String(newName || "").trim();
    if (!oldName || !next || next === oldName) return false;
    if (!draft || !Array.isArray(draft.categories)) return false;
    const idx = draft.categories.indexOf(oldName);
    if (idx === -1) return false;
    if (draft.categories.includes(next)) return false; // would create a duplicate
    draft.categories[idx] = next;
    for (const p of draft.products || []) {
        if (p?.category === oldName) p.category = next;
    }
    return true;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Per-product problems for inline display.
 * @returns {{ severity: "error" | "warning", field: string, message: string }[]}
 */
export function validateShopProduct(product, { products = [], index = -1, categories = [] } = {}) {
    const issues = [];
    if (!product || typeof product !== "object") {
        return [{ severity: "error", field: "", message: "Product is missing." }];
    }

    if (!String(product.name || "").trim()) {
        issues.push({ severity: "error", field: "name", message: "Name is required." });
    }

    const slug = String(product.slug || "").trim();
    if (!slug) {
        issues.push({ severity: "error", field: "slug", message: "Slug is required — it builds the product URL." });
    } else if (!SLUG_RE.test(slug)) {
        issues.push({ severity: "error", field: "slug", message: "Use lowercase letters, numbers and hyphens only." });
    } else if (
        products.some((p, i) => i !== index && String(p?.slug || "") === slug)
    ) {
        issues.push({ severity: "error", field: "slug", message: `Slug "${slug}" is already used by another product.` });
    }

    const dupId = products.some((p, i) => i !== index && p?.id !== undefined && p.id === product.id);
    if (dupId) {
        issues.push({ severity: "error", field: "id", message: `ID "${product.id}" is already used by another product.` });
    }

    if (!String(product.category || "").trim()) {
        issues.push({ severity: "error", field: "category", message: "Pick a category — it drives the filter pills." });
    } else if (categories.length && !categories.includes(product.category)) {
        issues.push({
            severity: "warning",
            field: "category",
            message: `"${product.category}" is not in the categories list — add it or fix the spelling.`,
        });
    }

    if (product.price !== null && product.price !== undefined && product.price !== "") {
        const n = Number(product.price);
        if (!Number.isFinite(n) || n < 0) {
            issues.push({ severity: "error", field: "price", message: "Price must be a number of 0 or more, or empty for Price on Request." });
        }
    }

    if (!String(product.image || "").trim()) {
        issues.push({ severity: "warning", field: "image", message: "No image — the card falls back to a placeholder." });
    }
    if (!String(product.shortDescription || "").trim()) {
        issues.push({ severity: "warning", field: "shortDescription", message: "No short description — the card preview will be empty." });
    }

    (Array.isArray(product.specifications) ? product.specifications : []).forEach((s, si) => {
        const label = String(s?.label || "").trim();
        const value = String(s?.value || "").trim();
        if (!label && !value) {
            issues.push({ severity: "warning", field: `specifications[${si}]`, message: `Specification row ${si + 1} is empty.` });
        } else if (!label || !value) {
            issues.push({ severity: "error", field: `specifications[${si}]`, message: `Specification row ${si + 1} needs both a label and a value.` });
        }
    });

    return issues;
}

/** Whole-file problems: categories list health plus per-product roll-up. */
export function validateShopCatalog(data) {
    const issues = [];
    if (!data || typeof data !== "object") {
        return [{ severity: "error", field: "", message: "Catalogue data could not be loaded." }];
    }
    const { categories = [], products = [] } = data;

    if (!categories.length) {
        issues.push({ severity: "error", field: "categories", message: "Add at least one category." });
    }
    const seen = new Set();
    for (const c of categories) {
        if (seen.has(c)) issues.push({ severity: "error", field: "categories", message: `Duplicate category "${c}".` });
        seen.add(c);
    }
    if (!products.length) {
        issues.push({ severity: "warning", field: "products", message: "No products yet." });
    }
    products.forEach((p, i) => {
        for (const issue of validateShopProduct(p, { products, index: i, categories })) {
            issues.push({ ...issue, field: `products[${i}].${issue.field}`, message: `#${i + 1} ${p?.name || p?.slug || "Untitled"}: ${issue.message}` });
        }
    });
    return issues;
}
