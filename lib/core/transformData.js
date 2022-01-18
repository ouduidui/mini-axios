const defaults = require('../defaults');

module.exports = function transformData(data, headers, fns) {
  const context = this || defaults;

  fns.forEach((fn) => {
    data = fn.call(context, data, headers);
  });

  return data;
};
