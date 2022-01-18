const url = require('url');
const http = require('http');
const https = require('https');
const settle = require('../core/settle');

const isHttps = /https:?/;

/**
 * 封装 XMLHttpRequest
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function httpAdapter(config) {
  return new Promise((resolve, reject) => {
    // TODO 取消请求

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
      stream.on('data', (chunk) => {
        responseBuffer.push(chunk);
        totalResponseBytes += chunk.length;
      });

      stream.on('aborted', () => {
        // TODO
      });

      stream.on('error', (err) => {
        reject(err);
      });

      stream.on('end', () => {
        // 合并数据
        response.data = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
        settle(resolve, reject, response);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    // 发送请求
    req.end(data);
  });
};
