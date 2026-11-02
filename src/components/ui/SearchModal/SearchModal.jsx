import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import exteriorData from '../../../data/products/exterior.json';
import interiorData from '../../../data/products/interior.json';
import { productsCatalog } from '../../../data/productsCatalog';
import business from '../../../config/business';
import { renderHeadingWithRed } from '../../../utils/textUtils';
import './SearchModal.css';

// Consolidate searchable catalogue
const allItems = [
  ...productsCatalog.map(p => ({
    id: `prod-${p.id}`,
    name: p.name,
    categoryType: 'products',
    categoryLabel: `Product · ${p.category}`,
    shortDescription: p.shortDescription,
    description: p.description,
    image: p.image,
    url: `/products/${p.slug}`
  })),
  ...exteriorData.items.map(item => ({
    ...item,
    categoryType: 'exterior',
    categoryLabel: 'Exterior Upgrade',
    url: `/exterior-car-accessories-chennai/${item.slug}`
  })),
  ...interiorData.items.map(item => ({
    ...item,
    categoryType: 'interior',
    categoryLabel: 'Interior Customization',
    url: `/interior-car-accessories-chennai/${item.slug}`
  }))
];

export default function SearchModal({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialQuery) setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedCategory('All');
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

  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'All'
      || (selectedCategory === 'Products' && item.categoryType === 'products')
      || (selectedCategory === 'Exterior' && item.categoryType === 'exterior')
      || (selectedCategory === 'Interior' && item.categoryType === 'interior');

    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(q);
    const descMatch = (item.shortDescription || '').toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
    const benefitMatch = (item.benefits || []).some(b => b.toLowerCase().includes(q));

    return nameMatch || descMatch || benefitMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="search-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search accessories">
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Modal Search Bar */}
        <div className="search-modal-bar">
          <Search size={20} className="search-modal-bar-icon" />
          <input
            ref={inputRef}
            type="search"
            className="search-modal-input"
            placeholder="Search fog lights, seat covers, 360 camera, infotainment, ambient lights..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search car accessories"
          />
          {query && (
            <button
              type="button"
              className="search-modal-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            className="search-modal-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <kbd>ESC</kbd>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="search-modal-pills">
          {['All', 'Products', 'Exterior', 'Interior'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`search-modal-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <span className="search-modal-count">
            {filteredItems.length} {filteredItems.length === 1 ? 'accessory' : 'accessories'} found
          </span>
        </div>

        {/* Search Results */}
        <div className="search-modal-results">
          {filteredItems.length === 0 ? (
            <div className="search-modal-empty">
              <Sparkles size={28} className="search-modal-empty-icon" />
              <p>No accessories found for "{query}".</p>
              <span>Try searching for "lighting", "screen", "seat", "camera", or "mats".</span>
            </div>
          ) : (
            <div className="search-modal-grid">
              {filteredItems.slice(0, 10).map(item => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="search-modal-item"
                  onClick={onClose}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="search-modal-item-img"
                      loading="lazy"
                    />
                  )}
                  <div className="search-modal-item-info">
                    <div className="search-modal-item-badge">{item.categoryLabel}</div>
                    <h4 className="search-modal-item-title">{renderHeadingWithRed(item.name)}</h4>
                    <p className="search-modal-item-desc">{item.shortDescription}</p>
                  </div>
                  <ArrowRight size={16} className="search-modal-item-arrow" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="search-modal-footer">
          <span>Need custom advice?</span>
          <a
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.shortName}, I'm looking for an accessory recommendation for my car`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="search-modal-wa-link"
          >
            WhatsApp Technician ({business.phone})
          </a>
        </div>

      </div>
    </div>
  );
}
