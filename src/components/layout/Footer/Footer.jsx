import { Link } from 'react-router-dom';
import { Instagram, Youtube, MapPin, Phone, Clock, Mail, ShieldCheck } from 'lucide-react';
import business from '../../../config/business';
import exteriorData from '../../../data/products/exterior.json';
import interiorData from '../../../data/products/interior.json';
import './Footer.css';

const categoryRoutes = {
  exterior: '/exterior-car-accessories-chennai',
  interior: '/interior-car-accessories-chennai',
};

const popularUpgrades = [
  ...exteriorData.items.filter(p => p.showInFooter),
  ...interiorData.items.filter(p => p.showInFooter),
].slice(0, 8);

export default function Footer() {
  const phoneDisplay = business.phone;
  const instaUrl = business.social.instagram;

  return (
    <footer className="footer">
      <div className="container">

        {/* ── Trust Banner Strip above footer columns ────────── */}
        <div className="footer-trust-banner">
          <div className="footer-trust-item">
            <span className="footer-trust-icon">★</span>
            <div>
              <strong>{business.stats.yearsExperience}+ Years of Experience</strong>
              <p>Trusted by {business.stats.clientsServed.toLocaleString()}+ vehicle owners in {business.city}</p>
            </div>
          </div>
          <div className="footer-trust-item">
            <span className="footer-trust-icon"><ShieldCheck size={20} /></span>
            <div>
              <strong>Zero Wire-Cutting Fitment</strong>
              <p>100% plug &amp; play couplers protect warranty</p>
            </div>
          </div>
          <div className="footer-trust-item">
            <span className="footer-trust-icon">📍</span>
            <div>
              <strong>Prime {business.location.split(',')[0]} Studio</strong>
              <p>{business.landmark}, {business.city}</p>
            </div>
          </div>
        </div>

        {/* ── Footer Grid ───────────────────────────────────── */}
        <div className="footer-grid">

          <div className="footer-col footer-col--brand">
            <div className="footer-brand">
              <Link to="/" className="footer-logo" aria-label={business.name}>
                <img
                  src="/logo.svg"
                  alt={business.name}
                  className="footer-logo-img"
                  width="240"
                  height="46"
                />
              </Link>
              <p className="footer-desc">
                {business.city}'s premier automotive accessories and retrofit studio. Precision OEM fitment, zero wire-cutting craftsmanship, and over {business.stats.yearsExperience} years of dedication to enhancing every drive.
              </p>
              <div className="footer-socials" aria-label="Social media links">
                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link footer-social-link--ig"
                  aria-label={`Follow ${business.shortName} on Instagram`}
                >
                  <Instagram size={17} />
                  <span>{business.instagramHandle}</span>
                </a>
                {business.social.youtube && (
                  <a
                    href={business.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link footer-social-link--yt"
                    aria-label={`Watch ${business.shortName} on YouTube`}
                  >
                    <Youtube size={17} />
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Studio <span className="text-red">Navigation</span></h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products Catalogue</Link></li>
              <li><Link to="/exterior-car-accessories-chennai">Exterior Upgrades</Link></li>
              <li><Link to="/interior-car-accessories-chennai">Interior Styling</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/gallery">Gallery Showcase</Link></li>
              <li><Link to="/about">About Studio</Link></li>
              <li><Link to="/reviews">Customer Reviews</Link></li>
              <li><Link to="/contact">Contact &amp; Location</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Popular <span className="text-red">Upgrades</span></h3>
            <ul className="footer-links">
              {popularUpgrades.map(p => (
                <li key={p.id}>
                  <Link to={`${categoryRoutes[p.category]}/${p.slug}`}>
                    {p.navName || p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col footer-col--contact">
            <h3 className="footer-col-title">Studio <span className="text-red">Location</span></h3>
            <ul className="footer-contact-list">
              <li>
                <div className="footer-contact-item">
                  <span className="footer-contact-item-icon"><MapPin size={15} /></span>
                  <div className="footer-contact-item-body">
                    <span className="footer-contact-item-label">Address</span>
                    <span className="footer-contact-item-value">{business.address}</span>
                  </div>
                </div>
              </li>
              <li>
                <a href={business.callHref} className="footer-contact-item">
                  <span className="footer-contact-item-icon"><Phone size={15} /></span>
                  <div className="footer-contact-item-body">
                    <span className="footer-contact-item-label">Phone &amp; WhatsApp (Click to Call)</span>
                    <span className="footer-contact-item-value footer-contact-phone">{phoneDisplay}</span>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="footer-contact-item">
                  <span className="footer-contact-item-icon"><Mail size={15} /></span>
                  <div className="footer-contact-item-body">
                    <span className="footer-contact-item-label">Email Enquiry</span>
                    <span className="footer-contact-item-value">{business.email}</span>
                  </div>
                </a>
              </li>
              <li>
                <div className="footer-contact-item">
                  <span className="footer-contact-item-icon"><Clock size={15} /></span>
                  <div className="footer-contact-item-body">
                    <span className="footer-contact-item-label">Opening Hours</span>
                    <span className="footer-contact-item-value">{business.hoursWeekdays}</span>
                    <span className="footer-contact-item-value">{business.hoursSunday}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Footer Bottom Bar ──────────────────────────────── */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <div className="footer-bottom-meta">
            <span>{business.location}</span>
            <span className="footer-bottom-meta-sep">·</span>
            <span>{business.city}, {business.state}</span>
            <span className="footer-bottom-meta-sep">·</span>
            <span className="footer-bottom-tagline">Automotive Upgrades &amp; Customization</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
