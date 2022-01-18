const axios = require('../index');

let cancel;

axios({
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  method: 'GET',
  cancelToken: new axios.CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
})
  .then((res) => {
    console.log('get success：', res.data, res.status);
  })
  .catch((err) => {
    console.log('get err', err);
  });

setTimeout(() => {
  cancel('取消请求');
});
