import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isPhoto = product.image && /\.(jpg|jpeg|png|webp)$/i.test(product.image);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="btb-product-card" id={`product-${product.slug}`}>
      <Link to={`/products/${product.slug}`} className="btb-product-card__media-link" tabIndex={-1}>
        <div className="btb-product-card__media">
          <img
            src={product.image || '/images/placeholder.webp'}
            alt={product.name}
            className={`btb-product-card__img${isPhoto ? ' btb-product-card__img--photo' : ''}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder.webp';
            }}
          />
        </div>
      </Link>

      <div className="btb-product-card__body">
        <div className="btb-product-card__meta">
          <span className="btb-product-card__category">{product.category}</span>
          <span className="btb-product-card__stock-tag">
            <span className="btb-product-card__stock-dot" />
            {product.stockStatus || 'In Stock'}
          </span>
        </div>

        <h3 className="btb-product-card__title">
          <Link to={`/products/${product.slug}`} className="btb-product-card__title-link">
            {product.name}
          </Link>
        </h3>

        <p className="btb-product-card__desc">
          {product.shortDescription}
        </p>

        <div className="btb-product-card__footer">
          <div className="btb-product-card__price-wrap">
            <span className="btb-product-card__price-label">Price</span>
            <span className={`btb-product-card__price ${!product.price ? 'btb-product-card__price--request' : ''}`}>
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="btb-product-card__actions">
            <Link
              to={`/products/${product.slug}`}
              className="btb-product-card__btn-view"
              title="View product details and specifications"
              aria-label={`View details of ${product.name}`}
            >
              <Eye size={16} />
              <span>Details</span>
            </Link>

            <button
              type="button"
              className={`btb-product-card__btn-add ${added ? 'btb-product-card__btn-add--added' : ''}`}
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to shopping cart`}
            >
              {added ? (
                <>
                  <Check size={16} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
