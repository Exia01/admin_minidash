import { StatusCodes } from 'http-status-codes';
const genericErrorHandler = (err, req, res, next) => {
  let customError = {
    //  catch all
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Could not complete request, try again later',
  };

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default genericErrorHandler;
