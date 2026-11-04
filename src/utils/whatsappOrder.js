/**
 * Formats order details into a clean WhatsApp message and generates wa.me click-to-chat URLs.
 * Owner number comes from src/data/business.json (editable via the edit console).
 * When a Cloudinary PDF link is available it is embedded in the message — wa.me
 * links can only carry text, so the PDF travels as a link for both parties.
 */
import business from '../config/business';

export const OWNER_WHATSAPP_NUMBER = business.whatsapp;

function buildItemsList(items) {
  return items
    .map((item, index) => {
      const name = item.product?.name || item.name;
      const category = item.product?.category || item.category;
      const qty = item.quantity;
      return `${index + 1}. ${name}\n   Category: ${category}\n   Quantity: ${qty}`;
    })
    .join('\n\n');
}

function buildPdfSection(orderId, pdfUrl) {
  return `OFFICIAL PDF BILL:
Document: B2B_Order_${orderId}.pdf
${pdfUrl ? `PDF Copy: ${pdfUrl}` : 'Status: Generated with this order'}`;
}

function buildOrderMessage(orderData, { pdfUrl = null, heading, closing } = {}) {
  const {
    orderId,
    orderDate,
    orderTime,
    customer,
    items,
    totalProducts,
    totalQuantity,
    estimatedTotal,
    hasUnpricedItems,
    notes
  } = orderData;

  const itemsList = buildItemsList(items);

  const formattedTotal = hasUnpricedItems
    ? (estimatedTotal ? `₹${estimatedTotal.toLocaleString('en-IN')} (Quotation pending for unpriced items)` : 'Price on Request')
    : `₹${(estimatedTotal || 0).toLocaleString('en-IN')}`;

  return `BUMPER TO BUMPER CAR ACCESSORIES

${heading}

Order ID: ${orderId}
Date: ${orderDate}
Time: ${orderTime}

CUSTOMER DETAILS:
Name: ${customer.name || 'N/A'}
Mobile: ${customer.phone || 'N/A'}
Vehicle: ${customer.vehicle || 'Not specified'}

ORDER DETAILS:

${itemsList}

ORDER SUMMARY:

Total Products: ${totalProducts}
Total Quantity: ${totalQuantity}
Estimated Total: ${formattedTotal}

${buildPdfSection(orderId, pdfUrl)}

Additional Instructions: ${notes ? notes.trim() : 'None'}

${closing}`;
}

export function formatWhatsAppOrderMessage(orderData, pdfUrl) {
  return buildOrderMessage(orderData, {
    pdfUrl,
    heading: 'NEW CUSTOMER ORDER',
    closing: `Please confirm product availability and order details.

Thank you.`
  });
}

/** The customer's own copy of the same order — sent to the number they entered at checkout. */
export function formatCustomerOrderCopy(orderData, pdfUrl) {
  return buildOrderMessage(orderData, {
    pdfUrl,
    heading: 'MY ORDER COPY',
    closing: `Please keep this copy for your reference. The store will confirm availability and fitment.

Thank you for shopping with us.`
  });
}

/**
 * wa.me expects digits only with country code. The checkout form validates a
 * 10-digit Indian mobile number; anything longer is assumed to already carry
 * a country code.
 */
export function normalizeCustomerWhatsAppNumber(phone = '') {
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length > 10 && digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function getWhatsAppOrderUrl(orderData, ownerNumber = OWNER_WHATSAPP_NUMBER, pdfUrl) {
  const text = formatWhatsAppOrderMessage(orderData, pdfUrl);
  return `https://wa.me/${ownerNumber}?text=${encodeURIComponent(text)}`;
}

export function getCustomerCopyUrl(orderData, pdfUrl) {
  const number = normalizeCustomerWhatsAppNumber(orderData?.customer?.phone);
  const text = formatCustomerOrderCopy(orderData, pdfUrl);
  const base = number ? `https://wa.me/${number}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}
