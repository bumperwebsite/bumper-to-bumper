import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import exteriorData from '../../../data/services/exterior.json';
import interiorData from '../../../data/services/interior.json';
import { renderHeadingWithRed } from '../../../utils/textUtils';
import './RelatedServices.css';

export default function RelatedServices({
  slugs = [],
  services: servicesProp,
  currentSlug,
  category,
  title = 'Related Accessories & Upgrades',
  label = 'Complementary Add-ons',
  hideHeader = false,
}) {
  const allServices = [...exteriorData.items, ...interiorData.items];

  let services = servicesProp;
  if (!services && slugs && slugs.length > 0) {
    services = slugs
      .filter(slug => slug !== currentSlug)
      .map(slug => allServices.find(s => s.slug === slug))
      .filter(Boolean)
      .slice(0, 4);
  }

  // Fallback: If no explicit related slugs or fewer than 3, fill with relevant category items
  if (!services || services.length < 3) {
    const targetCat = category || (allServices.find(s => s.slug === currentSlug)?.category) || 'exterior';
    const filler = allServices
      .filter(s => s.slug !== currentSlug && s.category === targetCat)
      .slice(0, 4);

    services = services && services.length > 0
      ? [...services, ...filler.filter(f => !services.some(s => s.slug === f.slug))].slice(0, 4)
      : filler;
  }

  if (!services || services.length === 0) return null;

  return (
    <div className="related-accessories-section">
      {!hideHeader && (
        <div className="related-accessories__header">
          {label && <span className="related-accessories__label">{label}</span>}
          <h2 className="related-accessories__title">{renderHeadingWithRed(title)}</h2>
          <p className="related-accessories__desc">
            Carefully curated accessories that pair seamlessly with your selection for enhanced aesthetics and <span className="text-red">performance</span>.
          </p>
        </div>
      )}

      <div className="related-accessories__grid">
        {services.map((item) => {
          const categoryPath =
            item.category === 'exterior'
              ? '/exterior-car-accessories-chennai'
              : '/interior-car-accessories-chennai';
          const isExterior = item.category === 'exterior';

          return (
            <Link
              key={item.id || item.slug}
              to={`${categoryPath}/${item.slug}`}
              className="related-accessory-card"
            >
              <div className="related-accessory-card__media">
                <img
                  src={item.image}
                  alt={item.imageAlt || item.name}
                  className="related-accessory-card__img"
                  loading="lazy"
                />
                <span className="related-accessory-card__badge">
                  {isExterior ? (
                    <>
                      <ShieldCheck size={12} aria-hidden="true" />
                      <span>Exterior</span>
                    </>
                  ) : (
                    <>
                      <Layers size={12} aria-hidden="true" />
                      <span>Interior</span>
                    </>
                  )}
                </span>
              </div>

              <div className="related-accessory-card__body">
                <h3 className="related-accessory-card__title">{renderHeadingWithRed(item.name)}</h3>
                <p className="related-accessory-card__snippet">
                  {item.shortDescription || item.description}
                </p>

                <div className="related-accessory-card__action">
                  <span>View Details</span>
                  <div className="related-accessory-card__arrow">
                    <ArrowRight size={14} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
