# SwiftOrbits USA Marketplace & Merchant ERP — Complete A to Z Project Backup

**Backup Timestamp:** 2026-10-04 00:30 (PKT)  
**Backup Location:** `c:\Users\ZC\OneDrive\Desktop\Swiftorbits\backup\`  
**ZIP Archive:** `c:\Users\ZC\OneDrive\Desktop\Swiftorbits\backup\swiftorbit_full_backup.zip`  
**Workspace Root:** `c:\Users\ZC\OneDrive\Desktop\Swiftorbits\`  
**Active Servers:**  
- **Storefront:** [http://localhost:5173/#category=all](http://localhost:5173/#category=all)
- **Admin Hub / ERP:** [http://localhost:4000/admin](http://localhost:4000/admin)

---

## 🌟 Latest Update: Native Amazon-Style Product Detail Page (PDP) — 100% No Popups, Full In-Website View (2026-10-04)
- **User Request Addressed:**
  - *"yar popup ma page open nai hona chaye.website main hi proper new page ki tarah open ho.bilkul smooth sara kam hona chaye.jese har amazon website k page open close hoty hain"*
- **100% Native Product Detail Page (No Popup Overlays):**
  - Completely eliminated the old popup/modal overlay (`#checkout-modal` and `.modal-overlay`) with its dark backdrop and scrolling lock.
  - Built a dedicated, full-width Product Detail Page view (`#view-product-detail.workspace-view`) directly inside the main website content container.
  - Implemented Amazon's standard 3-Column PDP layout:
    1. **Column 1 — Gallery & Trust Strip (`.pdp-col-gallery`):**
       - Main high-resolution product image with hover-zoom box and red deal badge (`-XX% OFF`).
       - Brand Image Gallery (`#modal-brand-gallery-thumbs`): clickable thumbnails for all other models and products by that brand (or category).
       - US Guarantee Trust Badges: Ships in 24h, 100% US Warranty, 30-Day Free Returns, 256-Bit SSL Secure Checkout.
    2. **Column 2 — Product Information & Specs (`.pdp-col-details`):**
       - Prime 2-Day Shipping pill and Department badge.
       - "Visit the [Brand] Store" interactive link.
       - Full product title, SKU, star ratings with verified review count and "100+ bought in past month" social proof.
       - Pricing banner with limited-time deal tag, sale price, strikethrough regular price, and dollar savings pill.
       - Technical specifications grid (`#modal-specs-container`) and "About this item" feature bullet points (`#modal-overview-list`).
    3. **Column 3 — Sticky Buy Box & Express Checkout (`.pdp-col-buybox`):**
       - Authentic Amazon-style Buy Box with unit price, Prime logo, in-stock badge, and seller details (Ships from / Sold by SwiftOrbits US Hub).
       - Embedded Instant USA Express Checkout form with customer details, US state selector, quantity spinner, and dynamic grand total calculation.
       - High-converting Amazon gold "Buy Now — Instant USA Express Checkout" button.
- **Related Products Recommendation Strip:**
  - "Customers who viewed this item also viewed" section at bottom of PDP with top 6 department recommendations (`#pdp-related-grid`), enabling seamless item-to-item browsing.
- **Smooth Amazon-Like Transitions & Navigation:**
  - Clean hash routing: URL dynamically updates to `#product=<SKU>`.
  - Seamless return to storefront without reload: "‹ Back to results" button, breadcrumb trail ("SwiftOrbits Store › Department › Brand › Product"), header brand logo, category tabs, and browser back/forward buttons all transition smoothly.
- **Build & Verification:**
  - Verified with `npm run build` (0 errors).
  - All source files synchronized to `backup/` and `swiftorbit_full_backup.zip`.

---

## 🌟 Previous Update: Direct Product Detail Page Opening Without Browser Scroll & Deep-Link Hash Routing (2026-10-04)
- **Direct Full Product Detail Page Opening (No Browser Scroll):**
  - Resolved user request: *"jab kisi b item pr click kia jai.to os item ko new page open hona chaye.na k web browser ki tarah nichy an...."*.
  - Clicking any brand tile or product item inside the 4-Quadrant Showcase (`.bream-quad-item`) now **immediately opens the comprehensive Product Detail & Instant US Checkout view** (`this.openCheckoutModal(targetProduct)`).
  - Completely eliminated `window.scrollTo` smooth scroll down to the bottom grid. The browser viewport remains steady with zero unexpected scrolling.
- **Deep-Link Hash Routing (`#product=<SKU>`):**
  - Opening any product dynamically updates the URL hash to `#product=<SKU>` (e.g. `http://localhost:5173/#product=ELEC-APL-001`).
  - Visiting or refreshing a URL with `#product=<SKU>` directly launches that exact product's detail page immediately upon data load.
- **Enhanced Modal Behavior & Background Scroll Lock:**
  - Added background lock (`document.body.style.overflow = 'hidden'`) while modal is active so background does not scroll or shift.
  - Modal content layout automatically resets scroll to top (`scrollTop = 0`) on every product open.
  - Added modal backdrop click-to-close and `Escape` key dismiss listeners.
  - Closing the modal cleans up the URL hash via `history.replaceState` without triggering page jumps.
- **Brand & Department Image Gallery:**
  - The modal's Brand Gallery `#modal-brand-gallery` showcases high-res thumbnails of all models for that brand (or top related products from that department), with instant one-click switching between items.
- **Production Compilation:**
  - Built production bundle with `vite build` (`dist/`) with 0 errors.

---

## 🌟 Previous Update: 100% Real-Time Storefront Image Sync, Clean Showcase Cards & Brand Gallery (2026-10-03 23:45 PKT)
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
