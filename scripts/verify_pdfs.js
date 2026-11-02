import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateOrderPdf } from '../src/utils/orderPdfGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, 'test_renders');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Scenario 1: Short single product
const scenario1 = {
  orderId: 'B2B-S1-001',
  orderDate: '31-10-2026',
  orderTime: '10:30 AM',
  customer: {
    name: 'Suresh Kumar',
    phone: '9840112233',
    vehicle: 'Maruti Suzuki Swift 2023'
  },
  items: [
    {
      name: 'Roots Double Headed Vehicle Fan',
      category: 'Interior Accessories',
      quantity: 1,
      price: 1450
    }
  ],
  totalProducts: 1,
  totalQuantity: 1,
  estimatedTotal: 1450,
  hasUnpricedItems: false,
  notes: 'Customer pickup at studio.'
};

// Scenario 2: Standard order with mixed priced and unpriced items + long notes
const scenario2 = {
  orderId: 'B2B-S2-789',
  orderDate: '31-10-2026',
  orderTime: '04:15 PM',
  customer: {
    name: 'Ananya Raghavan',
    phone: '9789551122',
    vehicle: 'Hyundai Creta 2024 SX(O) Knight Edition'
  },
  items: [
    {
      name: 'Moco X5 4GB 64GB OLED Android Multimedia Player',
      category: 'Infotainment System',
      quantity: 1,
      price: 24999
    },
    {
      name: 'Genome Lazer Pro Bi Beam LED Projectors Headlamp Setup',
      category: 'Lighting Upgrades',
      quantity: 2,
      price: null // unpriced
    },
    {
      name: 'Hella Signature Red Grill Dual Tone Horn Set with Wiring Harness',
      category: 'Horn & Audio',
      quantity: 1,
      price: 1950
    },
    {
      name: '7D Custom Laser Cut Dual Tone Floor Mats with Carpet Grass',
      category: 'Interior Styling',
      quantity: 1,
      price: 4500
    }
  ],
  totalProducts: 4,
  totalQuantity: 5,
  estimatedTotal: 31449,
  hasUnpricedItems: true,
  notes: 'Please ensure zero wire-cutting OEM couplers are ready before the appointment. Customer requested evening slot around 6:00 PM.'
};

// Scenario 3: Long product names and long instruction text
const scenario3 = {
  orderId: 'B2B-S3-LONG',
  orderDate: '31-10-2026',
  orderTime: '07:45 PM',
  customer: {
    name: 'Dr. Subramanian Balasubramanian Ramakrishnan',
    phone: '9841098765',
    vehicle: 'Mahindra Scorpio-N Z8L 4x4 Automatic Diesel with Extended Warranty Package'
  },
  items: [
    {
      name: 'DualKnob 2K Ultra HD 10.1 Inch High Resolution Floating Screen Android Multimedia Player with 360 Degree Surround View System Camera Calibration',
      category: 'Smart Multimedia & Advanced Driving Assistance Systems',
      quantity: 1,
      price: 38500
    },
    {
      name: 'Conpex 4300K Warm White Ultra High Intensity 180W Canbus Error Free LED Projector Headlamp Bulbs Conversion Kit for High Beam and Low Beam',
      category: 'Exterior Lighting Systems & Optical Electronics',
      quantity: 2,
      price: 8900
    },
    {
      name: 'Focal Auditor ASE 165 2-Way Component Speaker System with Polypropylene Cone and Inverted Dome Tweeters Including Precision Crossover Units',
      category: 'High Fidelity Acoustic In-Car Entertainment Components',
      quantity: 2,
      price: 14500
    }
  ],
  totalProducts: 3,
  totalQuantity: 5,
  estimatedTotal: 61900,
  hasUnpricedItems: false,
  notes: 'The vehicle is brand new straight from showroom delivery. Technician must preserve factory wiring loom intact without tapping or splicing. Extended warranty fitment certificate required.'
};

// Scenario 4: Multi-page order (14 diverse items)
const scenario4 = {
  orderId: 'B2B-S4-MULTI',
  orderDate: '31-10-2026',
  orderTime: '08:00 PM',
  customer: {
    name: 'Rajesh Soundararajan',
    phone: '9940022334',
    vehicle: 'Toyota Innova Hycross ZX Hybrid'
  },
  items: [
    { name: 'Moco X5 4GB 64GB OLED Multimedia Player', category: 'Infotainment', quantity: 1, price: 24999 },
    { name: 'Genome Lazer Pro Bi Beam LED Projectors', category: 'Lighting', quantity: 2, price: null },
    { name: 'Hella Signature Red Grill Horn Set', category: 'Horn Audio', quantity: 1, price: 1950 },
    { name: 'Maxxlink Ambient Light Magic Dual Screen', category: 'Interior Styling', quantity: 1, price: 8500 },
    { name: 'Pioneer Android Auto Media Player', category: 'Infotainment', quantity: 1, price: 18500 },
    { name: 'Focal Auditor ASE 165 Component', category: 'Car Audio', quantity: 2, price: 14500 },
    { name: 'JBL Car Audio Component Speaker System', category: 'Car Audio', quantity: 1, price: 9200 },
    { name: 'MyTVS Dashcam Ultra Front and Rear Dual Recording', category: 'Cameras & Safety', quantity: 1, price: 6999 },
    { name: 'Rat Axe Rat Repellent Spray for Engine Bay', category: 'Protection', quantity: 3, price: 650 },
    { name: '7D Luxury Floor Mats Full Coverage Set', category: 'Interior Accessories', quantity: 1, price: 5500 },
    { name: 'Ultra High Performance Microfiber Cleaning Cloth Pack', category: 'Car Care', quantity: 4, price: 499 },
    { name: 'Otto Grande Uomo Car Perfume Diffuser', category: 'Fragrance', quantity: 2, price: 850 },
    { name: 'Fitgear 2 Port PD QC 3.0 Fast Car Charger', category: 'Electrical', quantity: 2, price: 1199 },
    { name: 'Lyne Flexy 54C 120W Heavy Duty Fast Charging Cable', category: 'Electrical', quantity: 3, price: 499 },
    { name: 'Super Wiring Harness Relay Kit with In-line Fuse', category: 'Installation Kits', quantity: 1, price: 1250 }
  ],
  totalProducts: 15,
  totalQuantity: 26,
  estimatedTotal: 94745,
  hasUnpricedItems: true,
  notes: 'Complete vehicle package overhaul. Appointment fixed for Saturday 10:00 AM.'
};

const scenarios = [
  { name: 'scenario1_single', data: scenario1 },
  { name: 'scenario2_standard', data: scenario2 },
  { name: 'scenario3_longtext', data: scenario3 },
  { name: 'scenario4_multipage', data: scenario4 }
];

for (const sc of scenarios) {
  const result = generateOrderPdf(sc.data);
  const pdfBuffer = Buffer.from(result.doc.output('arraybuffer'));
  const pdfPath = path.resolve(outDir, `${sc.name}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`Saved ${sc.name}.pdf (${result.doc.getNumberOfPages()} pages)`);
}

console.log('All test PDFs generated successfully in:', outDir);

