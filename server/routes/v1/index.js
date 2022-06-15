import express from 'express';

import messageRouter from './message.js';
import productRouter from './product.js';
import { notFound } from './../../middleware/not-found.js';

const router = express.Router();

router.use('/message', messageRouter);
router.use('/product', productRouter)
// router.use(notFound)

export default router;
