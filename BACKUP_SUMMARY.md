# SwiftOrbits USA Marketplace & Merchant ERP — Complete A to Z Project Backup

**Backup Timestamp:** 2026-10-04 13:25 (PKT)  
**Workspace Root:** `c:\Users\ZC\OneDrive\Desktop\Swiftorbits\`  
**Active Servers:**  
- **Storefront:** [http://localhost:5173/](http://localhost:5173/)
- **Backend API & Merchant Portal:** [http://localhost:4000/admin](http://localhost:4000/admin)

---

## 🌟 Latest Update: Kitchen & Appliances Priority, 10s Hero Real Product Rotation, Admin Portal Rotator Controls & Dark Midnight Navy Strips (2026-10-04 13:25 PKT)
- **1. Kitchen & Appliances Priority Across Entire Storefront:**
  - Placed **"Kitchen & Appliances"** as category #1 in top subnav, sidebar filter lists, and hero category showcase cards.
  - On initial site load, while "All Deals" remains active in the top navbar, the storefront defaults directly to displaying "Kitchen & Appliances" category products.
- **2. Clean Header & Midnight Navy (#08094A) Theming:**
  - Removed "Today's Deals" title wrap and subnav button as requested.
  - Darkened top utility bar (`#02031f`), main search header (`#050638`), and subnav strip (`#0b0e4e`) using high-contrast deep midnight navy styling.
- **3. Real Product Auto-Rotation on 4 Hero Showcase Cards (10s Default):**
  - All 4 quadrant cards (`Kitchen & Appliances`, `Electronics`, `Beauty Picks`, `Health & Household`) cycle 100% authentic database products.
  - Smooth visual transition effects (blur exit, pop-in, badge bounce, fade-in).
  - Hover pause (`mouseenter` / `mouseleave`) allows customers to inspect or click any rotating item to open product details without rush.
  - Rotation cycle set to 10 seconds default.
- **4. Admin Portal Rotator Speed & Display Controls (Kam / Ziada System):**
  - **New Admin Tab & Stat Card:** Added `⚙️ Hero Showcase & Display Settings` in both the storefront SPA Merchant Portal (`#view-admin`) and backend ERP dashboard (`http://localhost:4000/admin`).
  - **Stepper Buttons (Kam / Ziada):** Dedicated `-5s`, `-1s`, `+1s`, and `+5s` buttons to fine-tune rotation speed.
  - **Interactive Slider:** Smooth drag slider from 1s to 60s with instant visual indicator.
  - **Custom Number Input:** Type any duration (1 to 300 seconds).
  - **1-Click Presets:** 2s, 3s, 5s, 10s (Default), 15s, 20s, 30s.
  - **Auto-Rotation Toggle:** Enable or Pause auto-rotation on demand.
  - **PostgreSQL Settings Persistence & Realtime Socket Sync:** Created `site_settings` table, `/api/settings` REST endpoints (GET / POST), and `settings:updated` Socket.IO broadcast for instant, cross-tab synchronization.
- **5. Production Build:**
  - Compiled clean with `vite build` to `dist/` with zero errors.

---
- **100% Real-Time Product & Image Synchronization:**
  - Synchronized all 162 catalog products across the PostgreSQL database, `backend/uploads`, `public/uploads`, and `SWIFT_SEED_PRODUCTS` in `src/main.js`.
  - Replaced all legacy duplicate placeholder images (`/air_fryer.png`, `/niacinamide_serum.png`, etc.) with authentic, distinct product photographs for every brand:
    - **Apple:** Apple Watch Ultra 2 (`/apple_watch_ultra_2.jpg`), AirPods Pro 2, 20W Fast Charger, MagSafe Pad.
    - **Royal Oud:** Authentic Eau De Parfum Spray 100ml (`/royal_oud.png`), Amber Attar Oil, Velvet Rose Mist, Heritage Extract.
    - **Ninja:** AF101 Air Fryer (`/air_fryer.png`), Fit Blender, Foodi 8-in-1 Oven, Express Chop Chopper.
    - **Dash, Hamilton Beach, Black+Decker, Sony, Anker, Logitech, CeraVe, Neutrogena, La Roche-Posay, Stanley, Levoit, Nutricost, OXO:** All mapped to unique high-res product photos from `uploads/`.
  - Added dynamic real-time sync function `renderHeroQuadShowcase()` in `src/main.js` that pulls live images and details directly from `this.products`.
- **Eliminated Fake "Active Tab" Outlines:**
  - Removed persistent blue border and glow (`.bream-quad-card.active-card`) from `src/style.css` and `src/main.js`.
  - All 4 showcase cards now remain strictly uniform, clean, and elegant without looking like a clicked or selected tab.
- **Direct Brand Landing & Pulse Highlight Animation:**
  - Clicking any brand tile (e.g. Apple, Sony, CeraVe, Ninja, Dash, Stanley) immediately filters both category and brand, updates the department and page title (e.g. `Dash Collection (8 Products & Images)`), and smoothly lands directly right onto the catalog grid.
  - Added modern `brand-landing-pulse` glow animation so users clearly see their selected brand's collection.
- **Brand Image Gallery in Product Detail Modal:**
  - Added an interactive thumbnail gallery `#modal-brand-gallery` inside the Product Detail & Checkout Modal.
  - Displays all other products and models from the same brand as clickable thumbnails, allowing instant image inspection and product switching directly inside the modal.
- **Production Build:**
  - Freshly compiled with `vite build` to `dist/` with 0 errors.

---

## 🌟 Previous Update: Amazon-Style 4-Quadrant Category Showcase & Brand Integration (2026-10-03)
- **Amazon 4-Quadrant Brand Category Cards:**
  - Integrated 4 uniform cards side-by-side matching the exact user reference design (`media_1791044552918.png`):
    1. **Electronics:** Title *"Plug in with our electronics ›"*, featuring real products for **Apple**, **Sony**, **Anker**, and **Logitech**.
    2. **Beauty & Personal Care:** Title *"Shop all things beauty ›"*, featuring real products for **CeraVe**, **Neutrogena**, **La Roche-Posay**, and **Royal Oud**.
    3. **Kitchen & Appliances:** Title *"Score kitchen essentials ›"*, featuring real products for **Ninja**, **Dash**, **Hamilton Beach**, and **Black+Decker**.
    4. **Health & Daily Essentials:** Title *"Gear up to get fit & healthy ›"*, featuring real products for **Stanley**, **Levoit**, **Nutricost**, and **OXO**.
- **Uniform Dimensions & Proportions:**
  - All 4 cards have mathematically identical height (`420px`), width, padding (`20px 18px 18px`), and rounded corners (`12px`).
  - Active card state uses non-distorting outline glow so dimensions stay 100% constant without pixel jumps.
- **Direct Interactive Category & Brand Navigation:**
  - Clicking any card header or arrow immediately activates that category and smoothly scrolls directly down to the category deals grid.
  - Clicking any specific brand item (e.g., Apple, Ninja, Stanley, CeraVe) instantly filters by both the category and that specific brand, opening the exact catalog products directly.
- **Cleaned Extra Sub-Tabs:**
  - Removed all obsolete small thumbnail buttons and strips, keeping the homepage uncluttered and focused.
- **Dual Server Runtime Verification:**
  - Both Backend API (port 4000) and Frontend Storefront (port 5173) verified live with HTTP 200 OK.

---

## 🌟 Previous Update: Universal Link Activation & Dual Server Runtime (2026-10-03)
- **Header & Top Bar Links:**
  - Added dedicated `Track Order` link (`#top-track-link`) directly launching the live USPS tracking modal.
  - Prime 2-Day Delivery (`#top-prime-link`), Customer Service (`#top-support-link`), and USPS Logistics (`#top-carrier-link`) fully active.
  - SwiftOrbits Brand Logo (`#brand-home-logo`) seamlessly resets filters, clears search query, and returns to homepage.
- **Sub-Navigation Strip & Active Link Highlights:**
  - Fixed active state toggling: selecting any category or filter cleanly removes `.active` from all other tabs.
  - "Today's Deals" (`data-filter="deals"`) and "Best Sellers" (`data-filter="bestsellers"`) fully functional with discount & rating sorting.
  - Subcategory sidebar displays active breadcrumb link `← Back to All Category` when inside any department.
- **Footer Links & Direct Handlers:**
  - Phone (`tel:+971555762122`) and Email (`mailto:info@swiftorbits.com`) now trigger system dialer and mail client without `preventDefault()` interference.
  - Office address opens Google Maps directions directly in a new browser tab.
  - Added functional links for "Track Your Order" and "Returns & Refunds".
- **URL Hash Routing:**
  - Full deep linking support for `#deals`, `#bestsellers`, `#track`, `#orders`, `#support`, `#returns`, `#about`, `#terms`, `#privacy`, and `#admin`.
- **Dual Server Daemons:**
  - Both Express/PGlite backend (port 4000) and Vite storefront (port 5173) active and returning `HTTP 200 OK`.

### 1. 🗂️ "All Category" Auto-Smooth Cascade System & Smart Filtering (Newest)
- **Automatic Cascading Selection:**
  - Clicking **"All Category"** (header, title, or circular selector) activates the master state.
  - Automatically and smoothly cascades down through all 6 subcategories (**Beauty & Personal Care**, **Electronics**, **Kitchen & Appliances**, **Health & Household**, **Pet Supplies**, **Toys, Games, Baby**).
  - Uses a **45ms staggered delay** with subtle micro-bounce ripple animations (`cascading-highlight`) and cubic-bezier spring scaling.
  - Displays **all items** across all categories in the storefront without filters.
- **Specific Category Isolation:**
  - Clicking any individual subcategory immediately unchecks "All Category" and deselects all other subcategories.
  - **Only that specific category is selected**, and the catalog grid instantly filters to display items belonging to that category alone.
  - Clicking an already selected individual category smoothly reverts back to "All Category", smoothly cascading all subcategories back to checked.
- **Collapsible Accordion Header:**
  - Dedicated toggle arrow button (`#dept-toggle-icon`) smoothly collapses/expands the subcategory list with clean CSS height transitions and 180° arrow rotation.

---

### 2. ⚡ Real-Time Customer Authentication & Instant Auto-Login
- **Instant Onboarding:**
  - Signup modal for **Full Name**, **Email Address**, and **Password**.
  - Submitting **"Create Account & Sign In"** creates the account in PostgreSQL with active status (`email_verified = true`).
  - An authentication JWT token is immediately generated and saved to `localStorage`.
  - The modal automatically dismisses, the header updates in real time to **"Hello, [Customer Name]"**, and a toast notification confirms login.
- **Instant Returning Sign-In:**
  - Customers can sign out and sign back in anytime using their email and password with zero barriers.
- **Real-Time Merchant Alert:**
  - Customer registration emits a WebSocket event (`customer:registered`) notifying the Merchant Hub live.
- **Non-Blocking Welcome Email:**
  - Background email engine sends an HTML welcome confirmation note via SMTP.

---

### 3. ⏱️ 60-Second OTP System & 30-Second Resend Cooldown
- **Fast Security Window:**
  - OTP expiry set to **60 seconds** across backend database schemas, controllers, and frontend countdown timers.
  - Resend button has a **30-second cooldown** with live countdown timer to prevent spam while allowing prompt retries.
  - Secure: OTP codes are never exposed in frontend responses and are strictly delivered via email.

---

### 4. 📧 Real Email (SMTP) Integration
- **Direct Gmail & Custom SMTP Support:**
  - `backend/src/services/emailService.js` natively supports `SMTP_SERVICE=gmail` with Google App Passwords, delivering emails to Gmail inboxes in **2 to 5 seconds**.
  - Custom SMTP hosts (Brevo, SendGrid, Hostinger, cPanel) are fully supported via `backend/.env`.

---

### 5. 🏷️ 6 Curated Departments & Normalized PostgreSQL Database
- **Standardized Departments:**
  1. **Beauty & Personal Care**
  2. **Electronics**
  3. **Kitchen & Appliances**
  4. **Health & Household**
  5. **Pet Supplies**
  6. **Toys, Games, Baby**
- **Normalized Schema (7 Tables):**
  - `admin_users`, `categories`, `products`, `product_images`, `orders`, `order_items`, `order_status_history`.
  - Atomic stock quantity management, multi-image galleries, and JSONB technical attributes.

---

### 6. 🔍 Search, Brand & Price Filters
- **Real-Time Search:** Live query matching on product title, brand, SKU, and category.
- **Brand Filters:** Dynamically populated brand checkboxes with item counts per department.
- **Price Filters:** Min / Max numerical price inputs with instant catalog filtering.
- **Discount Filters:** Radio buttons for deals (10%+, 25%+, 50%+ discounts).

---

### 7. 🛒 Cart, Checkout & Orders
- **Interactive Cart:** Slide-out / modal cart with local storage persistence, quantity increments, and live total calculations.
- **Checkout Flow:** Customer delivery details, US destination state selection, automatic shipping fee computation, and order placement.

---

### 8. 📊 Merchant Portal & Operations ERP
- **Operations Dashboard:** Accessible via **"Merchant Portal"** button.
- **Live Orders Queue:** Real-time order monitoring via Socket.IO with sound alerts.
- **Order Management:** Status transitions (`pending` ➔ `processing` ➔ `dispatched` ➔ `delivered` ➔ `cancelled`).
- **Receipt Printing:** Thermal 80mm and standard A4 receipt printing layouts.
- **Inventory Management:** Live product stock editing, additions, and updates.

---

### 9. 🛡️ Auto-Healing Embedded Database Engine
- **Crash-Resilient Database Boot:**
  - `backend/src/db.js` includes auto-recovery logic for PGlite and pg.Pool.
  - If the application process encounters stale lock files (`postmaster.pid`), the engine automatically cleans up and self-heals, preventing server startup crashes.

---

## 🚀 How to Run the Website

### Method 1: One-Click Launcher (Windows)
Double-click:
```bat
start_website.bat
```

### Method 2: Manual Terminal Commands
1. **Start Backend API (Port 4000):**
   ```bash
   cd backend
   npm start
   ```
   - API Health: `http://localhost:4000/api/health`

2. **Start Frontend Storefront (Port 5173):**
   ```bash
   # From project root
   npm run dev -- --host
   ```
   - Storefront URL: `http://localhost:5173/`

### 🔑 Merchant Admin Credentials:
- **Email:** `admin@swiftorbits.us`
- **Password:** `admin123456`
