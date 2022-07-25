import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { buildYOYSalesReport } from '../../controllers/reports.js';
const router = express.Router();

// router.get('/sales', buildSalesReport);
router.get('/sales/yoy/', buildYOYSalesReport);
// router.get('/products', buildProductsReport);
// router.get('/sales', buildSalesReport);
// router.get('/sales/shop/:shop_id', buildShopSalesReport);
// router.get('/sales', buildSalesReport)

export default router;
