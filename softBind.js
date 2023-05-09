Function.prototype.softBind = function (obj, ...rest) {
  const fn = this;
  const bound = function (...args) {
    const o = !this || this === (window || global) ? obj : this;
    return fn.apply(o, [...rest, ...args]);
  };

  return bound;
};
