import express from 'express';

import messageRouter from './message.js';
import productRouter from './product.js';

const router = express.Router();

router.use('/message', messageRouter);
router.use('/product', productRouter)

export default router;
