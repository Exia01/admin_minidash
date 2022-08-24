import express from 'express';

import messageRouter from './message.js';
import productRouter from './product.js';
import categoryRouter from './category.js';
import shopRouter from './shop.js';
import saleEntryRouter from './saleEntry.js';
import reportRouter from './reports.js';
import authRouter from './auth.js';
import userRouter from './user.js';
import { authorization } from '../../middleware/authorization.js';

const router = express.Router();

router.use('/message', messageRouter);
// router.use(authorization);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/shop', shopRouter);
router.use('/sale-entry', saleEntryRouter);
router.use('/report', reportRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
// router.use('/shop', shopRouter);

export default router;
