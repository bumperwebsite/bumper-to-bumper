import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  CheckCircle2,
  FileDown,
  MessageCircle,
  Share2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Phone,
  User,
  Car,
  FileText
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/productsCatalog';
import { generateOrderPdf } from '../utils/orderPdfGenerator';
import { getWhatsAppOrderUrl, OWNER_WHATSAPP_NUMBER } from '../utils/whatsappOrder';
import business from '../config/business';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalCount, pricedItemsTotal, hasUnpricedItems, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Completed Order Modal State
  const [completedOrder, setCompletedOrder] = useState(null);
  const [pdfResult, setPdfResult] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  // Field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Please enter your mobile number';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);

    try {
      // Generate unique Order ID
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const orderId = `B2B-${randomSuffix}`;

      // Current Date and Time
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const orderDate = `${day}-${month}-${year}`;

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const orderTime = `${hours}:${minutes} ${ampm}`;

      // Package Order Data
      const orderData = {
        orderId,
        orderDate,
        orderTime,
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          vehicle: formData.vehicle.trim()
        },
        items: [...cart],
        totalProducts: cart.length,
        totalQuantity: totalCount,
        estimatedTotal: pricedItemsTotal,
        hasUnpricedItems,
        notes: formData.notes.trim()
      };

      // Generate PDF locally
      const generatedPdf = generateOrderPdf(orderData);

      // Generate WhatsApp click-to-chat URL
      const whatsappUrl = getWhatsAppOrderUrl(orderData);

      // Save to order history in localStorage
      try {
        const history = JSON.parse(localStorage.getItem('btb_order_history') || '[]');
        history.unshift(orderData);
        localStorage.setItem('btb_order_history', JSON.stringify(history.slice(0, 20)));
      } catch (err) {
        console.warn('Could not save order history:', err);
      }

      setCompletedOrder({
        ...orderData,
        whatsappUrl
      });
      setPdfResult(generatedPdf);

      // Clear the cart
      clearCart();
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('There was an issue processing your order. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF Download Handler
  const handleDownloadPdf = () => {
    if (!pdfResult || !completedOrder) return;
    pdfResult.download(`B2B_Order_${completedOrder.orderId}.pdf`);
    setDownloaded(true);
  };

  // Web Share API handler (for mobile sharing)
  const handleSharePdf = async () => {
    if (!pdfResult || !completedOrder) return;
    try {
      const file = new File([pdfResult.blob], `B2B_Order_${completedOrder.orderId}.pdf`, {
        type: 'application/pdf'
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Bumper To Bumper Order ${completedOrder.orderId}`,
          text: `Here is my order summary from Bumper To Bumper Car Accessories.`
        });
      } else {
        handleDownloadPdf();
      }
    } catch (e) {
      console.log('Share canceled or not supported:', e);
      handleDownloadPdf();
    }
  };

  const siteUrl = business.siteUrl || 'https://bumpertobumpercaraccessories.com';

  return (
    <>
      <Helmet>
        <title>Checkout &amp; Order Submission | Bumper To Bumper Car Accessories</title>
        <meta name="description" content="Complete your automotive accessories order enquiry. Instant WhatsApp order notification and official PDF summary generation." />
        <link rel="canonical" href={`${siteUrl}/checkout`} />
      </Helmet>

      <div className="btb-checkout-page">
        {/* Header Strip */}
        <div className="btb-checkout-header">
          <div className="container">
            <span className="btb-checkout-header__eyebrow">CHECKOUT &amp; ORDER TRANSMISSION</span>
            <h1 className="btb-checkout-header__title">
              Complete Your <span className="text-red">Order</span>
            </h1>
            <p className="btb-checkout-header__desc">
              Provide your contact details. Your order summary and official PDF will be prepared instantly and routed to the owner's WhatsApp for fitment confirmation.
            </p>
          </div>
        </div>

        <div className="container btb-checkout-content">
          {cart.length === 0 && !completedOrder ? (
            <div className="btb-checkout-empty">
              <ShoppingBag size={48} className="btb-checkout-empty__icon" />
              <h2>No items in checkout</h2>
              <p>Your cart is empty. Please add accessories to proceed with your order.</p>
              <Link to="/products" className="btb-checkout-btn-back">
                <ArrowLeft size={16} />
                <span>Return to Products</span>
              </Link>
            </div>
          ) : (
            <div className="btb-checkout-grid">
              {/* Left Column: Customer Form */}
              <div className="btb-checkout-form-col">
                <div className="btb-checkout-card">
                  <h2 className="btb-checkout-card__title">
                    <User size={18} className="btb-checkout-icon" />
                    <span>Customer &amp; Vehicle Details</span>
                  </h2>

                  <form onSubmit={handleSubmitOrder} className="btb-checkout-form" noValidate>
                    {/* Customer Name */}
                    <div className="btb-form-group">
                      <label htmlFor="customer-name" className="btb-form-label">
                        Full Name <span className="text-red">*</span>
                      </label>
                      <div className="btb-input-wrap">
                        <User size={16} className="btb-input-icon" />
                        <input
                          id="customer-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Ramesh Kumar"
                          className={`btb-form-input ${errors.name ? 'btb-form-input--error' : ''}`}
                          required
                        />
                      </div>
                      {errors.name && <span className="btb-form-error">{errors.name}</span>}
                    </div>

                    {/* Mobile Number */}
                    <div className="btb-form-group">
                      <label htmlFor="customer-phone" className="btb-form-label">
                        Mobile Number <span className="text-red">*</span>
                      </label>
                      <div className="btb-input-wrap">
                        <Phone size={16} className="btb-input-icon" />
                        <input
                          id="customer-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 9876543210 (10 Digits)"
                          className={`btb-form-input ${errors.phone ? 'btb-form-input--error' : ''}`}
                          required
                        />
                      </div>
                      {errors.phone && <span className="btb-form-error">{errors.phone}</span>}
                    </div>

                    {/* Vehicle Make & Model (Optional) */}
                    <div className="btb-form-group">
                      <label htmlFor="customer-vehicle" className="btb-form-label">
                        Vehicle Make &amp; Model <span className="btb-form-optional">(Recommended for Fitment Check)</span>
                      </label>
                      <div className="btb-input-wrap">
                        <Car size={16} className="btb-input-icon" />
                        <input
                          id="customer-vehicle"
                          type="text"
                          name="vehicle"
                          value={formData.vehicle}
                          onChange={handleInputChange}
                          placeholder="e.g. Hyundai Creta 2024 / Tata Nexon / Mahindra Thar"
                          className="btb-form-input"
                        />
                      </div>
                      <span className="btb-form-hint">
                        Helps our technician ensure zero wire-cutting OEM couplers are ready.
                      </span>
                    </div>

                    {/* Additional Notes */}
                    <div className="btb-form-group">
                      <label htmlFor="customer-notes" className="btb-form-label">
                        Additional Instructions / Fitment Queries <span className="btb-form-optional">(Optional)</span>
                      </label>
                      <div className="btb-input-wrap">
                        <textarea
                          id="customer-notes"
                          name="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Mention any specific installation dates, studio appointment preference, or special requests..."
                          className="btb-form-textarea"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btb-checkout-btn-submit"
                    >
                      <MessageCircle size={20} />
                      <span>{isSubmitting ? 'Preparing Order & PDF...' : 'Place Order & Send via WhatsApp'}</span>
                      <ArrowRight size={18} />
                    </button>

                    <div className="btb-checkout-notice">
                      <ShieldCheck size={16} className="btb-checkout-notice-icon" />
                      <span>
                        Order details and PDF are generated directly. You will be redirected to WhatsApp to send the prefilled order directly to store owner: <strong>9789550006</strong>.
                      </span>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Order Summary Preview */}
              <div className="btb-checkout-summary-col">
                <div className="btb-checkout-summary-card">
                  <h2 className="btb-checkout-summary-title">Order Items ({cart.length})</h2>

                  <div className="btb-checkout-items">
                    {cart.map((item) => {
                      const product = item.product;
                      const price = product?.price;
                      const subtotal = price ? price * item.quantity : null;

                      return (
                        <div key={item.id} className="btb-checkout-item">
                          <img
                            src={product?.image || '/images/placeholder.webp'}
                            alt={product?.name}
                            className="btb-checkout-item__thumb"
                          />
                          <div className="btb-checkout-item__info">
                            <span className="btb-checkout-item__cat">{product?.category}</span>
                            <span className="btb-checkout-item__name">{product?.name}</span>
                            <span className="btb-checkout-item__qty">Qty: {item.quantity}</span>
                          </div>
                          <div className="btb-checkout-item__subtotal">
                            {subtotal !== null ? `₹${subtotal.toLocaleString('en-IN')}` : 'Price on Request'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="btb-checkout-totals">
                    <div className="btb-checkout-totals-row">
                      <span>Total Distinct Items</span>
                      <strong>{cart.length}</strong>
                    </div>
                    <div className="btb-checkout-totals-row">
                      <span>Total Product Quantity</span>
                      <strong>{totalCount} units</strong>
                    </div>
                    <div className="btb-checkout-totals-row btb-checkout-totals-row--highlight">
                      <span>Estimated Total</span>
                      <strong className="btb-checkout-totals-price">
                        {hasUnpricedItems ? (
                          pricedItemsTotal > 0 ? (
                            `₹${pricedItemsTotal.toLocaleString('en-IN')}*`
                          ) : (
                            'Price on Request'
                          )
                        ) : (
                          `₹${pricedItemsTotal.toLocaleString('en-IN')}`
                        )}
                      </strong>
                    </div>
                  </div>

                  {hasUnpricedItems && (
                    <div className="btb-checkout-alert">
                      <Sparkles size={15} />
                      <p>
                        *Order includes items requiring store quotation. Store will confirm final price before installation.
                      </p>
                    </div>
                  )}

                  <div className="btb-checkout-store-contact">
                    <p className="btb-store-name">BUMPER TO BUMPER CAR ACCESSORIES</p>
                    <p className="btb-store-address">{business.landmark}, {business.city}</p>
                    <p className="btb-store-phone">Owner WhatsApp: +91 97895 50006</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Order Confirmation & PDF Download Modal ──────────────── */}
        {completedOrder && (
          <div className="btb-order-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="order-success-title">
            <div className="btb-order-modal">
              <div className="btb-order-modal__top">
                <div className="btb-order-modal__icon">
                  <CheckCircle2 size={36} />
                </div>
                <span className="btb-order-modal__badge">ORDER TRANSMITTED</span>
                <h2 id="order-success-title" className="btb-order-modal__title">
                  Your Order Has Been Placed!
                </h2>
                <p className="btb-order-modal__subtitle">
                  Thank you for choosing Bumper To Bumper Car Accessories. Your order details and official document have been generated.
                </p>
              </div>

              {/* Order Meta Strip */}
              <div className="btb-order-modal__summary-box">
                <div className="btb-order-modal__meta-item">
                  <span className="btb-meta-label">Order ID</span>
                  <span className="btb-meta-val text-red">{completedOrder.orderId}</span>
                </div>
                <div className="btb-order-modal__meta-item">
                  <span className="btb-meta-label">Date &amp; Time</span>
                  <span className="btb-meta-val">{completedOrder.orderDate} · {completedOrder.orderTime}</span>
                </div>
                <div className="btb-order-modal__meta-item">
                  <span className="btb-meta-label">Products</span>
                  <span className="btb-meta-val">{completedOrder.totalProducts} items ({completedOrder.totalQuantity} units)</span>
                </div>
                <div className="btb-order-modal__meta-item">
                  <span className="btb-meta-label">Customer</span>
                  <span className="btb-meta-val">{completedOrder.customer.name} ({completedOrder.customer.phone})</span>
                </div>
              </div>

              {/* PDF Prompt Section */}
              <div className="btb-order-modal__pdf-prompt">
                <div className="btb-pdf-prompt-header">
                  <FileText size={22} className="btb-pdf-icon" />
                  <div>
                    <h3 className="btb-pdf-prompt-title">Would you like to download your order summary?</h3>
                    <p className="btb-pdf-prompt-desc">
                      Official A4 PDF receipt containing itemized products, business address, and fitment details. (Filename: B2B_Order_{completedOrder.orderId}.pdf)
                    </p>
                  </div>
                </div>

                <div className="btb-pdf-prompt-actions">
                  <button
                    type="button"
                    className="btb-modal-btn-download"
                    onClick={handleDownloadPdf}
                  >
                    <FileDown size={18} />
                    <span>{downloaded ? 'PDF Downloaded (Download Again)' : 'Yes, Download PDF'}</span>
                  </button>

                  {navigator.share && (
                    <button
                      type="button"
                      className="btb-modal-btn-share"
                      onClick={handleSharePdf}
                      title="Share PDF"
                    >
                      <Share2 size={16} />
                      <span>Share PDF</span>
                    </button>
                  )}
                </div>
              </div>

              {/* WhatsApp Transmission Block */}
              <div className="btb-order-modal__whatsapp-block">
                <div className="btb-wa-block-text">
                  <span className="btb-wa-tag">STEP 2 // NOTIFY OWNER ON WHATSAPP</span>
                  <p>
                    Click below to open WhatsApp with your complete prefilled order message to owner <strong>9789550006</strong>. Simply press "Send" in WhatsApp.
                  </p>
                </div>

                <a
                  href={completedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btb-modal-btn-wa"
                >
                  <MessageCircle size={20} />
                  <span>Open WhatsApp to Send Order to Owner</span>
                  <ArrowRight size={18} />
                </a>
              </div>

              {/* Modal Footer */}
              <div className="btb-order-modal__footer">
                <button
                  type="button"
                  className="btb-modal-btn-continue"
                  onClick={() => navigate('/products')}
                >
                  <span>No, Continue Shopping</span>
                </button>

                <Link to="/" className="btb-modal-btn-home">
                  <span>Return to Homepage</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
