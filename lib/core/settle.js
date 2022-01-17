module.exports = function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    const error = new Error('Request failed with status code ' + response.status);
    error.toJSON = function () {
      return {
        message: this.message,
        status: this.response && this.response.status ? this.response.status : null
      };
    };
    reject(error);
  }
};
