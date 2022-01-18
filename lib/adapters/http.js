const url = require('url');
const http = require('http');
const https = require('https');
const settle = require('../core/settle');
const Cancel = require('../cancel/Cancel');

const isHttps = /https:?/;

/**
 * 封装 XMLHttpRequest
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function httpAdapter(config) {
  return new Promise((resolvePromise, rejectPromise) => {
    let onCanceled;

    // 请求结束处理函数
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
    }

    // 包装resolve函数
    const resolve = function (value) {
      done();
      resolvePromise(value);
    };

    // 包装reject函数
    const reject = function (value) {
      done();
      rejectPromise(value);
    };

    const data = config.data;
    const headers = config.headers;
    const headerNames = {}; // header name 映射表

    Object.keys(headers).forEach((name) => {
      headerNames[name.toLowerCase()] = name;
    });

    // 解析链接
    const parsed = url.parse(config.url);
    const protocol = parsed.protocol || 'http:';

    // 判断是否为https请求
    const isHttpsRequest = isHttps.test(protocol);

    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.path,
      method: config.method.toUpperCase(),
      headers: headers
    };

    // 获取请求适配器
    const transport = isHttpsRequest ? https : http;

    // 创建请求
    const req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      const stream = res;

      const response = {
        status: res.statusCode,
        statusText: res.statusText,
        headers: res.headers,
        config: config
      };

      const responseBuffer = [];
      let totalResponseBytes = 0;
      // 响应监听
      stream.on('data', (chunk) => {
        responseBuffer.push(chunk);
        totalResponseBytes += chunk.length;
      });

      // 监听取消请求
      stream.on('aborted', () => {
        // 销毁流
        stream.destroy();

        const error = new Error('Request aborted');
        error.code = 'ECONNABORTED';
        reject(error);
      });

      // 错误监听
      stream.on('error', (err) => {
        reject(err);
      });

      // 响应结束监听
      stream.on('end', () => {
        // 合并数据
        response.data = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
        settle(resolve, reject, response);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    // 初始化取消函数
    if (config.cancelToken) {
      onCanceled = function (cancel) {
        // 如果请求已经取消了，就不必再调用
        if (req.aborted) return;

        // 调用取消请求
        req.abort();
        reject(cancel || new Cancel('canceled'));
      };

      // 订阅取消函数
      config.cancelToken.subscribe(onCanceled);
    }

    // 发送请求
    req.end(data);
  });
};
