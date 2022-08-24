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
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Email or username already registered' });

    const newUSer = new User({
      email,
      password,
      username,
      ...rest,
    });

    // Save Product to DB
    const savedUser = await newUSer.save();

    const token = await createToken({
      email: newUSer.email,
      id: newUSer._id,
      role: newUSer,
    });

    const decodedToken = await verifyToken(token);
    const expiresAt = decodedToken.exp;
    res.cookie('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
      secure: process.env.NODE_ENV === 'production',
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: SUCCESS_MSG, user: savedUser, expiresAt });
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
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'Wrong email or password.' });
    }

    // Compare Password
    const passwordValid = await verifyPassword(password, currentUser.password);

    const userName = currentUser?.username;

    // const userInfo = Object.assign({}, {...rest});
    const token = await createToken({
      id: currentUser._id,
      email: currentUser.email,
      role: currentUser.role,
      userName,
    });

    const decodedToken = await verifyToken(token);
    const expiresAt = decodedToken.exp;
    res.cookie('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
      secure: process.env.NODE_ENV === 'production',
    });

    // // send token in HTTP-only Cookie
    // res.cookie('token', token, { httpOnly: true });

    res.status(StatusCodes.OK).json({
      msg: 'Authentication successful!',
      email: currentUser.email,
      username: currentUser?.username || '',
      expiresAt,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    return res
      .clearCookie('access_token')
      .status(StatusCodes.OK)
      .json({ message: 'Successfully logged out' });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, logoutUser };
