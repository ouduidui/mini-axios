/**
 * 合并处理选项
 * @param config1
 * @param config2
 */
module.exports = function mergeConfig(config1, config2) {
  config2 = config2 || {};

  const mergeMap = {
    url: config2.url || config1.url,
    method: config2.method || config1.method,
    data: config2.data || config1.data,
    adapter: config2.adapter || config1.adapter,
    transformRequest: config2.transformRequest || config1.transformRequest,
    transformResponse: config2.transformResponse || config1.transformResponse,
    cancelToken: config2.cancelToken || config1.cancelToken,
    validateStatus: config2.validateStatus || config1.validateStatus
  };

  const config = {};
  // 去除无值选项
  Object.keys(mergeMap).forEach((key) => {
    if (mergeMap[key] !== undefined) {
      config[key] = mergeMap[key];
    }
  });

  return config;
};
