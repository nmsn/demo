Function.prototype.myApply = function (obj, args) {
  const context = obj || window;

  context.fn = this;

  const result = context.fn(...args);

  delete context.fn;

  return result;
};
