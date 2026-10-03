import http from 'http';
import app from '../src/app.js';
import { testConnection, close } from '../src/db.js';
import { initSocket } from '../src/sockets/socketManager.js';
import { runSeed } from './seed.js';

const PORT = 4001; // isolated test port
const BASE_URL = `http://localhost:${PORT}/api`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('  Running SwiftOrbits Backend Integration Test Suite     ');
  console.log('========================================================');

  // 1. Ensure Seed Data
  await runSeed();

  const server = http.createServer(app);
  initSocket(server, '*');

  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server listening on port ${PORT}...`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(` [PASS] ${message}`);
      passed++;
    } else {
      console.error(` [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: Health Check
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.body.ok === true && health.body.database === true, 'Health check verifies server & database');

    // TEST 2: Admin Login
    const loginFail = await request('POST', '/admin/login', { email: 'admin@swiftorbits.us', password: 'wrongpassword' });
    assert(loginFail.status === 401, 'Admin login rejects incorrect password');

    const loginSuccess = await request('POST', '/admin/login', { email: 'admin@swiftorbits.us', password: 'admin123456' });
    assert(loginSuccess.status === 200 && !!loginSuccess.body.token, 'Admin login succeeds with valid credentials and returns JWT');
    const adminToken = loginSuccess.body.token;

    // TEST 3: Categories API
    const categories = await request('GET', '/categories');
    assert(categories.status === 200 && categories.body.categories.length >= 7, `Categories API returns all seeded categories (${categories.body.count})`);

    // TEST 4: Products API
    const products = await request('GET', '/products');
    assert(products.status === 200 && products.body.products.length >= 86, `Products API returns seeded products (${products.body.count})`);

    // Filter by Category
    const elecProducts = await request('GET', '/products?category=electronics');
    assert(elecProducts.status === 200 && elecProducts.body.products.every(p => p.category === 'electronics'), 'Products API correctly filters by category');

    // TEST 5: Create Product (Admin Only)
    const testSku = 'TEST-PROD-' + Date.now();
    const createNoAuth = await request('POST', '/products', { title: 'Test Product', sku: testSku, category: 'electronics', regular_price: 100 });
    assert(createNoAuth.status === 401, 'Product creation requires admin authentication');

    const createSuccess = await request('POST', '/products', {
      title: 'Automated Test Drone 4K',
      sku: testSku,
      category: 'electronics',
      regular_price: 399.99,
      sale_price: 349.99,
      stock_qty: 25,
      attributes: { Brand: 'SwiftAero', Range: '5km' }
    }, { Authorization: `Bearer ${adminToken}` });
    assert(createSuccess.status === 201 && createSuccess.body.product.sku === testSku, 'Admin can create a new product in PostgreSQL');

    // Duplicate SKU Rejection
    const createDuplicate = await request('POST', '/products', {
      title: 'Duplicate SKU Product',
      sku: testSku,
      category: 'electronics',
      regular_price: 99.99
    }, { Authorization: `Bearer ${adminToken}` });
    assert(createDuplicate.status === 409, 'Duplicate SKU is strictly rejected with 409 Conflict');

    // TEST 6: Adjust Stock API
    const adjustStockRes = await request('PATCH', `/products/${createSuccess.body.product.id}/stock`, { delta: 10 }, { Authorization: `Bearer ${adminToken}` });
    assert(adjustStockRes.status === 200 && adjustStockRes.body.product.stock_qty === 35, 'Admin can atomically adjust product stock via API');

    // TEST 7: Customer Order Placement (Transactional & Atomic Stock Decrement)
    const orderRes = await request('POST', '/orders', {
      customer_name: 'Test Customer',
      customer_phone: '+1 (555) 000-1122',
      customer_email: 'test.customer@example.com',
      shipping_address: '100 Silicon Way',
      city: 'San Francisco',
      state: 'CA',
      sku: testSku,
      quantity: 5
    });

    assert(orderRes.status === 201 && orderRes.body.ok === true, 'Customer can place order via POST /api/orders');
    assert(orderRes.body.order.subtotal === 1749.95, `Server accurately calculated subtotal from DB prices ($${orderRes.body.order.subtotal})`);

    // Verify Stock decreased in database
    const verifyProd = await request('GET', `/products/${testSku}`);
    assert(verifyProd.body.product.stock_qty === 30, `Atomic inventory deduction verified: stock decreased from 35 to ${verifyProd.body.product.stock_qty}`);

    // TEST 8: Insufficient Stock Rejection
    const oversellOrder = await request('POST', '/orders', {
      customer_name: 'Greedy Buyer',
      customer_phone: '+1 (555) 999-8877',
      customer_email: 'greedy@example.com',
      shipping_address: '200 Market St',
      city: 'San Francisco',
      state: 'CA',
      sku: testSku,
      quantity: 999
    });
    assert(oversellOrder.status === 400 && oversellOrder.body.error.includes('Insufficient stock'), 'Overselling beyond available stock is rejected with clear error');

    // TEST 9: Order Tracking API
    const orderNumber = orderRes.body.order.order_number;
    const trackingRes = await request('GET', `/orders/${orderNumber}`);
    assert(trackingRes.status === 200 && trackingRes.body.order.order_number === orderNumber, 'Order tracking API retrieves customer order by order number');

    // TEST 10: Admin Update Order Status
    const orderId = orderRes.body.order.id;
    const statusUpdateRes = await request('PATCH', `/orders/${orderId}/status`, {
      status: 'dispatched',
      comment: 'USPS Tracking ID #940011189922334455'
    }, { Authorization: `Bearer ${adminToken}` });
    assert(statusUpdateRes.status === 200 && statusUpdateRes.body.order.order_status === 'dispatched', 'Admin can update order status to dispatched');

    // TEST 11: Analytics API
    const analyticsRes = await request('GET', '/analytics', null, { Authorization: `Bearer ${adminToken}` });
    assert(analyticsRes.status === 200 && analyticsRes.body.analytics.gross_revenue > 0, `Analytics API computes live financial aggregates (Gross: $${analyticsRes.body.analytics.gross_revenue})`);

    // TEST 12: Security - Protected Routes Reject Invalid Tokens
    const badTokenRes = await request('GET', '/analytics', null, { Authorization: 'Bearer invalid_token_123' });
    assert(badTokenRes.status === 401, 'Protected routes strictly reject invalid authentication tokens');

  } catch (err) {
    console.error('Test Suite encountered unhandled exception:', err);
    failed++;
  } finally {
    server.close();
    await close();
    console.log('========================================================');
    console.log(`Integration Test Results: ${passed} Passed, ${failed} Failed.`);
    console.log('========================================================');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
