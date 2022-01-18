const axios = require('../index');

axios.interceptors.request.use(
  function (config) {
    console.log('interceptors request', config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    console.log('interceptors response', response);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios({
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  method: 'GET'
})
  .then((res) => {
    console.log('get success：', res.data, res.status);
  })
  .catch((err) => {
    console.log('post err', err);
  });

axios({
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'POST',
  data: {
    title: 'foo',
    body: 'bar',
    userId: 1
  },
  headers: {
    'Content-type': 'application/json'
  }
})
  .then((res) => {
    console.log('post success：', res.data, res.status);
  })
  .catch((err) => {
    console.log('post err', err);
  });
