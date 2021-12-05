const bind = function (asThis, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const _this = this;

  return function fn(...args2) {
    /**
     * 因为返回了一个函数，当使用 new fn() 执行时，this 重新绑定，所以需要判断
     * new fn() -> this instanceof fn
     * */
    if (this instanceof fn) {
      return new _this(...args, ...args2);
    }
    return _this.apply(asThis, ...args, ...args2);
  };
};

/**
 * 兼容性写法
 *  使用 slice 处理 arguments
 *  使用 concat 处理 参数合并
 */

const bind2 = function (asThis) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const _this = this;

  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1); // arguments[0] 是 this，后面的是传入的参数

  return function fn(...args2) {
    if (this instanceof fn) {
      return new _this(args.concat(args2));
    }
    return _this.apply(asThis, args.concat(args2));
  };
};
