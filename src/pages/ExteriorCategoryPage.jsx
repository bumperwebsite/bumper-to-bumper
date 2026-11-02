import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import exteriorData from '../data/services/exterior.json';
import business from '../config/business';
import faqsData from '../data/faqs.json';
import Breadcrumbs from '../components/ui/Breadcrumbs/Breadcrumbs';
import CTASection from '../components/ui/CTASection/CTASection';
import FAQ from '../components/ui/FAQ/FAQ';
import ServiceCard from '../components/ui/ServiceCard/ServiceCard';
import { renderHeadingWithRed } from '../utils/textUtils';
import './CategoryPage.css';
import { Search, ChevronRight, MessageCircle } from 'lucide-react';

const CATEGORY_FAQS = faqsData.exterior;
const FILTER_TAGS = exteriorData.filterTags;
const EXTERIOR_GROUPS = exteriorData.groups;

export default function ExteriorCategoryPage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filteredServices = useMemo(() => {
    let list = exteriorData.items;
    if (activeTag !== 'All') {
      const group = EXTERIOR_GROUPS.find(g => g.id === activeTag.toLowerCase());
      if (group) {
        list = list.filter(s => group.slugs.includes(s.slug));
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeTag]);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Exterior Car Accessories' },
  ];

  const pageTitle = `Exterior Car Accessories in ${business.city} | ${business.shortName}`;
  const pageDescription = `Explore exterior car accessories in ${business.city} at ${business.shortName}, ${business.location}. High-performance bi-LED fog lights, headlights, spoilers, side foot steps, and zero wire-cutting OEM fitment.`;

  const isGroupedView = activeTag === 'All' && !search.trim();
  const whatsappHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.shortName}, I am interested in exterior car accessories for my car.`)}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${business.siteUrl}/exterior-car-accessories-chennai`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Breadcrumb */}
      <div className="cat-breadcrumb-wrap">
        <div className="container">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Hero */}
      <section className="cat-hero cat-hero--exterior" aria-labelledby="cat-hero-title">
        <div className="cat-hero__media">
          <img
            className="cat-hero__bg"
            src="https://i.pinimg.com/736x/8d/84/03/8d840388e1e9aa2edff89183b40689a6.jpg"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div className="cat-hero__content">
          <span className="section-label">3D Exterior Customization Studio</span>
          <h1 id="cat-hero-title" className="cat-hero__title">
            Exterior Car <br /><span className="cat-hero__title-accent text-red">Accessories</span><br />in {business.city}
          </h1>
          <p className="cat-hero__subtitle">
            Explore exterior car accessories in {business.city} designed to complement your vehicle's appearance and everyday practicality. Browse available styling and protection accessories, compare product details, and choose options that suit your vehicle and <span className="text-red">preferences</span>.
          </p>
          <div className="cat-hero__actions">
            <Link to="/contact" className="cat-hero__btn cat-hero__btn--primary">
              <span>Book Fitment</span>
              <ChevronRight size={16} className="cat-hero__btn-icon" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cat-hero__btn cat-hero__btn--secondary"
            >
              <span>WhatsApp Us</span>
              <MessageCircle size={16} className="cat-hero__btn-icon" />
            </a>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="cat-filter-section" aria-label="Filter exterior accessories">
        <div className="container">
          <div className="cat-filter-grid">
            <div className="cat-search-col">
              <span className="cat-filter-eyebrow">Search</span>
              <div className="cat-search-wrap">
                <Search size={16} className="cat-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Fog light, spoiler, bumper…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="cat-search-input"
                  aria-label="Search exterior accessories"
                />
              </div>
            </div>
            <div className="cat-tags-col">
              <span className="cat-filter-eyebrow">Filter by group</span>
              <div className="cat-tags" role="tablist" aria-label="Accessory groups">
                {FILTER_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`cat-tag ${activeTag === tag ? 'cat-tag--active' : ''}`}
                    aria-pressed={activeTag === tag}
                    role="tab"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Display */}
      <section className="cat-grid-section" aria-label="Exterior accessory catalog">
        <div className="container">
          {isGroupedView ? (
            EXTERIOR_GROUPS.map((group, groupIdx) => {
              const groupItems = exteriorData.items.filter(s => group.slugs.includes(s.slug));
              if (groupItems.length === 0) return null;

              return (
                <div key={group.id} className="cat-group-block">
                  <div className="cat-group-header">
                    <div>
                      <span className="cat-group-tag">{group.tag}</span>
                      <h2 className="cat-group-title">{renderHeadingWithRed(group.title)}</h2>
                    </div>
                    <span className="cat-group-count">{groupItems.length} UPGRADES</span>
                  </div>

                  <div className="cat-grid">
                    {groupItems.map((service, idx) => (
                      <ServiceCard key={service.id} service={service} index={idx + 1} dark={true} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : filteredServices.length === 0 ? (
            <div className="cat-empty" role="status">
              <p>
                No accessories found matching your criteria.
                <button
                  onClick={() => { setSearch(''); setActiveTag('All'); }}
                  className="cat-empty-reset"
                  aria-label="Reset search and filters"
                >
                  Reset Filters
                </button>
              </p>
            </div>
          ) : (
            <div className="cat-grid">
              {filteredServices.map((service, idx) => (
                <ServiceCard key={service.id} service={service} index={idx + 1} dark={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="cat-faq" aria-labelledby="cat-faq-title">
        <div className="container">
          <header className="cat-faq__header">
            <span className="section-label">Technical Inquiries</span>
            <h2 id="cat-faq-title" className="cat-faq__title">
              Exterior Fitment <span className="text-red">FAQ</span>
            </h2>
            <p className="cat-faq__subtitle">
              Common questions about our exterior fitment process, materials, and warranty — answered by our {business.city} <span className="text-red">technicians</span>.
            </p>
          </header>
          <div className="cat-faq__inner">
            <FAQ faqs={CATEGORY_FAQS} />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <CTASection
        title={<>Ready to Transform Your Vehicle's <span className="text-red">Exterior</span>?</>}
        subtitle={<>Contact our technicians with your car model for accurate compatibility and <span className="text-red">pricing</span>.</>}
        primaryCta={{ label: 'Book Fitment Slot', href: '/contact' }}
        whatsappMessage={`Hi ${business.name}, I am interested in exterior car accessories for my car.`}
        dark={true}
      />
    </>
  );
}
