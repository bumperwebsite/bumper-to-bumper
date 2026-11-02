import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to format currency safely
function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return 'Price on Request';
  }
  return `Rs. ${Number(val).toLocaleString('en-IN')}`;
}

export function generateOrderPdf(orderData) {
  const {
    orderId = 'B2B-TEST12',
    orderDate = '31-10-2026',
    orderTime = '06:30 PM',
    customer = {},
    items = [],
    totalProducts = items.length,
    totalQuantity = items.reduce((s, i) => s + (i.quantity || 1), 0),
    estimatedTotal = 0,
    hasUnpricedItems = true,
    notes = ''
  } = orderData;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ── 1. Top Business Header ─────────────────────────────────────────
  // Left: Crisp Vector Brand Mark
  const logoX = margin;
  const logoY = 14;

  // Outer dark rounded emblem
  doc.setFillColor(21, 21, 21);
  doc.roundedRect(logoX, logoY, 14, 14, 3, 3, 'F');

  // Red & white stylized chevron accents
  doc.setDrawColor(215, 25, 32);
  doc.setLineWidth(0.8);
  doc.line(logoX + 4, logoY + 5.5, logoX + 7, logoY + 3.5);
  doc.line(logoX + 7, logoY + 3.5, logoX + 10, logoY + 5.5);

  doc.setDrawColor(245, 245, 245);
  doc.line(logoX + 4.5, logoY + 8, logoX + 7, logoY + 6.2);
  doc.line(logoX + 7, logoY + 6.2, logoX + 9.5, logoY + 8);

  doc.setDrawColor(215, 25, 32);
  doc.line(logoX + 5.2, logoY + 10.5, logoX + 7, logoY + 9.2);
  doc.line(logoX + 7, logoY + 9.2, logoX + 8.8, logoY + 10.5);

  // Brand Name Typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 17, 17);
  doc.text('BUMPER', logoX + 17, logoY + 6);
  doc.setTextColor(215, 25, 32);
  doc.text('TO', logoX + 39, logoY + 6);
  doc.setTextColor(17, 17, 17);
  doc.text('BUMPER', logoX + 47, logoY + 6);

  // Subtitle
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('CAR ACCESSORIES', logoX + 17, logoY + 10.5);
  doc.setTextColor(215, 25, 32);
  doc.text('·', logoX + 46, logoY + 10.5);
  doc.setTextColor(100, 100, 100);
  doc.text('CHENNAI', logoX + 49, logoY + 10.5);

  // Red accent line under logo
  doc.setFillColor(215, 25, 32);
  doc.rect(logoX + 17, logoY + 12, 45, 0.5, 'F');

  // Right: Business Contact Details (Neatly Right-Aligned)
  const rightX = pageWidth - margin;
  let bizY = 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(17, 17, 17);
  doc.text('BUMPER TO BUMPER CAR ACCESSORIES', rightX, bizY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  bizY += 4.5;
  doc.text('Shop No. 1, Survey.No 27/2A, The ARK, Shop,', rightX, bizY, { align: 'right' });
  bizY += 4;
  doc.text('Jawaharlal Nehru Salai, Usha Nagar, Vanuvampet,', rightX, bizY, { align: 'right' });
  bizY += 4;
  doc.text('Adambakkam, Chennai, Tamil Nadu 600091', rightX, bizY, { align: 'right' });
  bizY += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Phone: 9789550006', rightX, bizY, { align: 'right' });
  bizY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('bumpertobumperchennai@gmail.com', rightX, bizY, { align: 'right' });

  // Thin separator rule below header
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, 43, pageWidth - margin, 43);

  // ── 2. Document Title Section ─────────────────────────────────────
  const titleY = 52;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 17, 17);
  doc.text('ORDER SUMMARY', margin, titleY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Order details and selected products', margin, titleY + 5);

  // Prominent Label: ORDER SUMMARY — NOT A TAX INVOICE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(215, 25, 32);
  doc.text('ORDER SUMMARY — NOT A TAX INVOICE', rightX, titleY + 2, { align: 'right' });

  // Subtle red accent line
  doc.setFillColor(215, 25, 32);
  doc.rect(margin, titleY + 8, 28, 0.8, 'F');

  // ── 3. Customer & Order Details (Two Clean Columns) ────────────────
  const infoY = 66;
  const col1X = margin;
  const col2X = 118;
  const colWidth = 80;

  // Left Column: Customer Details (NO EMAIL ADDRESS)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 17, 17);
  doc.text('Customer Details:', col1X, infoY);

  let cY = infoY + 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(25, 25, 25);
  doc.text(customer.name || 'Valued Customer', col1X, cY);

  cY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Mobile: ${customer.phone || 'Not Specified'}`, col1X, cY);

  if (customer.vehicle && customer.vehicle.trim()) {
    cY += 4.5;
    doc.text(`Vehicle: ${customer.vehicle.trim()}`, col1X, cY);
  }

  if (notes && notes.trim()) {
    cY += 4.5;
    const splitNotes = doc.splitTextToSize(`Instructions: ${notes.trim()}`, colWidth);
    doc.text(splitNotes, col1X, cY);
    cY += (splitNotes.length - 1) * 3.8;
  }

  // Right Column: Order Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 17, 17);
  doc.text('Order Details:', col2X, infoY);

  let oY = infoY + 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  // Order Number
  doc.text('Order Number:', col2X, oY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(215, 25, 32);
  doc.text(String(orderId), col2X + 26, oY);

  // Order Date
  oY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Order Date:', col2X, oY);
  doc.setTextColor(20, 20, 20);
  doc.text(String(orderDate), col2X + 26, oY);

  // Order Time
  oY += 4.5;
  doc.setTextColor(60, 60, 60);
  doc.text('Order Time:', col2X, oY);
  doc.setTextColor(20, 20, 20);
  doc.text(String(orderTime), col2X + 26, oY);

  // Order Status
  oY += 4.5;
  doc.setTextColor(60, 60, 60);
  doc.text('Order Status:', col2X, oY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(46, 159, 74);
  doc.text('Pending Confirmation', col2X + 26, oY);

  const tableStartY = Math.max(cY, oY) + 9;

  // ── 4. Product Table (autoTable) ──────────────────────────────────
  const tableRows = items.map((item, idx) => {
    const name = item.product?.name || item.name || '';
    const category = item.product?.category || item.category || '';
    const qty = item.quantity || 1;
    const price = item.product?.price ?? item.price;
    const unitPriceStr = price ? formatCurrency(price) : 'Price on Request';
    const amountStr = price ? formatCurrency(price * qty) : '—';

    return [
      idx + 1,
      name,
      category,
      qty,
      unitPriceStr,
      amountStr
    ];
  });

  autoTable(doc, {
    startY: tableStartY,
    head: [['S. No.', 'Product Name', 'Category', 'Quantity', 'Unit Price', 'Amount']],
    body: tableRows,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
      textColor: [30, 30, 30],
      lineColor: [225, 225, 225],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [17, 17, 17],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
      lineColor: [17, 17, 17],
      lineWidth: 0
    },
    alternateRowStyles: {
      fillColor: [251, 251, 251]
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center' },
      1: { cellWidth: 70, halign: 'left' },
      2: { cellWidth: 38, halign: 'left' },
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 22, halign: 'right' }
    },
    margin: { left: margin, right: margin, bottom: 22 },
    showHead: 'everyPage',
    didDrawCell: (data) => {
      // Add red accent strip under header row
      if (data.section === 'head' && data.row.index === 0) {
        doc.setFillColor(215, 25, 32);
        doc.rect(data.cell.x, data.cell.y + data.cell.height - 0.8, data.cell.width, 0.8, 'F');
      }
    }
  });

  // ── 5. Order Totals Block ─────────────────────────────────────────
  let finalY = doc.lastAutoTable.finalY + 6;

  // Guard against bottom-of-page collision
  if (finalY + 38 > pageHeight - 20) {
    doc.addPage();
    finalY = 22;
  }

  const totalsBoxWidth = 82;
  const totalsX = pageWidth - margin - totalsBoxWidth;

  // Subtotal row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Subtotal:', totalsX, finalY + 4);

  const subtotalDisplay = (estimatedTotal && estimatedTotal > 0)
    ? formatCurrency(estimatedTotal)
    : (hasUnpricedItems ? 'Price on Request' : 'Rs. 0');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text(subtotalDisplay, rightX, finalY + 4, { align: 'right' });

  // Total Quantity row
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Total Products / Units:', totalsX, finalY + 9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text(`${totalProducts} items (${totalQuantity} units)`, rightX, finalY + 9.5, { align: 'right' });

  // Horizontal divider rule
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.5);
  doc.line(totalsX, finalY + 12.5, rightX, finalY + 12.5);

  // Grand Total row
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 17);
  doc.text('Total Amount:', totalsX, finalY + 18.5);

  const totalAmountDisplay = hasUnpricedItems
    ? (estimatedTotal > 0 ? `${formatCurrency(estimatedTotal)}*` : 'Quotation on Request')
    : formatCurrency(estimatedTotal);

  doc.setFontSize(11.5);
  doc.setTextColor(215, 25, 32);
  doc.text(totalAmountDisplay, rightX, finalY + 18.5, { align: 'right' });

  // Unpriced items disclaimer
  if (hasUnpricedItems) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    const disclaimer = 'Final amount subject to product availability and price confirmation.';
    doc.text(disclaimer, rightX, finalY + 23.5, { align: 'right' });
  }

  // ── 6. Footer (On Every Page) ─────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Separator line
    const footerY = pageHeight - 14;
    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

    // Footer Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text('BUMPER TO BUMPER CAR ACCESSORIES', margin, footerY + 1);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your enquiry!', margin + 65, footerY + 1);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Phone: 9789550006`, margin + 115, footerY + 1);

    // Page Number
    doc.text(`Page ${i} of ${totalPages}`, rightX, footerY + 1, { align: 'right' });
  }

  return doc;
}

// Run test script if executed directly
const testOrder = {
  orderId: 'B2B-A94E2F',
  orderDate: '31-10-2026',
  orderTime: '06:30 PM',
  customer: {
    name: 'Karthik Subramanian',
    phone: '9840123456',
    vehicle: 'Hyundai Creta 2024 SX(O)'
  },
  items: [
    {
      name: 'Moco X5 4GB 64GB OLED Multimedia Player',
      category: 'Infotainment System',
      quantity: 1,
      price: 24999
    },
    {
      name: 'Genome Lazer Pro Bi Beam LED Projectors',
      category: 'Lighting',
      quantity: 2,
      price: null // Unpriced
    },
    {
      name: 'Hella Signature Red Grill Horn Set',
      category: 'Horn Sound Audio',
      quantity: 1,
      price: 1950
    }
  ],
  totalProducts: 3,
  totalQuantity: 4,
  estimatedTotal: 26949,
  hasUnpricedItems: true,
  notes: 'Please keep evening installation slot open at Adambakkam studio.'
};

const doc = generateOrderPdf(testOrder);
const outPath = path.resolve(__dirname, 'test_output.pdf');
fs.writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')));
console.log('Test PDF successfully generated at:', outPath);
