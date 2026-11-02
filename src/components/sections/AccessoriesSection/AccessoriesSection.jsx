import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ServiceCard from '../../ui/ServiceCard/ServiceCard';
import exteriorData from '../../../data/services/exterior.json';
import interiorData from '../../../data/services/interior.json';
import './AccessoriesSection.css';

export default function AccessoriesSection() {
  const [activeTab, setActiveTab] = useState('exterior');

  const items = activeTab === 'exterior'
    ? exteriorData.items.slice(0, 6)
    : interiorData.items.slice(0, 6);

  return (
    <section className="accessories-section" id="accessories" aria-label="Explore Our Products">
      {/* Automotive-themed background banner with dark overlay */}
      <div className="accessories-section__bg-banner" aria-hidden="true" />
      <div className="container">

        <header className="accessories-section__header">
          <span className="section-label">FEATURED INVENTORY</span>
          <h2 className="accessories-section__title">
            Explore Our <span className="accessories-section__title-accent">Products</span>
          </h2>
          <p className="accessories-section__subtitle">
            Explore accessories designed to transform the way your car looks, feels, and performs with <span className="text-red">zero</span> wire-cutting.
          </p>

          <div className="accessories-tabs" role="tablist" aria-label="Accessory categories">
            <button
              role="tab"
              aria-selected={activeTab === 'exterior'}
              className={`accessories-tab-btn ${activeTab === 'exterior' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('exterior')}
            >
              Exterior Upgrades ({exteriorData.items.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'interior'}
              className={`accessories-tab-btn ${activeTab === 'interior' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('interior')}
            >
              Interior Styling ({interiorData.items.length})
            </button>
          </div>
        </header>

        <div className="accessories-grid">
          {items.map((service, idx) => (
            <ServiceCard key={service.id} service={service} index={idx + 1} />
          ))}
        </div>

        <div className="accessories-action-bar">
          {activeTab === 'exterior' ? (
            <Link to="/exterior-car-accessories-chennai" className="btn btn-primary accessories-explore-btn">
              <span>View All {exteriorData.items.length} Exterior Accessories</span>
              <ArrowRight size={16} className="btn-icon" />
            </Link>
          ) : (
            <Link to="/interior-car-accessories-chennai" className="btn btn-primary accessories-explore-btn">
              <span>View All {interiorData.items.length} Interior Accessories</span>
              <ArrowRight size={16} className="btn-icon" />
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}
