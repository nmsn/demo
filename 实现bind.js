Function.prototype.myBind = function (obj, ...args) {
  const fn = this;

  // 真正返回的函数
  // 因为返回了一个函数，当使用 new fn() 执行时，this 重新绑定，所以需要判断
  // new fn() -> this instanceof fn
  return function F(...args2) {
    return fn.apply(
      // 重点就在于这句话
      // 前半句判断是返回的函数当作实例方法执行时
      // 后半句为传入的绑定对象
      this instanceof F ? this : obj,
      [...args, ...args2]
    );
  };
};
