import { ShieldCheck, Wrench, Award, MapPin } from 'lucide-react';
import business from '../../../config/business';
import './CountUpStats.css';

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: <>GENUINE <span className="text-red">ACCESSORIES</span></>,
    desc: <>OEM-grade components backed by manufacturer warranty and exact model <span className="text-red">fitment</span>.</>,
    stat: `${business.stats.accessoryCategories}+ Categories`
  },
  {
    icon: Wrench,
    title: <><span className="text-red">ZERO</span> WIRE-CUTTING</>,
    desc: <>Coupler-to-coupler installation by certified technicians, preserving car electrical <span className="text-red">warranty</span>.</>,
    stat: '100% Plug & Play'
  },
  {
    icon: Award,
    title: <>{business.stats.yearsExperience}+ YEARS OF <span className="text-red">EXPERIENCE</span></>,
    desc: <>Over {business.stats.clientsServed.toLocaleString()}+ car upgrades and bespoke custom styling delivered across <span className="text-red">{business.city}</span>.</>,
    stat: `${business.stats.yearsExperience}+ Years of Experience`
  },
  {
    icon: MapPin,
    title: <>{business.location.split(',')[0].toUpperCase()} <span className="text-red">STUDIO</span></>,
    desc: <>Located at {business.landmark} with dedicated <span className="text-red">bay</span>.</>,
    stat: `${business.city} Studio`
  }
];

export default function CountUpStats() {
  return (
    <section className="trust-features-section" aria-label={`Why Choose ${business.shortName}`}>
      <div className="container">
        <div className="trust-features__grid">
          {trustFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="trust-feature-card" key={index}>
                <div className="trust-feature-icon-wrapper">
                  <Icon size={24} className="trust-feature-icon" />
                </div>
                <div className="trust-feature-content">
                  <span className="trust-feature-stat">{item.stat}</span>
                  <h3 className="trust-feature-title">{item.title}</h3>
                  <p className="trust-feature-desc">{item.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
