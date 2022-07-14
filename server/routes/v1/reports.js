import Express from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Express.router();

router.get('/sales', buildSalesReport);
router.get('/sales/shop/:shop_id', buildShopSalesReport);
router.get('/products', buildProductsReport);
// router.get('/sales', buildSalesReport)
