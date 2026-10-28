import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Instagram, Phone } from 'lucide-react';
import business from '../../../config/business';

export default function MainHeader({ onOpenSearch, onOpenMobileMenu }) {
  const location = useLocation();

  const isHomeActive = location.pathname === '/';
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
          <img src="/logo.svg" alt={business.name} className="brand-badge__logo" width="220" height="42" />
        </Link>

        {/* ── Center: Direct Navigation (Accessories Split into Exterior & Interior) ── */}
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

            {/* 2. Exterior Accessories */}
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

            {/* 3. Interior Accessories */}
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

            {/* 4. Gallery */}
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

            {/* 5. Reviews */}
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

            {/* 6. About Us */}
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

            {/* 6. Contact */}
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

        {/* ── Right: Action Controls (Search, Instagram, Phone, Mobile Toggle) ── */}
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

          {/* Instagram Account Link */}
          <a
            href={business.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="header-icon-btn header-icon-btn--ig"
            aria-label="Visit our Instagram"
            title={`Visit our Instagram (${business.instagramHandle})`}
          >
            <Instagram size={18} aria-hidden="true" />
          </a>

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
