import { useEffect } from 'react';
import {
    Building2,
    Info,
    Star,
    Image as ImageIcon,
    FileText,
    HelpCircle,
    ListOrdered,
    Wrench,
    LayoutGrid,
    ExternalLink,
    LogOut,
    Save,
    RotateCcw,
    RefreshCw,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { useAuth } from './hooks/useAuth.jsx';
import './EditShell.css';

/* ============================================================
   SECTION REGISTRY
   One list drives the sidebar and the page header, so a new data
   file only has to be registered here.
   ============================================================ */

export const SECTIONS = [
    {
        id: 'business',
        label: 'Business',
        description: 'Name, contact details, hours, location, and stats shown across the site.',
        icon: Building2,
        file: 'src/data/business.json',
        group: 'Site',
    },
    {
        id: 'catalog',
        label: 'Catalog',
        description: 'Navigation categories, supported car brands, and the vehicle showcase.',
        icon: LayoutGrid,
        file: 'src/data/catalog.json',
        group: 'Site',
    },
    {
        id: 'about',
        label: 'About',
        description: 'Company story, standards, and the accessory range shown on the About page.',
        icon: Info,
        file: 'src/data/about.json',
        group: 'Content',
    },
    {
        id: 'process',
        label: 'Process',
        description: 'The step-by-step journey shown in the process section.',
        icon: ListOrdered,
        file: 'src/data/process.json',
        group: 'Content',
    },
    {
        id: 'reviews',
        label: 'Reviews',
        description: 'Customer reviews and the highlights strip.',
        icon: Star,
        file: 'src/data/reviews.json',
        group: 'Content',
    },
    {
        id: 'gallery',
        label: 'Gallery',
        description: 'Installation photos and the filter categories above them.',
        icon: ImageIcon,
        file: 'src/data/gallery.json',
        group: 'Content',
    },
    {
        id: 'faqs',
        label: 'FAQs',
        description: 'Questions grouped by page: homepage, about, exterior, interior.',
        icon: HelpCircle,
        file: 'src/data/faqs.json',
        group: 'Content',
    },
    {
        id: 'forms',
        label: 'Forms',
        description: 'Dropdown options for the contact, quick enquiry, and franchise forms.',
        icon: FileText,
        file: 'src/data/forms.json',
        group: 'Conversion',
    },
    {
        id: 'productsExterior',
        label: 'Exterior products',
        description: 'Exterior accessory catalogue, filter tags, and page groupings.',
        icon: Wrench,
        file: 'src/data/services/exterior.json',
        group: 'Products',
    },
    {
        id: 'productsInterior',
        label: 'Interior products',
        description: 'Interior accessory catalogue, filter tags, and page groupings.',
        icon: Wrench,
        file: 'src/data/services/interior.json',
        group: 'Products',
    },
];

export const GROUPS = ['Site', 'Content', 'Conversion', 'Products'];

/* ============================================================
   SIDEBAR
   ============================================================ */

export default function EditSidebar({ activeId, onSelect }) {
    const { logout } = useAuth();

    return (
        <nav className="edit-sidebar" aria-label="Data sections">
            <div className="edit-sidebar__brand">
                <span className="edit-sidebar__brand-mark" aria-hidden="true" />
                <span className="edit-sidebar__brand-text">
                    <span className="edit-sidebar__brand-name">Edit Console</span>
                    <span className="edit-sidebar__brand-sub">Content Management</span>
                </span>
            </div>

            <div className="edit-sidebar__scroll">
                {GROUPS.map((group) => (
                    <div key={group} className="edit-sidebar__group">
                        <h2 className="edit-sidebar__group-title">{group}</h2>
                        <ul className="edit-sidebar__list">
                            {SECTIONS.filter((s) => s.group === group).map((section) => {
                                const Icon = section.icon;
                                const isActive = activeId === section.id;
                                return (
                                    <li key={section.id}>
                                        <button
                                            type="button"
                                            className={`edit-sidebar__item ${isActive ? 'edit-sidebar__item--active' : ''}`}
                                            onClick={() => onSelect(section.id)}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            <Icon size={16} aria-hidden="true" />
                                            <span className="edit-sidebar__item-label">{section.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="edit-sidebar__footer">
                <a href="/" target="_blank" rel="noopener noreferrer" className="edit-sidebar__footer-item">
                    <ExternalLink size={14} aria-hidden="true" />
                    <span>View site</span>
                </a>
                <button type="button" className="edit-sidebar__footer-item" onClick={logout}>
                    <LogOut size={14} aria-hidden="true" />
                    <span>Sign out</span>
                </button>
            </div>
        </nav>
    );
}

/* ============================================================
   PAGE HEADER — names the section, its file, and what it drives.
   ============================================================ */

export function SectionHeader({ section }) {
    const Icon = section.icon;
    return (
        <header className="edit-header">
            <div className="edit-header__icon" aria-hidden="true">
                <Icon size={18} />
            </div>
            <div className="edit-header__text">
                <h1 className="edit-header__title">{section.label}</h1>
                <p className="edit-header__description">{section.description}</p>
                <code className="edit-header__file">{section.file}</code>
            </div>
        </header>
    );
}

/* ============================================================
   SAVE BAR — the commit surface.
   Sticky so it stays reachable however long the form is, and it
   is the only place Save/Discard/Refresh exist.
   ============================================================ */

export function SaveBar({ loading, saving, error, hasChanges, onRefresh, onDiscard, onSave }) {
    // Unsaved work should not vanish on a stray reload.
    useEffect(() => {
        if (!hasChanges) return undefined;
        const handler = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasChanges]);

    if (loading) {
        return (
            <div className="edit-savebar edit-savebar--loading" role="status">
                <span className="edit-savebar__loading">
                    <Loader2 size={14} className="edit-spinner" />
                    Loading {''}
                </span>
            </div>
        );
    }

    return (
        <div className="edit-savebar">
            <div className="edit-savebar__status">
                {hasChanges ? (
                    <span className="edit-savebar__badge edit-savebar__badge--dirty">
                        <span className="edit-savebar__dot" aria-hidden="true" />
                        Unsaved changes
                    </span>
                ) : (
                    <span className="edit-savebar__badge">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="m3 8.5 3.5 3.5L13 5" />
                        </svg>
                        All changes saved
                    </span>
                )}
                {error && (
                    <span className="edit-savebar__error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        {error}
                    </span>
                )}
            </div>

            <div className="edit-savebar__actions">
                <button
                    type="button"
                    className="edit-btn edit-btn--ghost"
                    onClick={onRefresh}
                    disabled={saving || !hasChanges}
                    title={hasChanges ? 'Discard changes and reload from GitHub' : 'Reload from GitHub'}
                >
                    <RefreshCw size={14} aria-hidden="true" />
                    Reload
                </button>
                <button
                    type="button"
                    className="edit-btn"
                    onClick={onDiscard}
                    disabled={saving || !hasChanges}
                >
                    <RotateCcw size={14} aria-hidden="true" />
                    Discard
                </button>
                <button
                    type="button"
                    className="edit-btn edit-btn--primary"
                    onClick={onSave}
                    disabled={saving || !hasChanges}
                >
                    {saving ? (
                        <Loader2 size={14} className="edit-spinner" aria-hidden="true" />
                    ) : (
                        <Save size={14} aria-hidden="true" />
                    )}
                    {saving ? 'Saving' : 'Save changes'}
                </button>
            </div>
        </div>
    );
}