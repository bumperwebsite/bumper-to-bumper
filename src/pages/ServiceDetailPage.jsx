import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MessageCircle,
  ChevronRight,
  Cpu,
  Clock,
  ShieldCheck,
  AlertCircle,
  Home,
} from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs/Breadcrumbs';
import FAQ from '../components/ui/FAQ/FAQ';
import CTASection from '../components/ui/CTASection/CTASection';
import RelatedServices from '../components/ui/RelatedServices/RelatedServices';
import exteriorData from '../data/services/exterior.json';
import interiorData from '../data/services/interior.json';
import business, { fillTokens } from '../config/business';
import { renderSubheadingWithRed } from '../utils/textUtils';
import './ServiceDetailPage.css';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const mediaRef = useRef(null);

  const allServices = [...exteriorData.items, ...interiorData.items];
  const service = allServices.find((s) => s.slug === slug);

  if (!service) {
    return (
      <section className="sd-not-found">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accessories', href: '/exterior-car-accessories-chennai' },
              { label: 'Not Found' },
            ]}
          />
          <div className="sd-not-found__card">
            <AlertCircle size={44} className="sd-not-found__icon" />
            <span className="section-label">Service Not Found</span>
            <h1 className="sd-not-found__title">Accessory Specification Not Found</h1>
            <p className="sd-not-found__desc">
              The requested accessory specification could not be located. Explore our 40 comprehensive exterior and interior automotive upgrades below.
            </p>
            <div className="sd-not-found__actions">
              <Link to="/exterior-car-accessories-chennai" className="sd-hero__btn">
                <span>Exterior Accessories (20)</span>
                <ChevronRight size={15} className="sd-hero__btn-icon" />
              </Link>
              <Link to="/interior-car-accessories-chennai" className="sd-hero__btn">
                <span>Interior Customization (20)</span>
                <ChevronRight size={15} className="sd-hero__btn-icon" />
              </Link>
              <Link to="/" className="sd-hero__btn">
                <Home size={15} />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const isExterior = service.category === 'Exterior' || service.id?.startsWith('ext-');
  const categoryLabel = isExterior ? 'Exterior Accessories' : 'Interior Accessories';
  const categoryPath = isExterior
    ? '/exterior-car-accessories-chennai'
    : '/interior-car-accessories-chennai';

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: categoryLabel, href: categoryPath },
    { label: service.name, href: '' },
  ];

  const pageTitle = `${service.name} in ${business.city} | ${business.name}`;
  const pageDescription = `${service.shortDescription} Professional installation in ${business.location} with ${business.stats.yearsExperience}+ years experience. Contact ${business.name} today.`;
  const canonicalUrl = `${business.siteUrl}${
    isExterior ? '/exterior-car-accessories-chennai' : '/interior-car-accessories-chennai'
  }/${service.slug}`;

  const whatsappMessage = encodeURIComponent(
    `Hello ${business.name}, I would like to enquire about ${service.name} installation for my car.`
  );
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${whatsappMessage}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: business.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.street,
        addressLocality: business.location,
        addressRegion: business.state,
        postalCode: business.pincode,
        addressCountry: 'IN',
      },
    },
    areaServed: business.city,
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        {service.image && (
          <meta
            property="og:image"
            content={/^https?:\/\//.test(service.image) ? service.image : `${business.siteUrl}${service.image}`}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      {/* HERO */}
      <section className="sd-hero">
        <div className="container">
          <div className="sd-breadcrumb">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="sd-hero__grid">
            <div className="sd-hero__left">
              <h1 className="sd-hero__title">
                <span className="sd-hero__title-accent">{service.name.split(' ')[0]}</span>{' '}
                {service.name.split(' ').slice(1).join(' ')}
              </h1>
              <p className="sd-hero__lead">{renderSubheadingWithRed(service.shortDescription)}</p>

              <div className="sd-hero__actions">
                <Link to="/contact" className="sd-hero__btn">
                  <span>Book Fitment</span>
                  <ChevronRight size={16} className="sd-hero__btn-icon" />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sd-hero__btn"
                >
                  <span>WhatsApp Us</span>
                  <MessageCircle size={16} className="sd-hero__btn-icon" />
                </a>
              </div>
            </div>

            <div className="sd-hero__right">
              <div className="sd-media-box" ref={mediaRef}>
                <img
                  src={service.image || '/images/placeholder.webp'}
                  alt={service.imageAlt || service.name}
                  loading="eager"
                  className="sd-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.webp';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TELEMETRY — answers "how long / how much" above content fold */}
      <section className="sd-telemetry-section">
        <div className="container">
          <div className="sd-telemetry">
            <div className="sd-telemetry__item">
              <Cpu size={16} className="sd-telemetry__icon" />
              <div>
                <span className="sd-telemetry__label">Fitment Type</span>
                <strong className="sd-telemetry__value">Plug &amp; Play OEM+</strong>
              </div>
            </div>
            <div className="sd-telemetry__item">
              <Clock size={16} className="sd-telemetry__icon" />
              <div>
                <span className="sd-telemetry__label">Install Time</span>
                <strong className="sd-telemetry__value">1 – 3 Hours</strong>
              </div>
            </div>
            <div className="sd-telemetry__item">
              <ShieldCheck size={16} className="sd-telemetry__icon" />
              <div>
                <span className="sd-telemetry__label">Factory Warranty</span>
                <strong className="sd-telemetry__value">100% Intact</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT — 2-col with sidebar */}
      <section className="sd-content">
        <div className="container">
          <div className="sd-content__grid">
            <div className="sd-content__main">
              <div className="sd-content__header">
                <span className="section-label">Engineering &amp; Craftsmanship</span>
                <h2>Upgrade <span className="text-red">Specifications</span></h2>
                <p className="sd-content__desc">{service.description}</p>
              </div>

              {service.benefits && service.benefits.length > 0 && (
                <div className="sd-features">
                  <h3 className="sd-features__title">Key Technical <span className="text-red">Advantages</span></h3>
                  <div className="sd-features__grid">
                    {service.benefits.map((benefit, i) => (
                      <div className="sd-features__card" key={i}>
                        <span className="sd-features__card-num">0{i + 1}</span>
                        <p>{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.installation && (
                <div className="sd-installation">
                  <div className="sd-installation__header">
                    <span className="section-label">Fitment Process</span>
                    <h3 className="sd-installation__title">Installation &amp; <span className="text-red">Fitment</span></h3>
                  </div>
                  <p>{fillTokens(service.installation)}</p>
                  <div className="sd-installation__badges">
                    <span className="tech-tag">Zero Void Warranty</span>
                    <span className="tech-tag">Heat-Resistant Sleeving</span>
                    <span className="tech-tag">Diagnostic Tested</span>
                  </div>
                </div>
              )}

              {service.options && service.options.length > 0 && (
                <div className="sd-options">
                  <h3 className="sd-options__title">Available <span className="text-red">Configurations</span></h3>
                  <div className="sd-options__list">
                    {service.options.map((option, i) => {
                      const label =
                        typeof option === 'object' && option !== null ? option.label : option;
                      const description =
                        typeof option === 'object' && option !== null ? option.description : null;
                      return (
                        <div className="sd-options__chip" key={i}>
                          <span className="sd-options__bullet" />
                          <div className="sd-options__content">
                            <strong className="sd-options__label">{label}</strong>
                            {description && <span className="sd-options__desc">{description}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <aside className="sd-sidebar">
              <div className="sd-sidebar__card">
                <div className="sd-sidebar__header">
                  <span className="sd-sidebar__tag">Instant Consultation</span>
                  <h3 className="sd-sidebar__title">Customized for Your <span className="text-red">Car</span></h3>
                </div>
                <p className="sd-sidebar__desc">
                  Send our technicians your car model, manufacturing year, and preferred upgrades for
                  quick pricing and slot <span className="text-red">confirmation</span>.
                </p>

                <div className="sd-sidebar__actions">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sd-sidebar__btn sd-sidebar__btn--primary"
                  >
                    <span>WhatsApp Inquiry</span>
                    <MessageCircle size={16} className="sd-sidebar__btn-icon" />
                  </a>
                  <Link to="/contact" className="sd-sidebar__btn">
                    <span>Book Fitment Slot</span>
                    <ChevronRight size={16} className="sd-sidebar__btn-icon" />
                  </Link>
                </div>

                <div className="sd-sidebar__meta">
                  <div className="sd-sidebar__meta-row">
                    <span>Studio</span>
                    <strong>{business.location}</strong>
                  </div>
                  <div className="sd-sidebar__meta-row">
                    <span>Estimated Time</span>
                    <strong>1 – 3 Hours</strong>
                  </div>
                  <div className="sd-sidebar__meta-row">
                    <span>Fitment</span>
                    <strong>100% Plug &amp; Play</strong>
                  </div>
                  <div className="sd-sidebar__meta-row">
                    <span>Testing</span>
                    <strong>Handover Inspection</strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {service.faqs && service.faqs.length > 0 && (
        <section className="sd-faq">
          <div className="container">
            <div className="sd-faq__header">
              <span className="section-label">Questions &amp; Answers</span>
              <h2>Frequently Asked <span className="text-red">Questions</span></h2>
              <p className="sd-faq__subtitle">
                Common questions about {service.name.toLowerCase()} installation, materials, warranty, and fitment — answered by our {business.city} <span className="text-red">technicians</span>.
              </p>
            </div>
            <div className="sd-faq__wrap">
              <FAQ faqs={service.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ── Related Accessories Showcase with Images ────────── */}
      <section className="sd-related">
        <div className="container">
          <div className="sd-related__header">
            <span className="section-label">RECOMMENDED UPGRADES</span>
            <h2>Related <span className="text-red">Accessories</span></h2>
            <p className="sd-related__subtitle">
              Explore more {service.category === 'exterior' || service.category === 'Exterior' ? 'exterior' : 'interior'} enhancements chosen by {business.city} <span className="text-red">drivers</span>.
            </p>
          </div>
          <RelatedServices
            slugs={service.relatedServices || []}
            currentSlug={service.slug}
            category={service.category}
            hideHeader
          />
        </div>
      </section>

      <CTASection
        title={`Upgrade Your Vehicle with ${service.name}`}
        subtitle={`Visit ${business.name} in ${business.location} for professional consultation and flawless fitment.`}
        primaryCta={{ label: 'Schedule Fitment', href: '/contact' }}
        whatsappMessage={`Hi, I would like to get a quote for ${service.name}.`}
        dark={true}
      />
    </>
  );
}
