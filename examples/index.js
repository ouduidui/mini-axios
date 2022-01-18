const axios = require('../index');

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
