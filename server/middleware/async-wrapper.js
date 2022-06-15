const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      //will be handled by the built in error handler by express
      next(error);
      //
    //   OR handler error
    }
  };
};

export default asyncWrapper;
