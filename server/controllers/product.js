import Product from './../models/product.js';
import { StatusCodes } from 'http-status-codes';
const SUCCESS_MSG = 'Success!';
const REQUIRED_FIELDS_MSG = 'Required field(s) missing';
const PRODUCT_NOT_FOUND = 'No product with id';
import { createCustomError } from '../utils/errors/index.js';

const createProduct = async (req, res, next) => {
  try {
    const { title, price, category, description, ...rest } = req.body;

    if (!title || !description) {
      let err = createCustomError(REQUIRED_FIELDS_MSG, StatusCodes.BAD_REQUEST);
      throw err;
    }
    // Check if product already exist
    // const currentProduct = await Product.findOne({ title }).lean().exec();
    // if (currentProduct)
    //   return res
    //     .status(400)
    //     .json({ msg: 'Product already in the inventory system' });

    const newProduct = new Product({
      title,
      price,
      description,
      ...rest,
    });

    // Save Product to DB
    const savedProduct = await newProduct.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: SUCCESS_MSG, product: savedProduct });
  } catch (err) {
    next(err);
  }
};

const index = async (req, res, next) => {
  let querySortObj = {};
  let querySearchObj = {};
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit); // Make sure to parse the limit to number
  if (!limit) {
    limit = 10;
  }
  let skip = (page - 1) * limit;
  //18
  // 5-> 5 5 5 3
  // if (!skip) {
  //   skip = 0;
  // }
  if (req.query.title) {
    // if title case insensitivity
    // https://www.mongodb.com/docs/manual/reference/operator/query/
    querySearchObj.title = { $regex: req.query.title, $options: 'i' };
  }
  if (req.query.description) {
    querySearchObj.description = {
      $regex: req.query.description,
      $options: 'i',
    };
  }
  if (req.query.min_price) {
    let tempPriceObj = querySearchObj.price ? querySearchObj.price : null;
    querySearchObj.price = {
      ...tempPriceObj,
      $gt: parseInt(req.query.min_price),
    };
  }
  if (req.query.max_price) {
    let tempPriceObj = querySearchObj.price ? querySearchObj.price : null;
    querySearchObj.price = {
      ...tempPriceObj,
      $lt: parseInt(req.query.max_price),
    };
  }
  if (req.query.category) {
    querySearchObj.category = req.query.category;
  }
  const pendingProducts = Product.find(querySearchObj).lean();
  if (req.query.fields) {
    let fields = req.query.fields.trim().split(',').join(' ');
    pendingProducts.select(fields);
  }
  if (req.query.sort) {
    const sortString = req.query.sort.trim();
    switch (sortString) {
      case 'price_low':
        querySortObj.price = 1;
        break;
      case 'price_high':
        querySortObj.price = -1;
        break;
      case 'price_high':
        querySortObj.price = -1;
        break;
      default:
        querySortObj.title = 1;
        break;
    }
  }

  // //if different filters are needed
  const queryObject = {};
  if (req.query.numericFilters) {
    // https://regexr.com/
    // numericFilters=price>40,inventoryCount>50
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    // replace the symbols for the equivalent val
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'inventoryCount'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      {
        price;
      }
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
        // // Object.price{$lt:40}
      }
    });
  }

  //could skip sort by checking keys on obj
  pendingProducts.sort(querySortObj);
  try {
    const [products, total] = await Promise.all([
      pendingProducts
        .skip(skip) // Use this to sort documents by newest first // Always apply 'skip' before 'limit'
        .limit(limit) // This is your 'page size'
        // .populate('variants')
        .exec(),
      Product.countDocuments(),
      //https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-awaitk
    ]);
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, products, nbHits: products.length, total });
  } catch (err) {
    next(err);
  }
};

// const uploadImage

const getSingleProduct = async (req, res, next) => {
  try {
    const id = req.params.product_id;
    // const {product_id:product_id} = req.params
    const foundProduct = await Product.findById(id)
      .lean()
      // .populate('variants')
      .exec();

    if (!foundProduct) {
      let err = createCustomError(
        `${PRODUCT_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    // console.log(Product.findById(id).populate('productVariants').exec());
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, product: foundProduct });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.product_id;
    const { title, price, category, description, ...rest } = req.body;
    //could also use "{$set:req.body} to update
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    ).exec();
    // if (!updatedProduct) {
    //   return res.status(400).json({ msg: `${PRODUCT_NOT_FOUND} ${id}` });
    // }  if (!foundProduct) {
    if (!updatedProduct) {
      let err = createCustomError(
        `${PRODUCT_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    let savedProduct = await updatedProduct.save();

    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, product: savedProduct });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.product_id;
    const foundProduct = await Product.findOne({ _id: id }).exec();
    if (!foundProduct) {
      let err = createCustomError(
        `${PRODUCT_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    const removedProduct = await Product.deleteOne(
      { _id: foundProduct._id },
      {
        new: true,
      }
    ).exec();

    return res.status(StatusCodes.OK).json({ msg: SUCCESS_MSG, product: null });
  } catch (err) {
    next(err);
  }
};

export { createProduct, index, getSingleProduct, updateProduct, deleteProduct };

// For reference
// const index = async (req, res, next) => {
//   let queryObj = {};
//   let limit = parseInt(req.query.limit); // Make sure to parse the limit to number
//   let skip = parseInt(req.query.skip); // Make sure to parse the skip to number
//   let sortBy = { name: 1 }; //alphabetical
//   if (!limit) {
//     limit = 0;
//   }
//   if (!skip) {
//     skip = 0;
//   }
//   if (req.query.title) {
//     // https://www.mongodb.com/docs/manual/reference/operator/query/
//     queryObj.title = { $regex: req.query.title, $options: 'i' };
//     // queryObj.title = req.query.title;
//   }
//   if (req.query.description) {
//     queryObj.description = req.query.description;
//   }
//   if (req.query.sortBy) {
//   }

//   try {
//     const [products, total] = await Promise.all([
//       Product.find(queryObj)
//         .sort(sortBy) // Use this to sort documents by newest first
//         .skip(skip) // Always apply 'skip' before 'limit'
//         .limit(limit) // This is your 'page size'
//         .lean()
//         // .populate('variants')
//         .exec(),
//       Product.countDocuments(),
//       //https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-awaitk
//     ]);
//     return res
//       .status(200)
//       .json({ msg: SUCCESS_MSG, products, nbHits: products.length, total });
//   } catch (err) {
//     let errMsg = err.stack;
//     let message = 'Could not complete request';
//     res.status(500).json({ msg: message, errMsg });
//   }
// };
