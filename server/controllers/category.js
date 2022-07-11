import Category from '../models/category.js';
import { StatusCodes } from 'http-status-codes';
const SUCCESS_MSG = 'Success!';
const REQUIRED_FIELDS_MSG = 'Required field(s) missing';
const PRODUCT_NOT_FOUND = 'No product with id';
import { createCustomError } from '../utils/errors/index.js';

const createCategory = async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;

    if (!name) {
      let err = createCustomError(REQUIRED_FIELDS_MSG, StatusCodes.BAD_REQUEST);
      throw err;
    }

    const newCategory = new Category({
      name,
      ...rest,
    });

    // Save Category to DB
    const savedCategory = await newCategory.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: SUCCESS_MSG, category: savedCategory });
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
  //18
  // 5-> 5 5 5 3
  // if (!skip) {
  //   skip = 0;
  // }

  if (req.query.name) {
    // if title case insensitivity
    // https://www.mongodb.com/docs/manual/reference/operator/query/
    querySearchObj.name = { $regex: req.query.name, $options: 'i' };
  }
  if (req.query.description) {
    querySearchObj.description = {
      $regex: req.query.description,
      $options: 'i',
    };
  }

  if (req.query.sort) {
    const sortString = req.query.sort.trim();
    switch (sortString) {
      case 'name':
        querySortObj.name = 1;
        break;
      default:
        querySortObj.createdAt = -1;
        break;
    }
  }

  let pendingCategories = Category.find(querySearchObj).lean();

  if (req.query.fields) {
    let fields = req.query.fields.trim().split(',').join(' ');
    pendingCategories.select(fields);
  }

  pendingCategories.sort(querySortObj);

  try {
    const [products, total] = await Promise.all([
      pendingCategories
        .skip(skip) // Use this to sort documents by newest first // Always apply 'skip' before 'limit'
        .limit(limit) // This is your 'page size'
        // .populate({ path: 'categories' }) //in case of virtual categories
        // .populate('categories')
        .exec(),
      Category.countDocuments(),
      //https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-awaitk
    ]);

    return res.status(StatusCodes.OK).json({
      msg: SUCCESS_MSG,
      products,
      nbHits: products.length,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// const uploadImage

const getSingleCategory = async (req, res, next) => {
  try {
    const id = req.params.category_id;
    // const {category_id:category_id} = req.params
    const foundCategory = await Category.findById(id).lean().exec();

    console.log(foundCategory);
    if (!foundCategory) {
      let err = createCustomError(
        `${PRODUCT_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    // console.log(Category.findById(id).populate('productVariants').exec());
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, category: foundCategory });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.category_id;
    const allowedUpdates = ['name', 'description'];

    const { name, category, ...rest } = req.body;
    //could also use "{$set:req.body} to update
    console.log(id);
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();

    if (!updatedCategory) {
      let err = createCustomError(
        `${PRODUCT_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    let savedCategory = await updatedCategory.save();

    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, category: savedCategory });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.category_id;
    const foundCategory = await Category.findOne({ _id: id }).exec();
    if (!foundCategory) {
      let err = createCustomError(
        `${PRODUCT_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    const removedCategory = await Category.deleteOne(
      { _id: foundCategory._id },
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
  createCategory,
  index,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
