const defaults = require('../defaults');

/**
 * 派发请求
 * @param config
 */
module.exports = function dispatchRequest(config) {
  // TODO 处理取消请求

  config.headers = config.headers || {};

  // TODO 处理Data

  // 获取适配器
  const adapter = config.adapter || defaults.adapter;

  return adapter(config).then(
    function (response) {
      return response;
    },
    function (reason) {
      return Promise.reject(reason);
    }
  );
};
