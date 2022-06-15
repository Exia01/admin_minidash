import express from 'express';
import {
  createProduct,
  index,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from '../../controllers/product.js';

const router = express.Router();

router.get('/', index);
router.post('/', createProduct);
router.get('/:product_id', getSingleProduct);
router.patch('/:product_id', updateProduct);
router.delete('/:product_id', deleteProduct);

router.get('/');

export default router;
