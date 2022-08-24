import { StatusCodes } from 'http-status-codes';
import { createCustomError } from '../utils/errors/index.js';
import { verifyToken } from '../utils/index.js';

const authorization = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    // return res.sendStatus(403);
    let err = createCustomError(
      'Authentication invalid',
      StatusCodes.UNAUTHORIZED
    );
    throw err;
  }
  try {
    const data = await verifyToken(token);
    console.log(data);
    req.userId = data.id;
    req.userRole = data.role;
    // Almost done
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { authorization };
