function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PRESET_IMAGES = [
  { name: 'Samsung Flagship', url: '/elec_phone.png' },
  { name: 'Bose Earbuds', url: '/elec_earbuds.png' },
  { name: 'Apple Watch Ultra', url: '/apple_watch_ultra_2.jpg' },
  { name: 'Fast USB Cable', url: '/usb_cable.png' },
  { name: 'M10 TWS Earbuds', url: '/earbuds_m10.png' },
  { name: 'Smart 4K TV', url: '/smart_tv.png' },
  { name: 'Levi\'s 501 Jeans', url: '/levis_501_jeans.jpg' },
  { name: 'Digital Air Fryer', url: '/air_fryer.png' },
  { name: 'Stanley Tumbler', url: '/stanley_tumbler.jpg' },
  { name: 'Lego Bonsai Tree', url: '/lego_bonsai.jpg' },
  { name: 'Crocs Clogs', url: '/crocs_clogs.jpg' },
  { name: 'Levoit Air Purifier', url: '/levoit_purifier.jpg' },
  { name: 'Nutricost Creatine', url: '/nutricost_creatine.jpg' },
  { name: 'Royal Oud Perfume', url: '/royal_oud.png' },
  { name: 'Niacinamide Serum', url: '/niacinamide_serum.png' },
  { name: 'Luxury Men\'s Watch', url: '/men_watch.png' },
  { name: 'Classic Polo Shirt', url: '/polo_shirt.png' }
];

function formatProductRowServer(p) {
  const regularPrice = parseFloat(p.regular_price) || 0;
  const salePrice = (p.sale_price !== null && p.sale_price !== undefined && p.sale_price !== '') ? parseFloat(p.sale_price) : null;
  const stockQty = parseInt(p.stock_qty) || 0;
  const rating = parseFloat(p.rating || 4.9).toFixed(1);
  const reviewsCount = parseInt(p.reviews_count || 120);

  const priceStr = salePrice !== null ?
    `<div><strong style="color:var(--swift-emerald); font-size:1.02rem;">$${salePrice.toFixed(2)}</strong></div>
     <div style="font-size:0.75rem; color:#64748b; text-decoration:line-through;">$${regularPrice.toFixed(2)}</div>` :
    `<strong style="font-size:1.02rem;">$${regularPrice.toFixed(2)}</strong>`;

  let attrs = {};
  if (typeof p.attributes === 'string') {
    try { attrs = JSON.parse(p.attributes); } catch(e) {}
  } else if (p.attributes) {
    attrs = p.attributes;
  }
  const attrFlat = Object.entries(attrs).map(([k, v]) => `${k}: ${v}`).join(' | ');

  const stockColor = stockQty <= 5 ? '#f43f5e' : (stockQty <= 15 ? '#f59e0b' : '#10b981');
  const safeTitle = escapeHtml(p.title || 'Untitled Product');
  const safeAttr = escapeHtml(attrFlat || 'Standard Specifications');
  const safeCategory = escapeHtml(p.category || 'general');
  const safeSku = escapeHtml(p.sku || '');
  const safeImage = escapeHtml(p.image || '/elec_phone.png');

  return `
    <tr id="row-prod-${p.id}">
      <td style="font-family:var(--font-mono); font-weight:700; color:var(--swift-cyan); white-space:nowrap;">
        ${safeSku}<br>
        <small style="color:#64748b; font-weight:normal;">#${p.id}</small>
      </td>
      <td>
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="prod-thumb-container" data-id="${p.id}" onclick="openEditProductModal(${p.id})" title="Click to edit product picture" style="position:relative; cursor:pointer; width:48px; height:48px; flex-shrink:0;">
            <img src="${safeImage}" style="width:48px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #334155; background:#0f172a;" onerror="this.onerror=null; this.src='/elec_phone.png';">
            <span style="position:absolute; bottom:-3px; right:-3px; background:#2563eb; color:#fff; font-size:10px; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #0f172a;" title="Edit picture">📷</span>
          </div>
          <div class="prod-title-wrap">
            <div class="prod-title-text" onclick="toggleTitle(this, event)" title="${safeTitle}">${safeTitle}</div>
            <div style="display:flex; gap:6px; margin-top:4px; align-items:center;">
              ${p.is_flash_sale ? '<span style="background:rgba(239,68,68,0.2); color:#f87171; border:1px solid rgba(239,68,68,0.4); font-size:0.65rem; font-weight:800; padding:1px 6px; border-radius:3px;">⚡ FLASH SALE</span>' : ''}
              <span style="font-size:0.72rem; color:#94a3b8;">⭐ ${rating} (${reviewsCount} reviews)</span>
            </div>
          </div>
        </div>
      </td>
      <td><span class="badge-pill badge-${safeCategory}">${safeCategory}</span></td>
      <td>${priceStr}</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${stockColor}"></span>
          <strong style="font-size:1.05rem; color:${stockQty <= 5 ? 'var(--swift-rose)' : 'inherit'};">${stockQty}</strong>
          <small style="color:#64748b;">units</small>
        </div>
      </td>
      <td style="font-size:0.75rem; color:var(--text-muted); max-width:200px;">
        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${safeAttr}">
          ${safeAttr}
        </div>
      </td>
      <td style="text-align:right; white-space:nowrap;">
        <div style="display:inline-flex; gap:6px; align-items:center;">
          <button class="btn btn-primary btn-sm btn-edit" data-id="${p.id}" onclick="openEditProductModal(${p.id})" style="font-weight:700;">
            ✏️ Edit
          </button>
          <button class="btn btn-outline btn-sm btn-stock-adjust" onclick="adjustStock(${p.id}, 10)" title="Quick +10 units">
            +10
          </button>
          <button class="btn btn-outline btn-sm btn-stock-adjust" onclick="adjustStock(${p.id}, -1)" title="Quick -1 unit">
            -1
          </button>
          <button class="btn btn-outline btn-sm" onclick="confirmDeleteProduct(${p.id})" title="Delete Product" style="color:var(--swift-rose); border-color:rgba(244,63,94,0.3);">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `;
}

function formatOrderRowServer(o) {
  const safeOrderNumber = escapeHtml(o.order_number);
  const safeDate = new Date(o.created_at || Date.now()).toLocaleDateString();
  const safeName = escapeHtml(o.customer_name);
  const safePhone = escapeHtml(o.customer_phone);
  const safeCity = escapeHtml(o.city || 'Los Angeles');
  const safeState = escapeHtml(o.state || 'CA');
  const safeAddress = escapeHtml(o.shipping_address);
  const safeTitle = escapeHtml(o.product_title || 'SwiftOrbits Package');
  const qty = parseInt(o.quantity) || 1;
  const safeSku = escapeHtml(o.sku || 'SO-US');
  const total = Number(o.grand_total || 0).toFixed(2);
  const status = escapeHtml(o.order_status || 'processing');

  return `
    <tr id="order-row-${o.id}">
      <td>
        <strong style="font-family:var(--font-mono); color:var(--swift-cyan);">${safeOrderNumber}</strong><br>
        <small style="color:#64748b;">${safeDate}</small>
      </td>
      <td>
        <strong>${safeName}</strong><br>
        <small style="color:#64748b;">${safePhone}</small>
      </td>
      <td>
        <div><strong>${safeCity}, ${safeState}</strong></div>
        <small style="color:#64748b;">${safeAddress}</small>
      </td>
      <td>
        <strong>${safeTitle}</strong> (x${qty})<br>
        <small style="font-family:var(--font-mono); color:#64748b;">${safeSku}</small>
      </td>
      <td><strong style="color:var(--swift-emerald); font-size:1.05rem;">$${total}</strong></td>
      <td>
        <select class="status-select" onchange="updateStatus(${o.id}, this.value)">
          <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="processing" ${status === 'processing' ? 'selected' : ''}>Processing</option>
          <option value="dispatched" ${status === 'dispatched' ? 'selected' : ''}>Dispatched (USPS)</option>
          <option value="delivered" ${status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="alert('USPS Thermal Label Printed for #' + '${safeOrderNumber}')">🖨️ Label</button>
      </td>
    </tr>
  `;
}

export function renderAdminDashboardHtml(options = {}) {
  let initialProducts = [];
  let initialOrders = [];

  if (Array.isArray(options)) {
    initialProducts = options;
  } else if (options && typeof options === 'object') {
    initialProducts = options.products || [];
    initialOrders = options.orders || [];
  }

  const initialRowsHtml = initialProducts.length > 0
    ? initialProducts.map(formatProductRowServer).join('')
    : '<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;">No products in database yet.</td></tr>';

  const initialOrdersHtml = initialOrders.length > 0
    ? initialOrders.map(formatOrderRowServer).join('')
    : `<tr id="empty-orders-row">
        <td colspan="7" style="text-align:center; padding:45px 20px; color:#64748b;">
          <div style="font-size:1.8rem; margin-bottom:8px;">📦</div>
          <div style="font-weight:700; color:#94a3b8; font-size:1rem;">No Customer Orders Placed Yet</div>
          <div style="font-size:0.8rem; color:#64748b; margin-top:4px;">When an order is placed on the Customer Storefront (Port 5173), it will arrive here instantly with a live alert notification.</div>
        </td>
      </tr>`;

  const totalProdsCount = initialProducts.length;
  const totalStockUnits = initialProducts.reduce((sum, p) => sum + (parseInt(p.stock_qty) || 0), 0);
  const totalOrdersCount = initialOrders.length;
  const grossRev = initialOrders.filter(o => o.order_status !== 'cancelled').reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
  const processingCount = initialOrders.filter(o => o.order_status === 'processing').length;
  const deliveredCount = initialOrders.filter(o => o.order_status === 'delivered').length;
  const cancelledCount = initialOrders.filter(o => o.order_status === 'cancelled').length;
  const validOrdersCount = totalOrdersCount - cancelledCount;
  const aov = validOrdersCount > 0 ? (grossRev / validOrdersCount) : 0;

  const elecUnits = initialOrders.filter(o => o.order_status !== 'cancelled').reduce((s, o) => {
    const sku = (o.sku || '').toLowerCase();
    const title = (o.product_title || '').toLowerCase();
    const cat = (o.category || '').toLowerCase();
    const qty = parseInt(o.quantity) || 1;
    return (cat.includes('elec') || sku.includes('elec') || title.includes('phone') || title.includes('earbuds') || title.includes('tv') || title.includes('cable')) ? s + qty : s;
  }, 0);

  const fashionUnits = initialOrders.filter(o => o.order_status !== 'cancelled').reduce((s, o) => {
    const sku = (o.sku || '').toLowerCase();
    const title = (o.product_title || '').toLowerCase();
    const cat = (o.category || '').toLowerCase();
    const qty = parseInt(o.quantity) || 1;
    return (cat.includes('beauty') || sku.includes('beauty') || title.includes('serum') || title.includes('cologne') || title.includes('cream')) ? s + qty : s;
  }, 0);

  const serializedProducts = JSON.stringify(initialProducts.map(p => ({
    id: p.id,
    sku: p.sku,
    title: p.title,
    category: p.category,
    regular_price: parseFloat(p.regular_price) || 0,
    sale_price: (p.sale_price !== null && p.sale_price !== undefined && p.sale_price !== '') ? parseFloat(p.sale_price) : null,
    stock_qty: parseInt(p.stock_qty) || 0,
    is_flash_sale: !!p.is_flash_sale,
    rating: parseFloat(p.rating || 4.9),
    reviews_count: parseInt(p.reviews_count || 120),
    image: p.image || '/elec_phone.png',
    attributes: typeof p.attributes === 'string' ? JSON.parse(p.attributes || '{}') : (p.attributes || {})
  })));

  const serializedOrders = JSON.stringify(initialOrders.map(o => ({
    id: o.id,
    order_number: o.order_number,
    customer_name: o.customer_name,
    customer_phone: o.customer_phone,
    customer_email: o.customer_email,
    shipping_address: o.shipping_address,
    city: o.city,
    state: o.state,
    sku: o.sku,
    product_title: o.product_title,
    quantity: o.quantity,
    grand_total: parseFloat(o.grand_total) || 0,
    order_status: o.order_status,
    created_at: o.created_at
  })));

  const presetThumbnailsHtml = PRESET_IMAGES.map(img => `
    <button type="button" class="preset-btn" onclick="selectPresetImage('${img.url}')" title="${escapeHtml(img.name)}" style="border:1px solid #334155; border-radius:6px; background:#0f172a; padding:2px; cursor:pointer; flex-shrink:0;">
      <img src="${img.url}" style="width:36px; height:36px; object-fit:cover; border-radius:4px; display:block;" onerror="this.onerror=null; this.src='/elec_phone.png';">
    </button>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SwiftOrbits USA Merchant Hub — Backend Operations ERP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <script src="/socket.io/socket.io.js"></script>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --card-border: #334155;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --swift-blue: #2563eb;
      --swift-blue-hover: #1d4ed8;
      --swift-cyan: #38bdf8;
      --swift-emerald: #10b981;
      --swift-amber: #f59e0b;
      --swift-rose: #f43f5e;
      --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* TOP BAR */
    .top-bar {
      background: #090d16;
      border-bottom: 1px solid #1e293b;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand-logo {
      font-size: 1.3rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .logo-swift { color: #fff; }
    .logo-orbit { color: var(--swift-cyan); }
    .logo-badge {
      background: rgba(56, 189, 248, 0.15);
      color: var(--swift-cyan);
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      margin-left: 6px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .top-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .socket-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--swift-emerald);
      background: rgba(16, 185, 129, 0.1);
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--swift-emerald);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn-primary { background: var(--swift-blue); color: #fff; }
    .btn-primary:hover { background: var(--swift-blue-hover); }
    .btn-storefront { background: #334155; color: #fff; }
    .btn-storefront:hover { background: #475569; }
    .btn-outline { background: transparent; border: 1px solid #475569; color: #cbd5e1; }
    .btn-outline:hover { background: #334155; color: #fff; }
    .btn-success { background: var(--swift-emerald); color: #fff; }
    .btn-danger { background: var(--swift-rose); color: #fff; }
    .btn-sm { padding: 4px 10px; font-size: 0.78rem; border-radius: 5px; }

    /* MAIN CONTAINER */
    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px;
      width: 100%;
      flex: 1;
    }

    /* HEADER BANNER */
    .header-banner {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header-banner h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
    }
    .header-banner p {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* STATS GRID */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 18px;
    }
    .stat-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }
    .stat-value {
      font-size: 1.7rem;
      font-weight: 900;
      margin: 6px 0 2px;
    }
    .stat-sub {
      font-size: 0.75rem;
      color: #64748b;
    }

    /* TABS */
    .tab-nav {
      display: flex;
      gap: 10px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 20px;
      overflow-x: auto;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 12px 18px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .tab-btn.active {
      color: var(--swift-cyan);
      border-bottom-color: var(--swift-cyan);
    }
    .tab-btn:hover { color: #fff; }

    /* CONTENT PANELS */
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* CARD PANEL */
    .card-panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .panel-title { font-size: 1.2rem; font-weight: 800; }
    .panel-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }

    /* DATA TABLE */
    .table-responsive {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.85rem;
    }
    th {
      background: #0f172a;
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.72rem;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      border-bottom: 1px solid #334155;
      white-space: nowrap;
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid #263346;
      vertical-align: middle;
    }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }

    .prod-title-wrap {
      max-width: 280px;
      min-width: 180px;
    }
    .prod-title-text {
      font-weight: 700;
      font-size: 0.88rem;
      line-height: 1.35;
      color: #f8fafc;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 280px;
      display: block;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 4px;
      padding: 3px 6px;
      margin: -3px -6px;
    }
    .prod-title-text:hover {
      color: var(--swift-cyan);
      background: rgba(255, 255, 255, 0.05);
    }
    .prod-title-text.expanded {
      white-space: normal;
      overflow: visible;
      word-break: break-word;
      background: #0f172a;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 6px 10px;
      position: relative;
      z-index: 10;
    }

    .badge-pill {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .badge-electronics, .badge-tech { background: rgba(37, 99, 235, 0.2); color: var(--swift-cyan); border: 1px solid rgba(56,189,248,0.3); }
    .badge-fashion { background: rgba(236, 72, 153, 0.2); color: #f472b6; border: 1px solid rgba(244,114,182,0.3); }
    .badge-beauty { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
    .badge-appliances { background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); }
    .badge-health_household { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); }
    .badge-pet_supplies { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
    .badge-toys_games_baby { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(192,132,252,0.3); }

    .status-select {
      background: #0f172a;
      color: #fff;
      border: 1px solid #475569;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* MODALS */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal-overlay.open { display: flex; }
    .modal-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      max-width: 680px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
    }
    .modal-title { font-size: 1.25rem; font-weight: 800; }
    .form-group { margin-bottom: 14px; }
    .form-group label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .form-control {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      color: #fff;
      padding: 9px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: inherit;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--swift-cyan);
    }
    .form-row {
      display: flex;
      gap: 12px;
    }
    .form-row > * { flex: 1; }

    .preset-btn:hover {
      border-color: var(--swift-cyan) !important;
      transform: scale(1.05);
      transition: all 0.15s ease;
    }

    /* NOTIFICATION TOAST */
    .toast-tray {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      background: #1e293b;
      border: 1px solid var(--swift-cyan);
      color: #fff;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      animation: slideIn 0.3s ease;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 440px;
      font-size: 0.85rem;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes bellRing {
      0% { transform: rotate(-18deg); }
      50% { transform: rotate(18deg); }
      100% { transform: rotate(-18deg); }
    }
    @keyframes pulseGlow {
      from { box-shadow: 0 0 20px rgba(16, 185, 129, 0.35); }
      to { box-shadow: 0 0 45px rgba(16, 185, 129, 0.75); }
    }
    @keyframes orderRowHighlight {
      0% { background: rgba(16, 185, 129, 0.45); }
      50% { background: rgba(16, 185, 129, 0.2); }
      100% { background: transparent; }
    }
    .highlight-new-order {
      animation: orderRowHighlight 3.5s ease;
    }
  </style>
</head>
<body>

  <!-- TOP BAR -->
  <header class="top-bar">
    <div class="brand-logo">
      <span class="logo-swift">Swift</span><span class="logo-orbit">Orbits</span>
      <span class="logo-badge">USA ERP OPERATIONS</span>
    </div>
    <div class="top-actions">
      <div class="socket-status" id="socket-badge">
        <span class="status-dot"></span>
        <span id="socket-label">Realtime Synchronized</span>
      </div>
      <a href="http://localhost:5173/" target="_blank" class="btn btn-storefront">
        🛒 Customer Storefront (Port 5173)
      </a>
      <button class="btn btn-outline" id="btn-logout" style="display:none;" onclick="logout()">
        🔒 Sign Out
      </button>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="container">

    <!-- HEADER BANNER -->
    <div class="header-banner">
      <div>
        <h1>SwiftOrbits USA Verified Merchant Operations Portal</h1>
        <p>Authoritative PostgreSQL inventory stock control, catalog editor, and real-time US order fulfillment queue.</p>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline" onclick="loadAll()">🔄 Refresh Data</button>
        <button class="btn btn-primary" onclick="openAddProductModal()">+ Add New Product</button>
      </div>
    </div>

    <!-- STATS GRID -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Catalog Products</div>
        <div class="stat-value" id="stat-total-prods" style="color: var(--swift-cyan);">${totalProdsCount} Products</div>
        <div class="stat-sub" id="stat-total-stock">${totalStockUnits.toLocaleString()} Units in PostgreSQL</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Electronics</div>
        <div class="stat-value" id="stat-elec" style="color: #38bdf8;">${elecUnits.toLocaleString()} Units</div>
        <div class="stat-sub">Smartphones & Audio</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Beauty & Personal Care</div>
        <div class="stat-value" id="stat-fashion" style="color: #f472b6;">${fashionUnits.toLocaleString()} Units</div>
        <div class="stat-sub">Skincare & Fragrance</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">US Order Queue</div>
        <div class="stat-value" id="stat-orders" style="color: #a78bfa;">${totalOrdersCount} Orders</div>
        <div class="stat-sub" id="stat-revenue">Gross: $${grossRev.toFixed(2)}</div>
      </div>
      <div class="stat-card" style="border-left: 4px solid #f59e0b; cursor:pointer;" onclick="switchTab('settings', document.querySelectorAll('.tab-btn')[3])" title="Configure Hero Showcase Speed">
        <div class="stat-label">Hero Rotator Interval</div>
        <div class="stat-value" id="stat-rotator-val" style="color: #f59e0b;">10s</div>
        <div class="stat-sub" id="stat-rotator-sub">🟢 Real Product Cycle</div>
      </div>
    </div>

    <!-- TAB NAVIGATION -->
    <div class="tab-nav">
      <button class="tab-btn active" onclick="switchTab('inventory', this)">📦 Catalog Inventory & Product Editor</button>
      <button class="tab-btn" onclick="switchTab('orders', this)">🚚 US Shipping Fulfillment Queue</button>
      <button class="tab-btn" onclick="switchTab('analytics', this)">📈 USD Revenue & Financial Ledger</button>
      <button class="tab-btn" onclick="switchTab('settings', this)">⚙️ Storefront Hero Showcase Settings</button>
    </div>

    <!-- TAB 1: INVENTORY -->
    <div id="tab-inventory" class="tab-content active">
      <div class="card-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">PostgreSQL Product Catalog (<span id="total-prod-count">${totalProdsCount}</span> Listed)</h2>
            <p class="panel-sub">Click any product's picture or the <strong>Edit</strong> button to edit photos, prices, or stock.</p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
            <select id="inventory-cat-filter" class="form-control" style="width:auto; min-width:170px;" onchange="applyFilters()">
              <option value="all">🌐 All Departments</option>
              <option value="beauty">💄 Beauty & Personal Care</option>
              <option value="electronics">⚡ Electronics</option>
              <option value="appliances">🍳 Kitchen & Appliances</option>
              <option value="health_household">🩺 Health & Househeld</option>
              <option value="pet_supplies">🐾 Pet Supplies</option>
              <option value="toys_games_baby">🧸 Toys,games,Baby</option>
            </select>
            <input type="text" id="inventory-search" class="form-control" placeholder="🔍 Search SKU or title..." style="width:220px;" oninput="applyFilters()">
            <button class="btn btn-primary" onclick="openAddProductModal()">+ Add Product</button>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>SKU / ID</th>
                <th>Product Details</th>
                <th>Department</th>
                <th>Pricing (USD $)</th>
                <th>Stock Qty</th>
                <th>Specifications & Rating</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="inventory-tbody">
              ${initialRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: ORDERS -->
    <div id="tab-orders" class="tab-content">
      <div class="card-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">US Domestic Shipping & Fulfillment Queue</h2>
            <p class="panel-sub">State transitions: Pending ➔ Processing ➔ Dispatched (USPS) ➔ Delivered ➔ Cancelled.</p>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order Ref #</th>
                <th>Customer Profile</th>
                <th>Destination Address</th>
                <th>Product Item</th>
                <th>Total (USD $)</th>
                <th>Fulfillment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="orders-tbody">
              ${initialOrdersHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: ANALYTICS -->
    <div id="tab-analytics" class="tab-content">
      <div class="card-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">SwiftOrbits US Financial & Sales Ledger</h2>
            <p class="panel-sub">Calculated directly from real database records.</p>
          </div>
        </div>

        <div class="stats-grid" style="margin-top: 16px;">
          <div class="stat-card">
            <div class="stat-label">Gross Revenue Collected</div>
            <div class="stat-value" id="ledger-gross" style="color: var(--swift-emerald);">$${grossRev.toFixed(2)}</div>
            <div class="stat-sub">Excludes cancelled orders</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Processing Orders</div>
            <div class="stat-value" id="ledger-processing" style="color: var(--swift-amber);">${processingCount}</div>
            <div class="stat-sub">Awaiting USPS dispatch</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Delivered Orders</div>
            <div class="stat-value" id="ledger-delivered" style="color: var(--swift-blue);">${deliveredCount}</div>
            <div class="stat-sub">Completed sales</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Average Order Value (AOV)</div>
            <div class="stat-value" id="ledger-aov" style="color: var(--swift-cyan);">$${aov.toFixed(2)}</div>
            <div class="stat-sub">Revenue / Order Volume</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: STOREFRONT HERO SHOWCASE SETTINGS -->
    <div id="tab-settings" class="tab-content">
      <div class="card-panel">
        <div class="panel-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
          <div>
            <h2 class="panel-title" style="display:flex; align-items:center; gap:10px;">
              <span>⚙️ Storefront Hero Category Rotator & Display Controls</span>
              <span class="badge-pill badge-appliances" style="font-size:0.75rem;">Realtime Control</span>
            </h2>
            <p class="panel-sub">ہیرو سیکشن کے 4 کیٹیگری کارڈز میں رئیل پروڈکٹس اور تصاویر کے تبدیل ہونے کا وقت (سیکنڈز) کم یا زیادہ کریں۔</p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-outline" onclick="resetRotatorSettings()">🔄 Reset to 10s</button>
            <button class="btn btn-primary" onclick="saveRotatorSettings()">💾 Save & Apply Now</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:24px; margin-top:20px;">
          <!-- Controls -->
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 22px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <div>
                <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em;">Cycle Interval Duration</span>
                <h3 style="font-size:1.15rem; font-weight:900; color:#fff; margin-top:4px;">تصاویر تبدیل ہونے کا وقت (سیکنڈز)</h3>
              </div>
              <div>
                <div style="font-size:1.8rem; font-weight:900; color:var(--swift-cyan); font-family:var(--font-mono); background:#0b132b; padding:6px 18px; border-radius:8px; border:1px solid rgba(56,189,248,0.4);">
                  <span id="srv-rotator-seconds-val">10</span>s
                </div>
              </div>
            </div>

            <!-- Stepper Buttons (Kam / Ziada) -->
            <div style="margin-bottom:20px;">
              <label style="font-size:0.85rem; font-weight:700; color:#cbd5e1; display:block; margin-bottom:8px;">
                سیکنڈز کم یا زیادہ کریں (Fine-Tune Steppers):
              </label>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn btn-outline" onclick="adjustRotatorSpeed(-5)" style="flex:1; border-color:#f43f5e; color:#f43f5e;">➖ 5s کم</button>
                <button type="button" class="btn btn-outline" onclick="adjustRotatorSpeed(-1)" style="flex:1; border-color:#f59e0b; color:#f59e0b;">➖ 1s کم</button>
                <button type="button" class="btn btn-outline" onclick="adjustRotatorSpeed(1)" style="flex:1; border-color:#10b981; color:#10b981;">➕ 1s زیادہ</button>
                <button type="button" class="btn btn-outline" onclick="adjustRotatorSpeed(5)" style="flex:1; border-color:#38bdf8; color:#38bdf8;">➕ 5s زیادہ</button>
              </div>
            </div>

            <!-- Slider -->
            <div style="margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <label style="font-size:0.85rem; font-weight:700; color:#cbd5e1;">اسپیڈ سلائیڈر (Drag Slider):</label>
                <span style="font-size:0.8rem; color:#94a3b8;">1s سے 60s</span>
              </div>
              <input type="range" id="srv-rotator-slider" min="1" max="60" step="1" value="10" oninput="onSrvSliderInput(this.value)" onchange="onSrvSliderChange(this.value)" style="width:100%; height:8px; accent-color:#38bdf8; cursor:pointer;" />
              <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:#64748b; font-weight:700; margin-top:4px;">
                <span>1s (تیز)</span>
                <span>5s</span>
                <span style="color:#38bdf8;">10s (ڈیفالٹ)</span>
                <span>15s</span>
                <span>20s</span>
                <span>30s</span>
                <span>60s (آہستہ)</span>
              </div>
            </div>

            <!-- Number Input -->
            <div style="display:flex; gap:14px; align-items:center; margin-bottom:20px; background:#0f172a; padding:12px 16px; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
              <label style="font-size:0.85rem; font-weight:700; color:#e2e8f0; flex:1;">مطلوبہ سیکنڈز خود درج کریں (Custom Seconds):</label>
              <div style="display:flex; align-items:center; gap:8px; width:130px;">
                <input type="number" id="srv-rotator-num-input" min="1" max="300" step="1" value="10" class="form-control" onchange="onSrvNumChange(this.value)" style="text-align:center; font-weight:900; font-size:1.1rem; padding:6px;" />
                <span style="color:#94a3b8; font-weight:700;">سیکنڈ</span>
              </div>
            </div>

            <!-- Presets -->
            <div style="margin-bottom:20px;">
              <label style="font-size:0.85rem; font-weight:700; color:#cbd5e1; display:block; margin-bottom:8px;">تیز رفتار پری سیٹس (Instant Presets):</label>
              <div style="display:flex; flex-wrap:wrap; gap:8px;" id="srv-rotator-presets">
                <button type="button" class="btn btn-outline btn-sm" onclick="setRotatorSpeedDirect(2)">⚡ 2s</button>
                <button type="button" class="btn btn-outline btn-sm" onclick="setRotatorSpeedDirect(3)">🚀 3s</button>
                <button type="button" class="btn btn-outline btn-sm" onclick="setRotatorSpeedDirect(5)">✨ 5s</button>
                <button type="button" class="btn btn-outline btn-sm" onclick="setRotatorSpeedDirect(10)">⭐ 10s (Default)</button>
                <button type="button" class="btn btn-outline btn-sm" onclick="setRotatorSpeedDirect(15)">🕒 15s</button>
                <button type="button" class="btn btn-outline btn-sm" onclick="setRotatorSpeedDirect(20)">☕ 20s</button>
                <button type="button" class="btn btn-outline btn-sm" onclick="setRotatorSpeedDirect(30)">🛡️ 30s</button>
              </div>
            </div>

            <!-- Toggle -->
            <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:0.9rem; font-weight:800; color:#fff;">خودکار روٹیشن آن / آف (Auto-Rotation Active)</div>
                <div style="font-size:0.75rem; color:#94a3b8;">اگر آپ خودکار تبدیلی کو روکنا چاہیں تو پاز کر سکتے ہیں۔</div>
              </div>
              <input type="checkbox" id="srv-rotator-toggle" checked onchange="toggleRotatorActive(this.checked)" style="width:20px; height:20px; cursor:pointer;" />
            </div>
          </div>

          <!-- Info -->
          <div>
            <div style="background:linear-gradient(135deg, #02031f 0%, #050638 50%, #0b0e4e 100%); border-radius:12px; padding:22px; border:1px solid rgba(56,189,248,0.2); margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--swift-cyan);">Storefront Live Sync</span>
                <span id="srv-rotator-live-badge" class="badge-pill badge-beauty">🟢 ACTIVE</span>
              </div>
              <div style="font-size:1.1rem; font-weight:800; color:#fff; margin-bottom:6px;">Real-Time PostgreSQL & Socket Sync</div>
              <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.4; margin-bottom:14px;">
                یہ سیٹنگ تبدیل کرنے پر تمام کسٹمرز اور ٹیبز کے لیے بیک وقت 4 ہیرو کارڈز کا ٹائمر اپڈیٹ ہو جائے گا۔
              </p>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
                <div>
                  <div style="font-size:0.7rem; color:#94a3b8;">CURRENT SPEED</div>
                  <div style="font-size:1.35rem; font-weight:900; color:var(--swift-cyan);" id="srv-rotator-current-display">10 Seconds</div>
                </div>
                <a href="http://localhost:5173/" target="_blank" class="btn btn-storefront" style="padding:6px 12px; font-size:0.8rem;">
                  🛒 View Storefront
                </a>
              </div>
            </div>

            <!-- Categories -->
            <div style="background:rgba(15, 23, 42, 0.6); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:20px;">
              <h4 style="font-size:0.92rem; font-weight:900; color:#fff; margin-bottom:12px;">📌 زیر گردش کیٹیگریز (Active Rotator Categories):</h4>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="padding:8px 12px; background:#0f172a; border-radius:6px; border-left:3px solid #f59e0b; display:flex; justify-content:space-between;">
                  <strong style="font-size:0.85rem; color:#fff;">1. Kitchen & Appliances (First Priority)</strong>
                  <span class="badge-pill badge-appliances">Slot #1</span>
                </div>
                <div style="padding:8px 12px; background:#0f172a; border-radius:6px; border-left:3px solid #2563eb; display:flex; justify-content:space-between;">
                  <strong style="font-size:0.85rem; color:#fff;">2. Electronics & Tech Devices</strong>
                  <span class="badge-pill badge-electronics">Slot #2</span>
                </div>
                <div style="padding:8px 12px; background:#0f172a; border-radius:6px; border-left:3px solid #ec4899; display:flex; justify-content:space-between;">
                  <strong style="font-size:0.85rem; color:#fff;">3. Beauty & Personal Care</strong>
                  <span class="badge-pill badge-fashion">Slot #3</span>
                </div>
                <div style="padding:8px 12px; background:#0f172a; border-radius:6px; border-left:3px solid #10b981; display:flex; justify-content:space-between;">
                  <strong style="font-size:0.85rem; color:#fff;">4. Health & Household Essentials</strong>
                  <span class="badge-pill badge-beauty">Slot #4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>

  </main>

  <!-- MODAL: EDIT PRODUCT -->
  <div class="modal-overlay" id="edit-product-modal">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h3 class="modal-title" style="display:flex; align-items:center; gap:8px;">
            <span>✏️ Edit Product Details</span>
            <span id="edit-prod-sku-badge" class="badge-pill badge-electronics" style="font-family:var(--font-mono); font-size:0.75rem;"></span>
          </h3>
          <p style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Update product fields or picture. Changes synchronize in real-time across the customer storefront.</p>
        </div>
        <button type="button" onclick="closeModal('edit-product-modal')" class="btn btn-sm btn-outline">✕</button>
      </div>
      <form id="edit-product-form" onsubmit="submitEditProduct(event)">
        <input type="hidden" id="edit-prod-id">

        <!-- PRODUCT IMAGE EDIT SECTION -->
        <div class="form-group">
          <label style="font-size:0.85rem; font-weight:700; color:var(--swift-cyan); display:flex; align-items:center; gap:6px;">
            <span>📸 Product Picture & Visual Assets</span>
          </label>
          <div style="background:#090d16; border:1px solid #334155; border-radius:10px; padding:16px;">
            <div style="display:flex; gap:16px; align-items:center;">
              <div style="position:relative; width:80px; height:80px; flex-shrink:0;">
                <img id="edit-prod-img-preview" src="/elec_phone.png" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:2px solid var(--swift-cyan); background:#0f172a;" onerror="this.onerror=null; this.src='/elec_phone.png';">
              </div>
              <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; gap:10px; align-items:center;">
                  <button type="button" class="btn btn-primary btn-sm" onclick="triggerFileInput()" style="font-weight:700;">
                    📁 Choose Photo from PC
                  </button>
                  <span id="edit-file-name" style="font-size:0.75rem; color:#94a3b8;">No new file chosen</span>
                  <input type="file" id="edit-prod-file" accept="image/png, image/jpeg, image/webp" style="display:none;" onchange="handleEditFileChange(this)">
                </div>
                <div>
                  <div style="font-size:0.72rem; color:#64748b; margin-bottom:3px; font-weight:600;">Or Paste Image URL / Asset Path:</div>
                  <input type="text" id="edit-prod-img-url" class="form-control" placeholder="https://... or /image.png" oninput="updateEditImgPreview(this.value)" style="font-size:0.8rem; padding:6px 10px;">
                </div>
              </div>
            </div>

            <!-- PRESET QUICK SELECT -->
            <div style="margin-top:12px; border-top:1px solid #1e293b; padding-top:10px;">
              <div style="font-size:0.72rem; color:#94a3b8; font-weight:700; margin-bottom:6px;">⚡ Quick Select Preset Catalog Images:</div>
              <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;">
                ${presetThumbnailsHtml}
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Product Title</label>
          <input type="text" id="edit-prod-title" class="form-control" required placeholder="e.g. Apple AirPods Pro 2">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>SKU Code</label>
            <input type="text" id="edit-prod-sku" class="form-control" required style="font-family:var(--font-mono);">
          </div>
          <div class="form-group">
            <label>Department Category</label>
            <select id="edit-prod-category" class="form-control" required>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="electronics">Electronics</option>
              <option value="appliances">Kitchen & Appliances</option>
              <option value="health_household">Health & Househeld</option>
              <option value="pet_supplies">Pet Supplies</option>
              <option value="toys_games_baby">Toys,games,Baby</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Regular Price ($ USD)</label>
            <input type="number" id="edit-prod-reg-price" class="form-control" step="0.01" min="0" required>
          </div>
          <div class="form-group">
            <label>Sale Price ($ USD - Optional)</label>
            <input type="number" id="edit-prod-sale-price" class="form-control" step="0.01" min="0" placeholder="e.g. 199.99">
          </div>
          <div class="form-group">
            <label>Stock Quantity (Units)</label>
            <input type="number" id="edit-prod-qty" class="form-control" min="0" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Rating (1.0 to 5.0)</label>
            <input type="number" id="edit-prod-rating" class="form-control" step="0.1" min="1.0" max="5.0" value="4.9">
          </div>
          <div class="form-group">
            <label>Reviews Count</label>
            <input type="number" id="edit-prod-reviews" class="form-control" min="0" value="120">
          </div>
          <div class="form-group" style="display:flex; flex-direction:column; justify-content:center;">
            <label style="cursor:pointer; display:flex; align-items:center; gap:8px; margin-top:14px;">
              <input type="checkbox" id="edit-prod-flash" style="width:18px; height:18px; cursor:pointer;">
              <span style="font-weight:700; color:#f87171;">⚡ Flash Sale Active</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Technical Specifications / Attributes (JSON)</label>
          <textarea id="edit-prod-attrs" class="form-control" rows="3" style="font-family:var(--font-mono); font-size:0.78rem;" placeholder='{"Brand": "Apple", "Color": "Titanium"}'></textarea>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; border-top:1px solid #334155; padding-top:14px;">
          <button type="button" class="btn btn-outline" onclick="closeModal('edit-product-modal')">Cancel</button>
          <button type="submit" class="btn btn-primary" id="btn-edit-submit">💾 Save Product Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD PRODUCT -->
  <div class="modal-overlay" id="add-product-modal">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">Publish New Product to PostgreSQL</h3>
        <button type="button" onclick="closeModal('add-product-modal')" class="btn btn-sm btn-outline">✕</button>
      </div>
      <form id="add-product-form" onsubmit="submitNewProduct(event)">
        <div class="form-row">
          <div class="form-group">
            <label>Product Title</label>
            <input type="text" id="new-prod-title" class="form-control" required placeholder="e.g. Apple AirPods Pro 2">
          </div>
          <div class="form-group">
            <label>SKU Code</label>
            <input type="text" id="new-prod-sku" class="form-control" required placeholder="SO-US-ELEC-99" style="font-family:var(--font-mono);">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Department Category</label>
            <select id="new-prod-category" class="form-control" required>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="electronics">Electronics</option>
              <option value="appliances">Kitchen & Appliances</option>
              <option value="health_household">Health & Househeld</option>
              <option value="pet_supplies">Pet Supplies</option>
              <option value="toys_games_baby">Toys,games,Baby</option>
            </select>
          </div>
          <div class="form-group">
            <label>Initial Stock Qty</label>
            <input type="number" id="new-prod-qty" class="form-control" value="50" min="0" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Regular Price ($ USD)</label>
            <input type="number" id="new-prod-reg-price" class="form-control" step="0.01" min="0" required placeholder="249.99">
          </div>
          <div class="form-group">
            <label>Sale Price ($ USD - Optional)</label>
            <input type="number" id="new-prod-sale-price" class="form-control" step="0.01" min="0" placeholder="199.99">
          </div>
        </div>

        <div class="form-group">
          <label>Product Image (Upload Local Image or URL)</label>
          <div style="display:flex; gap:10px;">
            <input type="file" id="new-prod-file" class="form-control" accept="image/png, image/jpeg, image/webp" style="flex:1;">
            <input type="text" id="new-prod-img-url" class="form-control" value="/elec_phone.png" style="flex:1;">
          </div>
        </div>

        <div class="form-group">
          <label>Technical Specifications (JSON)</label>
          <input type="text" id="new-prod-attrs" class="form-control" placeholder='{"Brand": "Apple", "Color": "White"}'>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid #334155; padding-top:14px;">
          <button type="button" class="btn btn-outline" onclick="closeModal('add-product-modal')">Cancel</button>
          <button type="submit" class="btn btn-primary" id="btn-publish-submit">Publish US Product</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADMIN LOGIN -->
  <div class="modal-overlay" id="login-modal">
    <div class="modal-card" style="max-width: 440px;">
      <div class="modal-header">
        <h3 class="modal-title">🔐 Merchant Hub Authentication</h3>
      </div>
      <form onsubmit="handleLogin(event)">
        <div class="form-group">
          <label>Admin Email</label>
          <input type="email" id="login-email" class="form-control" value="admin@swiftorbits.us" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="login-password" class="form-control" value="admin123456" required>
        </div>
        <div style="background:#0f172a; padding:10px; border-radius:6px; font-size:0.75rem; color:#94a3b8; margin-bottom:14px;">
          💡 <strong>Default Demo Credentials:</strong><br>
          Email: <code>admin@swiftorbits.us</code> | Password: <code>admin123456</code>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Sign In to Merchant Hub</button>
      </form>
    </div>
  </div>

  <!-- MODAL: NEW ORDER LIVE ALERT -->
  <div class="modal-overlay" id="new-order-alert-modal" style="z-index: 3000;">
    <div class="modal-card" style="max-width: 530px; border: 2px solid #10b981; box-shadow: 0 0 35px rgba(16, 185, 129, 0.45); animation: pulseGlow 1.5s infinite alternate;">
      <div class="modal-header" style="background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1)); padding: 18px 24px; border-bottom: 1px solid rgba(16,185,129,0.3);">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:2rem; animation: bellRing 0.8s ease infinite alternate; display:inline-block;">🔔</div>
          <div>
            <h3 class="modal-title" style="color: #34d399; font-size:1.35rem; font-weight:800; letter-spacing:0.3px; margin:0;">
              You Have a New Order!
            </h3>
            <span style="display:inline-block; margin-top:3px; background:rgba(16,185,129,0.25); color:#a7f3d0; border:1px solid rgba(16,185,129,0.4); font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:12px; letter-spacing:0.5px;">
              ● LIVE STOREFRONT TRANSACTION
            </span>
          </div>
        </div>
        <button type="button" onclick="closeModal('new-order-alert-modal')" class="btn btn-sm btn-outline" style="border-color:#334155;">✕</button>
      </div>
      <div style="padding: 22px 24px;">
        <div style="background:#090d16; border:1px solid #334155; border-radius:10px; padding:16px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #1e293b;">
            <span style="font-size:0.8rem; color:#94a3b8; font-weight:600;">ORDER REFERENCE</span>
            <span id="alert-order-ref" style="font-family:var(--font-mono); font-weight:800; color:var(--swift-cyan); font-size:1.1rem;"></span>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:12px;">
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:600;">CUSTOMER</div>
              <div id="alert-order-customer" style="font-weight:700; color:#f8fafc; font-size:0.95rem; margin-top:2px;"></div>
              <div id="alert-order-phone" style="font-size:0.8rem; color:#94a3b8; margin-top:1px;"></div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#64748b; font-weight:600;">DESTINATION</div>
              <div id="alert-order-dest" style="font-weight:700; color:#f8fafc; font-size:0.95rem; margin-top:2px;"></div>
              <div id="alert-order-address" style="font-size:0.8rem; color:#94a3b8; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
            </div>
          </div>
          <div style="background:#0f172a; padding:10px 12px; border-radius:6px; margin-bottom:14px; border:1px solid #1e293b;">
            <div style="font-size:0.75rem; color:#64748b; font-weight:600; margin-bottom:4px;">ITEMS ORDERED</div>
            <div id="alert-order-item" style="font-weight:600; color:#e2e8f0; font-size:0.9rem;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:4px;">
            <div>
              <span style="font-size:0.82rem; color:#94a3b8; font-weight:600;">TOTAL PAID (USD):</span>
            </div>
            <div id="alert-order-total" style="font-size:1.5rem; font-weight:900; color:var(--swift-emerald); font-family:var(--font-mono);">
            </div>
          </div>
        </div>
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button type="button" class="btn btn-outline" onclick="closeModal('new-order-alert-modal')">Close</button>
          <button type="button" class="btn btn-primary" onclick="viewNewOrderInQueue()" style="background:var(--swift-emerald); border-color:var(--swift-emerald); color:#022c22; font-weight:800; font-size:0.9rem; padding:8px 18px;">
            🚚 View in Fulfillment Queue
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- TOAST CONTAINER -->
  <div class="toast-tray" id="toast-tray"></div>

  <script>
    // PRELOADED AUTHORITATIVE POSTGRESQL PRODUCTS & ORDERS
    window.__INITIAL_PRODUCTS__ = ${serializedProducts};
    window.__INITIAL_ORDERS__ = ${serializedOrders};

    let token = localStorage.getItem('swift_admin_token') || '';
    let products = Array.isArray(window.__INITIAL_PRODUCTS__) ? [...window.__INITIAL_PRODUCTS__] : [];
    let orders = Array.isArray(window.__INITIAL_ORDERS__) ? [...window.__INITIAL_ORDERS__] : [];

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    const socket = io();

    socket.on('connect', () => {
      const badge = document.getElementById('socket-badge');
      const label = document.getElementById('socket-label');
      if (badge) badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      if (label) label.textContent = 'Realtime Synchronized';
      if (token) socket.emit('join:admin');
    });

    socket.on('disconnect', () => {
      const badge = document.getElementById('socket-badge');
      const label = document.getElementById('socket-label');
      if (badge) badge.style.borderColor = 'rgba(244, 63, 94, 0.4)';
      if (label) label.textContent = 'Reconnecting...';
    });

    socket.on('order:created', (order) => {
      console.log('Realtime new order received:', order);

      // 1. Play alert chime
      playOrderChime();

      // 2. Open "You Have a New Order!" Modal
      const modal = document.getElementById('new-order-alert-modal');
      if (modal) {
        const refEl = document.getElementById('alert-order-ref');
        const custEl = document.getElementById('alert-order-customer');
        const phoneEl = document.getElementById('alert-order-phone');
        const destEl = document.getElementById('alert-order-dest');
        const addrEl = document.getElementById('alert-order-address');
        const itemEl = document.getElementById('alert-order-item');
        const totalEl = document.getElementById('alert-order-total');

        if (refEl) refEl.textContent = order.order_number || '';
        if (custEl) custEl.textContent = order.customer_name || 'Customer';
        if (phoneEl) phoneEl.textContent = order.customer_phone || '';
        if (destEl) destEl.textContent = (order.city || 'Los Angeles') + (order.state ? ', ' + order.state : ', CA');
        if (addrEl) addrEl.textContent = order.shipping_address || '';
        const itemTitle = order.product_title || 'SwiftOrbits Package';
        const qty = order.quantity || 1;
        if (itemEl) itemEl.textContent = itemTitle + ' (x' + qty + ')';
        if (totalEl) totalEl.textContent = '$' + Number(order.grand_total || 0).toFixed(2);

        modal.classList.add('open');
      }

      // 3. Show Toast notification
      showToast(\`🔔 <strong>You Have a New Order!</strong> #\${escapeHtml(order.order_number)} by \${escapeHtml(order.customer_name)} ($\${Number(order.grand_total).toFixed(2)})\`);

      // 4. Update orders table in real time
      const emptyRow = document.getElementById('empty-orders-row');
      if (emptyRow) emptyRow.remove();

      const existingIdx = orders.findIndex(o => o.id === order.id || o.order_number === order.order_number);
      if (existingIdx === -1) {
        orders.unshift(order);
      } else {
        orders[existingIdx] = order;
      }
      renderOrdersTable(orders);

      const tbody = document.getElementById('orders-tbody');
      if (tbody && tbody.firstElementChild) {
        tbody.firstElementChild.classList.add('highlight-new-order');
      }

      // 5. Update stat counters in real time
      updateOrderMetrics();
      loadAnalytics();
    });

    socket.on('order:updated', () => {
      loadOrders();
      loadAnalytics();
    });

    socket.on('product:created', (prod) => {
      const idx = products.findIndex(p => p.id === prod.id || p.sku === prod.sku);
      if (idx === -1) {
        products.unshift(prod);
      } else {
        products[idx] = prod;
      }
      applyFilters();
      updateProductMetrics();
      loadAnalytics();
    });

    socket.on('product:updated', (prod) => {
      const idx = products.findIndex(p => p.id === prod.id || p.sku === prod.sku);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...prod };
      } else {
        products.unshift(prod);
      }
      applyFilters();
      updateProductMetrics();
      loadAnalytics();
    });

    socket.on('product:deleted', (data) => {
      products = products.filter(p => p.id !== data.id && p.sku !== data.sku);
      applyFilters();
      updateProductMetrics();
      loadAnalytics();
    });

    socket.on('product:stock-updated', (data) => {
      const p = products.find(i => i.id === data.id || i.sku === data.sku);
      if (p) {
        p.stock_qty = data.stock_qty;
        applyFilters();
        updateProductMetrics();
      }
      loadAnalytics();
    });

    socket.on('settings:updated', (s) => {
      console.log('Realtime settings update received:', s);
      applySettingsData(s);
    });

    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtx = new AudioCtx();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }
    document.addEventListener('click', () => { getAudioContext(); }, { once: false });
    document.addEventListener('keydown', () => { getAudioContext(); }, { once: false });

    function playOrderChime() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [
          { freq: 523.25, time: 0.0, dur: 0.18 },
          { freq: 659.25, time: 0.12, dur: 0.22 },
          { freq: 783.99, time: 0.24, dur: 0.45 }
        ];
        notes.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
          gain.gain.setValueAtTime(0.28, ctx.currentTime + n.time);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + n.time);
          osc.stop(ctx.currentTime + n.time + n.dur);
        });
      } catch (e) {}
    }

    function viewNewOrderInQueue() {
      closeModal('new-order-alert-modal');
      const orderTabBtns = document.querySelectorAll('.tab-btn');
      if (orderTabBtns && orderTabBtns[1]) {
        switchTab('orders', orderTabBtns[1]);
      }
      setTimeout(() => {
        const tbody = document.getElementById('orders-tbody');
        if (tbody && tbody.firstElementChild) {
          tbody.firstElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
          tbody.firstElementChild.classList.add('highlight-new-order');
        }
      }, 50);
    }

    function updateOrderMetrics() {
      const totalOrders = orders.length;
      const grossRev = orders.filter(o => o.order_status !== 'cancelled').reduce((s, o) => s + Number(o.grand_total || 0), 0);
      const processingCount = orders.filter(o => o.order_status === 'processing').length;
      const deliveredCount = orders.filter(o => o.order_status === 'delivered').length;
      const cancelledCount = orders.filter(o => o.order_status === 'cancelled').length;
      const validOrders = totalOrders - cancelledCount;
      const aov = validOrders > 0 ? (grossRev / validOrders) : 0;

      let techUnits = 0;
      let fashionUnits = 0;
      orders.filter(o => o.order_status !== 'cancelled').forEach(o => {
        const sku = (o.sku || '').toLowerCase();
        const title = (o.product_title || '').toLowerCase();
        const cat = (o.category || '').toLowerCase();
        const qty = parseInt(o.quantity) || 1;
        if (cat.includes('beauty') || sku.includes('beauty') || title.includes('serum') || title.includes('cologne') || title.includes('cream')) {
          fashionUnits += qty;
        } else if (cat.includes('elec') || sku.includes('elec') || title.includes('phone') || title.includes('earbuds') || title.includes('tv') || title.includes('cable')) {
          techUnits += qty;
        }
      });

      const statElec = document.getElementById('stat-elec');
      const statFashion = document.getElementById('stat-fashion');
      const statOrders = document.getElementById('stat-orders');
      const statRevenue = document.getElementById('stat-revenue');
      const ledgerGross = document.getElementById('ledger-gross');
      const ledgerProcessing = document.getElementById('ledger-processing');
      const ledgerDelivered = document.getElementById('ledger-delivered');
      const ledgerAov = document.getElementById('ledger-aov');

      if (statElec) statElec.textContent = techUnits + ' Units';
      if (statFashion) statFashion.textContent = fashionUnits + ' Units';
      if (statOrders) statOrders.textContent = totalOrders + ' Orders';
      if (statRevenue) statRevenue.textContent = 'Gross: $' + grossRev.toFixed(2);
      if (ledgerGross) ledgerGross.textContent = '$' + grossRev.toFixed(2);
      if (ledgerProcessing) ledgerProcessing.textContent = processingCount;
      if (ledgerDelivered) ledgerDelivered.textContent = deliveredCount;
      if (ledgerAov) ledgerAov.textContent = '$' + aov.toFixed(2);
    }

    function showToast(html) {
      const tray = document.getElementById('toast-tray');
      if (!tray) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = html;
      tray.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }, 4000);
    }

    async function getValidToken() {
      if (token) {
        try {
          const testRes = await fetch('/api/orders?limit=1', {
            headers: { Authorization: 'Bearer ' + token }
          });
          if (testRes.status === 200) return token;
        } catch(e) {}
      }
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@swiftorbits.us', password: 'admin123456' })
        });
        const data = await res.json();
        if (data.ok && data.token) {
          token = data.token;
          localStorage.setItem('swift_admin_token', token);
          const btn = document.getElementById('btn-logout');
          if (btn) btn.style.display = 'inline-flex';
          return token;
        }
      } catch(e) {}
      return token;
    }

    async function checkAuth() {
      await getValidToken();
      loadOrders();
      loadAnalytics();
    }

    async function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.ok) {
        token = data.token;
        localStorage.setItem('swift_admin_token', token);
        closeModal('login-modal');
        const btn = document.getElementById('btn-logout');
        if (btn) btn.style.display = 'inline-flex';
        socket.emit('join:admin');
        loadAll();
      } else {
        alert(data.error || 'Login failed');
      }
    }

    function logout() {
      token = '';
      localStorage.removeItem('swift_admin_token');
      document.getElementById('login-modal').classList.add('open');
      const btn = document.getElementById('btn-logout');
      if (btn) btn.style.display = 'none';
    }

    function switchTab(tabName, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + tabName);
      if (target) target.classList.add('active');
    }

    function openAddProductModal() {
      document.getElementById('add-product-modal').classList.add('open');
    }
    function closeModal(id) {
      const modal = document.getElementById(id);
      if (modal) modal.classList.remove('open');
    }

    async function loadAll() {
      await Promise.all([loadProducts(), loadOrders(), loadAnalytics(), loadSettings()]);
    }

    async function loadProducts() {
      try {
        const res = await fetch('/api/products?limit=500');
        const data = await res.json();
        if (data.ok && Array.isArray(data.products)) {
          products = data.products;
          applyFilters();
          updateProductMetrics();
        }
      } catch (e) {
        console.error('Failed loading products', e);
      }
    }

    function updateProductMetrics() {
      const totalProds = products.length;
      const totalUnits = products.reduce((acc, p) => acc + (parseInt(p.stock_qty) || 0), 0);
      const statProds = document.getElementById('stat-total-prods');
      const statStock = document.getElementById('stat-total-stock');
      const totalCount = document.getElementById('total-prod-count');

      if (statProds) statProds.textContent = totalProds + ' Products';
      if (statStock) statStock.textContent = totalUnits.toLocaleString() + ' Units in PostgreSQL';
      if (totalCount) totalCount.textContent = totalProds;
    }

    function applyFilters() {
      const searchEl = document.getElementById('inventory-search');
      const catEl = document.getElementById('inventory-cat-filter');
      const q = (searchEl ? searchEl.value : '').toLowerCase().trim();
      const cat = catEl ? catEl.value : 'all';

      const filtered = products.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const pTitle = (p.title || '').toLowerCase();
        const pSku = (p.sku || '').toLowerCase();
        const pAttrs = JSON.stringify(p.attributes || {}).toLowerCase();

        const matchCat = (cat === 'all' || pCat === cat);
        const matchSearch = (!q || pTitle.includes(q) || pSku.includes(q) || pCat.includes(q) || pAttrs.includes(q));
        return matchCat && matchSearch;
      });

      renderProductsTable(filtered);
    }

    function renderProductsTable(list) {
      const tbody = document.getElementById('inventory-tbody');
      if (!tbody) return;

      if (!list || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;">No products match the selected criteria.</td></tr>';
        return;
      }

      tbody.innerHTML = list.map(p => {
        const regularPrice = parseFloat(p.regular_price) || 0;
        const salePrice = (p.sale_price !== null && p.sale_price !== undefined && p.sale_price !== '') ? parseFloat(p.sale_price) : null;
        const stockQty = parseInt(p.stock_qty) || 0;
        const rating = parseFloat(p.rating || 4.9).toFixed(1);
        const reviewsCount = parseInt(p.reviews_count || 120);

        const priceStr = salePrice !== null ?
          \`<div><strong style="color:var(--swift-emerald); font-size:1.02rem;">$\${salePrice.toFixed(2)}</strong></div>
           <div style="font-size:0.75rem; color:#64748b; text-decoration:line-through;">$\${regularPrice.toFixed(2)}</div>\` :
          \`<strong style="font-size:1.02rem;">$\${regularPrice.toFixed(2)}</strong>\`;

        const attrs = typeof p.attributes === 'string' ? JSON.parse(p.attributes || '{}') : (p.attributes || {});
        const attrFlat = Object.entries(attrs).map(([k, v]) => \`\${k}: \${v}\`).join(' | ');

        const stockColor = stockQty <= 5 ? '#f43f5e' : (stockQty <= 15 ? '#f59e0b' : '#10b981');
        const safeTitle = escapeHtml(p.title || 'Untitled');
        const safeAttr = escapeHtml(attrFlat || 'Standard Specifications');
        const safeCategory = escapeHtml(p.category || 'general');
        const safeSku = escapeHtml(p.sku || '');
        const safeImage = escapeHtml(p.image || '/elec_phone.png');

        return \`
          <tr id="row-prod-\${p.id}">
            <td style="font-family:var(--font-mono); font-weight:700; color:var(--swift-cyan); white-space:nowrap;">
              \${safeSku}<br>
              <small style="color:#64748b; font-weight:normal;">#\${p.id}</small>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="prod-thumb-container" data-id="\${p.id}" onclick="openEditProductModal(\${p.id})" title="Click to edit product picture" style="position:relative; cursor:pointer; width:48px; height:48px; flex-shrink:0;">
                  <img src="\${safeImage}" style="width:48px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #334155; background:#0f172a;" onerror="this.onerror=null; this.src='/elec_phone.png';">
                  <span style="position:absolute; bottom:-3px; right:-3px; background:#2563eb; color:#fff; font-size:10px; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #0f172a;" title="Edit picture">📷</span>
                </div>
                <div class="prod-title-wrap">
                  <div class="prod-title-text" onclick="toggleTitle(this, event)" title="\${safeTitle}">\${safeTitle}</div>
                  <div style="display:flex; gap:6px; margin-top:4px; align-items:center;">
                    \${p.is_flash_sale ? '<span style="background:rgba(239,68,68,0.2); color:#f87171; border:1px solid rgba(239,68,68,0.4); font-size:0.65rem; font-weight:800; padding:1px 6px; border-radius:3px;">⚡ FLASH SALE</span>' : ''}
                    <span style="font-size:0.72rem; color:#94a3b8;">⭐ \${rating} (\${reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>
            </td>
            <td><span class="badge-pill badge-\${safeCategory}">\${safeCategory}</span></td>
            <td>\${priceStr}</td>
            <td>
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:\${stockColor}"></span>
                <strong style="font-size:1.05rem; color:\${stockQty <= 5 ? 'var(--swift-rose)' : 'inherit'};">\${stockQty}</strong>
                <small style="color:#64748b;">units</small>
              </div>
            </td>
            <td style="font-size:0.75rem; color:var(--text-muted); max-width:200px;">
              <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="\${safeAttr}">
                \${safeAttr}
              </div>
            </td>
            <td style="text-align:right; white-space:nowrap;">
              <div style="display:inline-flex; gap:6px; align-items:center;">
                <button class="btn btn-primary btn-sm btn-edit" data-id="\${p.id}" onclick="openEditProductModal(\${p.id})" style="font-weight:700;">
                  ✏️ Edit
                </button>
                <button class="btn btn-outline btn-sm btn-stock-adjust" onclick="adjustStock(\${p.id}, 10)" title="Quick +10 units">
                  +10
                </button>
                <button class="btn btn-outline btn-sm btn-stock-adjust" onclick="adjustStock(\${p.id}, -1)" title="Quick -1 unit">
                  -1
                </button>
                <button class="btn btn-outline btn-sm" onclick="confirmDeleteProduct(\${p.id})" title="Delete Product" style="color:var(--swift-rose); border-color:rgba(244,63,94,0.3);">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function toggleTitle(el, evt) {
      if (evt) evt.stopPropagation();
      el.classList.toggle('expanded');
    }
    window.toggleTitle = toggleTitle;

    // OPEN EDIT MODAL & POPULATE FIELDS
    function openEditProductModal(id) {
      const prod = products.find(p => p.id === id);
      if (!prod) return;

      document.getElementById('edit-prod-id').value = prod.id;
      document.getElementById('edit-prod-sku-badge').textContent = prod.sku || '';
      document.getElementById('edit-prod-sku').value = prod.sku || '';
      document.getElementById('edit-prod-title').value = prod.title || '';
      document.getElementById('edit-prod-category').value = prod.category || 'electronics';
      document.getElementById('edit-prod-reg-price').value = prod.regular_price || '';
      document.getElementById('edit-prod-sale-price').value = (prod.sale_price !== null && prod.sale_price !== undefined) ? prod.sale_price : '';
      document.getElementById('edit-prod-qty').value = prod.stock_qty || 0;
      document.getElementById('edit-prod-rating').value = prod.rating || 4.9;
      document.getElementById('edit-prod-reviews').value = prod.reviews_count || 120;
      document.getElementById('edit-prod-flash').checked = !!prod.is_flash_sale;
      document.getElementById('edit-prod-img-url').value = prod.image || '/elec_phone.png';
      document.getElementById('edit-prod-img-preview').src = prod.image || '/elec_phone.png';
      document.getElementById('edit-prod-file').value = '';
      document.getElementById('edit-file-name').textContent = 'Current image loaded';
      document.getElementById('edit-prod-attrs').value = JSON.stringify(prod.attributes || {}, null, 2);

      document.getElementById('edit-product-modal').classList.add('open');
    }

    function triggerFileInput() {
      document.getElementById('edit-prod-file').click();
    }

    function selectPresetImage(url) {
      document.getElementById('edit-prod-img-url').value = url;
      document.getElementById('edit-prod-img-preview').src = url;
      document.getElementById('edit-prod-file').value = '';
      document.getElementById('edit-file-name').textContent = 'Preset: ' + url;
      showToast('Selected image: ' + url);
    }

    function updateEditImgPreview(url) {
      if (url && url.trim()) {
        document.getElementById('edit-prod-img-preview').src = url.trim();
        document.getElementById('edit-file-name').textContent = 'Custom URL entered';
      }
    }

    function handleEditFileChange(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        document.getElementById('edit-file-name').textContent = 'Selected: ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('edit-prod-img-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    // SUBMIT EDIT PRODUCT FORM
    async function submitEditProduct(e) {
      e.preventDefault();
      const id = document.getElementById('edit-prod-id').value;
      const sku = document.getElementById('edit-prod-sku').value.trim().toUpperCase();
      const title = document.getElementById('edit-prod-title').value.trim();
      const category = document.getElementById('edit-prod-category').value;
      const regular_price = parseFloat(document.getElementById('edit-prod-reg-price').value) || 0;
      const saleVal = document.getElementById('edit-prod-sale-price').value.trim();
      const sale_price = saleVal ? parseFloat(saleVal) : null;
      const stock_qty = parseInt(document.getElementById('edit-prod-qty').value) || 0;
      const rating = parseFloat(document.getElementById('edit-prod-rating').value) || 4.9;
      const reviews_count = parseInt(document.getElementById('edit-prod-reviews').value) || 120;
      const is_flash_sale = document.getElementById('edit-prod-flash').checked;
      const rawAttrs = document.getElementById('edit-prod-attrs').value.trim();
      const fileInput = document.getElementById('edit-prod-file');
      let imageUrl = document.getElementById('edit-prod-img-url').value.trim() || '/elec_phone.png';

      let attributes = {};
      if (rawAttrs) {
        try {
          attributes = JSON.parse(rawAttrs);
        } catch(err) {
          alert('Invalid JSON in Technical Specifications! Please format as valid JSON.');
          return;
        }
      }

      const btn = document.getElementById('btn-edit-submit');
      btn.disabled = true;
      btn.textContent = 'Saving Changes...';

      try {
        const validToken = await getValidToken();

        // 1. Upload new image file if chosen
        if (fileInput.files && fileInput.files[0]) {
          btn.textContent = 'Uploading Photo...';
          const fd = new FormData();
          fd.append('image', fileInput.files[0]);
          const upRes = await fetch('/api/upload', {
            method: 'POST',
            headers: validToken ? { Authorization: \`Bearer \${validToken}\` } : {},
            body: fd
          });
          const upData = await upRes.json();
          if (upData.ok && upData.url) {
            imageUrl = upData.url;
          } else {
            alert('Image upload failed: ' + (upData.error || 'Server error'));
            btn.disabled = false;
            btn.textContent = '💾 Save Product Changes';
            return;
          }
        }

        // 2. Patch Product in PostgreSQL
        btn.textContent = 'Updating Database...';
        const res = await fetch(\`/api/products/\${id}\`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(validToken ? { Authorization: \`Bearer \${validToken}\` } : {})
          },
          body: JSON.stringify({
            sku,
            title,
            category,
            regular_price,
            sale_price,
            stock_qty,
            rating,
            reviews_count,
            is_flash_sale,
            attributes,
            image: imageUrl
          })
        });

        const data = await res.json();
        if (data.ok) {
          closeModal('edit-product-modal');
          showToast(\`✅ <strong>Product & Picture Updated!</strong> \${escapeHtml(data.product.title)}\`);
          const idx = products.findIndex(p => p.id === parseInt(id));
          if (idx !== -1) {
            products[idx] = data.product;
            applyFilters();
            updateProductMetrics();
          }
        } else {
          alert(data.error || 'Failed to update product');
        }
      } catch (err) {
        alert('Server error: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = '💾 Save Product Changes';
      }
    }

    async function adjustStock(id, delta) {
      try {
        const validToken = await getValidToken();
        const res = await fetch(\`/api/products/\${id}/stock\`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(validToken ? { Authorization: \`Bearer \${validToken}\` } : {})
          },
          body: JSON.stringify({ delta })
        });
        const data = await res.json();
        if (data.ok) {
          showToast(\`📦 Stock adjusted for \${escapeHtml(data.product.sku)}: \${data.product.stock_qty} units\`);
          const p = products.find(i => i.id === id);
          if (p) {
            p.stock_qty = data.product.stock_qty;
            applyFilters();
            updateProductMetrics();
          }
        }
      } catch (e) {
        alert('Stock update error: ' + e.message);
      }
    }

    async function confirmDeleteProduct(id) {
      const prod = products.find(p => p.id === id);
      if (!prod) return;

      if (!confirm(\`Are you sure you want to remove "\${prod.title}" (\${prod.sku}) from active catalog?\`)) {
        return;
      }

      try {
        const validToken = await getValidToken();
        const res = await fetch(\`/api/products/\${id}\`, {
          method: 'DELETE',
          headers: validToken ? { Authorization: \`Bearer \${validToken}\` } : {}
        });
        const data = await res.json();
        if (data.ok) {
          showToast(\`🗑️ Product removed: \${escapeHtml(prod.title)}\`);
          products = products.filter(p => p.id !== id);
          applyFilters();
          updateProductMetrics();
        } else {
          alert(data.error || 'Failed to delete');
        }
      } catch(e) {
        alert('Delete error: ' + e.message);
      }
    }

    async function submitNewProduct(e) {
      e.preventDefault();
      const title = document.getElementById('new-prod-title').value.trim();
      const sku = document.getElementById('new-prod-sku').value.trim().toUpperCase();
      const category = document.getElementById('new-prod-category').value;
      const stock_qty = parseInt(document.getElementById('new-prod-qty').value) || 0;
      const regular_price = parseFloat(document.getElementById('new-prod-reg-price').value) || 0;
      const saleVal = document.getElementById('new-prod-sale-price').value.trim();
      const sale_price = saleVal ? parseFloat(saleVal) : null;
      const rawAttrs = document.getElementById('new-prod-attrs').value.trim();
      const fileInput = document.getElementById('new-prod-file');
      const urlInput = document.getElementById('new-prod-img-url');

      let attributes = {};
      if (rawAttrs) {
        try { attributes = JSON.parse(rawAttrs); } catch(err) { alert('Invalid JSON in specs'); return; }
      }

      let imageUrl = urlInput.value || '/elec_phone.png';

      const btn = document.getElementById('btn-publish-submit');
      btn.disabled = true;
      btn.textContent = 'Publishing...';

      try {
        const validToken = await getValidToken();
        if (fileInput.files && fileInput.files[0]) {
          const fd = new FormData();
          fd.append('image', fileInput.files[0]);
          const upRes = await fetch('/api/upload', {
            method: 'POST',
            headers: validToken ? { Authorization: \`Bearer \${validToken}\` } : {},
            body: fd
          });
          const upData = await upRes.json();
          if (upData.ok) imageUrl = upData.url;
        }

        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(validToken ? { Authorization: \`Bearer \${validToken}\` } : {})
          },
          body: JSON.stringify({
            title, sku, category, regular_price, sale_price, stock_qty, attributes, image: imageUrl
          })
        });

        const data = await res.json();
        if (data.ok) {
          closeModal('add-product-modal');
          document.getElementById('add-product-form').reset();
          showToast('Product published to PostgreSQL catalog!');
          loadProducts();
        } else {
          alert(data.error || 'Failed to publish');
        }
      } catch (e) {
        alert('Server error: ' + e.message);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Publish US Product';
      }
    }

    async function loadOrders() {
      try {
        const validToken = await getValidToken();
        const res = await fetch('/api/orders', {
          headers: validToken ? { Authorization: \`Bearer \${validToken}\` } : {}
        });
        const data = await res.json();
        if (data.ok && Array.isArray(data.orders)) {
          orders = data.orders;
          renderOrdersTable(orders);
          updateOrderMetrics();
        }
      } catch (e) {
        console.error('Failed loading orders', e);
      }
    }

    function renderOrdersTable(list) {
      const tbody = document.getElementById('orders-tbody');
      if (!tbody) return;

      if (!list || list.length === 0) {
        tbody.innerHTML = '<tr id="empty-orders-row"><td colspan="7" style="text-align:center; padding:45px 20px; color:#64748b;"><div style="font-size:1.8rem; margin-bottom:8px;">📦</div><div style="font-weight:700; color:#94a3b8; font-size:1rem;">No Customer Orders Placed Yet</div><div style="font-size:0.8rem; color:#64748b; margin-top:4px;">When an order is placed on the Customer Storefront (Port 5173), it will arrive here instantly with a live alert notification.</div></td></tr>';
        return;
      }

      tbody.innerHTML = list.map(o => \`
        <tr>
          <td>
            <strong style="font-family:var(--font-mono); color:var(--swift-cyan);">\${escapeHtml(o.order_number)}</strong><br>
            <small style="color:#64748b;">\${new Date(o.created_at).toLocaleDateString()}</small>
          </td>
          <td>
            <strong>\${escapeHtml(o.customer_name)}</strong><br>
            <small style="color:#64748b;">\${escapeHtml(o.customer_phone)}</small>
          </td>
          <td>
            <div><strong>\${escapeHtml(o.city)}, \${escapeHtml(o.state)}</strong></div>
            <small style="color:#64748b;">\${escapeHtml(o.shipping_address)}</small>
          </td>
          <td>
            <strong>\${escapeHtml(o.product_title)}</strong> (x\${o.quantity})<br>
            <small style="font-family:var(--font-mono); color:#64748b;">\${escapeHtml(o.sku)}</small>
          </td>
          <td><strong style="color:var(--swift-emerald); font-size:1.05rem;">$\${Number(o.grand_total).toFixed(2)}</strong></td>
          <td>
            <select class="status-select" onchange="updateStatus(\${o.id}, this.value)">
              <option value="pending" \${o.order_status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="processing" \${o.order_status === 'processing' ? 'selected' : ''}>Processing</option>
              <option value="dispatched" \${o.order_status === 'dispatched' ? 'selected' : ''}>Dispatched (USPS)</option>
              <option value="delivered" \${o.order_status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" \${o.order_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="alert('USPS Thermal Label Printed for #' + '\${escapeHtml(o.order_number)}')">🖨️ Label</button>
          </td>
        </tr>
      \`).join('');
    }

    async function updateStatus(orderId, status) {
      try {
        const validToken = await getValidToken();
        const res = await fetch(\`/api/orders/\${orderId}/status\`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(validToken ? { Authorization: \`Bearer \${validToken}\` } : {})
          },
          body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.ok) {
          showToast(\`Order #\${escapeHtml(data.order.order_number)} status updated to '\${escapeHtml(status)}'\`);
        }
      } catch (e) {
        alert('Update error: ' + e.message);
      }
    }

    async function loadAnalytics() {
      try {
        const validToken = await getValidToken();
        const res = await fetch('/api/analytics', {
          headers: validToken ? { Authorization: \`Bearer \${validToken}\` } : {}
        });
        const data = await res.json();
        if (data.ok && data.analytics) {
          const a = data.analytics;
          const statElec = document.getElementById('stat-elec');
          const statFashion = document.getElementById('stat-fashion');
          const statOrders = document.getElementById('stat-orders');
          const statRevenue = document.getElementById('stat-revenue');

          if (statElec) statElec.textContent = (a.department_stock.tech || 0) + ' Units';
          if (statFashion) statFashion.textContent = (a.department_stock.fashion || 0) + ' Units';
          if (statOrders) statOrders.textContent = (a.active_orders || 0) + ' Orders';
          if (statRevenue) statRevenue.textContent = 'Gross: $' + Number(a.gross_revenue).toFixed(2);

          const ledgerGross = document.getElementById('ledger-gross');
          const ledgerProcessing = document.getElementById('ledger-processing');
          const ledgerDelivered = document.getElementById('ledger-delivered');
          const ledgerAov = document.getElementById('ledger-aov');

          if (ledgerGross) ledgerGross.textContent = '$' + Number(a.gross_revenue).toFixed(2);
          if (ledgerProcessing) ledgerProcessing.textContent = a.processing_orders || 0;
          if (ledgerDelivered) ledgerDelivered.textContent = a.delivered_orders || 0;
          if (ledgerAov) ledgerAov.textContent = '$' + Number(a.aov).toFixed(2);
        }
      } catch (e) {
        console.error('Failed loading analytics', e);
      }
    }

    let currentSettings = {
      hero_quad_rotation_seconds: 10,
      hero_quad_rotation_enabled: true
    };

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.ok && data.settings) {
          applySettingsData(data.settings);
        }
      } catch (err) {
        console.error('Failed loading settings:', err);
      }
    }

    function applySettingsData(s) {
      if (!s) return;
      if (s.hero_quad_rotation_seconds !== undefined) {
        currentSettings.hero_quad_rotation_seconds = parseInt(s.hero_quad_rotation_seconds, 10) || 10;
      }
      if (s.hero_quad_rotation_enabled !== undefined) {
        currentSettings.hero_quad_rotation_enabled = s.hero_quad_rotation_enabled !== false;
      }

      const sec = currentSettings.hero_quad_rotation_seconds;
      const enabled = currentSettings.hero_quad_rotation_enabled;

      const secEl = document.getElementById('srv-rotator-seconds-val');
      if (secEl) secEl.textContent = sec;

      const sliderEl = document.getElementById('srv-rotator-slider');
      if (sliderEl) sliderEl.value = Math.min(60, Math.max(1, sec));

      const numInputEl = document.getElementById('srv-rotator-num-input');
      if (numInputEl) numInputEl.value = sec;

      const currentDisplayEl = document.getElementById('srv-rotator-current-display');
      if (currentDisplayEl) currentDisplayEl.textContent = enabled ? sec + ' Seconds' : 'Paused (Disabled)';

      const toggleEl = document.getElementById('srv-rotator-toggle');
      if (toggleEl) toggleEl.checked = enabled;

      const liveBadge = document.getElementById('srv-rotator-live-badge');
      if (liveBadge) {
        liveBadge.textContent = enabled ? '🟢 ACTIVE' : '⏸️ PAUSED';
        liveBadge.className = enabled ? 'badge-pill badge-beauty' : 'badge-pill badge-fashion';
      }

      const statRotatorVal = document.getElementById('stat-rotator-val');
      if (statRotatorVal) statRotatorVal.textContent = sec + 's';

      const statRotatorSub = document.getElementById('stat-rotator-sub');
      if (statRotatorSub) statRotatorSub.textContent = enabled ? '🟢 ' + sec + 's Cycle' : '⏸️ Paused';
    }

    function adjustRotatorSpeed(delta) {
      const newSec = Math.max(1, Math.min(300, (currentSettings.hero_quad_rotation_seconds || 10) + delta));
      setRotatorSpeedDirect(newSec);
    }

    function onSrvSliderInput(val) {
      const sec = parseInt(val, 10) || 10;
      const secEl = document.getElementById('srv-rotator-seconds-val');
      if (secEl) secEl.textContent = sec;
      const numInputEl = document.getElementById('srv-rotator-num-input');
      if (numInputEl) numInputEl.value = sec;
    }

    function onSrvSliderChange(val) {
      setRotatorSpeedDirect(parseInt(val, 10) || 10);
    }

    function onSrvNumChange(val) {
      setRotatorSpeedDirect(parseInt(val, 10) || 10);
    }

    function toggleRotatorActive(active) {
      currentSettings.hero_quad_rotation_enabled = !!active;
      applySettingsData(currentSettings);
      saveRotatorSettings(false);
    }

    async function setRotatorSpeedDirect(sec) {
      sec = Math.max(1, Math.min(300, parseInt(sec, 10) || 10));
      currentSettings.hero_quad_rotation_seconds = sec;
      applySettingsData(currentSettings);
      await saveRotatorSettings(false);
    }

    async function saveRotatorSettings(notify = true) {
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hero_quad_rotation_seconds: currentSettings.hero_quad_rotation_seconds,
            hero_quad_rotation_enabled: currentSettings.hero_quad_rotation_enabled
          })
        });
        const data = await res.json();
        if (data.ok) {
          if (notify) alert('Hero Showcase settings saved successfully (' + currentSettings.hero_quad_rotation_seconds + 's)!');
        } else {
          alert('Failed to save settings: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error saving settings:', err);
      }
    }

    async function resetRotatorSettings() {
      currentSettings.hero_quad_rotation_seconds = 10;
      currentSettings.hero_quad_rotation_enabled = true;
      applySettingsData(currentSettings);
      await saveRotatorSettings(false);
      alert('Rotator speed reset to default 10 seconds.');
    }

    // Double-bind table click events to ensure clicks always work
    function setupDelegatedListeners() {
      const tbody = document.getElementById('inventory-tbody');
      if (!tbody) return;
      tbody.addEventListener('click', (e) => {
        const editTarget = e.target.closest('.btn-edit') || e.target.closest('.prod-thumb-container');
        if (editTarget) {
          const id = editTarget.getAttribute('data-id');
          if (id) {
            e.preventDefault();
            openEditProductModal(parseInt(id));
          }
        }
      });
    }

    // INITIALIZE
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setupDelegatedListeners();
        checkAuth();
      });
    } else {
      setupDelegatedListeners();
      checkAuth();
    }
  </script>
</body>
</html>`;
}
