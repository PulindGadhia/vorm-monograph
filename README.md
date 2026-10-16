<div align="center">

# VORM // MONOGRAPH

### Industrial Design Archive & Curated Storefront

_"Tactile permanence. Objects engineered to outlive their era."_

[![Built With](https://img.shields.io/badge/Built_With-React_19_+_TypeScript-blue?style=flat-square)](#tech-stack)
[![Styled With](https://img.shields.io/badge/Styled_With-Tailwind_CSS_4-38bdf8?style=flat-square)](#tech-stack)
[![Bundler](https://img.shields.io/badge/Bundler-Vite_8-646CFF?style=flat-square)](#tech-stack)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](#license)

</div>

---

## 📖 About

**VORM // MONOGRAPH** is a premium, editorial-grade product exploration web application — a curated archive of **14 industrial design objects** spanning technology, workspace tools, accessories, and home goods. The interface draws inspiration from Swiss typographic design, architectural monograph layouts, and high-end gallery storefronts.

Every product in the archive is presented with rich specification dossiers, material swatches, provenance details, and architectural notes — going far beyond a standard product grid.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Hero Spotlight Carousel** | Auto-cycling editorial showcase of featured objects with parallax imagery |
| **Live Search & Filtering** | Instant fuzzy search across names, categories, materials, and studios |
| **Category Navigation** | Filter by department — Technology, Workspace, Accessories, Home |
| **Price Sorting** | Sort catalog by price ascending or descending |
| **Multi-View Modes** | Switch between 4-column grid, 3-column grid, and specification index views |
| **Product Dossier Modal** | Deep-dive panel with Overview, Blueprint (specs), and Provenance tabs |
| **Companion Objects** | Related product suggestions within each dossier |
| **Side-by-Side Comparison** | Compare up to 3 products across all specification dimensions |
| **Curated Collection Bag** | Persistent shopping bag with quantity controls (localStorage backed) |
| **Spec Copy to Clipboard** | One-click copy of full product specifications |
| **Material Swatches** | Interactive color/finish swatches per product |
| **Responsive Design** | Fully adaptive from mobile to ultrawide displays |
| **Custom Typography** | Instrument Serif, Plus Jakarta Sans, JetBrains Mono (Google Fonts) |
| **INR Currency** | All prices formatted in Indian Rupees (₹) with locale formatting |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Runtime** | Node.js | v26.7.0 |
| **Package Manager** | npm | v11.19.0 |
| **Framework** | React | ^19.2.8 |
| **Language** | TypeScript | ~6.0.2 |
| **Bundler** | Vite | ^8.3.0 |
| **Styling** | Tailwind CSS (via Vite plugin) | ^4.3.3 |
| **Icons** | Lucide React | ^1.58.0 |
| **Linting** | OxLint | ^1.81.0 |

---

## 📁 Project Structure

```
vorm-monograph/
│
├── public/                          # Static assets served at root
│   ├── favicon.png                  # Browser tab icon (custom logo)
│   └── icons.svg                    # SVG icon sprite
│
├── src/                             # Application source code
│   ├── assets/                      # Bundled static assets
│   │   ├── hero.png                 # Hero section imagery
│   │   ├── react.svg                # React logo asset
│   │   └── vite.svg                 # Vite logo asset
│   │
│   ├── App.tsx                      # 🏗️  Main application (all components & data)
│   │   ├── Types & Interfaces       # ProductCategory, Product, CuratedItem, FilterState
│   │   ├── Currency Formatter       # INR ₹ locale formatting utility
│   │   ├── Product Data (×14)       # Full catalog with specs, swatches, provenance
│   │   ├── Filter & Sort Engine     # Pure functional filtering/sorting logic
│   │   ├── Header                   # Sticky nav with department links & utilities
│   │   ├── EditorialHero            # Spotlight carousel with category cards
│   │   ├── DiscoveryToolbar         # Search, filter, sort, view mode controls
│   │   ├── ProductGrid              # Responsive grid/index catalog renderer
│   │   ├── ObjectDossierModal       # Tabbed product deep-dive (Overview/Blueprint/Provenance)
│   │   ├── CompareModal             # Side-by-side comparison matrix (up to 3)
│   │   ├── CuratedBagDrawer         # Shopping bag slide-out with quantity management
│   │   ├── Footer                   # Editorial footer with studio locations
│   │   └── App (main)               # Root component orchestrating all state & modals
│   │
│   ├── App.css                      # Component-specific styles (if any)
│   ├── index.css                    # Tailwind CSS entry point (@import "tailwindcss")
│   └── main.tsx                     # Application entry — React DOM root mount
│
├── index.html                       # HTML shell with favicon, meta tags & module entry
├── package.json                     # Dependencies, scripts, and project metadata
├── package-lock.json                # Locked dependency tree
├── vite.config.ts                   # Vite config — React plugin + Tailwind CSS plugin
├── tsconfig.json                    # Root TypeScript config (project references)
├── tsconfig.app.json                # App-specific TS config (ES2023, React JSX, bundler mode)
├── tsconfig.node.json               # Node-specific TS config (for vite.config.ts)
├── .oxlintrc.json                   # OxLint configuration
├── .gitignore                       # Git ignore rules
└── README.md                        # 📄 You are here
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 18.x (recommended: v26+)
- **npm** ≥ 9.x

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd vorm-monograph
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**

   Navigate to the URL shown in terminal (typically `http://localhost:5173/`)

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR (Hot Module Replacement) |
| `npm run build` | Type-check with `tsc` and build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run OxLint for code quality checks |

---

## 🏗️ Architecture Overview

### Single-File Component Architecture

The entire application is authored in a single, well-organized [`App.tsx`](src/App.tsx) file (~2,843 lines) structured into **10 clearly demarcated sections**:

| # | Section | Lines | Purpose |
|---|---|---|---|
| 1 | TypeScript Interfaces | 26–78 | Strict type definitions for Product, Filter, View modes |
| 2 | Currency Formatter | 80–92 | INR (₹) Intl.NumberFormat utility |
| 3 | Product Data Archive | 94–553 | 14 curated product objects with full specifications |
| 4 | Filter & Sort Engine | 555–587 | Pure functions for search, category, and price sorting |
| 5 | Reusable Components | 589–1,761 | Header, Hero, Toolbar, ProductGrid, EmptyState |
| 6 | Object Dossier Modal | 1,762–2,075 | Tabbed product detail panel |
| 7 | Comparison Matrix | 2,076–2,231 | Side-by-side spec comparison (up to 3 products) |
| 8 | Curated Bag Drawer | 2,232–2,443 | Collection/cart management with localStorage |
| 9 | Editorial Footer | 2,444–2,547 | Footer with studio locations and credits |
| 10 | Main App Component | 2,549–2,843 | State management, derived data, and layout composition |

### State Management

- **React `useState`** for all UI state (search, filters, modals, bag)
- **`useMemo`** for derived/computed data (visible products, category counts)
- **`useCallback`** for stable handler references
- **`localStorage`** for persisting the curated collection bag across sessions

### Styling Strategy

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin for utility-first styling
- **Inline `<style>` block** for custom font declarations and CSS animations
- **Google Fonts**: Instrument Serif (editorial), Plus Jakarta Sans (body), JetBrains Mono (data/code)
- **Design Tokens**: Warm parchment `#F5F2EB`, vermilion accent `#E03E1A`, near-black `#121211`

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Parchment | `#F5F2EB` | Primary background |
| Near Black | `#121211` | Primary text, dark UI |
| Vermilion | `#E03E1A` | Accent, CTAs, interactive highlights |
| Warm Stone | `#DDD8CE` | Borders, dividers |
| Muted Sage | `#6E6A63` | Secondary text, metadata |
| Soft Taupe | `#A09C94` | Tertiary text, hints |

### Typography

| Font | Role | Weight(s) |
|---|---|---|
| **Instrument Serif** | Editorial headlines, quotes | 400, italic |
| **Plus Jakarta Sans** | Body text, UI labels | 400, 500, 600, 700 |
| **JetBrains Mono** | Serial numbers, specs, navigation | 400, 500, 600 |

---

## 📦 Product Catalog

The archive contains **14 curated objects** across 4 departments:

| Dept | # | Objects |
|---|---|---|
| **Technology** | 3 | TP-7 Field Audio Recorder, KBD-65 Mechanical Console, Acoustic Monolith Speaker |
| **Workspace** | 4 | Type-01 Task Lamp, Solid Brass Pen, Felt & Oak Desk Tray, Folded Steel Bookends |
| **Accessories** | 3 | Chronograph 38mm, Canvas Weekender Tote, Optical Acetate Frame |
| **Home** | 4 | Hasami Pour-Over Carafe, Nanbu Tekki Kettle, Bimetallic Hygrometer, Baltic Linen Throw |

Each product includes: serial number, subtitle, price (INR), origin city, designer/studio, material spec, dimensions, weight, warranty, edition status, material swatches, description, care instructions, and architectural notes.

---

## 🌐 Browser Support

- Chrome / Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 16+
- Mobile Safari & Chrome (iOS / Android)

---

## 📱 Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `< 640px` | Single-column, compact cards, collapsed navigation |
| `640px – 1024px` | 2-column grid, condensed toolbar |
| `1024px – 1280px` | 3-column grid, full toolbar |
| `> 1280px` | 4-column grid, expanded desktop navigation |

---

## 🔧 Configuration Files

| File | Purpose |
|---|---|
| [`vite.config.ts`](vite.config.ts) | Vite bundler config with React + Tailwind CSS plugins |
| [`tsconfig.json`](tsconfig.json) | Root TS config with project references |
| [`tsconfig.app.json`](tsconfig.app.json) | App TS config — ES2023 target, React JSX, bundler resolution |
| [`tsconfig.node.json`](tsconfig.node.json) | Node TS config — for Vite config file |
| [`.oxlintrc.json`](.oxlintrc.json) | OxLint linter configuration |
| [`.gitignore`](.gitignore) | Git ignore rules (node_modules, dist, logs, editor files) |

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This outputs a fully optimized static bundle to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Hosting

The `dist/` folder can be deployed to any static hosting provider:

- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag & drop `dist/` or connect Git
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **AWS S3 + CloudFront**: Upload `dist/` to S3 bucket

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is **private** and not licensed for redistribution.

---

<div align="center">

### Built by **Pulind Gadhia**

_VORM // MONOGRAPH — Archive Edition 04 • Index of Tactile Permanence_

**ZURICH / TOKYO / STOCKHOLM**

</div>
