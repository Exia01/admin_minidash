import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
const SUCCESS_MSG = 'Success!';
const REQUIRED_FIELDS_MSG = 'Required field(s) missing';
const INVALID_UPDATE = 'Could not update user, please try again later';
const USER_NOT_FOUND = 'No user with id';
import { createCustomError } from '../utils/errors/index.js';
import {
  createToken,
  verifyToken,
  verifyPassword,
  hashPassword,
} from '../utils/index.js';

const index = async (req, res, next) => {
  let querySortObj = {};
  let querySearchObj = {};
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit);
  if (!limit) {
    limit = 10;
  }
  let skip = (page - 1) * limit;

  if (req.query.username) {
    querySearchObj.name = { $regex: req.query.name, $options: 'i' };
  }
  if (req.query.email) {
    querySearchObj.email = { $regex: req.query.email, $options: 'i' };
  }
  if (req.query.enrolled) {
    let rangeDate = new Date(req.query.enrolled);
    let adjustedRange = new Date(rangeDate);
    adjustedRange.setUTCDate(1);
    if (rangeDate instanceof Date && !isNaN(rangeDate)) {
      querySearchObj.enrolled = { $gte: adjustedRange, $lte: rangeDate };
    }
  }

  const pendingUsers = User.find(querySearchObj).lean();
  if (req.query.fields) {
    let fields = req.query.fields.trim().split(',').join(' ');
    pendingUsers.select(fields);
  }
  if (req.query.sort) {
    const sortString = req.query.sort.trim();
    switch (sortString.toLowerCase()) {
      case 'enrolled':
        querySortObj.enrolled = 1;
        break;
      case 'enrolled_reverse':
        querySortObj.enrolled = -1;
        break;
      case 'email':
        querySortObj.email = 1;
        break;
      case 'username':
        querySortObj.email = 1;
        break;
      default:
        querySortObj.email = 1;
        break;
    }
  }

  //could skip sort by checking keys on obj
  pendingUsers.sort(querySortObj);
  try {
    const [users, total] = await Promise.all([
      pendingUsers
        .skip(skip) // Use this to sort documents by newest first // Always apply 'skip' before 'limit'
        .limit(limit) // This is your 'page size'
        // .populate('variants')
        .exec(),
      User.countDocuments(),
      //https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-awaitk
    ]);
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, users, nbHits: users.length, total });
  } catch (err) {
    next(err);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const { user_id: _id } = req.params;
    const foundUser = await User.findById(_id)
      .select('-password')
      .lean()
      .exec();

    if (!foundUser) {
      let err = createCustomError(
        `${USER_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, user: foundUser });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.user_id;

    const allowedUpdates = ['email', 'username', 'password', 'role', '__v'];
    // https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
    const reqBodyKeys = Object.keys(req.body);
    let isValidUpdate = reqBodyKeys.some((keyVal) =>
      allowedUpdates.includes(keyVal)
    );
    if (!isValidUpdate) {
      let err = createCustomError(`${INVALID_UPDATE}`, StatusCodes.BAD_REQUEST);
      throw err;
    }

    const { email, username, password, role, ...rest } = req.body;
    const updatedObj = { email, username, role };
    if (password && password != '') {
      const newHashedPassword = await hashPassword(password);
      console.log(newHashedPassword);
      updatedObj.password = newHashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: id }, updatedObj, {
      new: true,
    });

    if (!updatedUser) {
      let err = createCustomError(
        `${USER_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    let savedUser = await updatedUser.save();

    return res
      .status(StatusCodes.OK)
      .json({ msg: SUCCESS_MSG, user: savedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.user_id;
    const foundUser = await User.findOne({ _id: id }).exec();
    if (!foundUser) {
      let err = createCustomError(
        `${USER_NOT_FOUND} ${id}`,
        StatusCodes.BAD_REQUEST
      );
      throw err;
    }
    const removedUser = await User.deleteOne(
      { _id: foundUser._id },
      {
        new: true,
      }
    ).exec();

    return res.status(StatusCodes.OK).json({ msg: SUCCESS_MSG, user: null });
  } catch (err) {
    next(err);
  }
};

export { index, getSingleUser, updateUser, deleteUser };
