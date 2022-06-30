import express from 'express';

import messageRouter from './message.js';
import productRouter from './product.js';
import categoryRouter from './category.js';

const router = express.Router();

router.use('/message', messageRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);

export default router;
