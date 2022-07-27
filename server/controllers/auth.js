import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
const SUCCESS_MSG = 'Success!';
const REQUIRED_FIELDS_MSG = 'Required field(s) missing';
import { createCustomError } from '../utils/errors/index.js';
import { createToken, verifyToken, verifyPassword } from '../utils/index.js';

const registerUser = async (req, res, next) => {
  try {
    const { email, password, username, ...rest } = req.body;

    if (!email || !password) {
      let err = createCustomError(REQUIRED_FIELDS_MSG, StatusCodes.BAD_REQUEST);
      throw err;
    }
    const optsObj = {};
    optsObj.email = email;
    if (username && username != '') {
      optsObj.username = username;
    }

    // Check if product already exist
    const userExists = await User.findOne(optsObj).lean().exec();
    if (userExists)
      return res
        .status(400)
        .json({ msg: 'Email or username already registered' });

    const newUSer = new User({
      email,
      password,
      username,
      ...rest,
    });

    // Save Product to DB
    const savedUser = await newUSer.save();

    const token = await createToken(savedUser);

    const decodedToken = await verifyToken(token);
    const expiresAt = decodedToken.exp;

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: SUCCESS_MSG, user: savedUser, token, expiresAt });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Empty Validation
    if (!email || !password) {
      let err = createCustomError(REQUIRED_FIELDS_MSG, StatusCodes.BAD_REQUEST);
      throw err;
    }
    // Find Existing User (?)
    const currentUser = await User.findOne({ email: email }).lean();

    if (!currentUser) {
      return res.status(403).json({ msg: 'Wrong email or password.' });
    }

    // Compare Password
    const passwordValid = await verifyPassword(password, currentUser.password);

    // const userInfo = Object.assign({}, {...rest});
    const token = await createToken({
      email: currentUser.email,
      password: currentUser.password,
    });

    const decodedToken = await verifyToken(token);
    const expiresAt = decodedToken.exp;

    // // send token in HTTP-only Cookie
    // res.cookie('token', token, { httpOnly: true });

    res.status(200).json({
      msg: 'Authentication successful!',
      email: currentUser.email,
      username: currentUser?.username || '',
      expiresAt,
    });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser };
