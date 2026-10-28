import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, MessageCircle, Instagram, Phone, MapPin, ShieldCheck, Layers } from 'lucide-react';
import business from '../../../config/business';
import './MobileMenu.css';

export default function MobileMenu({ isOpen, onClose, whatsappUrl, instagramUrl }) {
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/', index: '01' },
    { name: 'Exterior', path: '/exterior-car-accessories-chennai', index: '02', icon: ShieldCheck },
    { name: 'Interior', path: '/interior-car-accessories-chennai', index: '03', icon: Layers },
    { name: 'Gallery', path: '/gallery', index: '04' },
    { name: 'Reviews', path: '/reviews', index: '05' },
    { name: 'About Us', path: '/about', index: '06' },
    { name: 'Contact', path: '/contact', index: '07' },
  ];

  return (
    <div
      className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      aria-hidden={!isOpen}
      ref={menuRef}
    >
      <div className="mobile-menu-header">
        <Link to="/" className="brand-badge" onClick={onClose} aria-label={business.name}>
          <img src="/logo.svg" alt={business.name} className="brand-badge__logo" width="220" height="42" />
        </Link>
        <button
          className="mobile-menu-close"
          onClick={onClose}
          aria-label="Close mobile navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mobile-menu-nav" aria-label="Mobile Navigation">
        <span className="mobile-menu-eyebrow">Studio Navigation</span>
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={onClose}
                >
                  <div className="mobile-menu-link-left">
                    {Icon && <Icon size={16} className="mobile-menu-link-icon" aria-hidden="true" />}
                    <span>{item.name}</span>
                  </div>
                  <span className="mobile-menu-index">{item.index}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mobile-menu-contact-info">
        <a href={business.callHref} className="mobile-menu-contact-row">
          <Phone size={15} className="mobile-menu-red-icon" />
          <span>Call: {business.phone}</span>
        </a>
        <div className="mobile-menu-contact-row">
          <MapPin size={15} className="mobile-menu-red-icon" />
          <span>{business.landmark}</span>
        </div>
      </div>

      <div className="mobile-menu-footer">
        <div className="mobile-menu-actions">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mobile-whatsapp"
              aria-label="Enquire via WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mobile-ig"
              aria-label="Visit Instagram"
            >
              <Instagram size={16} />
              <span>Instagram</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
