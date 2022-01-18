// 拦截器
function InterceptorManager() {
  // 存储拦截器容器
  this.handlers = [];
}

/**
 * 创建一个拦截器
 * @param fulfilled
 * @param rejected
 * @return {number}
 */
InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });

  // 使用下标作为 id
  return this.handlers.length - 1;
};

/**
 * 移除拦截器
 * @param id
 */
InterceptorManager.prototype.eject = function (id) {
  if (this.handlers[id]) {
    // 移除方法是通过直接将拦截器对象设置为 null 实现的，而不是 splice 剪切数组，遍历方法中也增加了相应的 null 值处理
    // 这样做一方面使得每一项ID保持为项的数组索引不变，另一方面也避免了重新剪切拼接数组的性能损失
    this.handlers[id] = null;
  }
};

/**
 * 遍历调用
 * @param fn
 */
InterceptorManager.prototype.forEach = function (fn) {
  this.handlers.forEach((h) => {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
