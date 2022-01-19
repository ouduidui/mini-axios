const defaults = require('../defaults');

/**
 * 数据转换
 * @param data 请求数据
 * @param headers 请求头
 * @param fns 转换方法集合
 * @return {*}
 */
module.exports = function transformData(data, headers, fns) {
  const context = this || defaults;

  fns.forEach((fn) => {
    data = fn.call(context, data, headers);
  });

  return data;
};
