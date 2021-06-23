var slice = Array.prototype.slice;

function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1);

  // 调用co会返回一个promise
  // 当所有yield执行完成后被resolve
  // resolve的值为generator的返回值
  return new Promise(function (resolve, reject) {
    // 第一个参数为generator或者是迭代器（generator的返回值是一个迭代器）
    // 如果是generator，则调用得到迭代器
    // 如果既不是生成器又不是迭代器则直接被reolve
    if (typeof gen === "function") gen = gen.apply(ctx, args);
    if (!gen || typeof gen.next !== "function") return resolve(gen);

    // 开始迭代
    onFulfilled();

    function onFulfilled(res) {
      var ret;
      // 调用迭代器的next()方法，若在调用过程出错则直接reject
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      // 开始下一次迭代
      next(ret);
      return null;
    }

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      // 如果yield执行结束则直接reolve
      if (ret.done) return resolve(ret.value);
      // co的本质是将yield后的任何类型都转换为promise
      // toPromise则是转换为promise的方法
      // 因此，value即是一个promise
      var value = toPromise.call(ctx, ret.value);
      // 在value的回调里注册onFulfilled与onRejected，
      // 所以只有当promise的状态变为非pending时才会开始下一次迭代
      // 这里是co利用generator实现异步编程的核心
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      // 如果yield后面不是function，promise，array，object则不会被toPromise转换为promise
      // 如果yield后面不是所期望的类型，则直接reject
      return onRejected(
        new TypeError(
          "You may only yield a function, promise, generator, array, or object, " +
            'but the following object was passed: "' +
            String(ret.value) +
            '"',
        ),
      );
    }
  });
}

function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ("function" == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}

// thunk函数转换为promise
function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}

// 数组转换为promise，数组里的每一项也必须符合yield的要求
function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

// 对象转换为promise
function objectToPromise(obj) {
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    if (promise && isPromise(promise)) defer(promise, key);
    else results[key] = obj[key];
  }
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(
      promise.then(function (res) {
        results[key] = res;
      }),
    );
  }
}
