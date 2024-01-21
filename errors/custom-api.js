class CustomAPIError extends Error {
  constructor(message) {
    // console.log(message);
    super(message);
  }
}

module.exports = CustomAPIError;
