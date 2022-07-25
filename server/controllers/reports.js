import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
const { isValidObjectId } = mongoose;
import SaleEntry from '../models/SaleEntry.js';
import Shop from './../models/shop.js';
import Product from './../models/product.js';

import { createCustomError } from '../utils/errors/index.js';
const SUCCESS_MSG = 'Success!';
const REQUIRED_REPORTS_PARAMS = 'Required report parameters missing';
const NO_SHOP_FOUND = 'No Shop found with id';

const buildYOYSalesReport = async (req, res, next) => {
  try {
    const queryFilterObj = {};
    const shop_id = req.query.shop || null;
    //base yr
    const monthsRange = parseInt(req.query.monthsRange) || 12;
    const baseYr = parseInt(req.query.baseYr) || new Date().getFullYear();
    //year comparison
    const compYr =
      new Date(req.query.compYr, 1).getFullYear() ||
      new Date().getFullYear() - 1;

    if (shop_id == null && !isValidObjectId(shop_id)) {
      let err = createCustomError(
        `${NO_SHOP_FOUND} ${shop_id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    queryFilterObj.shop = shop_id;
    queryFilterObj.baseYr = baseYr;
    queryFilterObj.compYr = compYr;
    const docs = await SaleEntry.aggregate([
      {
        $match: {
          // yearPeriod: { $in: [2020, 2021] }, /*Could use in instead */
          shop: mongoose.Types.ObjectId(shop_id),
          $or: [
            {
              yearPeriod: queryFilterObj.baseYr,
            },
            {
              yearPeriod: queryFilterObj.compYr,
            },
          ],
        },
      },
      // { $project: { _id: 0, yearPeriod: 1, total: 1 } },
      {
        $group: {
          _id: '$yearPeriod',
          yearlyTotal: { $sum: '$total' },
          docs: {
            $push: {
              total: '$total',
              quarter: '$quarter',
              month: '$month',
              yearPeriod: '$yearPeriod',
            },
          },
        },
      },
      {
        $sort: { yearPeriod: -1, month: 1 },
      },
    ]);

    return res.status(StatusCodes.OK).json({ msg: SUCCESS_MSG, report: docs });
  } catch (err) {
    //could also just return the err instead of handling in middleware
    console.log(err);
    next(err);
  }
};

const buildTopProductSoldReport = async (req, res, next) => {
  try {
    const products = await Product.find({});
    const updatedProducts = products.map((individualProduct) => {
      function randomIntFromInterval(min, max) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      const updatedProduct = Product.findByIdAndUpdate(
        { _id: individualProduct._id },
        {
          unitsSold: randomIntFromInterval(90, 900),
          totalUnitsSold: undefined,
        },
        {
          new: true,
        }
      );
      updatedProduct.then(function (doc) {
        console.log(doc);
      });
    });

    // const savedUpdatedProducts = await Product.updateMany({
    //   totalUnitsSold: undefined,
    //   unitsSold: randomIntFromInterval(90, 900),
    // });

    return res.status(200).json('okay');

    return res.status(StatusCodes.OK).json({ msg: SUCCESS_MSG, report: docs });
  } catch (err) {
    //could also just return the err instead of handling in middleware
    console.log(err);
    next(err);
  }
};

export { buildYOYSalesReport, buildTopProductSoldReport };
