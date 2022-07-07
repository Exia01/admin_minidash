import express from 'express';
import {
  createShop,
  index,
  getSingleShop,
  updateShop,
  deleteShop,
} from '../../controllers/shop.js';


const router = express.Router();

router.get('/', index);
router.post('/', createShop);
router.get('/:shop_id', getSingleShop);
router.patch('/:shop_id', updateShop);
router.delete('/:shop_id', deleteShop);

export default router;
