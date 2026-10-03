import { query } from '../db.js';

export async function getAnalytics(req, res) {
  try {
    // 1. Gross revenue (excluding cancelled orders)
    const revRes = await query(`
      SELECT COALESCE(SUM(grand_total), 0) AS gross_revenue
      FROM orders
      WHERE order_status != 'cancelled';
    `);
    const grossRevenue = parseFloat(revRes.rows[0].gross_revenue || 0);

    // 2. Order counts by status
    const statusCountsRes = await query(`
      SELECT order_status, COUNT(*) as count
      FROM orders
      GROUP BY order_status;
    `);

    const statusMap = {
      pending: 0,
      processing: 0,
      dispatched: 0,
      delivered: 0,
      cancelled: 0
    };

    let totalOrders = 0;
    for (const row of statusCountsRes.rows) {
      statusMap[row.order_status] = parseInt(row.count) || 0;
      totalOrders += parseInt(row.count) || 0;
    }

    const activeOrders = statusMap.processing + statusMap.pending;
    const completedOrders = statusMap.delivered;
    const cancelledOrders = statusMap.cancelled;

    // 3. Average Order Value (AOV)
    const validOrdersCount = totalOrders - cancelledOrders;
    const aov = validOrdersCount > 0 ? (grossRevenue / validOrdersCount) : 0;

    // 4. Department real order units (Units sold)
    const deptSoldRes = await query(`
      SELECT 
        p.category,
        COALESCE(SUM(oi.quantity), 0) as units_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.order_status != 'cancelled'
      GROUP BY p.category;
    `);

    const departmentStock = {
      beauty: 0,
      electronics: 0,
      appliances: 0,
      health_household: 0,
      pet_supplies: 0,
      toys_games_baby: 0
    };

    let totalInventoryUnits = 0;
    for (const row of deptSoldRes.rows) {
      departmentStock[row.category] = parseInt(row.units_sold) || 0;
      totalInventoryUnits += parseInt(row.units_sold) || 0;
    }

    // 5. Recent orders
    const recentOrdersRes = await query(`
      SELECT o.id, o.order_number, o.customer_name, o.grand_total, o.order_status, o.created_at
      FROM orders o
      ORDER BY o.id DESC
      LIMIT 5;
    `);

    // 6. Top selling products
    const topProductsRes = await query(`
      SELECT p.id, p.sku, p.title, p.category, p.image, p.stock_qty,
             COALESCE(SUM(oi.quantity), 0) as units_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.sku, p.title, p.category, p.image, p.stock_qty
      ORDER BY units_sold DESC, p.id ASC
      LIMIT 5;
    `);

    return res.json({
      ok: true,
      analytics: {
        gross_revenue: grossRevenue,
        aov: Math.round(aov * 100) / 100,
        total_orders: totalOrders,
        active_orders: activeOrders,
        processing_orders: statusMap.processing,
        dispatched_orders: statusMap.dispatched,
        delivered_orders: completedOrders,
        cancelled_orders: cancelledOrders,
        total_inventory_units: totalInventoryUnits,
        department_stock: {
          ...departmentStock,
          tech: (departmentStock.electronics || 0) + (departmentStock.appliances || 0)
        },
        recent_orders: recentOrdersRes.rows.map(o => ({
          ...o,
          grand_total: parseFloat(o.grand_total)
        })),
        top_products: topProductsRes.rows.map(p => ({
          ...p,
          units_sold: parseInt(p.units_sold) || 0
        }))
      }
    });
  } catch (err) {
    console.error('Error computing analytics:', err);
    return res.status(500).json({ ok: false, error: 'Failed to compute analytics.' });
  }
}

export default {
  getAnalytics
};
