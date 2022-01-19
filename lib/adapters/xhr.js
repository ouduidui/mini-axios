const settle = require('../core/settle');
const Cancel = require('../cancel/Cancel');
const qs = require('qs');

/**
 * 封装 XMLHttpRequest
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    const requestData = config.data;
    const requestHeaders = config.headers;

    // 取消请求
    let onCanceled;

    // 请求结束处理函数
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
    }

    let request = new XMLHttpRequest();

    // 启动请求
    request.open(
      config.method.toUpperCase(),
      config.params ? config.url + '?' + qs.stringify(config.params) : config.url,
      true
    );

    // 监听请求状态
    request.onreadystatechange = function () {
      // 只有当请求完成时（readyState === 4）才会往下处理
      if (!request || request.readyState !== 4) {
        return;
      }

      // 需要注意的是，如果 XMLHttpRequest 请求出错，大部分的情况下我们可以通过监听 onerror 进行处理，
      // 但是也有一个例外，当请求使用文件协议（file://）时，尽管请求成功了但是大部分浏览器也会返回 0 的状态码
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // 异步处理
      setTimeout(function onloadend() {
        if (!request) return;
        // 响应头
        const responseHeaders = request.getAllResponseHeaders();
        // 响应数据
        const responseData = request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        // 处理响应
        settle(
          (value) => {
            resolve(value);
            done();
          },
          (err) => {
            reject(err);
            done();
          },
          response
        );
      });
    };

    // 监听终止请求
    request.onabort = function () {
      if (!request) return;

      const error = new Error('Request aborted');
      error.code = 'ECONNABORTED';
      reject(error);

      request = null;
    };

    // 监听接口报错
    request.onerror = function () {
      reject(new Error('Network Error'));
      request = null;
    };

    // 设置请求头
    if ('setRequestHeader' in request) {
      Object.keys(requestHeaders).forEach((key) => {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          delete requestHeaders[key];
        } else {
          request.setRequestHeader(key, requestHeaders[key]);
        }
      });
    }

    // 处理取消请求
    if (config.cancelToken) {
      onCanceled = function (cancel) {
        reject(cancel || new Cancel('canceled'));
        request.abort();
        request = null;
      };

      config.cancelToken.subscribe(onCanceled);
    }

    // 发送请求
    request.send(requestData);
  });
};
