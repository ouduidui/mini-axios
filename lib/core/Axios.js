const mergeConfig = require('./mergeConfig');
const dispatchRequest = require('./dispatchRequest');
const InterceptorManager = require('./InterceptorManager');

function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  // 拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
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

  // 请求的拦截器队列
  const requestInterceptorChain = [];
  this.interceptors.request.forEach(function (interceptor) {
    // 将请求拦截回调倒序放入 requestInterceptorChain
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  const responseInterceptorChain = [];
  this.interceptors.response.forEach(function (interceptor) {
    // 将响应拦截回调顺序放入 responseInterceptorChain
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // chain 队列用来存储和管理实际请求和拦截器
  let chain = [dispatchRequest, undefined];
  // 将请求拦截器放入 chain 队头
  Array.prototype.unshift.apply(chain, requestInterceptorChain);
  // 将响应拦截器放入 chain 队尾
  chain = chain.concat(responseInterceptorChain);

  // 初始化Promise
  let promise = Promise.resolve(config);
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

module.exports = Axios;
