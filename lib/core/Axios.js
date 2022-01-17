const mergeConfig = require('./mergeConfig');
const dispatchRequest = require('./dispatchRequest');

function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  // TODO 拦截器
}

Axios.prototype.request = function (configOrUrl, config) {
  // 支持 request(url, options) 和 request(options) 两种写法
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  // 合并选项
  config = mergeConfig(this.defaults, config);

  // 请求方法小写化
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // TODO 处理拦截

  // chain 队列用来存储和管理实际请求和拦截器
  const chain = [dispatchRequest, undefined];

  // 初始化Promise
  let promise = Promise.resolve(config);
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

module.exports = Axios;
