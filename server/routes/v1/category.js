import express from 'express';
import {
  createCategory,
  // index,
  // getSingleCategory,
  // updateCategory,
  // deleteCategory,
} from '../../controllers/category.js';

const router = express.Router();

router.get('/', index);
router.post('/', createCategory);
router.get('/:category_id', getSingleCategory);
router.patch('/:category_id', updateCategory);
router.delete('/:category_id', deleteCategory);

router.get('/');

export default router;
