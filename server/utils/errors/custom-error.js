//exported in case we want to use it
// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript
// https://futurestud.io/tutorials/node-js-create-your-custom-error
class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (msg, statusCode) => {
  return new CustomAPIError(msg, statusCode);
};
const createReportBuilderError = (msg, statusCode) => {
  return CustomAPIError(msg, statusCode);
};


export { CustomAPIError, createCustomError };
