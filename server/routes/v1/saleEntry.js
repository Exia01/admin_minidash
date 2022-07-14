import express from 'express';
import {
  createSaleEntry,
  index,
  getSingleSaleEntry,
  updateSaleEntry,
    deleteSaleEntry,
} from '../../controllers/saleEntry.js';

const router = express.Router();

router.get('/', index);
router.post('/', createSaleEntry);
router.get('/:saleEntry_id', getSingleSaleEntry);
router.patch('/:saleEntry_id', updateSaleEntry);
router.delete('/:saleEntry_id', deleteSaleEntry);

export default router;
