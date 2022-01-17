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

  // 有效状态码，不符合最后会reject回去
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

module.exports = defaults;
