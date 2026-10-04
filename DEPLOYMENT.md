# SWIFTORBITS USA — PRODUCTION FULL-STACK DEPLOYMENT & ARCHITECTURE MANUAL

## 1. Architecture Overview

```
                      +------------------------------------------+
                      |         CUSTOMER FRONTEND / ERP          |
                      |   (Vite + HTML5 + CSS3 + Socket.IO)     |
                      +------------------------------------------+
                                    |                   ^
                        REST HTTPS  |                   | WebSocket (Realtime)
                        Port 4000   v                   | Port 4000
                      +------------------------------------------+
                      |             EXPRESS.JS API               |
                      |    (Auth, Orders, Inventory, Sockets)    |
                      +------------------------------------------+
                                    |                   |
                       SQL Pool     v                   v Local / S3
                      +-------------------+   +--------------------+
                      |    POSTGRESQL     |   |   IMAGE STORAGE    |
                      |  DATABASE ENGINE  |   |   uploads/ / S3    |
                      +-------------------+   +--------------------+
```

---

## 2. Quick Local Start (Windows / Dev)

### Method A: One-Click Launcher
Double-click:
```
start_website.bat
```
This automatically starts the backend API on port 4000, initializes the PostgreSQL database and realtime sockets, boots the Vite frontend on port 5173, and launches your default browser.

### Method B: Terminal Commands
1. **Start Backend Server:**
   ```bash
   cd backend
   npm install
   npm run seed    # (Runs database migrations & populates initial 86 products)
   npm start       # (Runs API on http://localhost:4000)
   ```

2. **Start Frontend Dev Server:**
   ```bash
   # From root directory
   npm install
   npm run dev     # (Runs Storefront on http://localhost:5173)
   ```

3. **Run Automated Integration Tests:**
   ```bash
   cd backend
   npm test
   ```

---

## 3. Verified Merchant / Admin Credentials

To enter the **SwiftOrbits USA Merchant Operations Portal & ERP**:
1. Click **"Merchant Portal"** in the top navigation strip.
2. Enter the authorized merchant credentials:
   * **Email:** `admin@swiftorbits.us`
   * **Password:** `admin123456`
3. Click **"Sign In to Merchant Hub"**.

---

## 4. Environment Variables Reference

Create `backend/.env` based on `backend/.env.example`:

| Variable | Default (Dev) | Description |
|---|---|---|
| `PORT` | `4000` | Port for Express & Socket.IO server |
| `DATABASE_URL` | `postgresql://...` | External PostgreSQL connection string (falls back to persistent PGlite if unavailable) |
| `JWT_SECRET` | `swiftorbits_super_secure_...` | 256-bit secret key used to sign Admin JWT tokens |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Allowed CORS origin for frontend storefront |
| `ADMIN_EMAIL` | `admin@swiftorbits.us` | Initial administrator email for seeding |
| `ADMIN_PASSWORD` | `admin123456` | Initial administrator password for seeding |
| `UPLOAD_DIR` | `uploads` | Directory for stored product images |

---

## 5. PostgreSQL Database Schema

The database consists of 7 normalized tables with foreign keys and performance indexes:

1. **`admin_users`**: Merchant staff accounts with bcrypt password hashes and roles.
2. **`categories`**: Departments (Electronics, Fashion, Beauty, Home, Appliances, Fresh Mart, Watches).
3. **`products`**: Unique SKU, USD pricing, atomic stock quantity, rating, technical JSONB attributes, and primary image.
4. **`product_images`**: Multi-image gallery per product.
5. **`orders`**: Customer profile, US destination state, subtotal, shipping fee, and grand total.
6. **`order_items`**: Order line items snapshotting product title, unit price, quantity, and line total.
7. **`order_status_history`**: Audit log recording transition history (`pending` ➔ `processing` ➔ `dispatched` ➔ `delivered` ➔ `cancelled`).

---

## 6. Realtime Socket.IO Event Engine

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `order:created` | Server ➔ All | Order object with items | Fires instantly when customer places order. Triggers chime and notification in Merchant Portal without reload. |
| `order:updated` | Server ➔ All | Updated order object | Fires when merchant modifies status (`dispatched`, `delivered`, `cancelled`). |
| `product:created` | Server ➔ Storefront | New product object | Realtime addition of new products published in ERP. |
| `product:updated` | Server ➔ Storefront | Updated product object | Realtime updates to price, title, or specs. |
| `product:stock-updated`| Server ➔ All | `{ id, sku, stock_qty }` | Emitted on every purchase or merchant stock adjustment to guarantee zero overselling. |

---

## 7. Production Linux / Cloud Deployment Guide

### A. Managed PostgreSQL (Neon / Supabase / AWS RDS)
1. Provision a PostgreSQL instance.
2. Set `DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require` in `backend/.env`.
3. Run `npm run migrate && npm run seed` once to initialize schema and catalog.

### B. Production Process Management (PM2)
```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name "swiftorbits-api"
pm2 save
pm2 startup
```

### C. Frontend Build & Static Serving (Nginx)
```bash
# Build optimized static distribution
npm run build
```
Nginx config snippet:
```nginx
server {
    listen 80;
    server_name marketplace.swiftorbits.us;

    location / {
        root /var/www/swiftorbits/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    location /uploads/ {
        alias /var/www/swiftorbits/backend/uploads/;
        expires 30d;
    }
}
```
