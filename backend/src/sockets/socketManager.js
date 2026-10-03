import { Server } from 'socket.io';

let io = null;

export function initSocket(httpServer, allowedOrigin) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigin || '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for admin clients
    socket.on('join:admin', () => {
      socket.join('admin_room');
      console.log(`[Socket.IO] Client ${socket.id} joined admin_room`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function emitOrderCreated(order) {
  if (io) {
    console.log(`[Socket.IO] Broadcasting order:created for #${order.order_number}`);
    io.emit('order:created', order);
  }
}

export function emitOrderUpdated(order) {
  if (io) {
    console.log(`[Socket.IO] Broadcasting order:updated for #${order.order_number} (status: ${order.order_status})`);
    io.emit('order:updated', order);
  }
}

export function emitProductCreated(product) {
  if (io) {
    console.log(`[Socket.IO] Broadcasting product:created for SKU: ${product.sku}`);
    io.emit('product:created', product);
  }
}

export function emitProductUpdated(product) {
  if (io) {
    console.log(`[Socket.IO] Broadcasting product:updated for SKU: ${product.sku}`);
    io.emit('product:updated', product);
  }
}

export function emitProductDeleted(id, sku) {
  if (io) {
    console.log(`[Socket.IO] Broadcasting product:deleted for ID: ${id}, SKU: ${sku}`);
    io.emit('product:deleted', { id, sku });
  }
}

export function emitStockUpdated(stockData) {
  if (io) {
    console.log(`[Socket.IO] Broadcasting product:stock-updated for SKU: ${stockData.sku} (Stock: ${stockData.stock_qty})`);
    io.emit('product:stock-updated', stockData);
  }
}

export default {
  initSocket,
  getIO,
  emitOrderCreated,
  emitOrderUpdated,
  emitProductCreated,
  emitProductUpdated,
  emitProductDeleted,
  emitStockUpdated
};
