import express from 'express';

import messageRouter from './message.js';
import productRouter from './product.js';
import categoryRouter from './category.js';
import shopRouter from './shop.js';

const router = express.Router();

router.use('/message', messageRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/shop', shopRouter);

export default router;
