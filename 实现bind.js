Function.prototype.bind = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  var _this = this;
  // 第 0 位是this，所以得从第一位开始裁剪
  var args = [...arguments].slice(1);

  return function F() {
    // 因为返回了一个函数，当使用 new F() 执行时，this 重新绑定，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  };
};
