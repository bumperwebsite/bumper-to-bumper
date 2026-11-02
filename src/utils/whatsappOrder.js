/**
 * Formats order details into a clean WhatsApp message and generates wa.me click-to-chat URL.
 * Owner WhatsApp: 919789550006
 */

export const OWNER_WHATSAPP_NUMBER = '919789550006';

export function formatWhatsAppOrderMessage(orderData) {
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

  const itemsList = items
    .map((item, index) => {
      const name = item.product?.name || item.name;
      const category = item.product?.category || item.category;
      const qty = item.quantity;
      return `${index + 1}. ${name}\n   Category: ${category}\n   Quantity: ${qty}`;
    })
    .join('\n\n');

  const formattedTotal = hasUnpricedItems
    ? (estimatedTotal ? `₹${estimatedTotal.toLocaleString('en-IN')} (Quotation pending for unpriced items)` : 'Price on Request')
    : `₹${(estimatedTotal || 0).toLocaleString('en-IN')}`;

  const message = `BUMPER TO BUMPER CAR ACCESSORIES

NEW CUSTOMER ORDER

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

OFFICIAL PDF BILL:
Document: B2B_Order_${orderId}.pdf
Status: Generated & Attached with this order

Additional Instructions: ${notes ? notes.trim() : 'None'}

Please confirm product availability and order details.

Thank you.`;

  return message;
}

export function getWhatsAppOrderUrl(orderData, ownerNumber = OWNER_WHATSAPP_NUMBER) {
  const text = formatWhatsAppOrderMessage(orderData);
  return `https://wa.me/${ownerNumber}?text=${encodeURIComponent(text)}`;
}
