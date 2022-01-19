const Cancel = require('./cancel');

function CancelToken(executor) {
  let resolvePromise;

  // 实例化时会在实例上挂载一个 promise
  // 这个 promise 的 resolve 回调暴露给了外部方法 executor
  this.promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  const token = this;

  this.promise.then((cancel) => {
    if (!token._listeners) return;

    for (let i = 0; i < token._listeners.length; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  executor(function cancel(message) {
    // 如果有实例上已经有reason，代表已经取消了，无需再次取消
    if (token.reason) {
      return;
    }

    token.reason = new Cancel(message);
    // 执行resolvePromise会直接调用this.promise.then方法
    resolvePromise(token.reason);
  });
}

/**
 * 订阅取消请求函数
 * @param listener
 */
CancelToken.prototype.subscribe = function (listener) {
  // 如果有this.reason，证明此时已经开始取消请求了
  // 因此立即执行取消动作
  if (this.reason) {
    listener(this.reason);
    return;
  }

  // 存储到 this._listeners 中
  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * 取消订阅，删除取消请求函数
 * @param listener
 */
CancelToken.prototype.unsubscribe = function (listener) {
  if (!this._listeners) return;

  const index = this._listeners.indexOf(listener);
  if (index !== -1) {
  }
  this._listeners.splice(index, 1);
};

/**
 * 请求前取消
 */
CancelToken.prototype.throwIfRequest = function () {
  if (this.reason) {
    throw this.reason;
  }
};

CancelToken.source = function () {
  let cancel;
  const token = new CancelToken(function (c) {
    cancel = c;
  });
  return {
    token: token, // CancelToken实例
    cancel: cancel // 取消函数
  };
};

module.exports = CancelToken;
