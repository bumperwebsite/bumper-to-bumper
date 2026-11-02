import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/productsCatalog';
import business from '../config/business';
import './CartPage.css';

export default function CartPage() {
  const {
    cart,
    totalCount,
    pricedItemsTotal,
    hasUnpricedItems,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const siteUrl = business.siteUrl || 'https://bumpertobumpercaraccessories.com';

  return (
    <>
      <Helmet>
        <title>Shopping Cart | Bumper To Bumper Car Accessories Chennai</title>
        <meta name="description" content="Review your selected automotive accessories, adjust quantities, and proceed to order enquiry with Bumper To Bumper Car Accessories." />
        <link rel="canonical" href={`${siteUrl}/cart`} />
      </Helmet>

      <div className="btb-cart-page">
        {/* Cart Header */}
        <div className="btb-cart-header">
          <div className="container">
            <div className="btb-cart-header__inner">
              <span className="btb-cart-header__eyebrow">ORDER SUMMARY &amp; FITMENT SELECTION</span>
              <h1 className="btb-cart-header__title">
                Your Shopping <span className="text-red">Cart</span>
              </h1>
              <p className="btb-cart-header__desc">
                Review your chosen automotive upgrades, adjust quantities, and proceed to checkout.
              </p>
            </div>
          </div>
        </div>

        <div className="container btb-cart-content">
          {cart.length === 0 ? (
            <div className="btb-cart-empty">
              <div className="btb-cart-empty__icon">
                <ShoppingBag size={48} />
              </div>
              <h2 className="btb-cart-empty__title">Your shopping cart is currently empty</h2>
              <p className="btb-cart-empty__text">
                Browse our complete collection of 44 verified car accessories including infotainment systems, LED lighting, dashcams, and styling upgrades.
              </p>
              <Link to="/products" className="btb-cart-empty__btn">
                <span>Explore Products Catalogue</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="btb-cart-grid">
              {/* Left Column: Products Table */}
              <div className="btb-cart-table-col">
                <div className="btb-cart-table-card">
                  <div className="btb-cart-table-header">
                    <span className="btb-cart-col-head btb-cart-col-product">Product Details</span>
                    <span className="btb-cart-col-head btb-cart-col-price">Unit Price</span>
                    <span className="btb-cart-col-head btb-cart-col-qty">Quantity</span>
                    <span className="btb-cart-col-head btb-cart-col-subtotal">Subtotal</span>
                    <span className="btb-cart-col-head btb-cart-col-action">Remove</span>
                  </div>

                  <div className="btb-cart-items-list">
                    {cart.map((item) => {
                      const product = item.product;
                      const unitPrice = product?.price;
                      const itemSubtotal = unitPrice ? unitPrice * item.quantity : null;

                      return (
                        <div key={item.id} className="btb-cart-row">
                          {/* Product Info */}
                          <div className="btb-cart-row__product">
                            <Link to={`/products/${product?.slug}`} className="btb-cart-row__thumb-link">
                              <img
                                src={product?.image || '/images/placeholder.webp'}
                                alt={product?.name}
                                className="btb-cart-row__thumb"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/placeholder.webp';
                                }}
                              />
                            </Link>
                            <div className="btb-cart-row__info">
                              <span className="btb-cart-row__cat">{product?.category}</span>
                              <Link to={`/products/${product?.slug}`} className="btb-cart-row__name">
                                {product?.name}
                              </Link>
                              <span className="btb-cart-row__fitment-tag">
                                100% Plug &amp; Play Coupler Fitment
                              </span>
                            </div>
                          </div>

                          {/* Unit Price */}
                          <div className="btb-cart-row__price">
                            <span className="btb-cart-mobile-label">Unit Price: </span>
                            <span className={!unitPrice ? 'text-muted' : ''}>
                              {formatPrice(unitPrice)}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="btb-cart-row__qty">
                            <div className="btb-cart-stepper">
                              <button
                                type="button"
                                className="btb-cart-stepper__btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${product?.name}`}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="btb-cart-stepper__val">{item.quantity}</span>
                              <button
                                type="button"
                                className="btb-cart-stepper__btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label={`Increase quantity of ${product?.name}`}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="btb-cart-row__subtotal">
                            <span className="btb-cart-mobile-label">Subtotal: </span>
                            <span className="btb-cart-row__subtotal-val">
                              {itemSubtotal !== null ? `₹${itemSubtotal.toLocaleString('en-IN')}` : 'Price on Request'}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <div className="btb-cart-row__action">
                            <button
                              type="button"
                              className="btb-cart-row__remove-btn"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Remove ${product?.name} from cart`}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cart Table Bottom Actions */}
                  <div className="btb-cart-table-footer">
                    <Link to="/products" className="btb-cart-btn-continue">
                      <ArrowLeft size={16} />
                      <span>Continue Shopping</span>
                    </Link>

                    <button
                      type="button"
                      className="btb-cart-btn-clear"
                      onClick={clearCart}
                    >
                      <Trash2 size={14} />
                      <span>Clear Shopping Cart</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="btb-cart-summary-col">
                <div className="btb-cart-summary-card">
                  <h2 className="btb-cart-summary-title">Order Summary</h2>

                  <div className="btb-cart-summary-list">
                    <div className="btb-cart-summary-row">
                      <span className="btb-cart-summary-label">Distinct Items</span>
                      <span className="btb-cart-summary-val">{cart.length}</span>
                    </div>

                    <div className="btb-cart-summary-row">
                      <span className="btb-cart-summary-label">Total Quantity</span>
                      <span className="btb-cart-summary-val">{totalCount} units</span>
                    </div>

                    <div className="btb-cart-summary-row btb-cart-summary-row--total">
                      <span className="btb-cart-summary-label">Estimated Total</span>
                      <span className="btb-cart-summary-total">
                        {hasUnpricedItems ? (
                          pricedItemsTotal > 0 ? (
                            `₹${pricedItemsTotal.toLocaleString('en-IN')}*`
                          ) : (
                            'Price on Request'
                          )
                        ) : (
                          `₹${pricedItemsTotal.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>
                  </div>

                  {hasUnpricedItems && (
                    <div className="btb-cart-unpriced-alert">
                      <Sparkles size={16} className="btb-cart-alert-icon" />
                      <p>
                        Some products in your cart require vehicle-specific fitment verification. Your final quotation will be confirmed directly by the store.
                      </p>
                    </div>
                  )}

                  <Link to="/checkout" className="btb-cart-btn-checkout">
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </Link>

                  <div className="btb-cart-trust-points">
                    <div className="btb-cart-trust-point">
                      <ShieldCheck size={16} className="btb-cart-trust-icon" />
                      <span>Zero wire-cutting warranty protected fitment</span>
                    </div>
                    <div className="btb-cart-trust-point">
                      <PhoneCall size={16} className="btb-cart-trust-icon" />
                      <span>Order directly sent to owner: {business.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
