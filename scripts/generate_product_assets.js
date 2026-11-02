import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/images/products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const products = [
  { id: '1', name: 'Moco X5 4GB 64GB OLED Multimedia Player', category: 'Infotainment System', icon: 'screen' },
  { id: '2', name: 'JBL Car Audio Component Speaker System', category: 'Audio Speaker System', icon: 'speaker' },
  { id: '3', name: 'DualKnob 2K Android Multimedia Player', category: 'Infotainment System', icon: 'screen' },
  { id: '4', name: 'MyTvs Dashcam Ultra', category: 'Camera', icon: 'camera' },
  { id: '5', name: 'Afura Android Media Player', category: 'Infotainment System', icon: 'screen' },
  { id: '6', name: 'Pioneer Android Auto Media Player', category: 'Infotainment System', icon: 'screen' },
  { id: '7', name: 'Abbtron Omega Series', category: 'Infotainment System', icon: 'screen' },
  { id: '8', name: 'Genome Lazer Pro Bi Beam LED Projectors', category: 'Lighting', icon: 'projector' },
  { id: '9', name: 'Aozoom Triple Colour Bi LED Fog Light', category: 'Lighting', icon: 'light' },
  { id: '10', name: 'Blaupunkt 3-Way Triaxial System ODX 693 DE', category: 'Audio Speaker System', icon: 'speaker' },
  { id: '11', name: 'PR LAPP 240 Watt', category: 'Lighting', icon: 'light' },
  { id: '12', name: 'Conpex 4300K LED Headlight', category: 'Headlight', icon: 'headlight' },
  { id: '13', name: 'Geesonic 180W Lighting 4300K', category: 'Lighting', icon: 'light' },
  { id: '14', name: 'Oneplus1 Ironman Series', category: 'Infotainment System', icon: 'screen' },
  { id: '15', name: 'Morel Maximo Ultra 602 MKII 6.5', category: 'Audio Speaker System', icon: 'speaker' },
  { id: '16', name: 'Focal Auditor ASE 165 2-Way Component', category: 'Audio Speaker System', icon: 'speaker' },
  { id: '17', name: 'M Six Helix', category: 'Car Audio System', icon: 'amplifier' },
  { id: '18', name: 'Alpine INE-AW409S', category: 'Infotainment System', icon: 'screen' },
  { id: '19', name: 'C6 BB151-H7 LED', category: 'Headlight', icon: 'headlight' },
  { id: '20', name: 'Hella Signature Red Grill Horn Set', category: 'Horn Sound Audio', icon: 'horn' },
  { id: '21', name: 'Super Wiring Kit', category: 'Accessories', icon: 'accessory' },
  { id: '22', name: 'PIAA Valeo', category: 'Horn Sound Audio', icon: 'horn' },
  { id: '23', name: 'Roots Double Headed Vehicle Fan', category: 'Accessories', icon: 'accessory' },
  { id: '24', name: 'GPop Mini Power Knob', category: 'Accessories', icon: 'accessory' },
  { id: '25', name: 'Pexovara Car Cleaner Brush', category: 'Accessories', icon: 'accessory' },
  { id: '26', name: 'Geesonic 180W Low Lighting', category: 'Lighting', icon: 'light' },
  { id: '27', name: 'I Pop Simple Door Guard', category: 'Accessories', icon: 'accessory' },
  { id: '28', name: 'X Premium High Performance Microfiber Cleaning Cloth', category: 'Accessories', icon: 'accessory' },
  { id: '29', name: 'Maeverick 65W Charger', category: 'Accessories', icon: 'cable' },
  { id: '30', name: 'Rat Axe Rat Repellent for Car', category: 'Accessories', icon: 'accessory' },
  { id: '31', name: 'Soroo C5 Faster Series 2 USB 5V-3.4A Charger', category: 'Accessories', icon: 'cable' },
  { id: '32', name: 'Design Fo Car Mobile Holder', category: 'Accessories', icon: 'accessory' },
  { id: '33', name: 'Otto Grande Uomo Car Perfume', category: 'Accessories', icon: 'perfume' },
  { id: '34', name: 'Lyne Flexy 54C 120 Watts Output Type-C Cable', category: 'Accessories', icon: 'cable' },
  { id: '35', name: 'Majik Charging Cable 2-to-2 Type-C Cable', category: 'Accessories', icon: 'cable' },
  { id: '36', name: 'Fitgear 2-Port PD + QC3.0 FG-16 Car Charger', category: 'Accessories', icon: 'cable' },
  { id: '37', name: 'Fitgear 3-in-1 Fast Cable 100W 1200mm', category: 'Accessories', icon: 'cable' },
  { id: '38', name: 'Areon Car Perfume', category: 'Accessories', icon: 'perfume' },
  { id: '39', name: 'Car Dashboard Idols', category: 'Accessories', icon: 'accessory' },
  { id: '40', name: 'Jasmine 100% Organic Camphor', category: 'Accessories', icon: 'perfume' },
  { id: '41', name: 'Campur 100% Organic Camphor', category: 'Accessories', icon: 'perfume' },
  { id: '42', name: 'Lumax Tail Lamp Replacement for SNTR OLD Tail Lamp', category: 'Lighting', icon: 'light' },
  { id: '43', name: 'Bullstone Glass Series 6.5 Car Speaker 800W', category: 'Audio Speaker System', icon: 'speaker' },
  { id: '44', name: 'MaxxLink Ambient Light Magic Dual Screen', category: 'Infotainment System', icon: 'screen' }
];

function getIconSvg(type) {
  switch (type) {
    case 'screen':
      return `
        <!-- Multimedia Screen Graphic -->
        <g transform="translate(250, 140)">
          <rect x="0" y="0" width="300" height="180" rx="16" fill="#181818" stroke="#2B2B2B" stroke-width="4"/>
          <rect x="15" y="15" width="270" height="150" rx="8" fill="#0A0A0A" stroke="#333333" stroke-width="1.5"/>
          <!-- UI interface on screen -->
          <circle cx="60" cy="90" r="28" fill="#1F1F1F" stroke="#D71920" stroke-width="2"/>
          <polygon points="56,78 72,90 56,102" fill="#D71920"/>
          <line x1="110" y1="65" x2="250" y2="65" stroke="#F5F5F5" stroke-width="4" stroke-linecap="round"/>
          <line x1="110" y1="85" x2="210" y2="85" stroke="#777777" stroke-width="3" stroke-linecap="round"/>
          <rect x="110" y="110" width="140" height="24" rx="4" fill="#1C1C1C" stroke="#2D2D2D" stroke-width="1"/>
          <text x="120" y="126" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="700" fill="#D71920">CARPLAY // ANDROID AUTO</text>
        </g>
      `;
    case 'speaker':
      return `
        <!-- Speaker Acoustic Cone Graphic -->
        <g transform="translate(260, 130)">
          <circle cx="140" cy="100" r="95" fill="#141414" stroke="#2E2E2E" stroke-width="6"/>
          <circle cx="140" cy="100" r="75" fill="#1A1A1A" stroke="#D71920" stroke-width="2.5" stroke-dasharray="8 4"/>
          <circle cx="140" cy="100" r="50" fill="#0F0F0F" stroke="#3A3A3A" stroke-width="3"/>
          <circle cx="140" cy="100" r="22" fill="#222222" stroke="#D71920" stroke-width="2"/>
          <!-- Sound waves -->
          <path d="M 260 65 Q 290 100 260 135" stroke="#D71920" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 280 45 Q 320 100 280 155" stroke="#D71920" stroke-width="2" stroke-opacity="0.6" fill="none" stroke-linecap="round"/>
          <path d="M 20 65 Q -10 100 20 135" stroke="#D71920" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 0 45 Q -40 100 0 155" stroke="#D71920" stroke-width="2" stroke-opacity="0.6" fill="none" stroke-linecap="round"/>
        </g>
      `;
    case 'amplifier':
      return `
        <!-- Amplifier Heatsink Graphic -->
        <g transform="translate(250, 140)">
          <rect x="0" y="0" width="300" height="170" rx="12" fill="#161616" stroke="#2B2B2B" stroke-width="4"/>
          <!-- Heatsink fins -->
          <line x1="30" y1="20" x2="270" y2="20" stroke="#282828" stroke-width="4"/>
          <line x1="30" y1="36" x2="270" y2="36" stroke="#282828" stroke-width="4"/>
          <line x1="30" y1="52" x2="270" y2="52" stroke="#282828" stroke-width="4"/>
          <!-- Center badge -->
          <rect x="90" y="75" width="120" height="45" rx="6" fill="#0D0D0D" stroke="#D71920" stroke-width="2"/>
          <text x="150" y="103" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="900" fill="#F5F5F5">6-CH // DSP</text>
          <!-- Terminals -->
          <circle cx="45" cy="145" r="7" fill="#C5A059"/>
          <circle cx="75" cy="145" r="7" fill="#C5A059"/>
          <circle cx="105" cy="145" r="7" fill="#C5A059"/>
          <circle cx="195" cy="145" r="7" fill="#2B2B2B" stroke="#D71920" stroke-width="2"/>
          <circle cx="225" cy="145" r="7" fill="#2B2B2B" stroke="#D71920" stroke-width="2"/>
          <circle cx="255" cy="145" r="7" fill="#2B2B2B" stroke="#D71920" stroke-width="2"/>
        </g>
      `;
    case 'projector':
    case 'light':
    case 'headlight':
      return `
        <!-- LED Projector & Headlight Beam Graphic -->
        <g transform="translate(270, 130)">
          <!-- Projector Housing -->
          <rect x="20" y="30" width="110" height="130" rx="16" fill="#181818" stroke="#333333" stroke-width="3"/>
          <circle cx="130" cy="95" r="55" fill="#111111" stroke="#D71920" stroke-width="4"/>
          <circle cx="130" cy="95" r="38" fill="#1C1C1C" stroke="#444444" stroke-width="2"/>
          <circle cx="130" cy="95" r="18" fill="#D71920" opacity="0.85"/>
          <!-- High intensity light cone -->
          <polygon points="175,80 300,30 300,160 175,110" fill="url(#beamGrad)" opacity="0.75"/>
          <line x1="185" y1="95" x2="310" y2="95" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      `;
    case 'camera':
      return `
        <!-- Dashcam Graphic -->
        <g transform="translate(270, 130)">
          <rect x="30" y="25" width="200" height="140" rx="14" fill="#181818" stroke="#2F2F2F" stroke-width="3.5"/>
          <!-- Lens module -->
          <circle cx="130" cy="95" r="48" fill="#0D0D0D" stroke="#D71920" stroke-width="3.5"/>
          <circle cx="130" cy="95" r="32" fill="#1F1F1F" stroke="#3F3F3F" stroke-width="2"/>
          <circle cx="130" cy="95" r="15" fill="#0A0A0A"/>
          <circle cx="136" cy="88" r="4" fill="#FFFFFF" opacity="0.8"/>
          <!-- Rec indicator LED -->
          <circle cx="55" cy="50" r="5" fill="#D71920"/>
          <text x="68" y="54" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="800" fill="#D71920">REC 4K</text>
        </g>
      `;
    case 'horn':
      return `
        <!-- Horn Sound Graphic -->
        <g transform="translate(270, 130)">
          <circle cx="85" cy="95" r="55" fill="#161616" stroke="#D71920" stroke-width="6"/>
          <line x1="45" y1="95" x2="125" y2="95" stroke="#D71920" stroke-width="4"/>
          <line x1="85" y1="55" x2="85" y2="135" stroke="#D71920" stroke-width="4"/>
          <circle cx="85" cy="95" r="20" fill="#242424" stroke="#444444" stroke-width="2"/>
          <!-- Acoustic arcs -->
          <path d="M 155 60 A 50 50 0 0 1 155 130" stroke="#F5F5F5" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 180 45 A 75 75 0 0 1 180 145" stroke="#D71920" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 205 30 A 100 100 0 0 1 205 160" stroke="#D71920" stroke-width="2" stroke-opacity="0.6" fill="none" stroke-linecap="round"/>
        </g>
      `;
    case 'cable':
      return `
        <!-- Fast Charger & Cable Graphic -->
        <g transform="translate(270, 140)">
          <!-- Charger head -->
          <rect x="40" y="25" width="110" height="70" rx="10" fill="#1A1A1A" stroke="#333333" stroke-width="3"/>
          <rect x="25" y="45" width="15" height="30" rx="3" fill="#D71920"/>
          <circle cx="120" cy="50" r="5" fill="#00E5FF"/>
          <rect x="70" y="45" width="30" height="10" rx="3" fill="#0D0D0D" stroke="#D71920" stroke-width="1.5"/>
          <rect x="70" y="65" width="30" height="10" rx="3" fill="#0D0D0D" stroke="#444444" stroke-width="1.5"/>
          <!-- Braided cable loop -->
          <path d="M 150 60 C 230 60, 240 140, 180 140 C 130 140, 110 110, 80 130" stroke="#D71920" stroke-width="6" fill="none" stroke-linecap="round"/>
          <polygon points="120,40 105,62 118,62 108,80 130,55 116,55" fill="#D71920" transform="translate(140, 10)"/>
        </g>
      `;
    case 'perfume':
      return `
        <!-- Luxury Aroma Diffuser Graphic -->
        <g transform="translate(290, 130)">
          <!-- Wooden Cap -->
          <rect x="60" y="20" width="60" height="30" rx="4" fill="#A87342" stroke="#6D4522" stroke-width="2"/>
          <line x1="75" y1="20" x2="75" y2="50" stroke="#8C5C2E" stroke-width="2"/>
          <line x1="105" y1="20" x2="105" y2="50" stroke="#8C5C2E" stroke-width="2"/>
          <!-- Glass Flacon -->
          <rect x="40" y="55" width="100" height="100" rx="12" fill="#181818" stroke="#D71920" stroke-width="3"/>
          <rect x="52" y="70" width="76" height="70" rx="6" fill="#201515" stroke="#331A1A" stroke-width="1.5"/>
          <!-- Aroma waves -->
          <path d="M 80 15 Q 70 0 85 -15" stroke="#D71920" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M 100 15 Q 110 0 95 -15" stroke="#F5F5F5" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <text x="90" y="112" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="800" fill="#F5F5F5" letter-spacing="1">PARFUM</text>
        </g>
      `;
    default:
      return `
        <!-- Automotive Accessory Emblem -->
        <g transform="translate(270, 130)">
          <polygon points="130,30 220,80 220,180 130,230 40,180 40,80" fill="#161616" stroke="#2F2F2F" stroke-width="3"/>
          <circle cx="130" cy="130" r="50" fill="#1C1C1C" stroke="#D71920" stroke-width="3"/>
          <path d="M 105 130 L 122 147 L 155 113" stroke="#D71920" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `;
  }
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

for (const p of products) {
  const slug = p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const iconSvg = getIconSvg(p.icon);

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="800" height="550">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E0E0E"/>
      <stop offset="50%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#080808"/>
    </linearGradient>
    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D71920" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#FFAA00" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A1A" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.6"/>

  <!-- Top Accent Bar -->
  <rect x="0" y="0" width="800" height="4" fill="#D71920"/>

  <!-- Category & Verified Badge -->
  <g transform="translate(40, 36)">
    <rect x="0" y="0" width="220" height="28" rx="14" fill="#1A1A1A" stroke="#2B2B2B" stroke-width="1"/>
    <circle cx="14" cy="14" r="4.5" fill="#D71920"/>
    <text x="28" y="18" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#E0E0E0" letter-spacing="0.06em">${escapeXml(p.category.toUpperCase())}</text>
  </g>

  <!-- Studio Tag -->
  <g transform="translate(620, 36)">
    <text x="140" y="18" text-anchor="end" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#B8B8B8" letter-spacing="0.1em">BUMPER <tspan fill="#D71920">TO</tspan> BUMPER</text>
  </g>

  <!-- Main Illustration Area -->
  ${iconSvg}

  <!-- Bottom Panel with Product Name -->
  <g transform="translate(40, 420)">
    <rect x="0" y="0" width="720" height="90" rx="12" fill="#121212" stroke="#242424" stroke-width="1.5"/>
    <rect x="0" y="0" width="4" height="90" rx="2" fill="#D71920"/>
    <text x="24" y="38" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" fill="#F5F5F5" letter-spacing="0.02em">${escapeXml(p.name)}</text>
    <text x="24" y="65" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#B8B8B8">
      100% Plug &amp; Play Fitment <tspan fill="#D71920">·</tspan> Zero Wire-Cutting <tspan fill="#D71920">·</tspan> Adambakkam Studio, Chennai
    </text>
    <g transform="translate(560, 30)">
      <rect x="0" y="0" width="135" height="30" rx="6" fill="#1C1C1C" stroke="#333333" stroke-width="1"/>
      <text x="67" y="19" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="700" fill="#D71920">GENUINE FITMENT</text>
    </g>
  </g>
</svg>
`;

  fs.writeFileSync(path.join(targetDir, `${slug}.svg`), svgContent);
}

console.log(`Successfully generated ${products.length} product SVG illustrations in ${targetDir}`);
