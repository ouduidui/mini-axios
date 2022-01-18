const defaults = require('../defaults');
const transformData = require('./transformData');

/**
 * 检测是否已经触发取消请求动作
 * @param config
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequest();
  }
}

/**
 * 派发请求
 * @param config
 */
module.exports = function dispatchRequest(config) {
  // 检测是否已经触发取消请求动作
  throwIfCancellationRequested(config);

  config.headers = config.headers || {};

  // 调用转换函数处理数据
  config.data = transformData.call(config, config.data, config.headers, config.transformRequest);

  // 获取适配器
  const adapter = config.adapter || defaults.adapter;

  return adapter(config).then(
    // 成功处理
    function (response) {
      // 检测是否已经触发取消请求动作
      throwIfCancellationRequested(config);

      // 处理response数据，核心是将字符串解析成对象
      response.data = transformData.call(config, response.data, response.headers, config.transformResponse);

      return response;
    },
    // 错误处理
    function (reason) {
      // 检测是否已经触发取消请求动作
      throwIfCancellationRequested(config);

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
