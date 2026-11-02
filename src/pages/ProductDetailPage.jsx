import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Wrench,
  Check,
  Plus,
  Minus,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { productsCatalog, getProductById, formatPrice } from '../data/productsCatalog';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import business from '../config/business';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = productsCatalog.find(p => p.slug === slug || String(p.id) === slug);
  const isPhoto = product?.image && /\.(jpg|jpeg|png|webp)$/i.test(product.image);

  if (!product) {
    return (
      <div className="btb-pdp-not-found">
        <div className="container">
          <div className="btb-pdp-not-found__inner">
            <h2>Product Not Found</h2>
            <p>The accessory you are looking for is unavailable or may have been renamed.</p>
            <Link to="/products" className="btb-pdp-btn-back">
              <ArrowLeft size={16} />
              <span>Back to Products Catalogue</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQtyChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // WhatsApp enquiry for this specific product
  const waProductText = encodeURIComponent(
    `Hello ${business.name}, I would like to enquire about the "${product.name}" (${product.category}). Please let me know the availability and quotation for my vehicle.`
  );
  const waProductUrl = `https://wa.me/${business.whatsapp}?text=${waProductText}`;

  // Related products from same category
  const relatedProducts = productsCatalog
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const siteUrl = business.siteUrl || 'https://bumpertobumpercaraccessories.com';
  const pageTitle = `${product.name} | Bumper To Bumper Car Accessories Chennai`;
  const pageDescription = `${product.shortDescription} Genuine automotive accessory fitment available at Bumper To Bumper, Adambakkam, Chennai.`;

  // JSON-LD Product Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': `${siteUrl}${product.image}`,
    'description': product.description || product.shortDescription,
    'category': product.category,
    'brand': {
      '@type': 'Brand',
      'name': business.name
    },
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'INR',
      'price': product.price || 0,
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'AutoPartsStore',
        'name': business.name,
        'telephone': business.phone,
        'address': business.address
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/products/${product.slug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}${product.image}`} />
        <meta property="og:url" content={`${siteUrl}/products/${product.slug}`} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      <div className="btb-pdp-page">
        {/* Breadcrumb Navigation */}
        <div className="btb-pdp-breadcrumbs">
          <div className="container">
            <nav className="btb-pdp-breadcrumbs__inner" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={13} className="btb-pdp-breadcrumbs__sep" />
              <Link to="/products">Products</Link>
              <ChevronRight size={13} className="btb-pdp-breadcrumbs__sep" />
              <span className="btb-pdp-breadcrumbs__cat">{product.category}</span>
              <ChevronRight size={13} className="btb-pdp-breadcrumbs__sep" />
              <span className="btb-pdp-breadcrumbs__current" aria-current="page">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Showcase Container */}
        <section className="btb-pdp-main">
          <div className="container">
            <div className="btb-pdp-grid">
              {/* Media Preview Column */}
              <div className="btb-pdp-media-col">
                <div className="btb-pdp-card">
                  <div className="btb-pdp-media-wrapper">
                    <img
                      src={product.image || '/images/placeholder.webp'}
                      alt={product.name}
                      className={`btb-pdp-main-image${isPhoto ? ' btb-pdp-main-image--photo' : ''}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/placeholder.webp';
                      }}
                    />
                    {product.badge && (
                      <span className="btb-pdp-badge">{product.badge}</span>
                    )}
                  </div>
                </div>

                {/* Studio Trust Fitment Box */}
                <div className="btb-pdp-trust-box">
                  <div className="btb-pdp-trust-item">
                    <ShieldCheck size={22} className="btb-pdp-trust-icon" />
                    <div>
                      <strong>Zero Wire-Cutting Fitment</strong>
                      <p>OEM coupler-to-coupler installation preserves vehicle warranty.</p>
                    </div>
                  </div>
                  <div className="btb-pdp-trust-item">
                    <Wrench size={22} className="btb-pdp-trust-icon" />
                    <div>
                      <strong>Precision Studio Installation</strong>
                      <p>Fitted by certified technicians at our Adambakkam studio, Chennai.</p>
                    </div>
                  </div>
                  <div className="btb-pdp-trust-item">
                    <MapPin size={22} className="btb-pdp-trust-icon" />
                    <div>
                      <strong>Location &amp; Fitting Slots</strong>
                      <p>{business.landmark}, Chennai. Mon-Sat: 10am-9:30pm.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info & Actions Column */}
              <div className="btb-pdp-info-col">
                <div className="btb-pdp-header">
                  <div className="btb-pdp-badges-row">
                    <span className="btb-pdp-cat-pill">{product.category}</span>
                    <span className="btb-pdp-stock-pill">
                      <span className="btb-pdp-stock-dot" />
                      {product.stockStatus || 'In Stock'}
                    </span>
                  </div>

                  <h1 className="btb-pdp-title">{product.name}</h1>

                  {/* Price Block */}
                  <div className="btb-pdp-price-box">
                    <div className="btb-pdp-price-header">
                      <span className="btb-pdp-price-label">Estimated Price / Quotation</span>
                    </div>
                    <div className="btb-pdp-price-val">
                      {formatPrice(product.price)}
                    </div>
                    {!product.price && (
                      <p className="btb-pdp-price-subtext">
                        Exact pricing depends on vehicle make, model variant, and fitting harness requirements. Add to cart to send an order inquiry or contact us for a personalized estimate.
                      </p>
                    )}
                  </div>
                </div>

                {/* Overview Text */}
                <div className="btb-pdp-overview">
                  <p>{product.shortDescription}</p>
                </div>

                {/* Purchase / Cart Actions */}
                <div className="btb-pdp-actions-panel">
                  <div className="btb-pdp-qty-group">
                    <label htmlFor="pdp-qty-input" className="btb-pdp-qty-label">Quantity</label>
                    <div className="btb-pdp-qty-stepper">
                      <button
                        type="button"
                        className="btb-pdp-qty-btn"
                        onClick={() => handleQtyChange(-1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        id="pdp-qty-input"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="btb-pdp-qty-input"
                        aria-label="Product quantity"
                      />
                      <button
                        type="button"
                        className="btb-pdp-qty-btn"
                        onClick={() => handleQtyChange(1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="btb-pdp-buttons-grid">
                    <button
                      type="button"
                      className={`btb-pdp-btn-add ${added ? 'btb-pdp-btn-add--added' : ''}`}
                      onClick={handleAddToCart}
                    >
                      {added ? (
                        <>
                          <Check size={18} />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>Add to Cart ({quantity})</span>
                        </>
                      )}
                    </button>

                    <a
                      href={waProductUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btb-pdp-btn-wa"
                      aria-label="Enquire via WhatsApp"
                    >
                      <MessageCircle size={18} />
                      <span>WhatsApp Enquiry</span>
                    </a>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="btb-pdp-details-block">
                  <h2 className="btb-pdp-section-heading">Product Overview</h2>
                  <p className="btb-pdp-description-text">{product.description}</p>
                </div>

                {/* Technical Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="btb-pdp-specs-block">
                    <h2 className="btb-pdp-section-heading">Technical Specifications</h2>
                    <div className="btb-pdp-specs-table">
                      {product.specifications.map((spec, i) => (
                        <div key={i} className="btb-pdp-spec-row">
                          <span className="btb-pdp-spec-label">{spec.label}</span>
                          <span className="btb-pdp-spec-value">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products from Category */}
        {relatedProducts.length > 0 && (
          <section className="btb-pdp-related">
            <div className="container">
              <div className="btb-pdp-related__header">
                <span className="btb-pdp-related__eyebrow">DISCOVER MORE IN {product.category.toUpperCase()}</span>
                <h2 className="btb-pdp-related__title">Similar Automotive Upgrades</h2>
              </div>

              <div className="btb-pdp-related__grid">
                {relatedProducts.map(rel => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
