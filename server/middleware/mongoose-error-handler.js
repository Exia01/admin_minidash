import { StatusCodes } from 'http-status-codes';
const mongooseErrorHandlerMiddleware = (err, req, res, next) => {
  // console.log('Mongoose err validator ', err.name);
  let customError = {
    // set default if wanting to use this as an all catch
    // statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    // msg: err.message || 'Something went wrong try again later',
  };

  if (err.name === 'ValidationError') {
    //loop through the errors for validation
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000 && err.name === 'MongoServerError') {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (
    customError.hasOwnProperty('msg') &&
    customError.hasOwnProperty('statusCode')
  ) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    return res.status(customError.statusCode).json({ msg: customError.msg });
  }

  next(err);
};

export default mongooseErrorHandlerMiddleware;
