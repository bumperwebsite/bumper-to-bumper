import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import business from '../config/business';

// Wrap the business address into short, right-aligned header lines.
// Greedy wrap at maxChars; any overflow is merged into the last line so
// no part of the address is ever dropped.
function wrapAddressLines(address, maxChars = 46, maxLines = 4) {
  const words = String(address || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines - 1);
  kept.push(lines.slice(maxLines - 1).join(' '));
  return kept;
}

// Safe currency formatting for jsPDF (Helvetica safe)
function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return 'Price on Request';
  }
  return `Rs. ${Number(val).toLocaleString('en-IN')}`;
}

export function generateOrderPdf(orderData) {
  const {
    orderId = 'B2B-PENDING',
    orderDate = '',
    orderTime = '',
    customer = {},
    items = [],
    totalProducts = items.length,
    totalQuantity = items.reduce((s, i) => s + (i.quantity || 1), 0),
    estimatedTotal = 0,
    hasUnpricedItems = false,
    notes = ''
  } = orderData;

  // Initialize A4 document (portrait, mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const rightX = pageWidth - margin;

  // ── 1. Top Business Header ─────────────────────────────────────────
  // Left: Crisp Vector Brand Mark (Bumper To Bumper logo)
  const logoX = margin;
  const logoY = 14;

  // Outer dark rounded emblem
  doc.setFillColor(21, 21, 21);
  doc.setDrawColor(43, 43, 43);
  doc.setLineWidth(0.4);
  doc.roundedRect(logoX, logoY, 15, 15, 3.2, 3.2, 'FD');

  // Red & white stylized chevron accents matching logo.svg
  doc.setDrawColor(215, 25, 32);
  doc.setLineWidth(0.85);
  doc.line(logoX + 4.2, logoY + 5.8, logoX + 7.5, logoY + 3.8);
  doc.line(logoX + 7.5, logoY + 3.8, logoX + 10.8, logoY + 5.8);

  doc.setDrawColor(245, 245, 245);
  doc.setLineWidth(0.75);
  doc.line(logoX + 4.8, logoY + 8.5, logoX + 7.5, logoY + 6.6);
  doc.line(logoX + 7.5, logoY + 6.6, logoX + 10.2, logoY + 8.5);

  doc.setDrawColor(215, 25, 32);
  doc.setLineWidth(0.65);
  doc.line(logoX + 5.5, logoY + 11.2, logoX + 7.5, logoY + 9.8);
  doc.line(logoX + 7.5, logoY + 9.8, logoX + 9.5, logoY + 11.2);

  // Brand Name Typography next to emblem
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(21, 21, 21);
  doc.text('BUMPER', logoX + 18, logoY + 6.2);
  doc.setTextColor(215, 25, 32);
  doc.text('TO', logoX + 40.5, logoY + 6.2);
  doc.setTextColor(21, 21, 21);
  doc.text('BUMPER', logoX + 48.5, logoY + 6.2);

  // Subtitle
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('CAR ACCESSORIES', logoX + 18, logoY + 10.8);
  doc.setTextColor(215, 25, 32);
  doc.text('·', logoX + 47, logoY + 10.8);
  doc.setTextColor(100, 100, 100);
  doc.text('CHENNAI', logoX + 50, logoY + 10.8);

  // Red accent line under logo
  doc.setFillColor(215, 25, 32);
  doc.rect(logoX + 18, logoY + 12.6, 46, 0.6, 'F');

  // Right: Business Contact Details (Neatly Right-Aligned)
  let bizY = 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(21, 21, 21);
  doc.text(String(business.name).toUpperCase(), rightX, bizY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  for (const line of wrapAddressLines(business.address)) {
    bizY += 4;
    doc.text(line, rightX, bizY, { align: 'right' });
  }
  bizY += 4.2;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 21, 21);
  doc.text(`Phone: ${business.phone}`, rightX, bizY, { align: 'right' });

  // Thin separator rule below header
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, 43, rightX, 43);

  // ── 2. Document Title Section ─────────────────────────────────────
  const titleY = 52;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(21, 21, 21);
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
  const colWidth = 82;

  // Left Column: Customer Details (NO EMAIL ADDRESS)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(21, 21, 21);
  doc.text('Customer Details:', col1X, infoY);

  let cY = infoY + 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(25, 25, 25);
  const nameLines = doc.splitTextToSize(customer.name || 'Valued Customer', colWidth);
  doc.text(nameLines, col1X, cY);
  cY += nameLines.length * 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Mobile: ${customer.phone || 'Not Specified'}`, col1X, cY);
  cY += 4.5;

  if (customer.vehicle && customer.vehicle.trim()) {
    const vehicleLines = doc.splitTextToSize(`Vehicle: ${customer.vehicle.trim()}`, colWidth);
    doc.text(vehicleLines, col1X, cY);
    cY += vehicleLines.length * 4.2;
  }

  if (notes && notes.trim()) {
    const splitNotes = doc.splitTextToSize(`Instructions: ${notes.trim()}`, colWidth);
    doc.text(splitNotes, col1X, cY);
    cY += splitNotes.length * 4.0;
  }

  // Right Column: Order Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(21, 21, 21);
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
  doc.setTextColor(46, 125, 50); // Professional green
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
    rowPageBreak: 'avoid',
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
      1: { cellWidth: 66, halign: 'left' },
      2: { cellWidth: 38, halign: 'left' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 23, halign: 'right' },
      5: { cellWidth: 23, halign: 'right' }
    },
    margin: { top: 24, left: margin, right: margin, bottom: 22 },
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
    doc.text(String(business.name).toUpperCase(), margin, footerY + 1);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your enquiry!', margin + 65, footerY + 1);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Phone: ${business.phone}`, margin + 115, footerY + 1);

    // Page Number
    doc.text(`Page ${i} of ${totalPages}`, rightX, footerY + 1, { align: 'right' });
  }

  return {
    doc,
    blob: doc.output('blob'),
    download: (filename) => {
      const name = filename || `B2B_Order_${orderId}.pdf`;
      doc.save(name);
    }
  };
}
