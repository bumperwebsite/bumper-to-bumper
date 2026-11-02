/**
 * Shop catalogue hook — src/data/products.json
 * ({ categories: string[], products: Product[] }).
 *
 * Same method and security as every other edit-console hook: reads and
 * saves through useDataFile, which goes through the session-authed
 * /api/github-file proxy (PAT stays server-side, path allowlisted,
 * 1 MB cap, JSON-checked, SHA concurrency). No special casing.
 */
import { useDataFile } from "./useDataFile.js";
import { createListActions } from "./createListActions.js";
import { DATA_FILES, slugify } from "../constants.js";
import {
    createBlankProduct,
    createBlankSpecification,
    nextShopProductId,
    uniqueShopSlug,
    normalizePrice,
    categoryUsage as countCategoryUsage,
    renameShopCategory as renameInDraft,
    validateShopProduct,
    validateShopCatalog,
} from "../lib/shopProducts.js";

function syncDerivedFields(product) {
    if (!product || typeof product !== "object") return;
    product.stockStatus = product.inStock ? "In Stock" : "Out Of Stock";
    // Legacy keys removed in the badge/image consolidation — strip
    // defensively so an old draft can never write them back.
    delete product.badge;
    delete product.galleryImage;
}

export function useShopProducts() {
    const hook = useDataFile(DATA_FILES.productsCatalog, { commitPrefix: "Update" });

    const products = hook.editData?.products ?? [];
    const categories = hook.editData?.categories ?? [];

    return {
        ...hook,
        products,
        categories,

        lists: {
            products: createListActions(hook, (d) => d.products),
            categories: createListActions(hook, (d) => d.categories),
        },

        /** Append a product with a fresh id and a collision-free slug. */
        addProduct: (overrides = {}) =>
            hook.updateEditData((draft) => {
                draft.products = Array.isArray(draft.products) ? draft.products : [];
                draft.categories = Array.isArray(draft.categories) ? draft.categories : [];
                const id = nextShopProductId(draft.products);
                const base = overrides.slug ?? slugify(String(overrides.name || "New product")) ?? "new-product";
                const product = {
                    ...createBlankProduct({ id, categories: draft.categories }),
                    ...overrides,
                    id,
                    slug: uniqueShopSlug(draft.products, base),
                    price: normalizePrice(overrides.price ?? null),
                };
                syncDerivedFields(product);
                draft.products.push(product);
            }),

        /** Duplicate a product — new id, "-copy" slug, deep-copied specs. */
        duplicateProduct: (index) =>
            hook.updateEditData((draft) => {
                const src = draft.products?.[index];
                if (!src) return;
                const copy = structuredClone(src);
                copy.id = nextShopProductId(draft.products);
                copy.name = `${src.name || "Untitled"} (copy)`;
                copy.slug = uniqueShopSlug(draft.products, `${src.slug || "product"}-copy`);
                syncDerivedFields(copy);
                draft.products.splice(index + 1, 0, copy);
            }),

        /**
         * Shallow-merge a patch into one product. Name changes
         * regenerate the slug (kebab-cased, unique); inStock flips
         * stockStatus; price is normalized (empty → Price on Request).
         */
        updateProduct: (index, patch) =>
            hook.updateEditData((draft) => {
                const current = draft.products?.[index];
                if (!current) return;
                const next = { ...patch };
                if ("price" in next) next.price = normalizePrice(next.price);
                if ("name" in next && !("slug" in next)) {
                    next.slug = uniqueShopSlug(draft.products, slugify(String(next.name || "product")) || "product", index);
                } else if ("slug" in next) {
                    next.slug = uniqueShopSlug(draft.products, slugify(String(next.slug || "product")) || "product", index);
                }
                if ("inStock" in next) {
                    next.stockStatus = next.inStock ? "In Stock" : "Out Of Stock";
                }
                Object.assign(current, next);
                syncDerivedFields(current);
            }),

        /** Nested specification rows — same updateEditData path as everything else. */
        addSpecification: (productIndex, spec) =>
            hook.updateEditData((draft) => {
                const list = draft.products?.[productIndex]?.specifications;
                if (!Array.isArray(list)) return;
                list.push(spec ?? createBlankSpecification());
            }),

        updateSpecification: (productIndex, specIndex, patch) =>
            hook.updateEditData((draft) => {
                const list = draft.products?.[productIndex]?.specifications;
                if (!list?.[specIndex]) return;
                Object.assign(list[specIndex], patch);
            }),

        removeSpecification: (productIndex, specIndex) =>
            hook.updateEditData((draft) => {
                const list = draft.products?.[productIndex]?.specifications;
                if (!Array.isArray(list)) return;
                list.splice(specIndex, 1);
            }),

        moveSpecification: (productIndex, from, to) =>
            hook.updateEditData((draft) => {
                const list = draft.products?.[productIndex]?.specifications;
                if (!Array.isArray(list)) return;
                if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
                const [row] = list.splice(from, 1);
                list.splice(to, 0, row);
            }),

        /**
         * Rename a category in the list and on every product that uses it.
         * No-op when the new name is blank, unchanged, or already taken.
         */
        renameCategory: (oldName, newName) =>
            hook.updateEditData((draft) => {
                renameInDraft(draft, oldName, newName);
            }),

        /** How many products reference a category (for safe-delete prompts). */
        categoryUsage: (name) => countCategoryUsage(products, name),

        /** Inline issues for one product row. */
        getProductIssues: (index) =>
            validateShopProduct(products[index], { products, index, categories }),

        /** Whole-file issues for a summary banner. Empty while loading. */
        catalogIssues: () => (hook.editData ? validateShopCatalog(hook.editData) : []),
    };
}
