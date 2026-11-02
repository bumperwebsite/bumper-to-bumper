import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import interiorData from '../data/services/interior.json';
import business from '../config/business';
import faqsData from '../data/faqs.json';
import Breadcrumbs from '../components/ui/Breadcrumbs/Breadcrumbs';
import CTASection from '../components/ui/CTASection/CTASection';
import FAQ from '../components/ui/FAQ/FAQ';
import ServiceCard from '../components/ui/ServiceCard/ServiceCard';
import { renderHeadingWithRed } from '../utils/textUtils';
import './CategoryPage.css';
import { Search, ChevronRight, MessageCircle } from 'lucide-react';

const CATEGORY_FAQS = faqsData.interior;
const FILTER_TAGS = interiorData.filterTags;
const INTERIOR_GROUPS = interiorData.groups;

export default function InteriorCategoryPage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filteredServices = useMemo(() => {
    let list = interiorData.items;
    if (activeTag !== 'All') {
      const group = INTERIOR_GROUPS.find(g => g.id === activeTag.toLowerCase());
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
    { label: 'Interior Car Accessories' },
  ];

  const pageTitle = `Interior Car Accessories in ${business.city} | ${business.shortName}`;
  const pageDescription = `Discover premium interior car accessories in ${business.city} at ${business.shortName}, ${business.location}. Custom-fit seat covers, 7D floor mats, Android screens, ambient lights & audio.`;

  const isGroupedView = activeTag === 'All' && !search.trim();
  const whatsappHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.shortName}, I am interested in interior car customization for my car.`)}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${business.siteUrl}/interior-car-accessories-chennai`} />
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
      <section className="cat-hero cat-hero--interior" aria-labelledby="cat-hero-title">
        <div className="cat-hero__content">
          <span className="section-label">3D Cockpit Customization Studio</span>
          <h1 id="cat-hero-title" className="cat-hero__title">
            Interior Car <br /><span className="cat-hero__title-accent text-red">Accessories</span><br />in {business.city}
          </h1>
          <p className="cat-hero__subtitle">
            Explore interior car accessories in {business.city} designed for comfort, convenience, and elevated driving refinement. Browse tailored seat covers, durable all-weather floor mats, responsive touchscreen displays, and ambient interior styling suited to your vehicle <span className="text-red">model</span>.
          </p>
          <div className="cat-hero__actions">
            <Link to="/contact" className="cat-hero__btn cat-hero__btn--primary">
              <span>Book Fitting</span>
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
      <section className="cat-filter-section" aria-label="Filter interior accessories">
        <div className="container">
          <div className="cat-filter-grid">
            <div className="cat-search-col">
              <span className="cat-filter-eyebrow">Search</span>
              <div className="cat-search-wrap">
                <Search size={16} className="cat-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Ambient light, seat cover, infotainment…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="cat-search-input"
                  aria-label="Search interior accessories"
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
      <section className="cat-grid-section" aria-label="Interior accessory catalog">
        <div className="container">
          {isGroupedView ? (
            INTERIOR_GROUPS.map((group, groupIdx) => {
              const groupItems = interiorData.items.filter(s => group.slugs.includes(s.slug));
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
                No interior accessories found matching your criteria.
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
            <span className="section-label">Cabin Engineering</span>
            <h2 id="cat-faq-title" className="cat-faq__title">
              Interior Customization <span className="text-red">FAQ</span>
            </h2>
            <p className="cat-faq__subtitle">
              Common questions about our interior customization process, materials, and warranty — answered by our {business.city} <span className="text-red">technicians</span>.
            </p>
          </header>
          <div className="cat-faq__inner">
            <FAQ faqs={CATEGORY_FAQS} />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <CTASection
        title={<>Ready to Upgrade Your Car's <span className="text-red">Cabin</span>?</>}
        subtitle={<>Schedule your slot at {business.name}, {business.location} for professional <span className="text-red">consultation</span>.</>}
        primaryCta={{ label: 'Book Fitment Slot', href: '/contact' }}
        whatsappMessage={`Hi ${business.name}, I am interested in interior car customization for my car.`}
        dark={true}
      />
    </>
  );
}
