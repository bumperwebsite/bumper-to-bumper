import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import './CartToast.css';

export default function CartToast() {
  const { toast, setToast } = useCart();

  if (!toast.visible) return null;

  return (
    <div className="cart-toast" role="status" aria-live="polite">
      <div className="cart-toast__inner">
        {toast.image ? (
          <img src={toast.image} alt={toast.productName} className="cart-toast__thumb" />
        ) : (
          <div className="cart-toast__icon-wrap">
            <CheckCircle2 size={20} className="cart-toast__icon" />
          </div>
        )}

        <div className="cart-toast__content">
          <span className="cart-toast__title">{toast.message}</span>
          <span className="cart-toast__product-name">{toast.productName}</span>
        </div>

        <div className="cart-toast__actions">
          <Link to="/cart" className="cart-toast__btn-cart" onClick={() => setToast(prev => ({ ...prev, visible: false }))}>
            <ShoppingBag size={14} />
            <span>View Cart</span>
          </Link>
          <button
            type="button"
            className="cart-toast__close"
            onClick={() => setToast(prev => ({ ...prev, visible: false }))}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
