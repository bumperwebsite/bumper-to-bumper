import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Phone, ShoppingBag } from 'lucide-react';
import business from '../../../config/business';
import { useCart } from '../../../context/CartContext';

export default function MainHeader({ onOpenSearch, onOpenMobileMenu }) {
  const location = useLocation();
  const { totalCount, openDrawer } = useCart();

  const isHomeActive = location.pathname === '/';
  const isProductsActive = location.pathname.startsWith('/products');
  const isExteriorActive = location.pathname.includes('/exterior');
  const isInteriorActive = location.pathname.includes('/interior');
  const isGalleryActive = location.pathname.startsWith('/gallery');
  const isReviewsActive = location.pathname.startsWith('/reviews');
  const isAboutActive = location.pathname.startsWith('/about');
  const isContactActive = location.pathname.startsWith('/contact');

  return (
    <div className="header-main-row">
      <div className="container header-main-row__inner">

        {/* ── Left: Brand Identity ──────────────────────────── */}
        <Link to="/" className="brand-badge" aria-label={`${business.name} Home`}>
          <img src="/logo.svg" alt={business.name} className="brand-badge__logo" width="280" height="54" />
        </Link>

        {/* ── Center: Direct Navigation (Products + Exterior & Interior) ── */}
        <nav className="header-main-nav" aria-label="Primary Navigation">
          <ul className="header-main-nav__list">
            {/* 1. Home */}
            <li className="header-main-nav__item">
              <Link
                to="/"
                className={`header-main-nav__link ${isHomeActive ? 'header-main-nav__link--active' : ''}`}
                aria-current={isHomeActive ? 'page' : undefined}
              >
                <span>Home</span>
                {isHomeActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>

            {/* 2. Products */}
            <li className="header-main-nav__item">
              <Link
                to="/products"
                className={`header-main-nav__link ${isProductsActive ? 'header-main-nav__link--active' : ''}`}
                title="Explore Automotive Accessories & Products"
                aria-current={isProductsActive ? 'page' : undefined}
              >
                <span>Products</span>
                {isProductsActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>

            {/* 3. Exterior Accessories */}
            <li className="header-main-nav__item">
              <Link
                to="/exterior-car-accessories-chennai"
                className={`header-main-nav__link ${isExteriorActive ? 'header-main-nav__link--active' : ''}`}
                title={`Exterior Car Accessories in ${business.city}`}
                aria-current={isExteriorActive ? 'page' : undefined}
              >
                <span>Exterior</span>
                {isExteriorActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>

            {/* 4. Interior Accessories */}
            <li className="header-main-nav__item">
              <Link
                to="/interior-car-accessories-chennai"
                className={`header-main-nav__link ${isInteriorActive ? 'header-main-nav__link--active' : ''}`}
                title={`Interior Car Accessories in ${business.city}`}
                aria-current={isInteriorActive ? 'page' : undefined}
              >
                <span>Interior</span>
                {isInteriorActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>

            {/* 5. Gallery */}
            <li className="header-main-nav__item">
              <Link
                to="/gallery"
                className={`header-main-nav__link ${isGalleryActive ? 'header-main-nav__link--active' : ''}`}
                aria-current={isGalleryActive ? 'page' : undefined}
              >
                <span>Gallery</span>
                {isGalleryActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>

            {/* 6. Reviews */}
            <li className="header-main-nav__item">
              <Link
                to="/reviews"
                className={`header-main-nav__link ${isReviewsActive ? 'header-main-nav__link--active' : ''}`}
                aria-current={isReviewsActive ? 'page' : undefined}
              >
                <span>Reviews</span>
                {isReviewsActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>

            {/* 7. About Us */}
            <li className="header-main-nav__item">
              <Link
                to="/about"
                className={`header-main-nav__link ${isAboutActive ? 'header-main-nav__link--active' : ''}`}
                aria-current={isAboutActive ? 'page' : undefined}
              >
                <span>About Us</span>
                {isAboutActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>

            {/* 8. Contact */}
            <li className="header-main-nav__item">
              <Link
                to="/contact"
                className={`header-main-nav__link ${isContactActive ? 'header-main-nav__link--active' : ''}`}
                aria-current={isContactActive ? 'page' : undefined}
              >
                <span>Contact</span>
                {isContactActive && <span className="header-main-nav__indicator" aria-hidden="true" />}
              </Link>
            </li>
          </ul>
        </nav>

        {/* ── Right: Action Controls (Search, Cart, Phone, Mobile Toggle) ── */}
        <div className="header-main-controls">
          {/* Search Trigger */}
          <button
            type="button"
            className="header-icon-btn header-icon-btn--search"
            onClick={onOpenSearch}
            aria-label="Search accessories catalogue"
            title="Search accessories catalogue"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          {/* Shopping Cart Button */}
          <button
            type="button"
            className="header-icon-btn header-icon-btn--cart"
            onClick={openDrawer}
            aria-label={`Shopping cart with ${totalCount} items`}
            title={`Shopping Cart (${totalCount} items)`}
          >
            <span className="header-icon-btn__label">CART</span>
            <ShoppingBag size={18} aria-hidden="true" />
            {totalCount > 0 && (
              <span className="header-cart-badge" aria-hidden="true">
                {totalCount}
              </span>
            )}
          </button>

          {/* Phone / Call Direct Link */}
          <a
            href={business.callHref}
            className="header-icon-btn header-icon-btn--phone"
            aria-label={`Call ${business.name}`}
            title={`Call ${business.name} (${business.phone})`}
          >
            <Phone size={18} aria-hidden="true" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="header-icon-btn header-icon-btn--toggle"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>

      </div>
    </div>
  );
}
