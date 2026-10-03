import { getClient, query } from '../db.js';
import {
  emitOrderCreated,
  emitOrderUpdated,
  emitStockUpdated
} from '../sockets/socketManager.js';

export async function createOrder(req, res) {
  const client = await getClient();
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      city,
      state,
      items, // array of { sku, quantity } or single { sku, quantity }
      sku,
      quantity,
      payment_method = 'credit_card'
    } = req.body;

    // Validate required customer shipping information
    if (!customer_name || !customer_phone || !customer_email || !shipping_address) {
      return res.status(400).json({
        ok: false,
        error: 'Complete shipping information (name, phone, email, address) is required.'
      });
    }

    // Normalize order items: supports both multi-item cart and single direct purchase
    let normalizedItems = [];
    if (Array.isArray(items) && items.length > 0) {
      normalizedItems = items;
    } else if (sku) {
      normalizedItems = [{ sku, quantity: parseInt(quantity) || 1 }];
    } else {
      return res.status(400).json({
        ok: false,
        error: 'Order must contain at least one product item.'
      });
    }

    // BEGIN ATOMIC TRANSACTION
    await client.query('BEGIN');

    let subtotal = 0;
    const resolvedOrderItems = [];
    const affectedProducts = [];

    for (const item of normalizedItems) {
      const itemQty = Math.max(1, parseInt(item.quantity) || 1);
      const cleanSku = (item.sku || '').trim().toUpperCase();

      // Row-level lock using PostgreSQL FOR UPDATE
      const prodRes = await client.query(
        'SELECT id, sku, title, regular_price, sale_price, stock_qty, category, image FROM products WHERE sku = $1 AND active = true FOR UPDATE;',
        [cleanSku]
      );

      if (prodRes.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(404).json({
          ok: false,
          error: `Product with SKU '${cleanSku}' was not found in active inventory.`
        });
      }

      const product = prodRes.rows[0];

      // Atomic stock availability check
      if (product.stock_qty < itemQty) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(400).json({
          ok: false,
          error: `Insufficient stock for '${product.title}'. Requested: ${itemQty}, Available: ${product.stock_qty}.`
        });
      }

      // Server-authoritative price calculation (never trust client)
      const unitPrice = product.sale_price !== null && !isNaN(product.sale_price)
        ? parseFloat(product.sale_price)
        : parseFloat(product.regular_price);

      const lineTotal = Math.round((unitPrice * itemQty) * 100) / 100;
      subtotal += lineTotal;

      resolvedOrderItems.push({
        product_id: product.id,
        sku: product.sku,
        product_title: product.title,
        quantity: itemQty,
        unit_price: unitPrice,
        line_total: lineTotal,
        new_stock: product.stock_qty - itemQty
      });

      affectedProducts.push({
        id: product.id,
        sku: product.sku,
        stock_qty: product.stock_qty - itemQty
      });
    }

    // Free 2-Day Prime shipping
    const shippingFee = 0.00;
    const grandTotal = Math.round((subtotal + shippingFee) * 100) / 100;

    // Generate unique order number (e.g. SO-US-482910)
    const orderNumber = 'SO-US-' + Math.floor(100000 + Math.random() * 900000);

    // 1. Insert Order
    const orderRes = await client.query(`
      INSERT INTO orders (
        order_number, customer_name, customer_phone, customer_email,
        shipping_address, city, state, shipping_fee, subtotal, grand_total,
        payment_method, payment_status, order_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'paid', 'processing')
      RETURNING *;
    `, [
      orderNumber,
      customer_name.trim(),
      customer_phone.trim(),
      customer_email.trim(),
      shipping_address.trim(),
      city ? city.trim() : 'Los Angeles',
      state ? state.trim().toUpperCase() : 'CA',
      shippingFee,
      subtotal,
      grandTotal,
      payment_method
    ]);

    const newOrder = orderRes.rows[0];

    // 2. Insert Order Items & Deduct Atomic Inventory
    for (const item of resolvedOrderItems) {
      await client.query(`
        INSERT INTO order_items (
          order_id, product_id, sku, product_title, quantity, unit_price, line_total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [
        newOrder.id,
        item.product_id,
        item.sku,
        item.product_title,
        item.quantity,
        item.unit_price,
        item.line_total
      ]);

      await client.query(`
        UPDATE products
        SET stock_qty = stock_qty - $1,
            sold_percent = LEAST(100, sold_percent + 2),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2;
      `, [item.quantity, item.product_id]);
    }

    // 3. Record Initial Status History
    await client.query(`
      INSERT INTO order_status_history (order_id, previous_status, new_status, comment)
      VALUES ($1, NULL, 'processing', 'Instant Prime Order Placed');
    `, [newOrder.id]);

    // COMMIT ATOMIC TRANSACTION
    await client.query('COMMIT');
    client.release();

    const formattedOrder = {
      ...newOrder,
      shipping_fee: parseFloat(newOrder.shipping_fee),
      subtotal: parseFloat(newOrder.subtotal),
      grand_total: parseFloat(newOrder.grand_total),
      items: resolvedOrderItems,
      // Compatibility fields for existing frontend UI single-item display:
      sku: resolvedOrderItems[0]?.sku,
      product_title: resolvedOrderItems.length > 1
        ? `${resolvedOrderItems[0].product_title} + ${resolvedOrderItems.length - 1} more items`
        : resolvedOrderItems[0]?.product_title,
      quantity: resolvedOrderItems.reduce((acc, i) => acc + i.quantity, 0),
      unit_price: resolvedOrderItems[0]?.unit_price
    };

    // Broadcast Realtime Events
    emitOrderCreated(formattedOrder);
    for (const p of affectedProducts) {
      emitStockUpdated(p);
    }

    return res.status(201).json({
      ok: true,
      message: `SwiftOrbits US Order #${orderNumber} placed successfully!`,
      order: formattedOrder
    });
  } catch (err) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Order creation error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to process transaction: ' + err.message
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    const { status, search, limit = 100, offset = 0 } = req.query;

    const conditions = [];
    const params = [];
    let pIdx = 1;

    if (status && status !== 'all') {
      conditions.push(`order_status = $${pIdx++}`);
      params.push(status.toLowerCase());
    }

    if (search && search.trim()) {
      conditions.push(`(order_number ILIKE $${pIdx} OR customer_name ILIKE $${pIdx} OR customer_email ILIKE $${pIdx} OR customer_phone ILIKE $${pIdx})`);
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT * FROM orders
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${pIdx++} OFFSET $${pIdx++};
    `;

    params.push(parseInt(limit) || 100);
    params.push(parseInt(offset) || 0);

    const ordersRes = await query(sql, params);

    // Retrieve order items for each order
    const ordersWithItems = await Promise.all(ordersRes.rows.map(async (o) => {
      const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
      const items = itemsRes.rows.map(i => ({
        ...i,
        unit_price: parseFloat(i.unit_price),
        line_total: parseFloat(i.line_total)
      }));

      return {
        ...o,
        shipping_fee: parseFloat(o.shipping_fee),
        subtotal: parseFloat(o.subtotal),
        grand_total: parseFloat(o.grand_total),
        items,
        // Compatibility mapping for existing UI
        sku: items[0]?.sku || '',
        product_title: items.length > 1
          ? `${items[0].product_title} (+${items.length - 1} items)`
          : (items[0]?.product_title || 'Package Shipment'),
        quantity: items.reduce((acc, i) => acc + i.quantity, 0),
        unit_price: items[0]?.unit_price || o.grand_total
      };
    }));

    return res.json({
      ok: true,
      count: ordersWithItems.length,
      orders: ordersWithItems
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ ok: false, error: 'Failed to retrieve orders.' });
  }
}

export async function getOrderByNumber(req, res) {
  try {
    const { orderNumber } = req.params;
    const cleanRef = orderNumber.trim().toUpperCase();

    const orderRes = await query(
      'SELECT * FROM orders WHERE UPPER(order_number) = $1 OR id::text = $1',
      [cleanRef]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Order not found.' });
    }

    const o = orderRes.rows[0];
    const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
    const historyRes = await query('SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY created_at ASC', [o.id]);

    const items = itemsRes.rows.map(i => ({
      ...i,
      unit_price: parseFloat(i.unit_price),
      line_total: parseFloat(i.line_total)
    }));

    return res.json({
      ok: true,
      order: {
        ...o,
        shipping_fee: parseFloat(o.shipping_fee),
        subtotal: parseFloat(o.subtotal),
        grand_total: parseFloat(o.grand_total),
        items,
        sku: items[0]?.sku || '',
        product_title: items[0]?.product_title || 'SwiftOrbits Package',
        quantity: items.reduce((acc, i) => acc + i.quantity, 0),
        unit_price: items[0]?.unit_price || o.grand_total,
        history: historyRes.rows
      }
    });
  } catch (err) {
    console.error('Error fetching order by number:', err);
    return res.status(500).json({ ok: false, error: 'Failed to retrieve order tracking info.' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const allowedStatuses = ['pending', 'processing', 'dispatched', 'delivered', 'cancelled'];
    const cleanStatus = (status || '').toLowerCase().trim();

    if (!allowedStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        ok: false,
        error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const currentOrderRes = await query('SELECT * FROM orders WHERE id = $1', [id]);
    if (currentOrderRes.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Order not found.' });
    }

    const currentOrder = currentOrderRes.rows[0];
    const prevStatus = currentOrder.order_status;

    // Update order status
    const updateRes = await query(`
      UPDATE orders
      SET order_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `, [cleanStatus, id]);

    const updatedOrder = updateRes.rows[0];

    // If order was cancelled, restock product inventory
    if (cleanStatus === 'cancelled' && prevStatus !== 'cancelled') {
      const items = await query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id]);
      for (const item of items.rows) {
        if (item.product_id) {
          const restockRes = await query(`
            UPDATE products
            SET stock_qty = stock_qty + $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, sku, stock_qty;
          `, [item.quantity, item.product_id]);

          if (restockRes.rows.length > 0) {
            emitStockUpdated(restockRes.rows[0]);
          }
        }
      }
    }

    // Record in order status history
    await query(`
      INSERT INTO order_status_history (order_id, previous_status, new_status, comment)
      VALUES ($1, $2, $3, $4);
    `, [id, prevStatus, cleanStatus, comment || `Status updated to ${cleanStatus}`]);

    // Format for response and socket broadcast
    const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    const formatted = {
      ...updatedOrder,
      shipping_fee: parseFloat(updatedOrder.shipping_fee),
      subtotal: parseFloat(updatedOrder.subtotal),
      grand_total: parseFloat(updatedOrder.grand_total),
      items: itemsRes.rows,
      sku: itemsRes.rows[0]?.sku || '',
      product_title: itemsRes.rows[0]?.product_title || 'SwiftOrbits Package',
      quantity: itemsRes.rows.reduce((acc, i) => acc + i.quantity, 0),
      unit_price: itemsRes.rows[0]?.unit_price || updatedOrder.grand_total
    };

    // Broadcast Realtime Order Update
    emitOrderUpdated(formatted);

    return res.json({
      ok: true,
      message: `Order #${updatedOrder.order_number} status updated to ${cleanStatus}.`,
      order: formatted
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ ok: false, error: 'Failed to update order status.' });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM order_items WHERE order_id = $1', [id]);
    await query('DELETE FROM order_status_history WHERE order_id = $1', [id]);
    const delRes = await query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (delRes.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Order not found.' });
    }
    return res.json({ ok: true, message: `Order #${delRes.rows[0].order_number} removed.` });
  } catch (err) {
    console.error('Error deleting order:', err);
    return res.status(500).json({ ok: false, error: 'Failed to delete order.' });
  }
}

export async function customerCancelOrder(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    const currentOrderRes = await query(
      'SELECT * FROM orders WHERE id::text = $1 OR UPPER(order_number) = $1',
      [id.toString().trim().toUpperCase()]
    );
    if (currentOrderRes.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Order not found.' });
    }

    const currentOrder = currentOrderRes.rows[0];
    if (currentOrder.order_status === 'delivered') {
      return res.status(400).json({ ok: false, error: 'Delivered orders cannot be cancelled.' });
    }
    if (currentOrder.order_status === 'cancelled') {
      return res.json({ ok: true, message: 'Order is already cancelled.', order: currentOrder });
    }

    const prevStatus = currentOrder.order_status;
    const updateRes = await query(`
      UPDATE orders
      SET order_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `, [currentOrder.id]);

    const updatedOrder = updateRes.rows[0];

    // Restock inventory
    const items = await query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [currentOrder.id]);
    for (const item of items.rows) {
      if (item.product_id) {
        const restockRes = await query(`
          UPDATE products
          SET stock_qty = stock_qty + $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING id, sku, stock_qty;
        `, [item.quantity, item.product_id]);

        if (restockRes.rows.length > 0) {
          emitStockUpdated(restockRes.rows[0]);
        }
      }
    }

    // Status history
    await query(`
      INSERT INTO order_status_history (order_id, previous_status, new_status, comment)
      VALUES ($1, $2, 'cancelled', $3);
    `, [currentOrder.id, prevStatus, reason || 'Customer requested order cancellation']);

    const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [currentOrder.id]);
    const formatted = {
      ...updatedOrder,
      shipping_fee: parseFloat(updatedOrder.shipping_fee),
      subtotal: parseFloat(updatedOrder.subtotal),
      grand_total: parseFloat(updatedOrder.grand_total),
      items: itemsRes.rows,
      sku: itemsRes.rows[0]?.sku || '',
      product_title: itemsRes.rows[0]?.product_title || 'SwiftOrbits Package',
      quantity: itemsRes.rows.reduce((acc, i) => acc + i.quantity, 0),
      unit_price: itemsRes.rows[0]?.unit_price || updatedOrder.grand_total
    };

    emitOrderUpdated(formatted);

    return res.json({
      ok: true,
      message: `Order #${updatedOrder.order_number} has been cancelled successfully.`,
      order: formatted
    });
  } catch (err) {
    console.error('Error cancelling order by customer:', err);
    return res.status(500).json({ ok: false, error: 'Failed to cancel order.' });
  }
}

export async function customerUpdateOrder(req, res) {
  try {
    const { id } = req.params;
    const { quantity, customer_name, customer_phone, shipping_address, city, state } = req.body;

    const currentOrderRes = await query(
      'SELECT * FROM orders WHERE id::text = $1 OR UPPER(order_number) = $1',
      [id.toString().trim().toUpperCase()]
    );
    if (currentOrderRes.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Order not found.' });
    }

    const currentOrder = currentOrderRes.rows[0];
    if (currentOrder.order_status === 'cancelled') {
      return res.status(400).json({ ok: false, error: 'Cancelled orders cannot be edited.' });
    }
    if (currentOrder.order_status === 'delivered') {
      return res.status(400).json({ ok: false, error: 'Delivered orders cannot be modified.' });
    }

    const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [currentOrder.id]);
    const firstItem = itemsRes.rows[0];
    const prevQty = firstItem ? firstItem.quantity : 1;
    const newQty = quantity ? Math.max(1, parseInt(quantity)) : prevQty;
    const unitPrice = firstItem ? parseFloat(firstItem.unit_price) : parseFloat(currentOrder.grand_total);
    const newSubtotal = Math.round(newQty * unitPrice * 100) / 100;
    const newGrandTotal = newSubtotal;

    // Adjust inventory if quantity changed
    const qtyDiff = newQty - prevQty;
    if (qtyDiff !== 0 && firstItem && firstItem.product_id) {
      const stockRes = await query(`
        UPDATE products
        SET stock_qty = stock_qty - $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, sku, stock_qty;
      `, [qtyDiff, firstItem.product_id]);

      if (stockRes.rows.length > 0) {
        emitStockUpdated(stockRes.rows[0]);
      }
    }

    // Update order items
    if (firstItem) {
      await query(`
        UPDATE order_items
        SET quantity = $1, line_total = $2
        WHERE id = $3;
      `, [newQty, newSubtotal, firstItem.id]);
    }

    // Update orders table
    const updateRes = await query(`
      UPDATE orders
      SET customer_name = COALESCE($1, customer_name),
          customer_phone = COALESCE($2, customer_phone),
          shipping_address = COALESCE($3, shipping_address),
          city = COALESCE($4, city),
          state = COALESCE($5, state),
          subtotal = $6,
          grand_total = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *;
    `, [
      customer_name ? customer_name.trim() : null,
      customer_phone ? customer_phone.trim() : null,
      shipping_address ? shipping_address.trim() : null,
      city ? city.trim() : null,
      state ? state.trim().toUpperCase() : null,
      newSubtotal,
      newGrandTotal,
      currentOrder.id
    ]);

    const updatedOrder = updateRes.rows[0];
    const updatedItems = await query('SELECT * FROM order_items WHERE order_id = $1', [currentOrder.id]);

    const formatted = {
      ...updatedOrder,
      shipping_fee: parseFloat(updatedOrder.shipping_fee),
      subtotal: parseFloat(updatedOrder.subtotal),
      grand_total: parseFloat(updatedOrder.grand_total),
      items: updatedItems.rows,
      sku: updatedItems.rows[0]?.sku || '',
      product_title: updatedItems.rows[0]?.product_title || 'SwiftOrbits Package',
      quantity: newQty,
      unit_price: unitPrice
    };

    emitOrderUpdated(formatted);

    return res.json({
      ok: true,
      message: `Order #${updatedOrder.order_number} updated successfully.`,
      order: formatted
    });
  } catch (err) {
    console.error('Error updating order by customer:', err);
    return res.status(500).json({ ok: false, error: 'Failed to update order.' });
  }
}

export default {
  createOrder,
  getAllOrders,
  getOrderByNumber,
  updateOrderStatus,
  deleteOrder,
  customerCancelOrder,
  customerUpdateOrder
};
