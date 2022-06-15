import Shop from '../models/shop.js';
const SUCCESS_MSG = 'Success!';
const REQUIRED_FIELDS_MSG = 'Required field(s) missing';
const SHOP_NOT_FOUND = 'No shop with id';

const createShop = async (req, res, next) => {
  try {
    // req.body.addedBy = req.user.sub;

    console.log(req.body);
    const { title, price, category, description, ...rest } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: REQUIRED_FIELDS_MSG });
    }
    // Check if shop already exist
    const currentShop = await Shop.findOne({ title }).lean().exec();
    if (currentShop)
      return res
        .status(400)
        .json({ msg: 'Shop already in the inventory system' });

    const newShop = new Shop({
      title,
      price,
      description,
      ...rest,
    });

    // Save Shop to DB
    const savedShop = await newShop.save();
    return res.status(200).json({ msg: SUCCESS_MSG, shop: savedShop });
  } catch (err) {
    let errMsg = err.stack;
    let msg = 'Could not complete request';
    res.status(500).json({ msg, errMsg });
  }
};

const index = async (req, res, next) => {
  let limit = parseInt(req.query.limit); // Make sure to parse the limit to number
  let skip = parseInt(req.query.skip); // Make sure to parse the skip to number
  let sortBy = { _id: -1 };
  if (!limit) {
    limit = 0;
  }
  if (!skip) {
    skip = 0;
  }
  if (req.query.department) {
  }
  if (req.query.qNew) {
    sortBy = { createAt: -1 };
  }

  let queryObj = {};

  if (req.query.name) {
    // Could do if req.query.name != ""
    console.log(req.query.name);
  }

  try {
    const [products, total] = await Promise.all([
      Shop.find(queryObj)
        .sort(sortBy) // Use this to sort documents by newest first
        .skip(skip) // Always apply 'skip' before 'limit'
        .limit(limit) // This is your 'page size'
        .lean()
        // .populate('variants')
        .exec(),
      Shop.countDocuments(),
      //https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-awaitk
    ]);
    return res.status(200).json({ msg: SUCCESS_MSG, products, total });
  } catch (err) {
    let errMsg = err.stack;
    let message = 'Could not complete request';
    res.status(500).json({ msg: message, errMsg });
  }
};

// const uploadImage

const getSingleShop = async (req, res, next) => {
  try {
    const id = req.params.product_id;
    const foundShop = await Shop.findById(id)
      .lean()
      // .populate('variants')
      .exec();

    if (!foundShop) {
      return res.status(400).json({ msg: `${SHOP_NOT_FOUND} ${id}` });
    }
    // console.log(Shop.findById(id).populate('productVariants').exec());
    return res.status(200).json({ msg: SUCCESS_MSG, shop: foundShop });
  } catch (err) {
    let errMsg = err.stack;
    let message = 'Could not complete request';
    res.status(500).json({ msg: message, errMsg });
  }
};

const updateShop = async (req, res, next) => {
  try {
    const id = req.params.product_id;
    const { title, price, category, description, ...rest } = req.body;
    if (!title || !description) {
      return res.status(400).json({ msg: REQUIRED_FIELDS_MSG });
    }
    //could also use "{$set:req.body} to update
    const updatedShop = await Shop.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    ).exec();
    if (!updatedShop) {
      return res.status(400).json({ msg: `${SHOP_NOT_FOUND} ${id}` });
    }
    let savedShop = await shop.save();

    return res.status(200).json({ msg: SUCCESS_MSG, shop: savedShop });
  } catch (err) {
    let errMsg = err.stack;
    let message = 'Could not complete request';
    res.status(500).json({ msg: message, errMsg });
  }
};

const deleteShop = async (req, res, next) => {
  try {
    console.log(req.params);
    const id = req.params.product_id;
    const foundShop = await Shop.findOne({ _id: id }).exec();
    //could also use "{$set:req.body} to update
    if (!foundShop) {
      return res.status(400).json({ msg: `${SHOP_NOT_FOUND} ${id}` });
    }
    const removedShop = await Shop.deleteOne(
      { _id: foundShop },
      {
        new: true,
      }
    ).exec();

    return res.status(200).json({ msg: SUCCESS_MSG, shop: foundShop });
  } catch (err) {
    let errMsg = err.stack;
    let message = 'Could not complete request';
    res.status(500).json({ msg: message, errMsg });
  }
};

export { createShop, index, getSingleShop, updateShop, deleteShop };
