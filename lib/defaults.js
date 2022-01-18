/**
 * 获取适配器
 * @return {{}}
 */
function getDefaultAdapter() {
  let adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // 浏览器端使用XMLHttpRequest
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // node端使用http
    adapter = require('./adapters/http');
  }

  return adapter;
}

const defaults = {
  // 适配器
  adapter: getDefaultAdapter(),

  // 默认的请求转换函数
  transformRequest: [
    function transformRequest(data, headers) {
      headers['Accept'] = 'application/json, text/plain, */*';

      if (!data) {
        return data;
      }

      if (data.toString() === '[object URLSearchParams]') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        return data.toString();
      }
      if (typeof data === 'object') {
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
      }
      return data;
    }
  ],

  // 默认的响应转换函数
  transformResponse: [
    function transformResponse(data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        throw e;
      }

      return data;
    }
  ],

  // 有效状态码，不符合最后会reject回去
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

module.exports = defaults;
