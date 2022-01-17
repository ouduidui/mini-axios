const Axios = require('./core/Axios');
const defaults = require('./defaults');

function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  return Axios.prototype.request.bind(context);
}

const axios = createInstance(defaults);

module.exports = axios;
