import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderByNumber,
  updateOrderStatus,
  deleteOrder,
  customerCancelOrder,
  customerUpdateOrder
} from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer facing
router.post('/', createOrder);
router.get('/:orderNumber', getOrderByNumber);
router.patch('/:id/cancel', customerCancelOrder);
router.patch('/:id/customer-update', customerUpdateOrder);

// Admin operations
router.get('/', requireAdmin, getAllOrders);
router.patch('/:id/status', requireAdmin, updateOrderStatus);
router.delete('/:id', requireAdmin, deleteOrder);

export default router;
