import { useMemo, useState } from 'react';
import {
    Plus,
    Trash2,
    Pencil,
    X,
    Copy,
    Tag,
    AlertCircle,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { useShopProducts } from '../hooks/useShopProducts.js';
import { normalizePrice } from '../lib/shopProducts.js';
import {
    Field,
    FieldGrid,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    Toggle,
    ImageField,
} from '../components/Fields.jsx';
import EditorFrame from '../components/EditorFrame.jsx';
import SectionCard, { ListHeader } from '../components/SectionCard.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import './shop-products-editor.css';

function IssuesLine({ issues }) {
    if (!issues || issues.length === 0) return null;
    const errors = issues.filter((i) => i.severity === 'error');
    const shown = errors.length > 0 ? errors : issues;
    return (
        <span className={`shop-edit-card__issues shop-edit-card__issues--${errors.length > 0 ? 'error' : 'warning'}`}>
            <AlertCircle size={11} aria-hidden="true" />
            {shown[0].message}
            {issues.length > 1 ? ` (+${issues.length - 1} more)` : ''}
        </span>
    );
}

function CategoryManager({ hook }) {
    const categories = hook.categories;
    const [newName, setNewName] = useState('');
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');

    function addCategory() {
        const name = newName.trim();
        if (!name || categories.includes(name)) return;
        hook.lists.categories.add(name);
        setNewName('');
    }

    function saveRename(oldName) {
        if (editValue.trim() && editValue.trim() !== oldName) {
            hook.renameCategory(oldName, editValue.trim());
        }
        setEditing(null);
    }

    function removeCategory(index, name) {
        if (hook.categoryUsage(name) > 0) return;
        hook.lists.categories.remove(index);
    }

    return (
        <SectionCard
            icon={Tag}
            title="Categories"
            subtitle="Filter pills on /products, in order. Renaming updates every product that uses it."
        >
            <ul className="shop-edit-cats">
                {categories.map((cat, i) => {
                    const usage = hook.categoryUsage(cat);
                    return (
                        <li key={`${cat}-${i}`} className="shop-edit-cats__row">
                            {editing === i ? (
                                <>
                                    <TextInput
                                        value={editValue}
                                        onChange={setEditValue}
                                        placeholder="Category name"
                                    />
                                    <button
                                        type="button"
                                        className="edit-btn edit-btn--sm edit-btn--primary"
                                        onClick={() => saveRename(cat)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="edit-btn edit-btn--sm"
                                        onClick={() => setEditing(null)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="shop-edit-cats__name">{cat}</span>
                                    <span className="edit-badge edit-badge--count">{usage}</span>
                                    <span className="shop-edit-cats__spacer" />
                                    <button
                                        type="button"
                                        className="edit-btn edit-btn--sm"
                                        onClick={() => {
                                            setEditing(i);
                                            setEditValue(cat);
                                        }}
                                        aria-label={`Rename ${cat}`}
                                    >
                                        <Pencil size={12} />
                                        Rename
                                    </button>
                                    <button
                                        type="button"
                                        className="edit-btn edit-btn--sm edit-btn--danger"
                                        onClick={() => removeCategory(i, cat)}
                                        disabled={usage > 0}
                                        title={
                                            usage > 0
                                                ? `Used by ${usage} product${usage === 1 ? '' : 's'} — reassign them first`
                                                : 'Remove category'
                                        }
                                        aria-label={`Remove ${cat}`}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
            <div className="shop-edit-cats__add">
                <TextInput
                    value={newName}
                    onChange={setNewName}
                    placeholder="New category name"
                />
                <button
                    type="button"
                    className="edit-btn edit-btn--sm edit-btn--primary"
                    onClick={addCategory}
                    disabled={!newName.trim() || categories.includes(newName.trim())}
                >
                    <Plus size={13} />
                    Add category
                </button>
            </div>
        </SectionCard>
    );
}

function ProductModal({ hook, index, onClose, onDelete }) {
    const product = hook.products[index];
    if (!product) return null;
    const issues = hook.getProductIssues(index);
    const specs = Array.isArray(product.specifications) ? product.specifications : [];

    return (
        <div
            className="shop-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${product.name || 'product'}`}
            onClick={onClose}
        >
            <div
                className="shop-edit-modal__panel"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="shop-edit-modal__head">
                    <div>
                        <p className="shop-edit-modal__eyebrow">{product.category || 'Uncategorized'}</p>
                        <h2 className="shop-edit-modal__title">{product.name || 'Untitled product'}</h2>
                        <code className="shop-edit-modal__slug">/{product.slug}</code>
                    </div>
                    <button
                        type="button"
                        className="edit-btn edit-btn--sm"
                        onClick={onClose}
                        aria-label="Close editor"
                    >
                        <X size={14} />
                        Close
                    </button>
                </div>

                <div className="shop-edit-modal__body">
                    {issues.length > 0 && (
                        <div className="edit-notice edit-notice--error" role="alert">
                            <AlertCircle size={16} />
                            <div>
                                <strong>{issues.filter((i) => i.severity === 'error').length} problem{issues.length === 1 ? '' : 's'} to fix</strong>
                                <ul className="shop-edit-modal__issues">
                                    {issues.map((issue, i) => (
                                        <li key={i}>
                                            <strong>{issue.field}:</strong> {issue.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <FieldGrid>
                        <Field label="Product name" required span={2}>
                            <TextInput
                                value={product.name}
                                onChange={(v) => hook.updateProduct(index, { name: v })}
                                placeholder="e.g. Moco X5 OLED Multimedia Player"
                            />
                        </Field>
                        <Field
                            label="URL slug"
                            hint="Auto-generated from the name (lowercase kebab-case). Not editable."
                        >
                            <TextInput value={product.slug || ''} onChange={() => {}} disabled />
                        </Field>
                        <Field label="Category" required hint="Drives the filter pills on /products.">
                            <Select
                                value={product.category}
                                onChange={(v) => hook.updateProduct(index, { category: v })}
                                options={hook.categories}
                                placeholder="Choose a category…"
                            />
                        </Field>
                        <Field label="Price (₹)" hint="Empty = “Price on Request”.">
                            <NumberInput
                                value={product.price ?? ''}
                                min={0}
                                placeholder="Price on Request"
                                onChange={(v) =>
                                    hook.updateProduct(index, {
                                        price: v === '' ? null : normalizePrice(v),
                                    })
                                }
                            />
                        </Field>
                        <Field label="Availability" hint="Stock status text updates automatically.">
                            <Toggle
                                value={!!product.inStock}
                                onChange={(v) => hook.updateProduct(index, { inStock: v })}
                                label={product.inStock ? 'In Stock' : 'Out Of Stock'}
                            />
                        </Field>
                        <Field label="Stock status" hint="Derived — not editable.">
                            <TextInput value={product.stockStatus || ''} onChange={() => {}} disabled />
                        </Field>
                        <Field label="Product image" span={2} hint="Single image URL (Cloudinary). Used on cards, cart, checkout and detail page.">
                            <ImageField
                                value={product.image}
                                onChange={(v) => hook.updateProduct(index, { image: v })}
                                alt={product.name || 'product'}
                            />
                        </Field>
                        <Field label="Short description" span={2} hint="Card preview, two lines.">
                            <Textarea
                                value={product.shortDescription}
                                onChange={(v) => hook.updateProduct(index, { shortDescription: v })}
                                rows={2}
                                placeholder="One or two lines shown on the product card."
                            />
                        </Field>
                        <Field label="Full description" span={2}>
                            <Textarea
                                value={product.description}
                                onChange={(v) => hook.updateProduct(index, { description: v })}
                                rows={5}
                                placeholder="Shown on the product detail page."
                            />
                        </Field>
                    </FieldGrid>

                    <div className="shop-edit-specs">
                        <div className="shop-edit-specs__head">
                            <h3 className="shop-edit-specs__title">
                                Specifications
                                <span className="edit-badge edit-badge--count">{specs.length}</span>
                            </h3>
                            <button
                                type="button"
                                className="edit-btn edit-btn--sm"
                                onClick={() => hook.addSpecification(index)}
                            >
                                <Plus size={13} />
                                Add row
                            </button>
                        </div>
                        {specs.length === 0 && (
                            <p className="edit-card__hint">No specification rows yet. Add the key details buyers compare.</p>
                        )}
                        {specs.map((spec, si) => (
                            <div key={si} className="shop-edit-specs__row">
                                <TextInput
                                    value={spec.label}
                                    onChange={(v) => hook.updateSpecification(index, si, { label: v })}
                                    placeholder="Label (e.g. RAM)"
                                />
                                <TextInput
                                    value={spec.value}
                                    onChange={(v) => hook.updateSpecification(index, si, { value: v })}
                                    placeholder="Value (e.g. 4GB)"
                                />
                                <div className="shop-edit-specs__row-actions">
                                    <button
                                        type="button"
                                        className="edit-icon-btn edit-icon-btn--sm"
                                        disabled={si === 0}
                                        onClick={() => hook.moveSpecification(index, si, si - 1)}
                                        aria-label="Move row up"
                                    >
                                        <ChevronUp size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        className="edit-icon-btn edit-icon-btn--sm"
                                        disabled={si === specs.length - 1}
                                        onClick={() => hook.moveSpecification(index, si, si + 1)}
                                        aria-label="Move row down"
                                    >
                                        <ChevronDown size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        className="edit-icon-btn edit-icon-btn--sm edit-icon-btn--danger"
                                        onClick={() => hook.removeSpecification(index, si)}
                                        aria-label={`Remove specification row ${si + 1}`}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="shop-edit-modal__danger">
                        <button
                            type="button"
                            className="edit-btn edit-btn--sm"
                            onClick={() => {
                                hook.duplicateProduct(index);
                                onClose();
                            }}
                        >
                            <Copy size={13} />
                            Duplicate product
                        </button>
                        <button
                            type="button"
                            className="edit-btn edit-btn--sm edit-btn--danger"
                            onClick={() => {
                                onDelete(index);
                                onClose();
                            }}
                        >
                            <Trash2 size={13} />
                            Delete product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ShopProductsEditor() {
    const hook = useShopProducts();
    const [activeIndex, setActiveIndex] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [query, setQuery] = useState('');

    const products = hook.products;
    const categories = hook.categories;

    const filtered = useMemo(() => {
        return products
            .map((p, i) => ({ product: p, index: i }))
            .filter(({ product }) => {
                if (categoryFilter !== 'All' && product.category !== categoryFilter) return false;
                if (query.trim()) {
                    const q = query.trim().toLowerCase();
                    return (
                        (product.name || '').toLowerCase().includes(q) ||
                        (product.category || '').toLowerCase().includes(q)
                    );
                }
                return true;
            });
    }, [products, categoryFilter, query]);

    const catalogIssues = hook.editData ? hook.catalogIssues() : [];
    const errorCount = catalogIssues.filter((i) => i.severity === 'error').length;

    function addProduct() {
        // New rows append at the end — open the index they will occupy.
        setActiveIndex(products.length);
        hook.addProduct({ category: categoryFilter !== 'All' ? categoryFilter : undefined });
    }

    function deleteProduct(index) {
        hook.lists.products.remove(index);
    }

    return (
        <EditorFrame sectionId="shopProducts" hook={hook}>
            {errorCount > 0 && (
                <div className="edit-notice edit-notice--error" role="alert">
                    <AlertCircle size={16} />
                    <div>
                        <strong>{errorCount} catalogue error{errorCount === 1 ? '' : 's'}.</strong> Open the
                        flagged cards to fix names, slugs, categories or prices before saving.
                    </div>
                </div>
            )}

            <CategoryManager hook={hook} />

            <section className="edit-stack">
                <ListHeader
                    title="Products"
                    count={products.length}
                    hint="Same cards as /products. Click a card to edit everything in a popup."
                    actions={
                        <button
                            type="button"
                            className="edit-btn edit-btn--primary edit-btn--sm"
                            onClick={addProduct}
                        >
                            <Plus size={13} />
                            Add product
                        </button>
                    }
                />

                <div className="shop-edit-toolbar">
                    <div className="shop-edit-pills" role="tablist" aria-label="Filter by category">
                        {['All', ...categories].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={categoryFilter === cat}
                                className={`shop-edit-pills__btn${categoryFilter === cat ? ' shop-edit-pills__btn--active' : ''}`}
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat === 'All' ? 'All products' : cat}
                            </button>
                        ))}
                    </div>
                    <div className="shop-edit-search">
                        <TextInput
                            value={query}
                            onChange={setQuery}
                            placeholder="Search name or category…"
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="edit-empty">
                        <span className="edit-empty__title">No products match</span>
                        <span className="edit-empty__hint">Clear the search or pick another category.</span>
                    </div>
                ) : (
                    <div className="shop-edit-grid">
                        {filtered.map(({ product, index }) => {
                            const issues = hook.getProductIssues(index);
                            return (
                                <button
                                    key={product.id ?? index}
                                    type="button"
                                    className="shop-edit-card"
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={`Edit ${product.name || 'untitled product'}`}
                                >
                                    <span className="shop-edit-card__media">
                                        {product.image ? (
                                            <img src={product.image} alt="" loading="lazy" />
                                        ) : (
                                            <span className="shop-edit-card__noimg">No image</span>
                                        )}
                                    </span>
                                    <span className="shop-edit-card__body">
                                        <span className="shop-edit-card__meta">
                                            <span className="shop-edit-card__cat">{product.category || '—'}</span>
                                            <span className="shop-edit-card__stock">
                                                <span
                                                    className={`shop-edit-card__dot${product.inStock ? ' shop-edit-card__dot--in' : ''}`}
                                                    aria-hidden="true"
                                                />
                                                {product.stockStatus || (product.inStock ? 'In Stock' : 'Out Of Stock')}
                                            </span>
                                        </span>
                                        <span className="shop-edit-card__name">{product.name || 'Untitled product'}</span>
                                        <span className="shop-edit-card__desc">{product.shortDescription || 'No short description yet.'}</span>
                                        <span className="shop-edit-card__foot">
                                            <span className="shop-edit-card__price">{formatPrice(product.price)}</span>
                                            <span className="shop-edit-card__slug">/{product.slug}</span>
                                        </span>
                                        <IssuesLine issues={issues} />
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {activeIndex !== null && hook.products[activeIndex] && (
                <ProductModal
                    hook={hook}
                    index={activeIndex}
                    onClose={() => setActiveIndex(null)}
                    onDelete={deleteProduct}
                />
            )}
        </EditorFrame>
    );
}
