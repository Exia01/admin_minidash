import SaleEntry from '../models/SaleEntry.js';
import Shop from '../models/shop.js';
import { StatusCodes } from 'http-status-codes';
const SUCCESS_MSG = 'Success!';
const REQUIRED_FIELDS_MSG = 'Required field(s) missing';
const SALE_ENTRY_NOT_FOUND = 'No Sale entry with id';
import { createCustomError } from '../utils/errors/index.js';

const createSaleEntry = async (req, res, next) => {
  try {
    const { shop_id, total, yearPeriod, quarter, month, ...rest } = req.body;

    if (!total || !yearPeriod || !quarter || !month || !shop_id) {
      let err = createCustomError(REQUIRED_FIELDS_MSG, StatusCodes.BAD_REQUEST);
      throw err;
    }

    const currentSaleEntry = await SaleEntry.findOne({
      yearPeriod,
      month,
      quarter,
      shop_id,
    })
      .lean()
      .exec();
    if (currentSaleEntry)
      return res.status(400).json({ msg: 'Sale entry already in the system' });

    //check if the month and quarter matches correctly

    const newSaleEntry = new SaleEntry({
      shop: shop_id,
      total,
      yearPeriod,
      quarter,
      month,
      ...rest,
    });

    const savedSaleEntry = await newSaleEntry.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: SUCCESS_MSG, category: savedSaleEntry });
  } catch (err) {
    next(err);
  }
};

// https://github.com/maryamaljanabi/bestbags-nodejs-ecommerce/blob/master/routes/products.js

const index = async (req, res, next) => {
  let querySortObj = {};
  let querySearchObj = {};
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit); // Make sure to parse the limit to number

  if (!limit) {
    limit = 10;
  }
  let skip = (page - 1) * limit;

  if (req.query.year) {
    // if title case insensitivity
    // https://www.mongodb.com/docs/manual/reference/operator/query/
    querySearchObj.yearPeriod = req.query.year;
  }
  if (req.query.quarter) {
    querySearchObj.quarter = req.query.quarter;
  }
  if (req.query.month) {
    querySearchObj.month = req.query.month;
  }
  if (req.query.shop) {
    querySearchObj.shop = req.query.shop;
  }

  if (req.query.sort) {
    const sortString = req.query.sort.trim();
    switch (sortString) {
      case 'month':
        querySortObj.month = 1;
        break;
      case 'year':
        querySortObj.yearPeriod = 1;
        break;
      case 'period':
        querySortObj.period = 1;
        break;
      case 'total':
        querySortObj.total = 1;
        break;
      default:
        querySortObj.createdAt = -1;
        break;
    }
  }

  let pendingSaleEntries = SaleEntry.find(querySearchObj).lean();

  if (req.query.fields) {
    let fields = req.query.fields.trim().split(',').join(' ');
    pendingSaleEntries.select(fields);
  }

  pendingSaleEntries.sort(querySortObj);

  try {
    const [saleEntries, total] = await Promise.all([
      pendingSaleEntries
        .skip(skip) // Use this to sort documents by newest first // Always apply 'skip' before 'limit'
        .limit(limit) // This is your 'page size'
        // .populate({ path: 'categories' }) //in case of virtual categories
        // .populate('categories')
        .exec(),
      SaleEntry.countDocuments(),
      //https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-awaitk
    ]);

    return res.status(StatusCodes.OK).json({
      msg: SUCCESS_MSG,
      saleEntries,
      nbHits: saleEntries.length,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// const uploadImage

const getSingleSaleEntry = async (req, res, next) => {
  try {
    const id = req.params.saleEntry_id;

    const foundSaleEntry = await SaleEntry.findById(id)
      .populate('shop', 'name  memberCode')
      .lean()
      .exec();

    console.log(foundSaleEntry);
    if (!foundSaleEntry) {
      // if(foundSaleEntry == null){
      //   let err = createCustomError(
      //     `${SALE_ENTRY_NOT_FOUND} ${id}`,
      //     StatusCodes.BAD_REQUEST
      //   );
      //   throw err;
      // }
      let err = createCustomError(
        `${SALE_ENTRY_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, saleEntry: foundSaleEntry });
  } catch (err) {
    next(err);
  }
};

const updateSaleEntry = async (req, res, next) => {
  try {
    const id = req.params.saleEntry_id;
    const { name, category, ...rest } = req.body;
    const updatedSaleEntry = await SaleEntry.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();

    if (!updatedSaleEntry) {
      let err = createCustomError(
        `${SALE_ENTRY_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    let savedCategory = await updatedSaleEntry.save();

    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, category: savedCategory });
  } catch (err) {
    next(err);
  }
};

const deleteSaleEntry = async (req, res, next) => {
  try {
    const id = req.params.saleEntry_id;
    const foundSaleEntry = await SaleEntry.findOne({ _id: id }).exec();
    if (!foundSaleEntry) {
      let err = createCustomError(
        `${SALE_ENTRY_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    const removedSaleEntry = await SaleEntry.deleteOne(
      { _id: foundSaleEntry._id },
      {
        new: true,
      }
    ).exec();

    return res.status(StatusCodes.OK).json({ msg: SUCCESS_MSG, product: null });
  } catch (err) {
    next(err);
  }
};

export {
  createSaleEntry,
  index,
  getSingleSaleEntry,
  updateSaleEntry,
  deleteSaleEntry,
};
