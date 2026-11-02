import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, X, Sparkles, ShoppingBag } from 'lucide-react';
import catalogData from '../data/products.json';
import ProductCard from '../components/products/ProductCard';
import business from '../config/business';
import './ProductsPage.css';

const productsCatalog = catalogData.products;
const PRODUCT_CATEGORIES = ['All Products', ...catalogData.categories];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { 'All Products': productsCatalog.length };
    productsCatalog.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = productsCatalog;

    // Filter by category
    if (selectedCategory !== 'All Products') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search query (name and category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...result];
    if (sortBy === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-asc') {
      sorted.sort((a, b) => {
        const pA = a.price ?? 999999;
        const pB = b.price ?? 999999;
        return pA - pB;
      });
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => {
        const pA = a.price ?? -1;
        const pB = b.price ?? -1;
        return pB - pA;
      });
    }

    return sorted;
  }, [selectedCategory, searchQuery, sortBy]);

  const siteUrl = business.siteUrl || 'https://bumpertobumpercaraccessories.com';
  const pageTitle = 'Car Accessories & Automotive Products in Chennai | Bumper To Bumper';
  const pageDescription = 'Explore infotainment systems, car audio, LED lighting, dashcams and automotive accessories at Bumper To Bumper Car Accessories in Adambakkam, Chennai.';

  // Schema.org structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Bumper To Bumper Automotive Accessories Catalog',
    'description': pageDescription,
    'itemListElement': filteredProducts.map((p, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': p.name,
        'category': p.category,
        'image': `${siteUrl}${p.image}`,
        'description': p.shortDescription,
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'INR',
          'price': p.price || 0,
          'availability': 'https://schema.org/InStock'
        }
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/products`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`${siteUrl}/products`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="btb-products-page">
        {/* Header Hero Section */}
        <section className="btb-products-hero">
          <div className="container">
            <div className="btb-products-hero__inner">
              <span className="btb-products-hero__eyebrow">
                <span className="btb-products-hero__eyebrow-dot" />
                OFFICIAL PRODUCT CATALOGUE · {productsCatalog.length} VERIFIED ACCESSORIES
              </span>
              <h1 className="btb-products-hero__title">
                Explore Our <span className="text-red">Products</span>
              </h1>
              <p className="btb-products-hero__desc">
                Discover car accessories and automotive upgrades selected to enhance your driving experience. Explore infotainment systems, lighting upgrades, audio equipment, and everyday automotive essentials at Bumper To Bumper Car Accessories.
              </p>
            </div>
          </div>
        </section>

        {/* Catalog Content */}
        <section className="btb-products-main">
          <div className="container">
            {/* Search and Sorting Controls Bar */}
            <div className="btb-products-toolbar">
              <div className="btb-products-search">
                <Search size={18} className="btb-products-search__icon" />
                <input
                  type="text"
                  placeholder="Search products by name or category (e.g., Moco, JBL, Aozoom, LED)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="btb-products-search__input"
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btb-products-search__clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="btb-products-sort">
                <SlidersHorizontal size={16} className="btb-products-sort__icon" />
                <label htmlFor="product-sort-select" className="btb-products-sort__label">Sort by:</label>
                <select
                  id="product-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="btb-products-sort__select"
                >
                  <option value="default">Default Catalog</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="btb-products-categories" role="tablist" aria-label="Product Categories">
              {PRODUCT_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`btb-cat-pill ${isActive ? 'btb-cat-pill--active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="btb-cat-pill__count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Results Status Header */}
            <div className="btb-products-status">
              <span className="btb-products-status__count">
                Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
                {selectedCategory !== 'All Products' && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>

              {(selectedCategory !== 'All Products' || searchQuery) && (
                <button
                  type="button"
                  className="btb-products-reset-btn"
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setSearchQuery('');
                  }}
                >
                  <X size={14} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="btb-products-empty">
                <div className="btb-products-empty__icon">
                  <Sparkles size={32} />
                </div>
                <h3>No products match your search</h3>
                <p>Try searching with another keyword or explore all categories.</p>
                <button
                  type="button"
                  className="btb-products-empty__btn"
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setSearchQuery('');
                  }}
                >
                  View All {productsCatalog.length} Products
                </button>
              </div>
            ) : (
              <div className="btb-products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
