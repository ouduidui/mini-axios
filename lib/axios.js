const Axios = require('./core/Axios');
const defaults = require('./defaults');

function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = Axios.prototype.request.bind(context);

  Object.keys(context).forEach((key) => {
    console.log('key', key);
    if (typeof context[key] === 'function') {
      instance[key] = context[key].bind(context);
    } else {
      instance[key] = context[key];
    }
  });

  return instance;
}

const axios = createInstance(defaults);

module.exports = axios;
