// flat

function _flat(arr, depth) {
  if (!Array.isArray(arr) || depth <= 0) {
    return arr;
  }
  return arr.reduce((prev, cur) => {
    if (Array.isArray(cur)) {
      return prev.concat(_flat(cur, depth - 1));
    } else {
      return prev.concat(cur);
    }
  }, []);
}

// push

Array.prototype.push = function () {
  for (let i = 0; i < arguments.length; i++) {
    this[this.length] = arguments[i];
  }
  return this.length;
};

// filter

Array.prototype._filter = function (fn) {
  if (typeof fn !== "function") {
    throw Error("参数必须是一个函数");
  }
  const res = [];
  for (let i = 0, len = this.length; i < len; i++) {
    fn(this[i]) && res.push(this[i]);
  }
  return res;
};

// map

Array.prototype._map = function (fn) {
  if (typeof fn !== "function") {
    throw Error("参数必须是一个函数");
  }
  const res = [];
  for (let i = 0, len = this.length; i < len; i++) {
    res.push(fn(this[i]));
  }
  return res;
};
