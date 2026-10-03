import express from 'express';
import {
  getAllProducts,
  getProductBySku,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct
} from '../controllers/productController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:sku', getProductBySku);
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.patch('/:id', requireAdmin, updateProduct);
router.patch('/:id/stock', requireAdmin, adjustStock);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
