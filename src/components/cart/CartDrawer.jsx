import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/productsCatalog';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    cart,
    totalCount,
    pricedItemsTotal,
    hasUnpricedItems,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart
  } = useCart();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer} role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__header-left">
            <ShoppingBag size={20} className="cart-drawer__icon" />
            <h2 className="cart-drawer__title">Shopping Cart</h2>
            <span className="cart-drawer__count-badge">{totalCount}</span>
          </div>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon-wrap">
                <ShoppingBag size={36} />
              </div>
              <h3 className="cart-drawer__empty-title">Your cart is empty</h3>
              <p className="cart-drawer__empty-desc">
                Explore our premium automotive accessories and upgrades to enhance your drive.
              </p>
              <Link
                to="/products"
                className="cart-drawer__btn-shop"
                onClick={closeDrawer}
              >
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {cart.map((item) => {
                const product = item.product;
                const price = product?.price;
                const subtotal = price ? price * item.quantity : null;

                return (
                  <div key={item.id} className="cart-drawer__item">
                    <img
                      src={product?.image || '/images/placeholder.webp'}
                      alt={product?.name}
                      className="cart-drawer__item-img"
                    />

                    <div className="cart-drawer__item-info">
                      <span className="cart-drawer__item-category">{product?.category}</span>
                      <h4 className="cart-drawer__item-name">{product?.name}</h4>
                      <div className="cart-drawer__item-price">
                        {formatPrice(price)}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="cart-drawer__item-bottom">
                        <div className="cart-qty-stepper">
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="cart-qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-drawer__item-remove"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${product?.name} from cart`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__summary-row">
              <span className="cart-drawer__summary-label">Estimated Subtotal</span>
              <span className="cart-drawer__summary-value">
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

            {hasUnpricedItems && (
              <p className="cart-drawer__unpriced-note">
                *Final quotation for unpriced items will be confirmed by store via WhatsApp.
              </p>
            )}

            <div className="cart-drawer__footer-actions">
              <Link
                to="/cart"
                className="cart-drawer__btn-view-cart"
                onClick={closeDrawer}
              >
                <span>View Full Cart</span>
              </Link>
              <Link
                to="/checkout"
                className="cart-drawer__btn-checkout"
                onClick={closeDrawer}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
