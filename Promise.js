function Promise(executor) {
  // let this = this;
  this.status = "pending";
  this.failCallBack = undefined;
  this.successCallback = undefined;
  this.error = undefined;
  executor(resolve.bind(this), reject.bind(this));

  function resolve(params) {
    if (this.status === "pending") {
      this.status = "success";
      this.successCallback(params);
    }
  }

  function reject(params) {
    if (this.status === "pending") {
      this.status = "fail";
      this.failCallBack(params);
    }
  }
}

Promise.prototype.then = function (full, fail) {
  this.successCallback = full;
  this.failCallBack = fail;
};

// 测试代码
new Promise(function (res, rej) {
  setTimeout((_) => res("成功"), 30);
}).then((res) => console.log(res));

// 完整Promise模型 setTimeout替代Promise.then
// 原文链接：https://github.com/LuckyWinty/fe-weekly-questions/issues/20

function Promise(fn) {
  let state = "pending";
  let value = null;
  const callbacks = [];

  this.then = function (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      handle({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
    });
  };

  this.catch = function (onError) {
    this.then(null, onError);
  };

  this.finally = function (onDone) {
    this.then(onDone, onError);
  };

  this.resolve = function (value) {
    if (value && value instanceof Promise) {
      return value;
    }
    if (
      value &&
      typeof value === "object" &&
      typeof value.then === "function"
    ) {
      const { then } = value;
      return new Promise((resolve) => {
        then(resolve);
      });
    }
    if (value) {
      return new Promise((resolve) => resolve(value));
    }
    return new Promise((resolve) => resolve());
  };

  this.reject = function (value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  };

  this.all = function (arr) {
    const args = Array.prototype.slice.call(arr);
    return new Promise((resolve, reject) => {
      if (args.length === 0) return resolve([]);
      let remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === "object" || typeof val === "function")) {
            const { then } = val;
            if (typeof then === "function") {
              then.call(
                val,
                (val) => {
                  res(i, val);
                },
                reject,
              );
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }
      for (let i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  this.race = function (values) {
    return new Promise((resolve, reject) => {
      for (let i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  function handle(callback) {
    if (state === "pending") {
      callbacks.push(callback);
      return;
    }

    const cb =
      state === "fulfilled" ? callback.onFulfilled : callback.onRejected;
    const next = state === "fulfilled" ? callback.resolve : callback.reject;

    if (!cb) {
      next(value);
      return;
    }
    try {
      const ret = cb(value);
      next(ret);
    } catch (e) {
      callback.reject(e);
    }
  }
  function resolve(newValue) {
    const fn = () => {
      if (state !== "pending") return;

      if (
        newValue &&
        (typeof newValue === "object" || typeof newValue === "function")
      ) {
        const { then } = newValue;
        if (typeof then === "function") {
          // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
          // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
          then.call(newValue, resolve, reject);
          return;
        }
      }
      state = "fulfilled";
      value = newValue;
      handelCb();
    };

    setTimeout(fn, 0);
  }
  function reject(error) {
    const fn = () => {
      if (state !== "pending") return;

      if (error && (typeof error === "object" || typeof error === "function")) {
        const { then } = error;
        if (typeof then === "function") {
          then.call(error, resolve, reject);
          return;
        }
      }
      state = "rejected";
      value = error;
      handelCb();
    };
    setTimeout(fn, 0);
  }
  function handelCb() {
    while (callbacks.length) {
      const fn = callbacks.shift();
      handle(fn);
    }
  }
  fn(resolve, reject);
}

// Promise 队列执行


function queue(arr) {
  var sequence = Promise.resolve();
  arr.forEach(function (item) {
    sequence = sequence.then(item);
  });
  return sequence;
}


// 执行队列
queue([a, b, c]).then((data) => {
  console.log(data); // abc
});

async function queue(arr) {
  let res = null;
  for (let promise of arr) { // forEach 只支持处理同步代码，此处 使用 for...of 是因为 for...of 是使用迭代器的方式遍历
    res = await promise(res);
  }
  return await res;
}
queue([a, b, c]).then((data) => {
  console.log(data); // abc
});
