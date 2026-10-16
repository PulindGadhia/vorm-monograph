import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
  ArrowUpRight,
  Check,
  Copy,
  ShoppingBag,
  Scale,
  Sparkles,
  Plus,
  Minus,
  Layers,
  ChevronRight,
  ChevronLeft,
  Grid,
  List,
  Eye
} from 'lucide-react';

// ============================================================================
// 1. STRICT TYPESCRIPT INTERFACES (src/types/product.ts)
// ============================================================================

export type ProductCategory = 'Technology' | 'Workspace' | 'Accessories' | 'Home';

export type SortOption = 'default' | 'price-asc' | 'price-desc';

export type ViewMode = 'grid-4' | 'grid-3' | 'index';

export type DossierTab = 'overview' | 'blueprint' | 'provenance';

export interface MaterialSwatch {
  name: string;
  hex: string;
  finish: string;
}

export interface Product {
  id: string;
  serialNo: string;
  name: string;
  subtitle: string;
  price: number; // Numeric INR price
  category: ProductCategory;
  editorialDiscipline: string;
  image: string;
  alt: string;
  originCity: string;
  designerStudio: string;
  materialSpec: string;
  dimensions: string;
  weight: string;
  warranty: string;
  editionYear: number;
  editionStatus: 'Permanent Collection' | 'Numbered Batch' | 'Studio Edition';
  swatches: MaterialSwatch[];
  spotlightQuote?: string;
  description: string;
  careInstructions: string;
  architecturalNotes: string;
}

export interface CuratedItem {
  productId: string;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: ProductCategory | 'All Categories';
  sortBy: SortOption;
}

// ============================================================================
// 2. INR CURRENCY FORMATTER UTILITY
// ============================================================================

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(amount);
}

// ============================================================================
// 3. CURATED INDUSTRIAL DESIGN ARCHIVE (src/data/products.ts — 14 Objects)
// ============================================================================

export const PRODUCTS_DATA: readonly Product[] = [
  {
    id: 'vorm-001',
    serialNo: 'VM—01 // A',
    name: 'TP-7 Field Audio Recorder',
    subtitle: 'Motorized Tactile Spool & 24-Bit Studio Capture Instrument',
    price: 124500,
    category: 'Technology',
    editorialDiscipline: 'Acoustic & Field Engineering',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85',
    alt: 'Compact brushed aluminum digital field audio recorder with motorized tape reel on warm surface',
    originCity: 'Stockholm, Sweden',
    designerStudio: 'Vorm Acoustic Lab',
    materialSpec: 'CNC-milled 6061 anodized aluminum, turned naval brass motor shaft',
    dimensions: '96 × 68 × 16 mm',
    weight: '170 g',
    warranty: '10-Year Mechanical Guarantee',
    editionYear: 2026,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Raw Bead-Blasted Silver', hex: '#D6D4CE', finish: 'Matte Anodized' },
      { name: 'International Vermilion', hex: '#E03E1A', finish: 'Enamel Marker' },
      { name: 'Carbon Obsidian', hex: '#1E1E1C', finish: 'Hard Coat' }
    ],
    spotlightQuote: 'Engineered with a hall-effect motorized center reel that lets your fingertips physically scrub, pause, and cue digital audio with zero latency.',
    description:
      'An ultra-portable tactile audio recorder featuring a motorized brushed-metal center wheel for physical scrubbing, instant voice memo capture, three stereo two-way jacks, and 128 GB internal lossless storage.',
    careInstructions:
      'Wipe chassis with a dry microfiber cloth. Avoid solvents near the hall-effect optical bearing ring.',
    architecturalNotes:
      'Tolerance held to ±0.02mm across the monobloc shell. Spring-loaded side rocker acts as an instant mechanical clutch.'
  },
  {
    id: 'vorm-002',
    serialNo: 'VM—02 // W',
    name: 'Type-01 Cantilever Task Lamp',
    subtitle: 'Counterbalanced Zero-Spring Architectural Drafting Luminaire',
    price: 28900,
    category: 'Workspace',
    editorialDiscipline: 'Studio Illumination',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
    alt: 'Minimalist matte black architectural desk lamp illuminating a warm timber worktable',
    originCity: 'Zurich, Switzerland',
    designerStudio: 'Atelier Kith & Vorm',
    materialSpec: 'Bead-blasted extruded aluminum, optical borosilicate glass cylinder',
    dimensions: '440 × 160 × 490 mm',
    weight: '2,450 g',
    warranty: 'Lifetime Ballast & Hinge Warranty',
    editionYear: 2025,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Carbon Ink', hex: '#181817', finish: 'Micro-Textured Powder' },
      { name: 'Warm Limestone', hex: '#E8E4D9', finish: 'Matte Ceramic Coat' }
    ],
    spotlightQuote: 'Eliminates external springs and exposed cabling in favor of a concealed tungsten counterweight and precision friction-disc fulcrum.',
    description:
      'Engineered with zero visible springs or cables, this tension-balanced cantilever task lamp delivers 97 CRI glare-free warm studio illumination (2700K–4000K stepless rotary dimmer) across drafting tables.',
    careInstructions:
      'Clean the borosilicate diffuser with isopropyl alcohol on a lint-free cloth when cool.',
    architecturalNotes:
      'Low-voltage current travels directly through the dual anodized aluminum parallel arms, eliminating wire fatigue.'
  },
  {
    id: 'vorm-003',
    serialNo: 'VM—03 // C',
    name: 'Chronograph Monobloc 38mm',
    subtitle: 'Radial Typographic Dial with Thermally Blued Seconds Hand',
    price: 42000,
    category: 'Accessories',
    editorialDiscipline: 'Horology & Personal Instruments',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
    alt: 'Minimalist bauhaus wristwatch with stark white dial and fine steel case',
    originCity: 'Glashütte, Germany',
    designerStudio: 'Dezernat Zeitwerk',
    materialSpec: '316L brushed surgical steel, double-domed sapphire, vegetable-tanned Bridle leather',
    dimensions: 'Ø 38 × 8.4 mm (Lug-to-Lug 44.5 mm)',
    weight: '54 g',
    warranty: '5-Year Calibre Certification',
    editionYear: 2026,
    editionStatus: 'Numbered Batch',
    swatches: [
      { name: 'Archival Parchment Dial', hex: '#F4F1EA', finish: 'Silver-Plated Matte' },
      { name: 'Brushed 316L Steel', hex: '#A5A6A8', finish: 'Linear Satin' },
      { name: 'Vermilion Sweep', hex: '#E03E1A', finish: 'Lacquered Hand' }
    ],
    spotlightQuote: 'Proportions derived from 1960s European railway platform clocks, prioritizing instantaneous peripheral legibility.',
    description:
      'Housed in a single-block turned steel case with box-section sapphire glass. Features high-contrast pad-printed numerals, a sweeping vermilion seconds hand, and tool-free spring bars.',
    careInstructions:
      'Avoid submerging leather strap in water; condition annually with raw beeswax balm.',
    architecturalNotes:
      'Bezel width reduced to 1.4mm to maximize dial aperture while retaining 5 ATM pressure resistance.'
  },
  {
    id: 'vorm-004',
    serialNo: 'VM—04 // H',
    name: 'Hasami Porcelain Pour-Over Carafe',
    subtitle: 'Modular Stacking Brewer & Thermal Stoneware Vessel',
    price: 8400,
    category: 'Home',
    editorialDiscipline: 'Domestic Ritual & Tableware',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    alt: 'Matte stoneware ceramic pour-over coffee brewer and vessel on linen cloth',
    originCity: 'Nagasaki, Japan',
    designerStudio: 'Hasami Kiln Collective',
    materialSpec: 'Amakusa porcelain clay blended with iron-rich raw stoneware glaze',
    dimensions: 'Ø 145 × 185 mm (650 ml)',
    weight: '680 g',
    warranty: '2-Year Thermal Shock Coverage',
    editionYear: 2025,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Raw Ash Clay', hex: '#C9C2B4', finish: 'Unglazed Tactile' },
      { name: 'Kuro Matte Black', hex: '#282725', finish: 'Mineral Glaze' }
    ],
    description:
      'Fired at 1,300°C in traditional kilns in Hasami Village, this modular two-piece ribbed dripper and server stacks cleanly with planar precision and retains thermal stability without a protruding handle.',
    careInstructions:
      'Dishwasher safe. Season raw exterior clay with warm water before first brew to prevent coffee oil staining.',
    architecturalNotes:
      'Shared 145mm outer diameter allows the dripper, carafe, and oak lid to nest in any vertical permutation.'
  },
  {
    id: 'vorm-005',
    serialNo: 'VM—05 // A',
    name: 'KBD-65 Low-Profile Mechanical Console',
    subtitle: 'Gasket-Mounted CNC Aluminum Typing Instrument',
    price: 19500,
    category: 'Technology',
    editorialDiscipline: 'Human-Machine Interface',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85',
    alt: 'Compact aluminum mechanical keyboard with neutral off-white and charcoal keycaps',
    originCity: 'taipei / Zurich',
    designerStudio: 'Vorm Digital Systems',
    materialSpec: 'Solid billet 6063 aluminum chassis, PBT dye-sublimated legends, POM linear switches',
    dimensions: '312 × 108 × 19 mm',
    weight: '920 g',
    warranty: '3-Year Switch & PCB Warranty',
    editionYear: 2026,
    editionStatus: 'Studio Edition',
    swatches: [
      { name: 'Warm Chalk PBT', hex: '#EBE7DF', finish: 'Micro-Grain' },
      { name: 'Graphite Slate', hex: '#3B3B39', finish: 'Anodized Base' }
    ],
    description:
      'A whisper-quiet 65% mechanical typing instrument tuned with poron acoustic dampening, factory-lubricated tactile POM switches, QMK/VIA open firmware, and tri-mode wireless studio connectivity.',
    careInstructions:
      'Use included wire keycap puller for periodic compressed-air cleaning.',
    architecturalNotes:
      '6-degree typing angle machined directly into the bottom billet with flush silicone perimeter feet.'
  },
  {
    id: 'vorm-006',
    serialNo: 'VM—06 // W',
    name: 'Solid Brass Drafting Pen 0.5',
    subtitle: 'Unlacquered Lathe-Turned C3604 Naval Brass Writing Instrument',
    price: 4600,
    category: 'Workspace',
    editorialDiscipline: 'Drafting & Archival Notation',
    image: 'https://images.unsplash.com/photo-1585336261026-680e295ce3fe?auto=format&fit=crop&w=1000&q=85',
    alt: 'Heavyweight precision milled metal fountain and rollerball pen on archival paper',
    originCity: 'Tokyo, Japan',
    designerStudio: 'Saito Precision Lathe Works',
    materialSpec: 'Uncoated C3604 solid naval brass, ceramic rollerball 0.5mm archival ink cartridge',
    dimensions: 'Ø 10.5 × 138 mm',
    weight: '48 g',
    warranty: 'Lifetime Mechanical Thread Guarantee',
    editionYear: 2025,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Raw C3604 Brass', hex: '#C5A059', finish: 'Living Patina' },
      { name: 'Oxidized Bronze', hex: '#6E5A3B', finish: 'Aged Finish' }
    ],
    description:
      'Lathe-turned from a single hexagonal rod of solid brass with a forward-weighted center of gravity that writes under its own mass. Left unlacquered to develop an individual patina over decades.',
    careInstructions:
      'Allow natural oxidation or restore mirror sheen using a trace of gentle brass polish.',
    architecturalNotes:
      'Precision-machined threads close with an airtight hydraulic damping sensation.'
  },
  {
    id: 'vorm-007',
    serialNo: 'VM—07 // A',
    name: 'Acoustic Monolith Bookshelf Monitor',
    subtitle: 'Reference Active Studio Speaker with Kvadrat Wool Baffle',
    price: 64000,
    category: 'Technology',
    editorialDiscipline: 'Electro-Acoustic Architecture',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85',
    alt: 'Architectural high-fidelity bookshelf speaker in matte charcoal finish',
    originCity: 'Copenhagen, Denmark',
    designerStudio: 'Klang & Vorm Audio',
    materialSpec: 'High-density valchromat acoustic enclosure, Kvadrat textile, solid brass rotary pots',
    dimensions: '280 × 190 × 340 mm',
    weight: '7,800 g',
    warranty: '5-Year Amplifier & Driver Coverage',
    editionYear: 2026,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Basalt Grey', hex: '#2A2A28', finish: 'Matte Valchromat' },
      { name: 'Raw Baltic Birch', hex: '#D8C7A9', finish: 'Oiled Veneer' }
    ],
    description:
      'Reference-grade active studio monitor housed in a rectilinear cabinet with physical analog bass/treble potentiometers, Class-D bi-amplification, and lossless optical, USB-C, and AirPlay 2 inputs.',
    careInstructions:
      'Vacuum wool front grille gently using a soft brush attachment.',
    architecturalNotes:
      'Rear slot-port geometry eliminates boundary turbulence when positioned within 10cm of library shelving.'
  },
  {
    id: 'vorm-008',
    serialNo: 'VM—08 // W',
    name: 'Modular Felt & White Oak Desk Tray',
    subtitle: 'CNC-Pocketed Valet for Daily Instruments & Optics',
    price: 6200,
    category: 'Workspace',
    editorialDiscipline: 'Surface Organization',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=85',
    alt: 'Organized minimalist workspace with wooden catchall tray, notebook, and coffee',
    originCity: 'Helsinki, Finland',
    designerStudio: 'Studio Pohja',
    materialSpec: 'FSC-certified quarter-sawn European white oak, 3mm undyed merino wool felt',
    dimensions: '260 × 130 × 22 mm',
    weight: '390 g',
    warranty: '5-Year Structural Timber Guarantee',
    editionYear: 2025,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Natural White Oak', hex: '#C8B08A', finish: 'Raw Linseed Wax' },
      { name: 'Undyed Merino', hex: '#DFDBD2', finish: 'Pressed Wool' }
    ],
    description:
      'Milled from solid European oak with gentle internal cove radii to cradle fountain pens, SD cards, lenses, and timepieces without acoustic clatter.',
    careInstructions:
      'Refresh timber annually with a drop of cold-pressed linseed oil.',
    architecturalNotes:
      'Underside features recessed brass alignment pins to stack or interlock with companion trays.'
  },
  {
    id: 'vorm-009',
    serialNo: 'VM—09 // C',
    name: 'Kurashiki Canvas Weekender Tote',
    subtitle: '24oz Shuttle-Loomed Paraffin Duck Carryall',
    price: 14800,
    category: 'Accessories',
    editorialDiscipline: 'Archival Transit & Carry',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    alt: 'Heavyweight natural unbleached cotton canvas tote bag with clean geometric seams',
    originCity: 'Kurashiki, Japan',
    designerStudio: 'Okayama Loom Works',
    materialSpec: '24oz shuttle-loomed paraffin-waxed cotton duck, hand-peened solid copper rivets',
    dimensions: '420 × 360 × 160 mm',
    weight: '860 g',
    warranty: 'Lifetime Seam & Rivet Repair',
    editionYear: 2025,
    editionStatus: 'Numbered Batch',
    swatches: [
      { name: 'Unbleached Ecru', hex: '#EAE3D2', finish: 'Raw Shuttle Canvas' },
      { name: 'Indigo Dyed', hex: '#1D3557', finish: 'Natural Fermented Vat' }
    ],
    description:
      'Woven on vintage power looms in Okayama Prefecture, this self-standing structured carryall features an internal suspended 16-inch laptop sleeve, key tether, and double-layered waterproofed base.',
    careInstructions:
      'Spot clean with cold water and a stiff bristle brush. Do not machine wash or dry-clean.',
    architecturalNotes:
      'Continuous 38mm webbing straps pass completely beneath the base to distribute loads up to 40 kg.'
  },
  {
    id: 'vorm-010',
    serialNo: 'VM—10 // H',
    name: 'Nanbu Tekki Cast Iron Kettle — 1.2L',
    subtitle: 'Sand-Cast Foundry Teapot with Removable Stainless Infuser',
    price: 16500,
    category: 'Home',
    editorialDiscipline: 'Thermal & Culinary Objects',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=85',
    alt: 'Traditional black Nanbu Tekki cast iron teapot resting on a minimalist table',
    originCity: 'Morioka, Japan',
    designerStudio: 'Iwachu Foundry 4th Gen',
    materialSpec: 'Sand-cast pig iron, traditional roasted urushi charcoal finish',
    dimensions: '195 × 165 × 150 mm (1.2 Litre)',
    weight: '1,950 g',
    warranty: 'Generational Cast Iron Guarantee',
    editionYear: 2025,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Foundry Iron Black', hex: '#232220', finish: 'Sand-Cast Texture' }
    ],
    description:
      'Hand-cast in individual sand molds using 400-year-old Morioka foundry techniques, enriching boiled water with bioavailable trace iron while softening mineral harshness. Compatible with gas and induction.',
    careInstructions:
      'Empty remaining water while warm and allow residual heat to dry the interior completely.',
    architecturalNotes:
      'Flat bottom induction base engineered for rapid thermal transfer on modern glass cooktops.'
  },
  {
    id: 'vorm-011',
    serialNo: 'VM—11 // C',
    name: 'Optical Acetate Frame — 04 Square',
    subtitle: '8mm Cured Takiron Cellulose Acetate Architectural Spectacles',
    price: 18200,
    category: 'Accessories',
    editorialDiscipline: 'Personal Optics',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85',
    alt: 'Hand-polished tortoiseshell and charcoal acetate eyeglasses on neutral stone background',
    originCity: 'Sabae, Japan',
    designerStudio: 'Fukui Optical Guild',
    materialSpec: '8mm Takiron cured cellulose acetate, custom titanium 5-barrel riveted hinges',
    dimensions: '47 — 22 — 145 mm',
    weight: '34 g',
    warranty: '3-Year Hinge & Frame Alignment',
    editionYear: 2026,
    editionStatus: 'Studio Edition',
    swatches: [
      { name: 'Dark Havana Tortoise', hex: '#4A3222', finish: 'Bamboo-Polished' },
      { name: 'Translucent Smoke', hex: '#7A7974', finish: 'Crystal Gloss' }
    ],
    description:
      'Tumble-polished in bamboo chips and walnut shells for 72 hours for a deep, glass-like luster. Outfitted with zero-tint anti-reflective Carl Zeiss archival plano lenses ready for prescription fitting.',
    careInstructions:
      'Rinse under tepid water before wiping lenses with the supplied woven microfiber cloth.',
    architecturalNotes:
      'Custom-milled titanium temple cores feature engraved millimeter ruler markings visible through the acetate.'
  },
  {
    id: 'vorm-012',
    serialNo: 'VM—12 // H',
    name: 'Bimetallic Hygrometer & Barometer Dial',
    subtitle: 'Battery-Free Mechanical Atmospheric Wall Instrument',
    price: 11200,
    category: 'Home',
    editorialDiscipline: 'Atmospheric Metrology',
    image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1000&q=85',
    alt: 'Clean circular wall-mounted instrument dial with high-contrast black markings on white face',
    originCity: 'Stuttgart, Germany',
    designerStudio: 'Feinmechanik Süd',
    materialSpec: 'Spun anodized aluminum housing, copper-beryllium aneroid capsule, mineral glass',
    dimensions: 'Ø 160 × 38 mm',
    weight: '420 g',
    warranty: '10-Year Calibration Warranty',
    editionYear: 2025,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Instrument White', hex: '#F7F5F0', finish: 'Matte Enamel Dial' },
      { name: 'Signal Orange Needle', hex: '#E03E1A', finish: 'Balanced Aluminum' }
    ],
    description:
      'Calibrated mechanical room climate instrument requiring zero batteries or connectivity. Tracks relative humidity and atmospheric pressure shifts with hairspring precision.',
    careInstructions:
      'Mount away from direct radiator drafts. Rear brass screw allows sea-level altitude calibration.',
    architecturalNotes:
      'Ventilated rear bezel admits ambient room air while shielding internal coils from dust.'
  },
  {
    id: 'vorm-013',
    serialNo: 'VM—13 // W',
    name: 'Folded Steel Bookend Pair — L-02',
    subtitle: '4mm Laser-Cut Architectural Monograph Anchors',
    price: 5400,
    category: 'Workspace',
    editorialDiscipline: 'Library & Shelving Hardware',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=85',
    alt: 'Architectural stack of art monographs supported by minimal metal bookends',
    originCity: 'Milan, Italy',
    designerStudio: 'Officina Brera',
    materialSpec: '4mm cold-rolled folded steel plate, micro-textured powder coat, natural Portuguese cork base',
    dimensions: '180 × 140 × 140 mm (Pair)',
    weight: '1,640 g',
    warranty: 'Lifetime Structural Guarantee',
    editionYear: 2025,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Vermilion Red', hex: '#E03E1A', finish: 'Matte Powder' },
      { name: 'Raw Alabaster', hex: '#EAE6DD', finish: 'Fine Texture' },
      { name: 'Anthracite', hex: '#1E1E1C', finish: 'Matte Powder' }
    ],
    description:
      'Engineered with a paper-thin 2mm lower tongue that disappears beneath the first volume while anchoring heavy large-format design monographs without flexing or scratching timber shelving.',
    careInstructions:
      'Wipe with a damp cloth.',
    architecturalNotes:
      'Single-bend radius formed on a 60-ton press brake for strict 90.0° perpendicularity.'
  },
  {
    id: 'vorm-014',
    serialNo: 'VM—14 // H',
    name: 'Unbleached Baltic Linen Throw',
    subtitle: 'Heavyweight 380 GSM Loom-State Architectural Textile',
    price: 13900,
    category: 'Home',
    editorialDiscipline: 'Domestic Textiles',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=85',
    alt: 'Textured oatmeal and warm ivory woven linen textiles draped over a minimalist bed',
    originCity: 'Vilnius, Lithuania',
    designerStudio: 'Lina & Vorm Weavery',
    materialSpec: '100% long-staple unbleached Baltic flax linen (OEKO-TEX Standard 100)',
    dimensions: '2100 × 1500 mm',
    weight: '1,120 g',
    warranty: '5-Year Selvedge Integrity',
    editionYear: 2026,
    editionStatus: 'Permanent Collection',
    swatches: [
      { name: 'Raw Flax Oatmeal', hex: '#D8D0C1', finish: 'Stone-Washed' },
      { name: 'Warm Alabaster', hex: '#F0ECE1', finish: 'Enzyme Softened' }
    ],
    description:
      'Stone-washed in small batches for an airy, dry hand-feel that regulates thermal comfort across both humid monsoon evenings and crisp winter mornings.',
    careInstructions:
      'Machine wash gentle at 30°C; line dry in shade to preserve natural flax fibers.',
    architecturalNotes:
      'Finished with a 15mm mitered hem and woven archival specification label stitched at the lower corner.'
  }
];

export const CATEGORIES: readonly ('All Categories' | ProductCategory)[] = [
  'All Categories',
  'Technology',
  'Workspace',
  'Accessories',
  'Home'
];

export const CATEGORY_EDITORIAL_META: Record<
  'All Categories' | ProductCategory,
  { code: string; subtitle: string }
> = {
  'All Categories': {
    code: 'IDX // 00',
    subtitle: 'Complete Archival Index — All Disciplines'
  },
  Technology: {
    code: 'DEP // 01',
    subtitle: 'Acoustic, Field Capture & Human-Machine Interfaces'
  },
  Workspace: {
    code: 'DEP // 02',
    subtitle: 'Drafting Instruments, Cantilever Luminaires & Desk Architecture'
  },
  Accessories: {
    code: 'DEP // 03',
    subtitle: 'Mechanical Horology, Sabae Optics & Waxed Canvas Carry'
  },
  Home: {
    code: 'DEP // 04',
    subtitle: 'Hasami Ceramics, Nanbu Tekki Ironware & Baltic Textiles'
  }
};

export const QUICK_DISCOVERY_TAGS: readonly { label: string; query: string }[] = [
  { label: 'Brass', query: 'Brass' },
  { label: 'Lamp', query: 'Lamp' },
  { label: 'Recorder', query: 'Recorder' },
  { label: 'Kettle', query: 'Kettle' },
  { label: 'Porcelain', query: 'Porcelain' },
  { label: 'Monolith', query: 'Monolith' }
];

// ============================================================================
// 4. PURE NON-MUTATING FILTER & SORT ENGINE
// ============================================================================

export function deriveVisibleProducts(
  products: readonly Product[],
  searchQuery: string,
  selectedCategory: ProductCategory | 'All Categories',
  sortBy: SortOption
): Product[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All Categories' || product.category === selectedCategory;

    const matchesSearch =
      normalizedQuery === '' ||
      product.name.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-asc') {
    return [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sortBy === 'price-desc') {
    return [...filtered].sort((a, b) => b.price - a.price);
  }

  return [...filtered];
}

// ============================================================================
// 5. REUSABLE COMPONENTS
// ============================================================================

/**
 * Header Component (src/components/Header.tsx)
 * Features VORM // MONOGRAPH wordmark, live department navigation, Compare Tray trigger,
 * and Curated Collection Bag drawer trigger. Zero fake or dead links.
 */
interface HeaderProps {
  selectedCategory: ProductCategory | 'All Categories';
  onSelectCategory: (category: ProductCategory | 'All Categories') => void;
  compareIds: readonly string[];
  onOpenCompare: () => void;
  curatedItems: readonly CuratedItem[];
  onOpenBag: () => void;
  onResetAll: () => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  compareIds,
  onOpenCompare,
  curatedItems,
  onOpenBag,
  onResetAll,
}) => {
  const totalBagCount = useMemo(
    () => curatedItems.reduce((sum, item) => sum + item.quantity, 0),
    [curatedItems]
  );

  const handleNavClick = (cat: ProductCategory | 'All Categories') => {
    onSelectCategory(cat);
    const catalogEl = document.getElementById('discovery-toolbar');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#DDD8CE]">
      {/* Subtle Top Archival Ticker */}
      <div className="bg-[#121211] text-[#F5F2EB] border-b border-[#292826] px-4 sm:px-8 py-1.5 text-[10px] font-mono tracking-[0.18em] uppercase">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E03E1A] shrink-0" aria-hidden="true" />
            <span className="truncate">
              VORM // MONOGRAPH — ARCHIVE EDITION 04 • INDEX OF TACTILE PERMANENCE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-[#A09C94] shrink-0">
            <span>ZURICH / TOKYO / STOCKHOLM</span>
            <span>•</span>
            <span>CURRENCY: INR (₹)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-6 min-w-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onResetAll();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E03E1A]"
          >
            <div className="font-mono text-sm sm:text-base font-semibold tracking-[0.18em] text-[#121211] flex items-center gap-1.5">
              <span>VORM</span>
              <span className="text-[#E03E1A] font-normal">//</span>
              <span>MONOGRAPH</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#6E6A63] hidden sm:block">
              Industrial Design Archive &amp; Storefront
            </span>
          </a>

          {/* Desktop Department Links */}
          <nav
            aria-label="Primary department navigation"
            className="hidden xl:flex items-center gap-1 border-l border-[#DDD8CE] pl-6"
          >
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleNavClick(category)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${isActive
                      ? 'bg-[#121211] text-[#F5F2EB]'
                      : 'text-[#57534E] hover:text-[#121211] hover:bg-[#EBE6DC]'
                    }`}
                >
                  {category === 'All Categories' ? 'Index [All]' : category}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Interactive Utilities: Compare Matrix & Curated Collection Bag */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Compare Trigger */}
          <button
            type="button"
            onClick={onOpenCompare}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 border font-mono text-[11px] uppercase tracking-[0.1em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E03E1A] ${compareIds.length > 0
                ? 'border-[#121211] bg-[#EBE6DC] text-[#121211]'
                : 'border-[#DDD8CE] bg-[#F5F2EB] text-[#57534E] hover:border-[#121211] hover:text-[#121211]'
              }`}
            aria-label={`Compare selected objects (${compareIds.length} of 3 selected)`}
          >
            <Scale className="w-3.5 h-3.5 text-[#E03E1A]" aria-hidden="true" />
            <span className="hidden sm:inline">Compare</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-[#121211] text-[#F5F2EB] font-semibold">
              {compareIds.length}/3
            </span>
          </button>

          {/* Curated Collection Bag Trigger */}
          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#121211] hover:bg-[#E03E1A] text-[#F5F2EB] font-mono text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E03E1A]"
            aria-label={`Open curated collection bag (${totalBagCount} objects)`}
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">Collection</span>
            <span className="px-1.5 py-0.2 bg-[#E03E1A] text-[#F5F2EB] text-[10px] font-semibold">
              {totalBagCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * EditorialHero Component (src/components/Hero.tsx)
 * Asymmetric architectural hero with interactive 3-object Exhibition Spotlight carousel,
 * live material swatch selector, and immediate access to the catalog.
 */
interface EditorialHeroProps {
  spotlightProducts: readonly Product[];
  onInspectProduct: (product: Product) => void;
  onAddToBag: (productId: string) => void;
  selectedCategory: ProductCategory | 'All Categories';
  onSelectCategory: (category: ProductCategory | 'All Categories') => void;
  categoryCounts: Record<string, number>;
}

const EditorialHero: React.FC<EditorialHeroProps> = ({
  spotlightProducts,
  onInspectProduct,
  onAddToBag,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [selectedSwatchIdx, setSelectedSwatchIdx] = useState<number>(0);

  const currentSpotlight = spotlightProducts[activeSlide] || spotlightProducts[0];

  const handleSlideChange = (newIndex: number) => {
    setActiveSlide(newIndex);
    setSelectedSwatchIdx(0);
  };

  return (
    <section
      aria-labelledby="hero-headline"
      className="border-b border-[#DDD8CE] bg-[#F5F2EB] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column (7 Cols): Editorial Manifesto & Interactive Department Matrix */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-4 sm:space-y-5">
              {/* Monograph Issue Badge */}
              <div className="inline-flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="px-2 py-0.5 bg-[#E03E1A] text-[#F5F2EB] font-medium">
                  MONOGRAPH 04
                </span>
                <span className="text-[#57534E]">
                  // CURATED INDUSTRIAL DESIGN &amp; PERMANENT OBJECTS
                </span>
              </div>

              {/* Main Editorial Headline */}
              <h1
                id="hero-headline"
                className="font-serif text-4xl sm:text-6xl lg:text-[66px] leading-[1.01] tracking-[-0.025em] text-[#121211] font-normal"
              >
                Tactile permanence.{' '}
                <span className="italic font-light text-[#44403C] block mt-1">
                  Objects engineered to outlive their era.
                </span>
              </h1>

              {/* Editorial Description */}
              <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#44403C] max-w-2xl pt-1">
                <strong>VORM // MONOGRAPH</strong> is an independent design index and storefront
                dedicated to precision-machined workspace tools, reference electro-acoustics, and
                enduring domestic forms. Every object is documented by origin, material alloy, and
                repairability.
              </p>
            </div>

            {/* Interactive Architectural Department Selector Matrix */}
            <div className="pt-4 border-t border-[#DDD8CE]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E6A63]">
                  Archive Disciplines // Select Department to Filter Index
                </span>
                <span className="font-mono text-[10px] text-[#6E6A63] hidden sm:inline">
                  {CATEGORY_EDITORIAL_META[selectedCategory].subtitle}
                </span>
              </div>

              <div
                className="grid grid-cols-2 sm:grid-cols-5 gap-2"
                role="group"
                aria-label="Filter collection by department"
              >
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  const count = categoryCounts[category] ?? 0;
                  const meta = CATEGORY_EDITORIAL_META[category];
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => onSelectCategory(category)}
                      aria-pressed={isActive}
                      className={`group text-left p-2.5 sm:p-3 border transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E03E1A] ${isActive
                          ? 'bg-[#121211] text-[#F5F2EB] border-[#121211]'
                          : 'bg-[#ECE8DF]/70 hover:bg-[#ECE8DF] text-[#121211] border-[#DDD8CE] hover:border-[#121211]'
                        }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest mb-1">
                        <span className={isActive ? 'text-[#E03E1A]' : 'text-[#6E6A63]'}>
                          {meta.code}
                        </span>
                        <span
                          className={`px-1 ${isActive ? 'bg-[#E03E1A] text-[#F5F2EB]' : 'text-[#6E6A63]'
                            }`}
                        >
                          {count.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="font-serif text-base sm:text-lg leading-tight truncate">
                        {category === 'All Categories' ? 'All Objects' : category}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Interactive Exhibition Spotlight Carousel */}
          <div className="lg:col-span-5">
            <div className="h-full border border-[#121211] bg-[#ECE8DF] p-4 sm:p-6 flex flex-col justify-between relative">
              {/* Spotlight Top Header & Carousel Controls */}
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#DDD8CE]">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#121211]">
                  <Sparkles className="w-3.5 h-3.5 text-[#E03E1A]" aria-hidden="true" />
                  <span>Exhibition Spotlight // 0{activeSlide + 1} of 0{spotlightProducts.length}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleSlideChange(
                        (activeSlide - 1 + spotlightProducts.length) % spotlightProducts.length
                      )
                    }
                    aria-label="Previous spotlight object"
                    className="p-1 border border-[#DDD8CE] bg-[#F5F2EB] hover:border-[#121211] text-[#121211] transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSlideChange((activeSlide + 1) % spotlightProducts.length)}
                    aria-label="Next spotlight object"
                    className="p-1 border border-[#DDD8CE] bg-[#F5F2EB] hover:border-[#121211] text-[#121211] transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Spotlight Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-auto">
                {/* Product Plate Image */}
                <div
                  onClick={() => onInspectProduct(currentSpotlight)}
                  className="sm:col-span-5 relative aspect-[4/5] w-full overflow-hidden border border-[#DDD8CE] bg-[#E2DDD2] cursor-pointer group"
                >
                  <img
                    src={currentSpotlight.image}
                    alt={currentSpotlight.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2 left-2 bg-[#121211]/90 text-[#F5F2EB] font-mono text-[9px] uppercase tracking-widest px-2 py-0.5">
                    {currentSpotlight.serialNo}
                  </div>
                </div>

                {/* Engineering & Editorial Metadata */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#6E6A63]">
                    <span>{currentSpotlight.originCity}</span>
                    <span className="text-[#1D3557] font-medium">{currentSpotlight.category}</span>
                  </div>

                  <h2
                    onClick={() => onInspectProduct(currentSpotlight)}
                    className="font-serif text-2xl sm:text-[26px] leading-tight text-[#121211] hover:text-[#E03E1A] transition-colors cursor-pointer"
                  >
                    {currentSpotlight.name}
                  </h2>

                  <p className="text-xs leading-relaxed text-[#44403C]">
                    {currentSpotlight.spotlightQuote || currentSpotlight.description}
                  </p>

                  {/* Interactive Material Swatch Selector */}
                  <div className="pt-1">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#6E6A63] mb-1.5">
                      Surface Finish:{' '}
                      <span className="text-[#121211]">
                        {currentSpotlight.swatches[selectedSwatchIdx]?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentSpotlight.swatches.map((swatch, idx) => (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={() => setSelectedSwatchIdx(idx)}
                          title={`${swatch.name} (${swatch.finish})`}
                          aria-label={`Select finish ${swatch.name}`}
                          className={`w-5 h-5 rounded-full border transition-transform ${selectedSwatchIdx === idx
                              ? 'scale-110 ring-2 ring-[#E03E1A] ring-offset-2 ring-offset-[#ECE8DF] border-[#121211]'
                              : 'border-[#6E6A63] opacity-80 hover:opacity-100'
                            }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-3 border-t border-[#DDD8CE] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-[#6E6A63]">
                        Archive Valuation
                      </span>
                      <span className="font-mono text-base font-semibold text-[#121211]">
                        {formatINR(currentSpotlight.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onAddToBag(currentSpotlight.id)}
                        className="px-2.5 py-1.5 border border-[#121211] bg-[#F5F2EB] hover:bg-[#121211] text-[#121211] hover:text-[#F5F2EB] font-mono text-[10px] uppercase tracking-wider transition-colors"
                      >
                        + Collect
                      </button>
                      <button
                        type="button"
                        onClick={() => onInspectProduct(currentSpotlight)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#121211] hover:bg-[#E03E1A] text-[#F5F2EB] font-mono text-[10px] uppercase tracking-wider transition-colors"
                      >
                        <span>Dossier</span>
                        <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Slide Progress Dots */}
              <div className="pt-3 mt-4 border-t border-[#DDD8CE] flex items-center justify-between font-mono text-[10px] text-[#6E6A63]">
                <span className="truncate max-w-[240px]">
                  DIM: {currentSpotlight.dimensions}
                </span>
                <div className="flex items-center gap-1.5">
                  {spotlightProducts.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSlideChange(idx)}
                      aria-label={`View spotlight ${idx + 1}: ${item.name}`}
                      className={`h-1.5 transition-all ${activeSlide === idx
                          ? 'w-6 bg-[#E03E1A]'
                          : 'w-2 bg-[#C7C1B5] hover:bg-[#121211]'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * DiscoveryToolbar Component (src/components/ProductFilters.tsx)
 * Implements accessible live search by name (with `/` shortcut), Category dropdown,
 * Price sorting dropdown (Default, Low to High, High to Low), View Mode toggle,
 * dynamic result count, and Clear Filters button.
 */
interface DiscoveryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory | 'All Categories';
  onCategoryChange: (category: ProductCategory | 'All Categories') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const DiscoveryToolbar: React.FC<DiscoveryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Support pressing "/" anywhere outside an input to focus the live search box
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      id="discovery-toolbar"
      aria-label="Product discovery and filtering controls"
      className="sticky top-16 sm:top-[70px] z-20 bg-[#ECE8DF]/95 backdrop-blur-md border-b border-[#DDD8CE]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3.5 space-y-3">
        {/* Primary Row: Search Input, Category Select, Price Sort Select, Result Count & Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
          {/* 1. Live Search Input by Product Name (5 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <label htmlFor="product-search-input" className="sr-only">
              Search products by name
            </label>
            <div className="relative flex items-center">
              <Search
                className="w-4 h-4 text-[#6E6A63] absolute left-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                id="product-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search archive by product name (press '/' to focus)..."
                autoComplete="off"
                className="w-full pl-10 pr-16 py-2.5 bg-[#F5F2EB] border border-[#DDD8CE] hover:border-[#8C867B] focus:border-[#121211] text-sm text-[#121211] placeholder-[#8C867B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E03E1A]"
              />
              {searchQuery.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search query"
                  className="absolute right-2.5 p-1 text-[#6E6A63] hover:text-[#121211] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E03E1A]"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : (
                <kbd
                  aria-hidden="true"
                  className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-[#6E6A63] bg-[#ECE8DF] border border-[#DDD8CE]"
                >
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* 2. Category Dropdown (3 cols on lg) */}
          <div className="sm:col-span-1 lg:col-span-3">
            <label htmlFor="category-filter-select" className="sr-only">
              Filter by category
            </label>
            <div className="relative flex items-center">
              <SlidersHorizontal
                className="w-3.5 h-3.5 text-[#6E6A63] absolute left-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="category-filter-select"
                value={selectedCategory}
                onChange={(e) =>
                  onCategoryChange(e.target.value as ProductCategory | 'All Categories')
                }
                className="w-full pl-9 pr-8 py-2.5 bg-[#F5F2EB] border border-[#DDD8CE] hover:border-[#8C867B] focus:border-[#121211] text-xs sm:text-sm text-[#121211] font-mono tracking-tight appearance-none cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E03E1A]"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All Categories'
                      ? 'All Categories'
                      : `Category: ${category}`}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-3 text-[10px] font-mono text-[#6E6A63]"
                aria-hidden="true"
              >
                ▼
              </span>
            </div>
          </div>

          {/* 3. Price Sorting Dropdown (2 cols on lg) */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label htmlFor="price-sort-select" className="sr-only">
              Sort products by price
            </label>
            <div className="relative flex items-center">
              <ArrowUpDown
                className="w-3.5 h-3.5 text-[#6E6A63] absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="price-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full pl-8 pr-7 py-2.5 bg-[#F5F2EB] border border-[#DDD8CE] hover:border-[#8C867B] focus:border-[#121211] text-xs sm:text-sm text-[#121211] font-mono tracking-tight appearance-none cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E03E1A]"
              >
                <option value="default">Default Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <span
                className="pointer-events-none absolute right-2.5 text-[10px] font-mono text-[#6E6A63]"
                aria-hidden="true"
              >
                ▼
              </span>
            </div>
          </div>

          {/* 4. Dynamic Result Counter & Clear Filters Button (2 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-2 flex items-center justify-between lg:justify-end gap-2">
            <div
              aria-live="polite"
              className="font-mono text-xs text-[#44403C] whitespace-nowrap"
            >
              Showing <strong className="font-semibold text-[#121211]">{resultCount}</strong> of{' '}
              {totalCount}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#E03E1A] text-[#F5F2EB] hover:bg-[#121211] font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121211]"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Sub-Bar: Quick Editorial Search Tags & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#DDD8CE]/70 text-xs">
          {/* Quick Search Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6A63] shrink-0">
              Quick Index:
            </span>
            {QUICK_DISCOVERY_TAGS.map((tag) => {
              const isSelected =
                searchQuery.trim().toLowerCase() === tag.query.toLowerCase();
              return (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => onSearchChange(isSelected ? '' : tag.query)}
                  className={`px-2 py-0.5 font-mono text-[11px] border transition-colors shrink-0 ${isSelected
                      ? 'bg-[#121211] text-[#F5F2EB] border-[#121211]'
                      : 'bg-[#F5F2EB] text-[#44403C] border-[#DDD8CE] hover:border-[#121211] hover:text-[#121211]'
                    }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>

          {/* Architectural View Switcher */}
          <div
            className="inline-flex border border-[#DDD8CE] bg-[#F5F2EB] p-0.5 ml-auto"
            role="group"
            aria-label="Catalog layout mode"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('grid-4')}
              aria-pressed={viewMode === 'grid-4'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${viewMode === 'grid-4'
                  ? 'bg-[#121211] text-[#F5F2EB]'
                  : 'text-[#6E6A63] hover:text-[#121211]'
                }`}
              title="4-Column Standard Grid"
            >
              <Grid className="w-3 h-3" aria-hidden="true" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid-3')}
              aria-pressed={viewMode === 'grid-3'}
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${viewMode === 'grid-3'
                  ? 'bg-[#121211] text-[#F5F2EB]'
                  : 'text-[#6E6A63] hover:text-[#121211]'
                }`}
              title="3-Column Exhibition Gallery"
            >
              <Layers className="w-3 h-3" aria-hidden="true" />
              <span>Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('index')}
              aria-pressed={viewMode === 'index'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${viewMode === 'index'
                  ? 'bg-[#121211] text-[#F5F2EB]'
                  : 'text-[#6E6A63] hover:text-[#121211]'
                }`}
              title="Architectural Spec Index"
            >
              <List className="w-3 h-3" aria-hidden="true" />
              <span>Spec Index</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * ProductCard Component (src/components/ProductCard.tsx)
 * Displays high-resolution coherent product photography with 4:5 aspect ratio lock,
 * architectural SVG schematic fallback on image failure, product name, INR formatted price,
 * category badge, interactive material swatches, Compare toggle, and Collect button.
 */
interface ProductCardProps {
  product: Product;
  isCompared: boolean;
  onToggleCompare: (productId: string) => void;
  onAddToBag: (productId: string) => void;
  onInspectProduct: (product: Product) => void;
  onFilterByCategory: (category: ProductCategory) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isCompared,
  onToggleCompare,
  onAddToBag,
  onInspectProduct,
  onFilterByCategory,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToBag(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group bg-[#F5F2EB] flex flex-col justify-between border-b border-r border-[#DDD8CE] transition-colors duration-300 hover:bg-[#ECE8DF]/75">
      <div>
        {/* Card Header: Serial Code, Category Filter Pill & Compare Toggle */}
        <div className="px-4 sm:px-5 pt-3.5 pb-2.5 flex items-center justify-between border-b border-[#E5E0D5] gap-2">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-[#6E6A63]">
            {product.serialNo}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onFilterByCategory(product.category)}
              title={`Filter collection by ${product.category}`}
              className="font-mono text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 bg-[#ECE8DF] hover:bg-[#121211] text-[#44403C] hover:text-[#F5F2EB] border border-[#DDD8CE] transition-colors"
            >
              {product.category}
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(product.id)}
              aria-pressed={isCompared}
              title={isCompared ? 'Remove from comparison' : 'Compare object specifications'}
              className={`p-1 border transition-colors ${isCompared
                  ? 'bg-[#121211] text-[#F5F2EB] border-[#121211]'
                  : 'bg-transparent text-[#6E6A63] border-transparent hover:border-[#DDD8CE] hover:text-[#121211]'
                }`}
            >
              <Scale className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 4:5 Aspect-Ratio Locked Product Photography with Architectural Blueprint Fallback */}
        <div
          onClick={() => onInspectProduct(product)}
          className="relative aspect-[4/5] w-full overflow-hidden bg-[#E5E0D5] cursor-pointer"
        >
          {!imageFailed ? (
            <>
              {!imageLoaded && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-[#E5E0D5] animate-pulse"
                  aria-hidden="true"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#8C867B]">
                    {product.serialNo}
                  </span>
                </div>
              )}
              <img
                src={product.image}
                alt={product.alt}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
                className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
              />
            </>
          ) : (
            /* Architectural CAD Schematic Fallback if image fails to load */
            <div
              role="img"
              aria-label={product.alt}
              className="w-full h-full flex flex-col items-center justify-between p-6 bg-[#E5E0D5] text-[#44403C] select-none"
            >
              <div className="w-full flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#6E6A63]">
                <span>CAD Projection</span>
                <span>{product.serialNo}</span>
              </div>
              <svg
                className="w-20 h-20 stroke-[#57534E]"
                viewBox="0 0 100 100"
                fill="none"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <rect x="14" y="14" width="72" height="72" />
                <circle cx="50" cy="50" r="24" />
                <line x1="14" y1="50" x2="86" y2="50" strokeDasharray="2 2" />
                <line x1="50" y1="14" x2="50" y2="86" strokeDasharray="2 2" />
              </svg>
              <div className="text-center">
                <p className="font-serif text-sm text-[#121211]">{product.name}</p>
                <p className="font-mono text-[10px] text-[#6E6A63] mt-0.5">
                  {product.dimensions}
                </p>
              </div>
            </div>
          )}

          {/* Edition Status Badge */}
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#F5F2EB]/90 backdrop-blur-xs text-[#121211] border border-[#DDD8CE]">
              {product.editionStatus}
            </span>
          </div>

          {/* Hover Engineering Spec Bar */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#121211]/85 via-[#121211]/55 to-transparent text-[#F5F2EB] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between gap-2 pointer-events-none">
            <div className="font-mono text-[10px] leading-tight">
              <div className="text-[#E03E1A] uppercase tracking-wider">{product.originCity}</div>
              <div className="text-[#DDD8CE] truncate max-w-[180px]">
                {product.dimensions} • {product.weight}
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider bg-[#E03E1A] text-[#F5F2EB] px-2 py-0.5 shrink-0">
              Dossier ↗
            </span>
          </div>
        </div>

        {/* Card Body: Product Title, Subtitle, Swatches & Material Spec */}
        <div className="p-4 sm:p-5 pb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] truncate">
              {product.designerStudio}
            </span>
            {/* Swatch Dots */}
            <div className="flex items-center gap-1 shrink-0" aria-label="Material finishes">
              {product.swatches.map((swatch) => (
                <span
                  key={swatch.name}
                  title={`${swatch.name} (${swatch.finish})`}
                  className="w-2.5 h-2.5 rounded-full border border-[#8C867B]"
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>
          </div>

          <h2
            onClick={() => onInspectProduct(product)}
            className="font-serif text-xl sm:text-[22px] leading-snug text-[#121211] group-hover:text-[#E03E1A] transition-colors cursor-pointer"
          >
            {product.name}
          </h2>

          <p className="mt-1 font-mono text-[11px] text-[#57534E] line-clamp-1">
            {product.materialSpec}
          </p>

          <p className="mt-2 text-xs leading-relaxed text-[#44403C] line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Formatted INR Price & Dual Actions (Inspect + Collect) */}
      <div className="px-4 sm:px-5 py-3.5 border-t border-[#E5E0D5] flex items-center justify-between gap-2 bg-[#F5F2EB]">
        <div>
          <span className="block font-mono text-[9px] uppercase tracking-wider text-[#6E6A63]">
            Valuation (INR)
          </span>
          <span className="font-mono text-sm sm:text-base font-semibold text-[#121211]">
            {formatINR(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onInspectProduct(product)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#DDD8CE] hover:border-[#121211] bg-[#F5F2EB] text-[#121211] font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E03E1A]"
            aria-label={`Open technical dossier for ${product.name}`}
          >
            <Eye className="w-3 h-3" aria-hidden="true" />
            <span className="hidden xs:inline">Spec</span>
          </button>

          <button
            type="button"
            onClick={handleCollect}
            className={`inline-flex items-center gap-1 px-3 py-1.5 border font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E03E1A] ${justAdded
                ? 'bg-[#1D3557] border-[#1D3557] text-[#F5F2EB]'
                : 'border-[#121211] bg-[#121211] hover:bg-[#E03E1A] hover:border-[#E03E1A] text-[#F5F2EB]'
              }`}
            aria-label={`Add ${product.name} to collection`}
          >
            {justAdded ? (
              <>
                <Check className="w-3 h-3" aria-hidden="true" />
                <span>Collected</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" aria-hidden="true" />
                <span>Collect</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

/**
 * ProductGrid Component (src/components/ProductGrid.tsx)
 * Supports 4-Column Standard Grid, 3-Column Exhibition Gallery, and Architectural Spec Index View.
 */
interface ProductGridProps {
  products: readonly Product[];
  viewMode: ViewMode;
  compareIds: readonly string[];
  onToggleCompare: (productId: string) => void;
  onAddToBag: (productId: string) => void;
  onInspectProduct: (product: Product) => void;
  onFilterByCategory: (category: ProductCategory) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  compareIds,
  onToggleCompare,
  onAddToBag,
  onInspectProduct,
  onFilterByCategory,
}) => {
  if (viewMode === 'index') {
    return (
      <section
        aria-label="Architectural specification index"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8"
      >
        <div className="border border-[#DDD8CE] bg-[#F5F2EB] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD8CE] bg-[#ECE8DF] font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6A63]">
                <th className="py-3.5 px-4">Serial</th>
                <th className="py-3.5 px-4">Object &amp; Studio</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Category</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Material &amp; Dimensions</th>
                <th className="py-3.5 px-4 text-right">Price (INR)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8CE] text-sm">
              {products.map((product) => {
                const isCompared = compareIds.includes(product.id);
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-[#ECE8DF]/75 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-[#6E6A63] whitespace-nowrap">
                      {product.serialNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={product.image}
                          alt={product.alt}
                          onClick={() => onInspectProduct(product)}
                          className="w-11 h-14 object-cover border border-[#DDD8CE] bg-[#E5E0D5] shrink-0 cursor-pointer"
                        />
                        <div>
                          <div
                            onClick={() => onInspectProduct(product)}
                            className="font-serif text-lg text-[#121211] group-hover:text-[#E03E1A] transition-colors cursor-pointer"
                          >
                            {product.name}
                          </div>
                          <div className="font-mono text-[11px] text-[#6E6A63]">
                            {product.designerStudio} • {product.originCity}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <button
                        type="button"
                        onClick={() => onFilterByCategory(product.category)}
                        className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#ECE8DF] hover:bg-[#121211] text-[#44403C] hover:text-[#F5F2EB] border border-[#DDD8CE] transition-colors"
                      >
                        {product.category}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <div className="text-xs text-[#121211] line-clamp-1">{product.materialSpec}</div>
                      <div className="font-mono text-[11px] text-[#6E6A63]">
                        {product.dimensions} • {product.weight}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sm font-semibold text-[#121211] whitespace-nowrap">
                      {formatINR(product.price)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleCompare(product.id)}
                          aria-pressed={isCompared}
                          title="Compare object"
                          className={`p-1.5 border transition-colors ${isCompared
                              ? 'bg-[#121211] text-[#F5F2EB] border-[#121211]'
                              : 'bg-[#F5F2EB] text-[#6E6A63] border-[#DDD8CE] hover:border-[#121211]'
                            }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onInspectProduct(product)}
                          className="px-2.5 py-1 border border-[#DDD8CE] hover:border-[#121211] bg-[#F5F2EB] font-mono text-[10px] uppercase tracking-wider"
                        >
                          Dossier
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddToBag(product.id)}
                          className="px-2.5 py-1 bg-[#121211] hover:bg-[#E03E1A] text-[#F5F2EB] font-mono text-[10px] uppercase tracking-wider transition-colors"
                        >
                          + Collect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  const gridColumnsClass =
    viewMode === 'grid-3'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <section
      aria-label="Curated product catalog"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10"
    >
      <div className={`grid ${gridColumnsClass} border-t border-l border-[#DDD8CE]`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isCompared={compareIds.includes(product.id)}
            onToggleCompare={onToggleCompare}
            onAddToBag={onAddToBag}
            onInspectProduct={onInspectProduct}
            onFilterByCategory={onFilterByCategory}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * EmptyState Component (src/components/EmptyState.tsx)
 * Displays "Nothing in this collection.", explains active criteria, and offers Clear Filters.
 */
interface EmptyStateProps {
  searchQuery: string;
  selectedCategory: string;
  onClearFilters: () => void;
  onSelectCategory: (cat: ProductCategory | 'All Categories') => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  selectedCategory,
  onClearFilters,
  onSelectCategory,
}) => {
  return (
    <section
      aria-live="polite"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-24"
    >
      <div className="max-w-xl mx-auto border border-[#121211] bg-[#ECE8DF]/70 p-8 sm:p-12 text-center">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E03E1A] mb-3">
          <span>Archive Query // 00 Objects Found</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-[#121211] font-normal">
          Nothing in this collection.
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[#44403C] leading-relaxed">
          No products match the current criteria
          {searchQuery.trim() ? (
            <>
              {' '}
              for <span className="font-mono text-[#121211]">"{searchQuery.trim()}"</span>
            </>
          ) : null}
          {selectedCategory !== 'All Categories' ? (
            <>
              {' '}
              within <span className="font-mono text-[#121211]">{selectedCategory}</span>
            </>
          ) : null}
          . Clear your active search or department filter to restore the full archival index.
        </p>

        <div className="mt-7">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#121211] hover:bg-[#E03E1A] text-[#F5F2EB] font-mono text-xs uppercase tracking-[0.16em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E03E1A]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear Filters</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#DDD8CE]">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#6E6A63] mb-3">
            Or explore a specific discipline directly
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {(['Technology', 'Workspace', 'Accessories', 'Home'] as ProductCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onClearFilters();
                    onSelectCategory(cat);
                  }}
                  className="px-3 py-1 bg-[#F5F2EB] border border-[#DDD8CE] hover:border-[#121211] font-mono text-xs text-[#44403C] hover:text-[#121211] transition-colors"
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 6. RICH OBJECT DOSSIER MODAL (With Interactive Tabs & Companion Objects)
// ============================================================================

interface ObjectDossierModalProps {
  product: Product | null;
  isCompared: boolean;
  onToggleCompare: (productId: string) => void;
  onAddToBag: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
}

const ObjectDossierModal: React.FC<ObjectDossierModalProps> = ({
  product,
  isCompared,
  onToggleCompare,
  onAddToBag,
  onSelectProduct,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DossierTab>('overview');
  const [selectedSwatch, setSelectedSwatch] = useState<number>(0);

  useEffect(() => {
    setActiveTab('overview');
    setSelectedSwatch(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const companionObjects = PRODUCTS_DATA.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#121211]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#F5F2EB] border border-[#121211] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="px-5 sm:px-7 py-3.5 bg-[#121211] text-[#F5F2EB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em]">
            <span className="text-[#E03E1A] font-semibold">{product.serialNo}</span>
            <span>//</span>
            <span>Archival Specification Dossier</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close specification dossier"
            className="p-1 text-[#A09C94] hover:text-[#F5F2EB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Image Column */}
            <div className="md:col-span-5 bg-[#E5E0D5] border-b md:border-b-0 md:border-r border-[#DDD8CE] flex flex-col justify-between">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#121211]/90 text-[#F5F2EB] font-mono text-[10px] uppercase tracking-widest px-2.5 py-1">
                  {product.originCity}
                </div>
              </div>

              {/* Swatch Bar */}
              <div className="p-4 bg-[#ECE8DF] border-t border-[#DDD8CE]">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] mb-2">
                  Finish:{' '}
                  <strong className="text-[#121211]">
                    {product.swatches[selectedSwatch]?.name} (
                    {product.swatches[selectedSwatch]?.finish})
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  {product.swatches.map((sw, idx) => (
                    <button
                      key={sw.name}
                      type="button"
                      onClick={() => setSelectedSwatch(idx)}
                      className={`w-6 h-6 rounded-full border ${selectedSwatch === idx
                          ? 'ring-2 ring-[#E03E1A] ring-offset-2 ring-offset-[#ECE8DF] border-[#121211]'
                          : 'border-[#8C867B]'
                        }`}
                      style={{ backgroundColor: sw.hex }}
                      aria-label={sw.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Specification Column */}
            <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] px-2.5 py-0.5 bg-[#ECE8DF] border border-[#DDD8CE] text-[#44403C]">
                    {product.category} — {product.editorialDiscipline}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#E03E1A]">
                    {product.editionStatus}
                  </span>
                </div>

                <h2
                  id="dossier-modal-title"
                  className="font-serif text-2xl sm:text-3xl text-[#121211] font-normal"
                >
                  {product.name}
                </h2>
                <p className="font-mono text-xs text-[#6E6A63] mt-1">{product.subtitle}</p>

                {/* Interactive Dossier Tabs */}
                <div className="mt-5 flex border-b border-[#DDD8CE] font-mono text-[11px] uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`px-3.5 py-2 border-b-2 transition-colors ${activeTab === 'overview'
                        ? 'border-[#E03E1A] text-[#121211] font-semibold'
                        : 'border-transparent text-[#6E6A63] hover:text-[#121211]'
                      }`}
                  >
                    01. Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('blueprint')}
                    className={`px-3.5 py-2 border-b-2 transition-colors ${activeTab === 'blueprint'
                        ? 'border-[#E03E1A] text-[#121211] font-semibold'
                        : 'border-transparent text-[#6E6A63] hover:text-[#121211]'
                      }`}
                  >
                    02. Blueprint &amp; Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('provenance')}
                    className={`px-3.5 py-2 border-b-2 transition-colors ${activeTab === 'provenance'
                        ? 'border-[#E03E1A] text-[#121211] font-semibold'
                        : 'border-transparent text-[#6E6A63] hover:text-[#121211]'
                      }`}
                  >
                    03. Care &amp; Guarantee
                  </button>
                </div>

                {/* Tab Content Panels */}
                <div className="mt-4">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-[#44403C]">
                        {product.description}
                      </p>
                      <div className="p-3.5 bg-[#ECE8DF]/80 border-l-2 border-[#E03E1A] text-xs text-[#44403C] leading-relaxed">
                        <strong className="font-mono uppercase text-[10px] tracking-wider text-[#121211] block mb-1">
                          Architectural Note
                        </strong>
                        {product.architecturalNotes}
                      </div>
                    </div>
                  )}

                  {activeTab === 'blueprint' && (
                    <dl className="divide-y divide-[#DDD8CE] font-mono text-xs">
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E6A63] uppercase">Materials</dt>
                        <dd className="text-[#121211] text-right">{product.materialSpec}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E6A63] uppercase">Dimensions</dt>
                        <dd className="text-[#121211] text-right">{product.dimensions}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E6A63] uppercase">Mass / Weight</dt>
                        <dd className="text-[#121211] text-right">{product.weight}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E6A63] uppercase">Studio &amp; Origin</dt>
                        <dd className="text-[#121211] text-right">
                          {product.designerStudio} ({product.originCity})
                        </dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-4">
                        <dt className="text-[#6E6A63] uppercase">Release Year</dt>
                        <dd className="text-[#121211] text-right">{product.editionYear}</dd>
                      </div>
                    </dl>
                  )}

                  {activeTab === 'provenance' && (
                    <div className="space-y-3 text-xs leading-relaxed text-[#44403C]">
                      <div className="p-3.5 border border-[#DDD8CE] bg-[#ECE8DF]/50">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[#121211] font-semibold mb-1">
                          Preservation &amp; Care Protocol
                        </div>
                        <p>{product.careInstructions}</p>
                      </div>
                      <div className="p-3.5 border border-[#DDD8CE] bg-[#ECE8DF]/50">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[#1D3557] font-semibold mb-1">
                          Warranty &amp; Repairability
                        </div>
                        <p>
                          {product.warranty}. Modular replacement components are stocked in our
                          Zurich and Tokyo depots for a minimum of 15 years.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Bottom Action Bar */}
              <div className="pt-4 border-t border-[#DDD8CE] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6E6A63]">
                    Archive Price (INR)
                  </span>
                  <span className="font-mono text-2xl font-semibold text-[#121211]">
                    {formatINR(product.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleCompare(product.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 border font-mono text-xs uppercase tracking-wider transition-colors ${isCompared
                        ? 'bg-[#1D3557] text-[#F5F2EB] border-[#1D3557]'
                        : 'border-[#121211] bg-[#F5F2EB] text-[#121211] hover:bg-[#ECE8DF]'
                      }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onAddToBag(product.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121211] hover:bg-[#E03E1A] text-[#F5F2EB] font-mono text-xs uppercase tracking-widest transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Collection</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Companion Objects in the Same Category */}
          {companionObjects.length > 0 && (
            <div className="px-5 sm:px-7 py-5 bg-[#ECE8DF] border-t border-[#DDD8CE]">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6E6A63] mb-3">
                Companion Objects in {product.category}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {companionObjects.map((comp) => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => onSelectProduct(comp)}
                    className="flex items-center gap-3 p-2.5 bg-[#F5F2EB] border border-[#DDD8CE] hover:border-[#121211] text-left transition-colors"
                  >
                    <img
                      src={comp.image}
                      alt={comp.alt}
                      className="w-11 h-14 object-cover bg-[#E5E0D5] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] text-[#6E6A63]">{comp.serialNo}</div>
                      <div className="font-serif text-base text-[#121211] truncate">
                        {comp.name}
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#E03E1A]">
                        {formatINR(comp.price)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. SIDE-BY-SIDE ARCHITECTURAL COMPARISON SHEET MODAL
// ============================================================================

interface CompareModalProps {
  isOpen: boolean;
  compareIds: readonly string[];
  onRemoveCompare: (id: string) => void;
  onClearCompare: () => void;
  onInspectProduct: (product: Product) => void;
  onAddToBag: (productId: string) => void;
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  compareIds,
  onRemoveCompare,
  onClearCompare,
  onInspectProduct,
  onAddToBag,
  onClose,
}) => {
  if (!isOpen) return null;

  const comparedProducts = PRODUCTS_DATA.filter((p) => compareIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#121211]/70 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Object Specification Comparison Matrix"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[#F5F2EB] border border-[#121211] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#121211] text-[#F5F2EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em]">
            <Scale className="w-4 h-4 text-[#E03E1A]" />
            <span>Side-by-Side Specification Matrix ({comparedProducts.length} of 3 Objects)</span>
          </div>
          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                type="button"
                onClick={onClearCompare}
                className="font-mono text-[10px] uppercase tracking-wider text-[#A09C94] hover:text-[#F5F2EB] underline"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close comparison matrix"
              className="p-1 text-[#A09C94] hover:text-[#F5F2EB]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-14 space-y-3">
              <p className="font-serif text-2xl text-[#121211]">
                No objects selected for comparison.
              </p>
              <p className="text-xs text-[#6E6A63] max-w-md mx-auto leading-relaxed">
                Click the scale icon on up to 3 product cards in the catalog to compare their
                dimensions, alloys, origins, and INR valuations side by side.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedProducts.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#DDD8CE] bg-[#ECE8DF]/50 p-4 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#6E6A63] mb-2">
                      <span>{item.serialNo}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveCompare(item.id)}
                        className="text-[#6E6A63] hover:text-[#E03E1A]"
                        aria-label={`Remove ${item.name} from comparison`}
                      >
                        Remove ×
                      </button>
                    </div>

                    <img
                      src={item.image}
                      alt={item.alt}
                      onClick={() => {
                        onClose();
                        onInspectProduct(item);
                      }}
                      className="w-full h-44 object-cover border border-[#DDD8CE] mb-3 cursor-pointer"
                    />

                    <h3 className="font-serif text-xl text-[#121211]">{item.name}</h3>
                    <div className="font-mono text-sm font-semibold text-[#E03E1A] mt-1">
                      {formatINR(item.price)}
                    </div>

                    <dl className="mt-4 pt-3 border-t border-[#DDD8CE] space-y-2 font-mono text-[11px]">
                      <div>
                        <dt className="text-[#6E6A63] uppercase text-[9px]">Department</dt>
                        <dd className="text-[#121211]">{item.category}</dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6A63] uppercase text-[9px]">Origin &amp; Studio</dt>
                        <dd className="text-[#121211]">
                          {item.designerStudio} — {item.originCity}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6A63] uppercase text-[9px]">Dimensions &amp; Mass</dt>
                        <dd className="text-[#121211]">
                          {item.dimensions} ({item.weight})
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6A63] uppercase text-[9px]">Material Spec</dt>
                        <dd className="text-[#121211] leading-snug">{item.materialSpec}</dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6A63] uppercase text-[9px]">Guarantee</dt>
                        <dd className="text-[#121211]">{item.warranty}</dd>
                      </div>
                    </dl>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToBag(item.id)}
                    className="w-full py-2 bg-[#121211] hover:bg-[#E03E1A] text-[#F5F2EB] font-mono text-[11px] uppercase tracking-wider transition-colors"
                  >
                    + Collect Object
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 8. CURATED COLLECTION DRAWER (Shortlist / Acquisition Bag with Spec Copy)
// ============================================================================

interface CuratedBagDrawerProps {
  isOpen: boolean;
  curatedItems: readonly CuratedItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearBag: () => void;
  onInspectProduct: (product: Product) => void;
  onClose: () => void;
}

const CuratedBagDrawer: React.FC<CuratedBagDrawerProps> = ({
  isOpen,
  curatedItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
  onInspectProduct,
  onClose,
}) => {
  const [copiedSpec, setCopiedSpec] = useState(false);

  if (!isOpen) return null;

  const detailedItems = curatedItems
    .map((entry) => {
      const product = PRODUCTS_DATA.find((p) => p.id === entry.productId);
      return product ? { product, quantity: entry.quantity } : null;
    })
    .filter((x): x is { product: Product; quantity: number } => x !== null);

  const totalAmount = detailedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCopySpecSheet = () => {
    const lines = [
      'VORM // MONOGRAPH — CURATED ACQUISITION SCHEDULE',
      '================================================',
      ...detailedItems.map(
        ({ product, quantity }) =>
          `${product.serialNo} | ${product.name} (×${quantity}) — ${formatINR(
            product.price * quantity
          )} [${product.originCity}]`
      ),
      '------------------------------------------------',
      `TOTAL ARCHIVE VALUATION: ${formatINR(totalAmount)}`
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#121211]/65 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Curated Collection Drawer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#F5F2EB] border-l border-[#121211] h-full flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#121211] text-[#F5F2EB] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em]">
            <ShoppingBag className="w-3.5 h-3.5 text-[#E03E1A]" />
            <span>Curated Collection ({detailedItems.length})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close collection drawer"
            className="p-1 text-[#A09C94] hover:text-[#F5F2EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {detailedItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="font-serif text-2xl text-[#121211]">Your collection is empty.</p>
              <p className="text-xs text-[#6E6A63] max-w-xs mx-auto leading-relaxed">
                Select &ldquo;+ Collect&rdquo; on any object in the monograph to assemble a personal
                specification schedule.
              </p>
            </div>
          ) : (
            detailedItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-3.5 bg-[#ECE8DF]/70 border border-[#DDD8CE] flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onClose();
                    onInspectProduct(product);
                  }}
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-12 h-16 object-cover border border-[#DDD8CE] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] text-[#6E6A63]">
                      {product.serialNo} • {product.category}
                    </div>
                    <div className="font-serif text-base text-[#121211] truncate">
                      {product.name}
                    </div>
                    <div className="font-mono text-xs font-semibold text-[#121211]">
                      {formatINR(product.price * quantity)}
                    </div>
                  </div>
                </div>

                {/* Quantity & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="text-[#6E6A63] hover:text-[#E03E1A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="inline-flex items-center border border-[#DDD8CE] bg-[#F5F2EB] font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      aria-label="Decrease quantity"
                      className="px-2 py-0.5 hover:bg-[#ECE8DF]"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="px-2 py-0.5">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      aria-label="Increase quantity"
                      className="px-2 py-0.5 hover:bg-[#ECE8DF]"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {detailedItems.length > 0 && (
          <div className="p-6 bg-[#ECE8DF] border-t border-[#DDD8CE] space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="uppercase text-[#6E6A63]">Total Valuation (INR)</span>
              <span className="text-lg font-semibold text-[#121211]">
                {formatINR(totalAmount)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopySpecSheet}
              className="w-full py-2.5 bg-[#121211] hover:bg-[#E03E1A] text-[#F5F2EB] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              {copiedSpec ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Spec Schedule Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Export / Copy Spec Schedule</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onClearBag}
                className="font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] hover:text-[#E03E1A] underline"
              >
                Empty Collection
              </button>
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-[10px] uppercase tracking-wider text-[#121211] hover:text-[#E03E1A]"
              >
                Continue Exploring →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 9. EDITORIAL FOOTER (src/components/Footer.tsx)
// ============================================================================

interface FooterProps {
  onSelectCategory: (cat: ProductCategory | 'All Categories') => void;
  onResetAll: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSelectCategory, onResetAll }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#DDD8CE] bg-[#ECE8DF] text-[#44403C] mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#DDD8CE]">
          {/* Col 1: Brand & Editorial Sign-Off */}
          <div className="md:col-span-5 space-y-3">
            <div className="font-mono text-base font-semibold tracking-[0.18em] text-[#121211]">
              VORM <span className="text-[#E03E1A]">//</span> MONOGRAPH
            </div>
            <p className="font-serif italic text-xl text-[#121211]">
              &ldquo;Tactile permanence. Objects engineered to outlive their era.&rdquo;
            </p>
            <p className="text-xs text-[#6E6A63] max-w-md leading-relaxed">
              An independent industrial design archive and curatorial house. Every piece in the
              permanent collection is vetted for repairability, honest alloy composition, and
              timeless utility.
            </p>
          </div>

          {/* Col 2: Curated Departments */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#121211] font-semibold">
              Archive Disciplines
            </div>
            <ul className="space-y-1.5 font-mono text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#6E6A63] hover:text-[#E03E1A] transition-colors"
                  >
                    {cat === 'All Categories' ? '00 / Complete Archive' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Curatorial Houses & Provenance */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#121211] font-semibold">
              Archival Bureaus
            </div>
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px] text-[#6E6A63]">
              <div>
                <strong className="text-[#121211] block">ZURICH STUDIO</strong>
                Talstrasse 82, 8001 Zürich
              </div>
              <div>
                <strong className="text-[#121211] block">TOKYO DEPOT</strong>
                Jingumae, Shibuya-ku
              </div>
              <div>
                <strong className="text-[#121211] block">STOCKHOLM LAB</strong>
                Södermalm Acoustic Wing
              </div>
              <div>
                <strong className="text-[#121211] block">SABAE GUILD</strong>
                Fukui Optical District
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Colophon */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E6A63]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {currentYear} VORM // MONOGRAPH ARCHIVE. ALL RIGHTS RESERVED.</span>
            <span className="text-[#A5A096] hidden sm:inline">/</span>
            <span>
              BUILT BY <span className="text-[#121211] font-semibold text-[#E03E1A]">PULIND GADHIA</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onResetAll();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[#121211] hover:text-[#E03E1A] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// 10. MAIN APPLICATION COMPONENT (src/App.tsx)
// ============================================================================

const BAG_STORAGE_KEY = 'vorm_monograph_collection_v1';

export function App() {
  // Primary Discovery State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All Categories'>(
    'All Categories'
  );
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid-4');

  // Interactive Modals & Drawers
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);

  // Curated Collection Bag (Persisted in localStorage)
  const [curatedItems, setCuratedItems] = useState<CuratedItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(BAG_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
          { productId: 'vorm-001', quantity: 1 },
          { productId: 'vorm-006', quantity: 1 }
        ];
    } catch {
      return [{ productId: 'vorm-001', quantity: 1 }];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(curatedItems));
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [curatedItems]);

  // Compute live item counts per department
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Categories': PRODUCTS_DATA.length,
    };
    for (const product of PRODUCTS_DATA) {
      counts[product.category] = (counts[product.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Derive visible products from active search, category, and price sort controls
  const visibleProducts = useMemo(
    () => deriveVisibleProducts(PRODUCTS_DATA, searchQuery, selectedCategory, sortBy),
    [searchQuery, selectedCategory, sortBy]
  );

  // Featured Spotlight Objects for the Hero Carousel
  const spotlightProducts = useMemo(
    () => PRODUCTS_DATA.slice(0, 3),
    []
  );

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Categories' ||
    sortBy !== 'default';

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSortBy('default');
  }, []);

  // Compare up to 3 objects
  const handleToggleCompare = useCallback((productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  }, []);

  // Add object to Curated Collection Bag
  const handleAddToBag = useCallback((productId: string) => {
    setCuratedItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const handleUpdateBagQuantity = useCallback((productId: string, delta: number) => {
    setCuratedItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveBagItem = useCallback((productId: string) => {
    setCuratedItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col bg-[#F5F2EB] text-[#121211] selection:bg-[#E03E1A] selection:text-[#F5F2EB]"
    >
      {/* Swiss & Editorial Typography + Plain CSS Architecture */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --font-serif: 'Instrument Serif', Georgia, serif;
          --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        body {
          font-family: var(--font-sans);
          background-color: #F5F2EB;
          color: #121211;
          overflow-x: hidden;
        }

        .font-serif {
          font-family: var(--font-serif);
        }

        .font-mono {
          font-family: var(--font-mono);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.18s ease-out forwards;
        }
      `}</style>

      {/* 1. Editorial Header */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        compareIds={compareIds}
        onOpenCompare={() => setIsCompareOpen(true)}
        curatedItems={curatedItems}
        onOpenBag={() => setIsBagOpen(true)}
        onResetAll={handleClearFilters}
      />

      {/* 2. Asymmetric Hero with Interactive Exhibition Spotlight Carousel */}
      <EditorialHero
        spotlightProducts={spotlightProducts}
        onInspectProduct={(p) => setInspectedProduct(p)}
        onAddToBag={handleAddToBag}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* 3. Sticky Discovery Toolbar (Live Search, Category Filter, Price Sort, View Switcher) */}
      <DiscoveryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={visibleProducts.length}
        totalCount={PRODUCTS_DATA.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Product Catalog Grid / Spec Index or Empty State */}
      <main className="flex-1">
        {visibleProducts.length > 0 ? (
          <ProductGrid
            products={visibleProducts}
            viewMode={viewMode}
            compareIds={compareIds}
            onToggleCompare={handleToggleCompare}
            onAddToBag={handleAddToBag}
            onInspectProduct={(product) => setInspectedProduct(product)}
            onFilterByCategory={(cat) => setSelectedCategory(cat)}
          />
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFilters={handleClearFilters}
            onSelectCategory={setSelectedCategory}
          />
        )}
      </main>

      {/* Floating Compare Dock when objects are selected for side-by-side comparison */}
      {compareIds.length > 0 && !isCompareOpen && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 z-30 bg-[#121211] text-[#F5F2EB] border border-[#E03E1A] px-4 py-3 shadow-2xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <Scale className="w-4 h-4 text-[#E03E1A]" />
            <span>
              <strong>{compareIds.length}</strong> / 3 Objects in Comparison Matrix
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="px-2 py-1 font-mono text-[10px] uppercase text-[#A09C94] hover:text-[#F5F2EB]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="px-3 py-1.5 bg-[#E03E1A] text-[#F5F2EB] font-mono text-[10px] uppercase tracking-wider font-semibold"
            >
              Open Matrix ↗
            </button>
          </div>
        </div>
      )}

      {/* 5. Editorial Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onResetAll={handleClearFilters}
      />

      {/* 6. Deep-Dive Object Specification Dossier Modal */}
      <ObjectDossierModal
        product={inspectedProduct}
        isCompared={inspectedProduct ? compareIds.includes(inspectedProduct.id) : false}
        onToggleCompare={handleToggleCompare}
        onAddToBag={handleAddToBag}
        onSelectProduct={(p) => setInspectedProduct(p)}
        onClose={() => setInspectedProduct(null)}
      />

      {/* 7. Side-by-Side Comparison Matrix Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        compareIds={compareIds}
        onRemoveCompare={handleToggleCompare}
        onClearCompare={() => setCompareIds([])}
        onInspectProduct={(p) => setInspectedProduct(p)}
        onAddToBag={handleAddToBag}
        onClose={() => setIsCompareOpen(false)}
      />

      {/* 8. Curated Collection Bag Drawer */}
      <CuratedBagDrawer
        isOpen={isBagOpen}
        curatedItems={curatedItems}
        onUpdateQuantity={handleUpdateBagQuantity}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={() => setCuratedItems([])}
        onInspectProduct={(p) => setInspectedProduct(p)}
        onClose={() => setIsBagOpen(false)}
      />
    </div>
  );
}

export default App;