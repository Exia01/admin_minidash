import Shop from './../models/shop.js';
import { StatusCodes } from 'http-status-codes';
const SUCCESS_MSG = 'Success!';
const REQUIRED_FIELDS_MSG = 'Required field(s) missing';
const SHOP_NOT_FOUND = 'No Shop with id';
const WRONG_FORMAT = 'is not a valid format';
import { createCustomError } from '../utils/errors/index.js';

const createShop = async (req, res, next) => {
  try {
    const { name, memberCode, phone, ...rest } = req.body;
    let validDate = req.body.enrolled ? new Date(req.body?.enrolled) : null;

    if (!name || !memberCode || !phone) {
      let err = createCustomError(REQUIRED_FIELDS_MSG, StatusCodes.BAD_REQUEST);
      throw err;
    }
    if (validDate instanceof Date && isNaN(validDate)) {
      // https://masteringjs.io/tutorials/fundamentals/typeof-date#:~:text=You%20can%20use%20the%20!,whether%20a%20date%20is%20valid.&text=If%20x%20is%20a%20Date,x)%20is%20equivalent%20to%20Number.

      let err = createCustomError(
        `Date is ${WRONG_FORMAT}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }

    const newShop = new Shop({
      name,
      memberCode,
      phone,
      ...rest,
    });

    // Save Shop to DB
    const savedShop = await newShop.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: SUCCESS_MSG, shop: savedShop });
  } catch (err) {
    // return res.json(err)
    next(err);
  }
};

const index = async (req, res, next) => {
  let querySortObj = {};
  let querySearchObj = {};
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit);
  if (!limit) {
    limit = 10;
  }
  let skip = (page - 1) * limit;

  if (req.query.name) {
    querySearchObj.name = { $regex: req.query.name, $options: 'i' };
  }
  if (req.query.enrolled) {
    let rangeDate = new Date(req.query.enrolled);
    let adjustedRange = new Date(rangeDate);
    adjustedRange.setUTCDate(1);
    if (rangeDate instanceof Date && !isNaN(rangeDate)) {
      querySearchObj.enrolled = { $gte: adjustedRange, $lte: rangeDate };
    }
  }
  if (req.query.address) {
    querySearchObj.address = { $regex: req.query.address, $options: 'i' };
  }
  if (req.query.city) {
    querySearchObj.city = { $regex: req.query.city, $options: 'i' };
  }
  if (req.query.state) {
    querySearchObj.state = req.query.state;
  }
  if (req.query.description) {
    querySearchObj.description = {
      $regex: req.query.description,
      $options: 'i',
    };
  }
  if (req.query.phone) {
    querySearchObj.phone = { $regex: req.query.phone, $options: 'i' };
  }

  const pendingShops = Shop.find(querySearchObj).lean();
  if (req.query.fields) {
    let fields = req.query.fields.trim().split(',').join(' ');
    pendingShops.select(fields);
  }
  if (req.query.sort) {
    const sortString = req.query.sort.trim();
    console.log(sortString);
    switch (sortString.toLowerCase()) {
      case 'enrolled':
        querySortObj.enrolled = 1;
        break;
      case 'enrolled_reverse':
        querySortObj.enrolled = -1;
        break;
      case 'name':
        querySortObj.name = 1;
        break;
      default:
        querySortObj.name = 1;
        break;
    }
  }

  //could skip sort by checking keys on obj
  pendingShops.sort(querySortObj);
  try {
    const [shops, total] = await Promise.all([
      pendingShops
        .skip(skip) // Use this to sort documents by newest first // Always apply 'skip' before 'limit'
        .limit(limit) // This is your 'page size'
        // .populate('variants')
        .exec(),
      Shop.countDocuments(),
      //https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-awaitk
    ]);
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, shops, nbHits: shops.length, total });
  } catch (err) {
    next(err);
  }
};

// const uploadImage

const getSingleShop = async (req, res, next) => {
  try {
    const id = req.params.shop_id;
    const foundShop = await Shop.findById(id).lean().exec();

    if (!foundShop) {
      let err = createCustomError(
        `${SHOP_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    // console.log(Shop.findById(id).populate('productVariants').exec());
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, shop: foundShop });
  } catch (err) {
    next(err);
  }
};

const updateShop = async (req, res, next) => {
  try {
    const id = req.params.shop_id;
    let validDate = req.body.enrolled ? new Date(req.body?.enrolled) : null;
    if (validDate instanceof Date && isNaN(validDate)) {
      // https://masteringjs.io/tutorials/fundamentals/typeof-date#:~:text=You%20can%20use%20the%20!,whether%20a%20date%20is%20valid.&text=If%20x%20is%20a%20Date,x)%20is%20equivalent%20to%20Number.

      let err = createCustomError(
        `Date is ${WRONG_FORMAT}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    //could also use "{$set:req.body} to update
    const foundShop = await Shop.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();

    if (!foundShop) {
      let err = createCustomError(
        `${SHOP_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    let savedShop = await foundShop.save();

    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, shop: savedShop });
  } catch (err) {
    next(err);
  }
};

const deleteShop = async (req, res, next) => {
  try {
    const id = req.params.shop_id;
    const foundShop = await Shop.findOne({ _id: id }).exec();
    if (!foundShop) {
      let err = createCustomError(
        `${SHOP_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    const removedShop = await Shop.deleteOne(
      { _id: foundShop._id },
      {
        new: true,
      }
    ).exec();

    return res.status(StatusCodes.OK).json({ msg: SUCCESS_MSG, shop: null });
  } catch (err) {
    next(err);
  }
};

export { createShop, index, getSingleShop, updateShop, deleteShop };
