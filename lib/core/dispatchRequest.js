const defaults = require('../defaults');
const transformData = require('./transformData');

/**
 * 派发请求
 * @param config
 */
module.exports = function dispatchRequest(config) {
  // TODO 处理取消请求

  config.headers = config.headers || {};

  // 调用转换函数处理数据
  config.data = transformData.call(config, config.data, config.headers, config.transformRequest);

  // 获取适配器
  const adapter = config.adapter || defaults.adapter;

  return adapter(config).then(
    // 成功处理
    function (response) {
      // 处理response数据，核心是将字符串解析成对象
      response.data = transformData.call(config, response.data, response.headers, config.transformResponse);

      return response;
    },
    // 错误处理
    function (reason) {
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }

      return Promise.reject(reason);
    }
  );
};
