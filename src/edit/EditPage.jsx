import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import EditSidebar, { SECTIONS } from './EditShell.jsx';
import EditLogin from './EditLogin.jsx';
import BusinessEditor from './editors/BusinessEditor.jsx';
import CatalogEditor from './editors/CatalogEditor.jsx';
import AboutEditor from './editors/AboutEditor.jsx';
import ProcessEditor from './editors/ProcessEditor.jsx';
import ReviewsEditor from './editors/ReviewsEditor.jsx';
import GalleryEditor from './editors/GalleryEditor.jsx';
import FAQsEditor from './editors/FAQsEditor.jsx';
import FormsEditor from './editors/FormsEditor.jsx';
import ProductsEditor from './editors/ProductsEditor.jsx';
import ShopProductsEditor from './editors/ShopProductsEditor.jsx';
import './index.css';
import './EditShell.css';

const VALID_IDS = SECTIONS.map((s) => s.id);
const DEFAULT_ID = 'business';

function Editor({ sectionId }) {
    switch (sectionId) {
        case 'business': return <BusinessEditor />;
        case 'catalog': return <CatalogEditor />;
        case 'about': return <AboutEditor />;
        case 'process': return <ProcessEditor />;
        case 'reviews': return <ReviewsEditor />;
        case 'gallery': return <GalleryEditor />;
        case 'faqs': return <FAQsEditor />;
        case 'forms': return <FormsEditor />;
        case 'productsExterior': return <ProductsEditor section="productsExterior" />;
        case 'productsInterior': return <ProductsEditor section="productsInterior" />;
        case 'shopProducts': return <ShopProductsEditor />;
        default: return null;
    }
}

/**
 * The active section lives in the URL hash, so a reload or a shared
 * link lands on the same place instead of resetting to the first tab.
 */
function useSectionFromHash() {
    const read = () => {
        const id = window.location.hash.replace(/^#\/?/, '');
        return VALID_IDS.includes(id) ? id : DEFAULT_ID;
    };

    const [sectionId, setSectionId] = useState(read);

    useEffect(() => {
        const onHashChange = () => setSectionId(read());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const select = useCallback((id) => {
        window.location.hash = `/${id}`;
        setSectionId(id);
        // A new section is a new document as far as the reader is concerned.
        document.querySelector('.edit-shell__main')?.scrollTo({ top: 0 });
    }, []);

    return [sectionId, select];
}

function Shell() {
    const [activeId, setActiveId] = useSectionFromHash();

    // Warn before losing unsaved edits to a section switch or tab close.
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, []);

    return (
        <div className="edit-shell">
            <EditSidebar activeId={activeId} onSelect={setActiveId} />
            <div className="edit-shell__main">
                <div className="edit-shell__content">
                    <Editor sectionId={activeId} />
                </div>
            </div>
        </div>
    );
}

function EditContent() {
    const { isAuthenticated, sessionExpired } = useAuth();

    if (!isAuthenticated && !sessionExpired) {
        return <EditLogin />;
    }

    // The overlay keeps the editor mounted, so unsaved changes survive re-login.
    return (
        <>
            <Shell />
            {sessionExpired && (
                <div className="edit-session-overlay" role="dialog" aria-modal="true" aria-label="Session expired">
                    <EditLogin />
                </div>
            )}
        </>
    );
}

export default function EditPage() {
    return (
        <AuthProvider>
            <EditContent />
        </AuthProvider>
    );
}