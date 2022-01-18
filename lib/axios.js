const Axios = require('./core/Axios');
const defaults = require('./defaults');
const CancelToken = require('./cancel/CancelToken');

function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = Axios.prototype.request.bind(context);

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
