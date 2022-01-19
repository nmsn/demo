// 1.
function Promise(fn) {
  // let this = this;
  this.status = "pending";
  this.failCallBack = undefined;
  this.successCallback = undefined;
  this.error = undefined;
  fn(resolve.bind(this), reject.bind(this));

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

// 2.
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

// 3.

class Prom {
  static resolve(value) {
    if (value && value.then) {
      return value;
    }
    return new Prom((resolve) => resolve(value));
  }

  constructor(fn) {
    this.value = undefined;
    this.reason = undefined;
    this.status = "PENDING";

    // 维护一个 resolve/pending 的函数队列
    this.resolveFns = [];
    this.rejectFns = [];

    const resolve = (value) => {
      // 注意此处的 setTimeout
      setTimeout(() => {
        this.status = "RESOLVED";
        this.value = value;
        this.resolveFns.forEach(({ fn, resolve: res, reject: rej }) =>
          res(fn(value)),
        );
      });
    };

    const reject = (e) => {
      setTimeout(() => {
        this.status = "REJECTED";
        this.reason = e;
        this.rejectFns.forEach(({ fn, resolve: res, reject: rej }) =>
          rej(fn(e)),
        );
      });
    };

    fn(resolve, reject);
  }

  then(fn) {
    if (this.status === "RESOLVED") {
      const result = fn(this.value);
      // 需要返回一个 Promise
      // 如果状态为 resolved，直接执行
      return Prom.resolve(result);
    }
    if (this.status === "PENDING") {
      // 也是返回一个 Promise
      return new Prom((resolve, reject) => {
        // 推进队列中，resolved 后统一执行
        this.resolveFns.push({ fn, resolve, reject });
      });
    }
  }

  catch(fn) {
    if (this.status === "REJECTED") {
      const result = fn(this.value);
      return Prom.resolve(result);
    }
    if (this.status === "PENDING") {
      return new Prom((resolve, reject) => {
        this.rejectFns.push({ fn, resolve, reject });
      });
    }
  }
}

// 4.

class MyPromise {
  constructor(fn) {
    // 表示状态
    this.state = "pending";
    // 表示then注册的成功函数
    this.successFunc = [];
    // 表示then注册的失败函数
    this.failFunc = [];

    let resolve = (val) => {
      // 保持状态改变不可变（resolve和reject只准触发一种）
      if (this.state !== "pending") return;

      // 成功触发时机  改变状态 同时执行在then注册的回调事件
      this.state = "success";
      // 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里为模拟异步
      setTimeout(() => {
        // 执行当前事件里面所有的注册函数
        this.successFunc.forEach((item) => item.call(this, val));
      });
    };

    let reject = (err) => {
      if (this.state !== "pending") return;
      // 失败触发时机  改变状态 同时执行在then注册的回调事件
      this.state = "fail";
      // 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里模拟异步
      setTimeout(() => {
        this.failFunc.forEach((item) => item.call(this, err));
      });
    };
    // 调用函数
    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // 实例方法 then
  then(resolveCallback, rejectCallback) {
    // 判断回调是否是函数
    resolveCallback =
      typeof resolveCallback !== "function" ? (v) => v : resolveCallback;
    rejectCallback =
      typeof rejectCallback !== "function"
        ? (err) => {
            throw err;
          }
        : rejectCallback;
    // 为了保持链式调用  继续返回promise
    return new MyPromise((resolve, reject) => {
      // 将回调注册到successFun事件集合里面去
      this.successFunc.push((val) => {
        try {
          //  执行回调函数
          let x = resolveCallback(val);
          //（最难的一点）
          // 如果回调函数结果是普通值 那么就resolve出去给下一个then链式调用  如果是一个promise对象（代表又是一个异步） 那么调用x的then方法 将resolve和reject传进去 等到x内部的异步 执行完毕的时候（状态完成）就会自动执行传入的resolve 这样就控制了链式调用的顺序
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      });

      this.failFunc.push((val) => {
        try {
          //  执行回调函数
          let x = rejectCallback(val);
          x instanceof MyPromise ? x.then(resolve, reject) : reject(x);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  //静态方法
  static all(promiseArr) {
    let result = [];
    //声明一个计数器 每一个promise返回就加一
    let count = 0;
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        //这里用 Promise.resolve包装一下 防止不是Promise类型传进来
        Promise.resolve(promiseArr[i]).then(
          (res) => {
            //这里不能直接push数组  因为要控制顺序一一对应(感谢评论区指正)
            result[i] = res;
            count++;
            //只有全部的promise执行成功之后才resolve出去
            if (count === promiseArr.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }

  //静态方法
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        Promise.resolve(promiseArr[i]).then(
          (res) => {
            //promise数组只要有任何一个promise 状态变更  就可以返回
            resolve(res);
          },
          (err) => {
            reject(err);
          },
        );
      }
    });
  }
}

// 使用
let promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 2000);
});

let promise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1234);
  }, 1000);
});

MyPromise.all([promise1, promise2]).then((res) => {
  console.log(res);
});

MyPromise.race([promise1, promise2]).then((res) => {
  console.log(res);
});

promise1
  .then(
    (res) => {
      console.log(res); //过两秒输出123
      return new MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve("success");
        }, 1000);
      });
    },
    (err) => {
      console.log(err);
    },
  )
  .then(
    (res) => {
      console.log(res); //再过一秒输出success
    },
    (err) => {
      console.log(err);
    },
  );
