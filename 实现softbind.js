Function.prototype.softBind = function (obj) {
  const fn = this;

  // 获取绑定石时传入的参数
  const args = Array.prototype.slice.call(arguments, 1);
  const bound = function () {
    return fn.apply(
      // 处理 this 指向问题
      !this || this === (window || global) ? obj : this,
      // 拼接参数
      args.concat.apply(args, arguments),
    );
  };
  bound.prototype = Object.create(fn.prototype);
  return bound;
};
