/**
 * Uploads the generated order PDF to Cloudinary so both the customer and the
 * store owner get a direct link inside their WhatsApp message (wa.me links
 * can carry text only, never a file).
 *
 * Files land in the `bumper_orders/` folder — kept separate from the product
 * imagery folder. Uses the unsigned `b2b_order_pdfs` preset, whose incoming
 * folder is locked to `bumper_orders/` in the Cloudinary console.
 * The cloud name is public: it appears in every delivered asset URL.
 */
const CLOUD_NAME = 'rahleqhb';
const UPLOAD_PRESET = 'b2b_order_pdfs';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

/**
 * Builds a searchable public id from the three primary fields:
 * date, time and order id — e.g. `B2B_Order_B2B-AB12CD_04-11-2026_3-45-PM`.
 */
export function buildOrderPdfPublicId({ orderId, orderDate, orderTime }) {
  const time = String(orderTime || '')
    .replace(/[:\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `B2B_Order_${orderId}_${orderDate}_${time}`.replace(/[^A-Za-z0-9._-]/g, '');
}

/**
 * Uploads the PDF blob and resolves with its public Cloudinary URL.
 * Throws on failure so callers can offer a retry.
 */
export async function uploadOrderPdf(blob, publicId) {
  if (!blob || !publicId) throw new Error('Missing PDF blob or public id');

  const form = new FormData();
  form.append('file', blob, `${publicId}.pdf`);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('public_id', `${publicId}.pdf`);

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: form });
  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || `Cloudinary upload failed (HTTP ${res.status})`);
  }
  return data.secure_url;
}
