const Axios = require('./core/Axios');
const defaults = require('./defaults');
const CancelToken = require('./cancel/CancelToken');

// 创建axios
function createInstance(defaultConfig) {
  // 新建实例
  const context = new Axios(defaultConfig);
  // 实现axios方法
  const instance = Axios.prototype.request.bind(context);

  // 绑定Axios的实例属性和实例方法
  Object.keys(context).forEach((key) => {
    if (typeof context[key] === 'function') {
      instance[key] = context[key].bind(context);
    } else {
      instance[key] = context[key];
    }
  });

  return instance;
}

const axios = createInstance(defaults);

axios.CancelToken = CancelToken;

module.exports = axios;
