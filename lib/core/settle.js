/**
 * 处理适配器响应结果
 * @param resolve
 * @param reject
 * @param response
 */
module.exports = function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  // 校验有效状态码方法
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    const error = new Error('Request failed with status code ' + response.status);
    error.response = response;
    error.toJSON = function () {
      return {
        message: this.message,
        status: this.response && this.response.status ? this.response.status : null
      };
    };
    reject(error);
  }
};
